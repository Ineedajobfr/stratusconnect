import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OpenSanctionsEntity {
  id: string;
  schema: string;
  properties: {
    name?: string[];
    alias?: string[];
    birthDate?: string[];
    nationality?: string[];
    address?: string[];
    topics?: string[];
  };
  datasets?: string[];
  referents?: string[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Starting sanctions data sync...');
    
    // Initialize Supabase with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Download OpenSanctions data from their public dataset
    console.log('Downloading OpenSanctions data...');
    const response = await fetch('https://data.opensanctions.org/datasets/latest/default/entities.ftm.json');
    
    if (!response.ok) {
      throw new Error(`Failed to download sanctions data: ${response.statusText}`);
    }

    const textData = await response.text();
    const entities: OpenSanctionsEntity[] = textData
      .split('\n')
      .filter(line => line.trim())
      .map(line => JSON.parse(line));

    console.log(`Processing ${entities.length} entities...`);

    // Filter for persons and organizations with sanctions-related topics
    const sanctionedEntities = entities.filter(entity => 
      entity.properties.topics?.some(topic => 
        topic.includes('sanction') || 
        topic.includes('crime') || 
        topic.includes('wanted') ||
        topic.includes('pep') // Politically Exposed Persons
      )
    );

    console.log(`Found ${sanctionedEntities.length} sanctioned entities`);

    // Process entities in batches to avoid memory issues
    const batchSize = 100;
    let processedCount = 0;

    // Clear existing data for fresh sync
    await supabase.from('sanctions_entities').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    for (let i = 0; i < sanctionedEntities.length; i += batchSize) {
      const batch = sanctionedEntities.slice(i, i + batchSize);
      
      const formattedEntities = batch.map(entity => ({
        entity_id: entity.id,
        name: entity.properties.name?.[0] || 'Unknown',
        aliases: entity.properties.alias || [],
        birth_date: entity.properties.birthDate?.[0] ? new Date(entity.properties.birthDate[0]).toISOString().split('T')[0] : null,
        nationalities: entity.properties.nationality || [],
        addresses: entity.properties.address || [],
        entity_type: entity.schema === 'Person' ? 'person' : 'organization',
        sanctions_reason: entity.properties.topics?.join(', ') || 'Unknown',
        sanctions_authority: entity.datasets?.[0] || 'OpenSanctions',
        risk_score: entity.properties.topics?.includes('sanction') ? 0.9 : 0.7,
        status: 'active'
      }));

      const { error } = await supabase
        .from('sanctions_entities')
        .insert(formattedEntities);

      if (error) {
        console.error(`Error inserting batch ${i / batchSize + 1}:`, error);
        throw error;
      }

      processedCount += batch.length;
      console.log(`Processed ${processedCount}/${sanctionedEntities.length} entities`);
    }

    // Update sanctions list metadata
    const { error: listError } = await supabase
      .from('sanctions_lists')
      .upsert({
        list_name: 'OpenSanctions Global Dataset',
        source: 'opensanctions',
        record_count: sanctionedEntities.length,
        status: 'active',
        last_updated: new Date().toISOString()
      }, { onConflict: 'list_name' });

    if (listError) {
      console.error('Error updating sanctions list:', listError);
      throw listError;
    }

    console.log('Sanctions sync completed successfully');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Sanctions data synchronized successfully',
        entitiesProcessed: sanctionedEntities.length,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in sanctions sync:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
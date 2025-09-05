import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScreeningRequest {
  fullName: string;
  companyName?: string;
  dateOfBirth?: string;
  nationality?: string;
  screeningType?: 'verification' | 'transaction' | 'periodic';
}

// Simple string similarity calculation using Levenshtein distance
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim();
  const s2 = str2.toLowerCase().trim();
  
  if (s1 === s2) return 1.0;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

function calculateRiskLevel(matches: any[]): string {
  if (matches.length === 0) return 'low';
  
  const highestScore = Math.max(...matches.map(m => m.match_score));
  
  if (highestScore >= 0.9) return 'high';
  if (highestScore >= 0.7) return 'medium';
  return 'low';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header missing');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Authentication failed');
    }

    const body: ScreeningRequest = await req.json();
    console.log('Screening request:', body);

    // Initialize Supabase with service role for database operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { persistSession: false } }
    );

    // Get all sanctions entities for screening
    const { data: entities, error: entitiesError } = await supabase
      .from('sanctions_entities')
      .select('*')
      .eq('status', 'active');

    if (entitiesError) {
      throw new Error(`Failed to fetch sanctions entities: ${entitiesError.message}`);
    }

    console.log(`Screening against ${entities?.length || 0} sanctions entities`);

    const matches = [];
    const searchTerms = {
      fullName: body.fullName,
      companyName: body.companyName,
      dateOfBirth: body.dateOfBirth,
      nationality: body.nationality
    };

    // Screen against each entity
    for (const entity of entities || []) {
      let maxScore = 0;
      let matchType = '';
      let matchDetails: any = {};

      // Check name similarity
      const nameScore = calculateSimilarity(body.fullName, entity.name);
      if (nameScore > maxScore) {
        maxScore = nameScore;
        matchType = 'name';
        matchDetails = { searchName: body.fullName, entityName: entity.name };
      }

      // Check aliases
      if (entity.aliases) {
        for (const alias of entity.aliases) {
          const aliasScore = calculateSimilarity(body.fullName, alias);
          if (aliasScore > maxScore) {
            maxScore = aliasScore;
            matchType = 'alias';
            matchDetails = { searchName: body.fullName, entityAlias: alias };
          }
        }
      }

      // Check company name if provided
      if (body.companyName && entity.entity_type === 'organization') {
        const companyScore = calculateSimilarity(body.companyName, entity.name);
        if (companyScore > maxScore) {
          maxScore = companyScore;
          matchType = 'company';
          matchDetails = { searchCompany: body.companyName, entityName: entity.name };
        }
      }

      // Check date of birth if available
      if (body.dateOfBirth && entity.birth_date) {
        if (body.dateOfBirth === entity.birth_date) {
          maxScore = Math.max(maxScore, 0.8); // Boost score for exact DOB match
          matchDetails.dateOfBirthMatch = true;
        }
      }

      // Check nationality
      if (body.nationality && entity.nationalities) {
        for (const nationality of entity.nationalities) {
          if (nationality.toLowerCase().includes(body.nationality.toLowerCase())) {
            maxScore = Math.max(maxScore, 0.6); // Boost score for nationality match
            matchDetails.nationalityMatch = true;
            break;
          }
        }
      }

      // Only consider matches above threshold
      if (maxScore >= 0.5) {
        matches.push({
          entity_id: entity.id,
          match_score: maxScore,
          match_type: matchType,
          match_details: matchDetails,
          entity
        });
      }
    }

    // Sort matches by score (highest first)
    matches.sort((a, b) => b.match_score - a.match_score);
    
    const riskLevel = calculateRiskLevel(matches);
    console.log(`Found ${matches.length} matches, risk level: ${riskLevel}`);

    // Create screening record
    const { data: screening, error: screeningError } = await supabase
      .from('sanctions_screenings')
      .insert({
        user_id: user.id,
        screening_type: body.screeningType || 'verification',
        search_terms: searchTerms,
        matches_found: matches.length,
        risk_level: riskLevel,
        status: 'completed'
      })
      .select()
      .single();

    if (screeningError) {
      throw new Error(`Failed to create screening record: ${screeningError.message}`);
    }

    // Insert match records
    if (matches.length > 0) {
      const matchRecords = matches.slice(0, 10).map(match => ({ // Limit to top 10 matches
        screening_id: screening.id,
        entity_id: match.entity_id,
        match_score: match.match_score,
        match_type: match.match_type,
        match_details: match.match_details
      }));

      const { error: matchError } = await supabase
        .from('sanctions_matches')
        .insert(matchRecords);

      if (matchError) {
        console.error('Error inserting matches:', matchError);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        screening: {
          id: screening.id,
          risk_level: riskLevel,
          matches_found: matches.length,
          screened_at: screening.screened_at,
          expires_at: screening.expires_at
        },
        matches: matches.slice(0, 5).map(match => ({
          match_score: match.match_score,
          match_type: match.match_type,
          entity_name: match.entity.name,
          entity_type: match.entity.entity_type,
          sanctions_reason: match.entity.sanctions_reason,
          sanctions_authority: match.entity.sanctions_authority
        })),
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in sanctions screening:', error);
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
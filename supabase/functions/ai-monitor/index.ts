import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { pipeline } from 'https://esm.sh/@huggingface/transformers@3.0.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { content, userId, eventType = 'message_analysis' } = await req.json()
    
    if (!content || !userId) {
      return new Response(
        JSON.stringify({ error: 'Content and userId are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log('Analyzing content for user:', userId)
    
    // Initialize sentiment analysis pipeline
    const sentimentPipeline = await pipeline('sentiment-analysis', 'Xenova/distilbert-base-uncased-finetuned-sst-2-english')
    
    // Initialize text classification for toxicity detection
    const toxicityPipeline = await pipeline('text-classification', 'martin-ha/toxic-comment-model')
    
    // Analyze sentiment
    const sentimentResults = await sentimentPipeline(content)
    const sentiment = sentimentResults[0]
    
    // Analyze toxicity
    const toxicityResults = await toxicityPipeline(content)
    const toxicity = toxicityResults[0]
    
    console.log('Sentiment:', sentiment)
    console.log('Toxicity:', toxicity)
    
    // Determine risk level
    let riskLevel = 'low'
    const warnings = []
    
    // Check for negative sentiment with high confidence
    if (sentiment.label === 'NEGATIVE' && sentiment.score > 0.8) {
      riskLevel = 'medium'
      warnings.push('Highly negative sentiment detected')
    }
    
    // Check for toxicity
    if (toxicity.label === 'TOXIC' && toxicity.score > 0.7) {
      riskLevel = 'high'
      warnings.push('Toxic content detected')
    }
    
    // Log security event if risk detected
    if (riskLevel !== 'low') {
      const { error: logError } = await supabaseClient.rpc('log_security_event', {
        p_user_id: userId,
        p_event_type: eventType,
        p_severity: riskLevel,
        p_description: `AI analysis detected: ${warnings.join(', ')}`,
        p_metadata: {
          sentiment: sentiment,
          toxicity: toxicity,
          content_length: content.length,
          analysis_timestamp: new Date().toISOString()
        }
      })
      
      if (logError) {
        console.error('Error logging security event:', logError)
      }
      
      // Create AI warning for high risk content
      if (riskLevel === 'high') {
        const { error: warningError } = await supabaseClient.rpc('create_ai_warning', {
          p_user_id: userId,
          p_warning_type: 'content_violation',
          p_message: 'Your recent message was flagged for inappropriate content. Please review our community guidelines.',
          p_severity: 'danger',
          p_expires_hours: 48
        })
        
        if (warningError) {
          console.error('Error creating AI warning:', warningError)
        }
      }
    }
    
    const response = {
      analysis: {
        sentiment: sentiment,
        toxicity: toxicity,
        riskLevel: riskLevel,
        warnings: warnings
      },
      action: riskLevel === 'high' ? 'blocked' : 'approved'
    }
    
    console.log('Analysis complete:', response)
    
    return new Response(
      JSON.stringify(response),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
    
  } catch (error) {
    console.error('Error in ai-monitor function:', error)
    return new Response(
      JSON.stringify({ error: 'Analysis failed', details: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
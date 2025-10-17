// Supabase Edge Function for Image Moderation
// Server-side image processing and AI classification
// Handles large files and provides additional security

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ImageModerationRequest {
  imageUrl: string;
  userId: string;
  fileName: string;
  fileSize: number;
  fileHash: string;
}

interface ModerationResult {
  approved: boolean;
  confidence: number;
  classification: {
    nsfw: number;
    violence: number;
    inappropriate: number;
    safe: number;
  };
  rejectionReason?: string;
  processingTime: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { imageUrl, userId, fileName, fileSize, fileHash }: ImageModerationRequest = await req.json()

    if (!imageUrl || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required parameters' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const startTime = Date.now()

    // Initialize Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Download and process image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`)
    }

    const imageBuffer = await imageResponse.arrayBuffer()
    const imageData = new Uint8Array(imageBuffer)

    // Perform server-side image analysis
    const moderationResult = await analyzeImage(imageData, fileName)

    const processingTime = Date.now() - startTime

    const result: ModerationResult = {
      ...moderationResult,
      processingTime
    }

    // Log the moderation result to security_events table
    const { error: logError } = await supabaseClient
      .from('security_events')
      .insert({
        user_id: userId,
        event_type: 'image_moderation_server',
        details: {
          fileName,
          fileSize,
          fileHash,
          approved: result.approved,
          confidence: result.confidence,
          classification: result.classification,
          rejectionReason: result.rejectionReason,
          processingTime: result.processingTime,
          serverProcessed: true
        },
        ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip'),
        user_agent: req.headers.get('user-agent')
      })

    if (logError) {
      console.error('Failed to log moderation result:', logError)
    }

    return new Response(
      JSON.stringify(result),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Image moderation error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Image moderation failed', 
        details: error.message 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

/**
 * Analyze image content using server-side processing
 * This is a simplified version - in production you'd use a proper ML model
 */
async function analyzeImage(imageData: Uint8Array, fileName: string): Promise<Omit<ModerationResult, 'processingTime'>> {
  // Basic file validation
  const fileSize = imageData.length
  const maxSize = 5 * 1024 * 1024 // 5MB

  if (fileSize > maxSize) {
    return {
      approved: false,
      confidence: 1.0,
      classification: { nsfw: 0, violence: 0, inappropriate: 0, safe: 0 },
      rejectionReason: `File size ${(fileSize / 1024 / 1024).toFixed(2)}MB exceeds 5MB limit`
    }
  }

  // Check file signature (magic bytes)
  const isValidImage = validateImageSignature(imageData)
  if (!isValidImage) {
    return {
      approved: false,
      confidence: 1.0,
      classification: { nsfw: 0, violence: 0, inappropriate: 0, safe: 0 },
      rejectionReason: 'Invalid image file signature'
    }
  }

  // Basic content analysis (simplified)
  // In production, this would use a proper ML model like TensorFlow.js or a cloud service
  const analysisResult = await performBasicContentAnalysis(imageData, fileName)

  return analysisResult
}

/**
 * Validate image file signature
 */
function validateImageSignature(imageData: Uint8Array): boolean {
  // JPEG signature
  if (imageData[0] === 0xFF && imageData[1] === 0xD8 && imageData[2] === 0xFF) {
    return true
  }

  // PNG signature
  if (imageData[0] === 0x89 && imageData[1] === 0x50 && imageData[2] === 0x4E && imageData[3] === 0x47) {
    return true
  }

  // WebP signature (RIFF)
  if (imageData[0] === 0x52 && imageData[1] === 0x49 && imageData[2] === 0x46 && imageData[3] === 0x46) {
    return true
  }

  return false
}

/**
 * Perform basic content analysis
 * This is a placeholder - in production you'd use a proper ML model
 */
async function performBasicContentAnalysis(imageData: Uint8Array, fileName: string): Promise<Omit<ModerationResult, 'processingTime'>> {
  // Simulate AI analysis with random results
  // In production, this would use TensorFlow.js or a cloud ML service
  
  const random = Math.random()
  
  // Simulate classification results
  const classification = {
    nsfw: random * 0.1, // Low probability for NSFW
    violence: random * 0.05, // Very low probability for violence
    inappropriate: random * 0.15, // Low probability for inappropriate content
    safe: 1 - (random * 0.3) // High probability for safe content
  }

  const maxRisk = Math.max(classification.nsfw, classification.violence, classification.inappropriate)
  const approved = maxRisk < 0.8 // 80% threshold

  let rejectionReason: string | undefined
  if (!approved) {
    if (classification.nsfw > 0.8) {
      rejectionReason = 'Content classified as inappropriate (NSFW)'
    } else if (classification.violence > 0.8) {
      rejectionReason = 'Content classified as violent'
    } else if (classification.inappropriate > 0.8) {
      rejectionReason = 'Content classified as inappropriate'
    }
  }

  return {
    approved,
    confidence: maxRisk,
    classification,
    rejectionReason
  }
}

/**
 * Enhanced content analysis using external ML service
 * This would be implemented with a proper ML model in production
 */
async function performAdvancedContentAnalysis(imageData: Uint8Array): Promise<Omit<ModerationResult, 'processingTime'>> {
  // This would integrate with:
  // - Google Cloud Vision API
  // - AWS Rekognition
  // - Azure Computer Vision
  // - Custom TensorFlow.js model
  
  // For now, return a safe default
  return {
    approved: true,
    confidence: 0.1,
    classification: { nsfw: 0, violence: 0, inappropriate: 0, safe: 1 },
  }
}

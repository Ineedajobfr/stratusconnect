import { supabase } from '@/integrations/supabase/client';

export interface AIAnalysisResult {
  analysis: {
    sentiment: { label: string; score: number };
    toxicity: { label: string; score: number };
    riskLevel: string;
    warnings: string[];
  };
  action: 'approved' | 'blocked';
}

export const analyzeContent = async (
  content: string,
  userId: string,
  eventType: string = 'message_analysis'
): Promise<AIAnalysisResult> => {
  try {
    const { data, error } = await supabase.functions.invoke('ai-monitor', {
      body: {
        content,
        userId,
        eventType
      }
    });

    if (error) {
      console.error('AI monitoring error:', error);
      // Return safe default if monitoring fails
      return {
        analysis: {
          sentiment: { label: 'NEUTRAL', score: 0.5 },
          toxicity: { label: 'NON_TOXIC', score: 0.1 },
          riskLevel: 'low',
          warnings: []
        },
        action: 'approved'
      };
    }

    return data;
  } catch (error) {
    console.error('Error analyzing content:', error);
    // Return safe default if monitoring fails
    return {
      analysis: {
        sentiment: { label: 'NEUTRAL', score: 0.5 },
        toxicity: { label: 'NON_TOXIC', score: 0.1 },
        riskLevel: 'low',
        warnings: []
      },
      action: 'approved'
    };
  }
};

export const getUserSecurityStatus = async (userId: string) => {
  try {
    const { data, error } = await supabase.rpc('get_user_security_status', {
      p_user_id: userId
    });

    if (error) {
      console.error('Error fetching security status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching security status:', error);
    return null;
  }
};
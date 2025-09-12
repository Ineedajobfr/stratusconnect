// XP Integration Examples
// These show how to integrate the gamification system into real user actions

import { recordXpEvent } from './gamification';

// Example: When a broker posts an RFQ
export async function handleRfqPosted(userId: string, rfqId: string) {
  try {
    // Your existing RFQ posting logic here
    // ... 
    
    // Award XP for posting RFQ
    await recordXpEvent({
      userId,
      type: 'rfq_posted',
      meta: { rfqId, timestamp: new Date().toISOString() }
    });
    
    console.log(`Awarded 5 XP to user ${userId} for posting RFQ ${rfqId}`);
  } catch (error) {
    console.error('Failed to record RFQ XP event:', error);
    // Don't let XP recording failure break the main flow
  }
}

// Example: When an operator submits a quote quickly
export async function handleQuoteSubmitted(userId: string, quoteId: string, responseTimeMs: number) {
  try {
    // Your existing quote submission logic here
    // ...
    
    // Check if it was submitted fast (under 5 minutes)
    const isFastResponse = responseTimeMs < 5 * 60 * 1000; // 5 minutes in milliseconds
    
    if (isFastResponse) {
      await recordXpEvent({
        userId,
        type: 'quote_submitted_fast',
        meta: { 
          quoteId, 
          responseTimeMs,
          timestamp: new Date().toISOString() 
        }
      });
      
      console.log(`Awarded 15 XP to user ${userId} for fast quote submission (${responseTimeMs}ms)`);
    } else {
      // Still award points for regular quote submission
      await recordXpEvent({
        userId,
        type: 'quote_accepted', // or create a new event type for regular quotes
        meta: { quoteId, responseTimeMs }
      });
    }
  } catch (error) {
    console.error('Failed to record quote XP event:', error);
  }
}

// Example: When a deal is completed on time
export async function handleDealCompleted(userId: string, dealId: string, wasOnTime: boolean) {
  try {
    // Your existing deal completion logic here
    // ...
    
    if (wasOnTime) {
      await recordXpEvent({
        userId,
        type: 'deal_completed_on_time',
        meta: { 
          dealId, 
          completedAt: new Date().toISOString(),
          wasOnTime: true
        }
      });
      
      console.log(`Awarded 40 XP to user ${userId} for completing deal on time`);
    }
  } catch (error) {
    console.error('Failed to record deal completion XP event:', error);
  }
}

// Example: When a deal is completed without disputes
export async function handleDisputeFreeDeal(userId: string, dealId: string) {
  try {
    // Your existing deal completion logic here
    // ...
    
    await recordXpEvent({
      userId,
      type: 'dispute_free_deal',
      meta: { 
        dealId, 
        completedAt: new Date().toISOString(),
        disputeFree: true
      }
    });
    
    console.log(`Awarded 20 XP to user ${userId} for dispute-free deal completion`);
  } catch (error) {
    console.error('Failed to record dispute-free deal XP event:', error);
  }
}

// Example: When KYC is completed
export async function handleKycCompleted(userId: string, kycId: string) {
  try {
    // Your existing KYC completion logic here
    // ...
    
    await recordXpEvent({
      userId,
      type: 'kyc_completed',
      meta: { 
        kycId, 
        completedAt: new Date().toISOString()
      }
    });
    
    console.log(`Awarded 10 XP to user ${userId} for completing KYC`);
  } catch (error) {
    console.error('Failed to record KYC completion XP event:', error);
  }
}

// Example: When credentials are updated
export async function handleCredentialsUpdated(userId: string, credentialType: string) {
  try {
    // Your existing credential update logic here
    // ...
    
    await recordXpEvent({
      userId,
      type: 'credentials_up_to_date',
      meta: { 
        credentialType,
        updatedAt: new Date().toISOString()
      }
    });
    
    console.log(`Awarded 10 XP to user ${userId} for updating ${credentialType} credentials`);
  } catch (error) {
    console.error('Failed to record credential update XP event:', error);
  }
}

// Example: When a broker responds to a saved search alert quickly
export async function handleSavedSearchResponse(userId: string, searchId: string, responseTimeMs: number) {
  try {
    // Your existing saved search response logic here
    // ...
    
    const isQuickResponse = responseTimeMs < 10 * 60 * 1000; // 10 minutes
    
    if (isQuickResponse) {
      await recordXpEvent({
        userId,
        type: 'saved_search_hit_response',
        meta: { 
          searchId, 
          responseTimeMs,
          timestamp: new Date().toISOString()
        }
      });
      
      console.log(`Awarded 10 XP to user ${userId} for quick saved search response (${responseTimeMs}ms)`);
    }
  } catch (error) {
    console.error('Failed to record saved search response XP event:', error);
  }
}

// Example: When a fallthrough is successfully recovered
export async function handleFallthroughRecovered(userId: string, originalDealId: string, newDealId: string) {
  try {
    // Your existing fallthrough recovery logic here
    // ...
    
    await recordXpEvent({
      userId,
      type: 'fallthrough_recovered',
      meta: { 
        originalDealId,
        newDealId,
        recoveredAt: new Date().toISOString()
      }
    });
    
    console.log(`Awarded 30 XP to user ${userId} for recovering fallthrough deal`);
  } catch (error) {
    console.error('Failed to record fallthrough recovery XP event:', error);
  }
}

// Example: Manual admin award for helpful community behavior
export async function handleCommunityHelpful(userId: string, reason: string, adminId: string) {
  try {
    // This would typically be called by an admin interface
    // ...
    
    await recordXpEvent({
      userId,
      type: 'community_helpful',
      meta: { 
        reason,
        awardedBy: adminId,
        awardedAt: new Date().toISOString()
      }
    });
    
    console.log(`Awarded 10 XP to user ${userId} for community helpfulness: ${reason}`);
  } catch (error) {
    console.error('Failed to record community helpful XP event:', error);
  }
}

// Utility function to check if user is eligible for promotion
export async function checkPromotionEligibility(userId: string, currentLeague: string) {
  // This would check if user has enough points and meets other criteria
  // for promotion to the next league
  const leagueOrder = ['bronze', 'silver', 'gold', 'platinum', 'emerald', 'diamond'];
  const currentIndex = leagueOrder.indexOf(currentLeague);
  const nextLeague = leagueOrder[currentIndex + 1];
  
  if (!nextLeague) {
    return { eligible: false, reason: 'Already at highest league' };
  }
  
  // In a real implementation, you'd check actual points and other criteria
  // For now, return a mock response
  return {
    eligible: true,
    nextLeague,
    pointsNeeded: 50, // Mock value
    currentPoints: 220 // Mock value
  };
}

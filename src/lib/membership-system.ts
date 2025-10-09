/**
 * MEMBERSHIP & LOYALTY SYSTEM
 * Tiered membership with exclusive benefits
 * Stripe subscription integration
 */

import { supabase } from '@/integrations/supabase/client';

export interface MembershipTier {
  id: string;
  name: 'Free' | 'Silver' | 'Gold' | 'Platinum';
  monthlyFee: number;
  benefits: string[];
  emptyLegDiscount: number; // percentage
  priorityBooking: boolean;
  conciergeService: boolean;
  loungeAccess: boolean;
}

export interface UserMembership {
  userId: string;
  tier: MembershipTier;
  startDate: string;
  renewalDate: string;
  status: 'active' | 'canceled' | 'expired';
  stripeSubscriptionId?: string;
}

export class MembershipSystem {
  private static instance: MembershipSystem;

  static getInstance(): MembershipSystem {
    if (!MembershipSystem.instance) {
      MembershipSystem.instance = new MembershipSystem();
    }
    return MembershipSystem.instance;
  }

  /**
   * Available membership tiers
   */
  readonly tiers: MembershipTier[] = [
    {
      id: 'free',
      name: 'Free',
      monthlyFee: 0,
      benefits: [
        'Access to empty leg marketplace',
        'Basic flight search',
        'Standard booking',
      ],
      emptyLegDiscount: 0,
      priorityBooking: false,
      conciergeService: false,
      loungeAccess: false,
    },
    {
      id: 'silver',
      name: 'Silver',
      monthlyFee: 99,
      benefits: [
        'All Free benefits',
        '10% off empty legs',
        'Priority customer support',
        'Advanced search filters',
        'Booking history & analytics',
      ],
      emptyLegDiscount: 10,
      priorityBooking: false,
      conciergeService: false,
      loungeAccess: false,
    },
    {
      id: 'gold',
      name: 'Gold',
      monthlyFee: 299,
      benefits: [
        'All Silver benefits',
        '20% off empty legs',
        'Priority booking (first dibs)',
        'Dedicated concierge service',
        'Complimentary ground transportation',
        'Route watch alerts',
      ],
      emptyLegDiscount: 20,
      priorityBooking: true,
      conciergeService: true,
      loungeAccess: false,
    },
    {
      id: 'platinum',
      name: 'Platinum',
      monthlyFee: 999,
      benefits: [
        'All Gold benefits',
        '30% off empty legs',
        'Guaranteed availability (24h notice)',
        'Private lounge access',
        'Complimentary catering upgrades',
        'Exclusive operator network',
        'Annual flight credits ($2,500)',
      ],
      emptyLegDiscount: 30,
      priorityBooking: true,
      conciergeService: true,
      loungeAccess: true,
    },
  ];

  /**
   * Get user's current membership
   */
  async getUserMembership(userId: string): Promise<UserMembership | null> {
    try {
      const { data, error } = await supabase
        .from('memberships')
        .select('*')
        .eq('user_id', userId)
        .eq('status', 'active')
        .single();

      if (error) throw error;

      const tier = this.tiers.find((t) => t.id === data.tier_id);
      if (!tier) return null;

      return {
        userId,
        tier,
        startDate: data.start_date,
        renewalDate: data.renewal_date,
        status: data.status,
        stripeSubscriptionId: data.stripe_subscription_id,
      };
    } catch (error) {
      console.error('Failed to get membership:', error);
      return null;
    }
  }

  /**
   * Upgrade/downgrade membership
   */
  async changeMembership(userId: string, newTierId: string): Promise<UserMembership> {
    const newTier = this.tiers.find((t) => t.id === newTierId);
    if (!newTier) throw new Error('Invalid tier');

    try {
      // In production: Create/update Stripe subscription
      // For now, just update database
      const { data, error } = await supabase
        .from('memberships')
        .upsert({
          user_id: userId,
          tier_id: newTierId,
          status: 'active',
          start_date: new Date().toISOString(),
          renewal_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        userId,
        tier: newTier,
        startDate: data.start_date,
        renewalDate: data.renewal_date,
        status: data.status,
      };
    } catch (error) {
      console.error('Failed to change membership:', error);
      throw error;
    }
  }

  /**
   * Cancel membership
   */
  async cancelMembership(userId: string): Promise<void> {
    try {
      // In production: Cancel Stripe subscription
      await supabase
        .from('memberships')
        .update({ status: 'canceled' })
        .eq('user_id', userId);
    } catch (error) {
      console.error('Failed to cancel membership:', error);
      throw error;
    }
  }

  /**
   * Calculate membership value (ROI)
   */
  calculateMembershipValue(
    tier: MembershipTier,
    monthlyFlights: number,
    avgFlightCost: number
  ): {
    monthlySavings: number;
    roi: number; // percentage
    worthIt: boolean;
  } {
    const monthlySavings = monthlyFlights * avgFlightCost * (tier.emptyLegDiscount / 100);
    const roi = ((monthlySavings - tier.monthlyFee) / tier.monthlyFee) * 100;
    const worthIt = monthlySavings > tier.monthlyFee;

    return { monthlySavings, roi, worthIt };
  }
}

// Export singleton
export const membershipSystem = MembershipSystem.getInstance();


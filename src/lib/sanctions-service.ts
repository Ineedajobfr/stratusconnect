// Sanctions Checking Service
// Integrates with official sanctions lists and provides screening functionality

export interface SanctionsEntity {
  id: string;
  name: string;
  entity_type: 'individual' | 'organization' | 'vessel' | 'aircraft';
  source: 'OFAC' | 'OFSI' | 'EU' | 'UN' | 'OpenSanctions';
  source_id: string;
  aliases: string[];
  countries: string[];
  birth_date?: string;
  sanctions_program: string;
  raw_data: any;
  created_at: string;
  updated_at: string;
}

export interface SanctionsMatch {
  entity: SanctionsEntity;
  match_score: number;
  match_reasons: string[];
  risk_level: 'low' | 'medium' | 'high' | 'critical';
}

export class SanctionsService {
  private static instance: SanctionsService;
  private sanctionsCache: Map<string, SanctionsEntity[]> = new Map();
  private lastUpdate: Date | null = null;

  static getInstance(): SanctionsService {
    if (!SanctionsService.instance) {
      SanctionsService.instance = new SanctionsService();
    }
    return SanctionsService.instance;
  }

  // Check if sanctions data needs updating (daily)
  private needsUpdate(): boolean {
    if (!this.lastUpdate) return true;
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    return this.lastUpdate < oneDayAgo;
  }

  // Load sanctions data from database
  private async loadSanctionsData(): Promise<SanctionsEntity[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('sanctions_entities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error loading sanctions data:', error);
      return [];
    }
  }

  // Fuzzy name matching algorithm
  private calculateMatchScore(name1: string, name2: string): number {
    const s1 = name1.toLowerCase().trim();
    const s2 = name2.toLowerCase().trim();
    
    // Exact match
    if (s1 === s2) return 1.0;
    
    // Levenshtein distance
    const distance = this.levenshteinDistance(s1, s2);
    const maxLength = Math.max(s1.length, s2.length);
    const similarity = 1 - (distance / maxLength);
    
    // Boost score for partial matches
    if (s1.includes(s2) || s2.includes(s1)) {
      return Math.min(similarity + 0.2, 1.0);
    }
    
    return similarity;
  }

  private levenshteinDistance(s1: string, s2: string): number {
    const matrix = Array(s2.length + 1).fill(null).map(() => Array(s1.length + 1).fill(null));
    
    for (let i = 0; i <= s1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= s2.length; j++) matrix[j][0] = j;
    
    for (let j = 1; j <= s2.length; j++) {
      for (let i = 1; i <= s1.length; i++) {
        const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,
          matrix[j - 1][i] + 1,
          matrix[j - 1][i - 1] + cost
        );
      }
    }
    
    return matrix[s2.length][s1.length];
  }

  // Check user against sanctions lists
  async checkUser(user: {
    full_name: string;
    email: string;
    company_name?: string;
    location?: string;
    birth_date?: string;
  }): Promise<SanctionsMatch[]> {
    try {
      // Load sanctions data if needed
      if (this.needsUpdate()) {
        const sanctionsData = await this.loadSanctionsData();
        this.sanctionsCache.set('entities', sanctionsData);
        this.lastUpdate = new Date();
      }

      const entities = this.sanctionsCache.get('entities') || [];
      const matches: SanctionsMatch[] = [];

      // Check against all entities
      for (const entity of entities) {
        let maxScore = 0;
        const matchReasons: string[] = [];

        // Check full name
        const nameScore = this.calculateMatchScore(user.full_name, entity.name);
        if (nameScore > 0.7) {
          maxScore = Math.max(maxScore, nameScore);
          matchReasons.push(`Name match: ${entity.name} (${Math.round(nameScore * 100)}%)`);
        }

        // Check aliases
        for (const alias of entity.aliases) {
          const aliasScore = this.calculateMatchScore(user.full_name, alias);
          if (aliasScore > 0.7) {
            maxScore = Math.max(maxScore, aliasScore);
            matchReasons.push(`Alias match: ${alias} (${Math.round(aliasScore * 100)}%)`);
          }
        }

        // Check company name if provided
        if (user.company_name && entity.entity_type === 'organization') {
          const companyScore = this.calculateMatchScore(user.company_name, entity.name);
          if (companyScore > 0.7) {
            maxScore = Math.max(maxScore, companyScore);
            matchReasons.push(`Company match: ${entity.name} (${Math.round(companyScore * 100)}%)`);
          }
        }

        // Check country if provided
        if (user.location && entity.countries.includes(user.location)) {
          maxScore = Math.max(maxScore, maxScore + 0.1);
          matchReasons.push(`Country match: ${user.location}`);
        }

        // Check birth date if provided
        if (user.birth_date && entity.birth_date && user.birth_date === entity.birth_date) {
          maxScore = Math.max(maxScore, maxScore + 0.2);
          matchReasons.push(`Birth date match: ${entity.birth_date}`);
        }

        // If we have a significant match, add it
        if (maxScore > 0.7) {
          const riskLevel = maxScore > 0.9 ? 'critical' : 
                           maxScore > 0.8 ? 'high' : 
                           maxScore > 0.75 ? 'medium' : 'low';

          matches.push({
            entity,
            match_score: maxScore,
            match_reasons: matchReasons,
            risk_level: riskLevel
          });
        }
      }

      // Sort by match score (highest first)
      return matches.sort((a, b) => b.match_score - a.match_score);

    } catch (error) {
      console.error('Error checking sanctions:', error);
      return [];
    }
  }

  // Add new sanctions entity
  async addSanctionsEntity(entity: Omit<SanctionsEntity, 'id' | 'created_at' | 'updated_at'>): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('sanctions_entities')
        .insert({
          ...entity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) throw error;

      // Clear cache to force reload
      this.sanctionsCache.clear();
      this.lastUpdate = null;

    } catch (error) {
      console.error('Error adding sanctions entity:', error);
      throw error;
    }
  }

  // Update sanctions entity
  async updateSanctionsEntity(id: string, updates: Partial<SanctionsEntity>): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('sanctions_entities')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      // Clear cache to force reload
      this.sanctionsCache.clear();
      this.lastUpdate = null;

    } catch (error) {
      console.error('Error updating sanctions entity:', error);
      throw error;
    }
  }

  // Delete sanctions entity
  async deleteSanctionsEntity(id: string): Promise<void> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('sanctions_entities')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Clear cache to force reload
      this.sanctionsCache.clear();
      this.lastUpdate = null;

    } catch (error) {
      console.error('Error deleting sanctions entity:', error);
      throw error;
    }
  }

  // Get all sanctions entities
  async getAllSanctionsEntities(): Promise<SanctionsEntity[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('sanctions_entities')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error getting sanctions entities:', error);
      return [];
    }
  }

  // Search sanctions entities
  async searchSanctionsEntities(query: string): Promise<SanctionsEntity[]> {
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data, error } = await supabase
        .from('sanctions_entities')
        .select('*')
        .or(`name.ilike.%${query}%,aliases.cs.{${query}}`)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error searching sanctions entities:', error);
      return [];
    }
  }

  // Import sanctions data from external sources
  async importSanctionsData(source: 'OFAC' | 'OFSI' | 'EU' | 'UN' | 'OpenSanctions', data: any[]): Promise<void> {
    try {
      const entities: Omit<SanctionsEntity, 'id' | 'created_at' | 'updated_at'>[] = [];

      for (const item of data) {
        entities.push({
          name: item.name || item.full_name || 'Unknown',
          entity_type: item.entity_type || 'individual',
          source,
          source_id: item.id || item.source_id || Math.random().toString(36),
          aliases: item.aliases || item.aka || [],
          countries: item.countries || item.nationality || [],
          birth_date: item.birth_date || item.date_of_birth,
          sanctions_program: item.sanctions_program || item.program || 'Unknown',
          raw_data: item
        });
      }

      // Batch insert
      const { supabase } = await import('@/integrations/supabase/client');
      const { error } = await supabase
        .from('sanctions_entities')
        .insert(entities.map(entity => ({
          ...entity,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })));

      if (error) throw error;

      // Clear cache to force reload
      this.sanctionsCache.clear();
      this.lastUpdate = null;

    } catch (error) {
      console.error('Error importing sanctions data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export const sanctionsService = SanctionsService.getInstance();

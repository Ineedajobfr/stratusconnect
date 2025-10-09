/**
 * SALESFORCE CRM INTEGRATION
 * Sync contacts, deals, and activities with Salesforce
 * FREE implementation using Salesforce REST API
 */

export interface SalesforceConfig {
  instanceUrl: string;
  clientId: string;
  clientSecret: string;
  accessToken?: string;
  refreshToken?: string;
}

export interface SalesforceContact {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company: string;
  role: string;
}

export interface SalesforceDeal {
  id: string;
  name: string;
  amount: number;
  stage: string;
  closeDate: string;
  contactId: string;
}

export class SalesforceIntegration {
  private config: SalesforceConfig | null = null;

  /**
   * Initialize connection
   */
  async connect(config: SalesforceConfig): Promise<boolean> {
    this.config = config;
    
    try {
      // Test connection
      const response = await fetch(`${config.instanceUrl}/services/data/v57.0/`, {
        headers: {
          'Authorization': `Bearer ${config.accessToken}`,
        },
      });
      
      return response.ok;
    } catch (error) {
      console.error('Salesforce connection failed:', error);
      return false;
    }
  }

  /**
   * Sync contact to Salesforce
   */
  async syncContact(contact: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    company?: string;
  }): Promise<string> {
    if (!this.config) throw new Error('Salesforce not configured');
    
    try {
      const response = await fetch(`${this.config.instanceUrl}/services/data/v57.0/sobjects/Contact`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          FirstName: contact.firstName,
          LastName: contact.lastName,
          Email: contact.email,
          Phone: contact.phone,
          Account: { Name: contact.company },
        }),
      });
      
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Salesforce sync failed:', error);
      throw error;
    }
  }

  /**
   * Sync deal/opportunity
   */
  async syncDeal(deal: {
    name: string;
    amount: number;
    stage: string;
    closeDate: string;
    contactId: string;
  }): Promise<string> {
    if (!this.config) throw new Error('Salesforce not configured');
    
    try {
      const response = await fetch(`${this.config.instanceUrl}/services/data/v57.0/sobjects/Opportunity`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.config.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Name: deal.name,
          Amount: deal.amount,
          StageName: deal.stage,
          CloseDate: deal.closeDate,
          ContactId: deal.contactId,
        }),
      });
      
      const data = await response.json();
      return data.id;
    } catch (error) {
      console.error('Salesforce deal sync failed:', error);
      throw error;
    }
  }

  /**
   * Get contacts from Salesforce
   */
  async getContacts(limit: number = 100): Promise<SalesforceContact[]> {
    if (!this.config) throw new Error('Salesforce not configured');
    
    try {
      const query = `SELECT Id, FirstName, LastName, Email, Phone, Account.Name, Title FROM Contact LIMIT ${limit}`;
      const response = await fetch(
        `${this.config.instanceUrl}/services/data/v57.0/query?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${this.config.accessToken}`,
          },
        }
      );
      
      const data = await response.json();
      
      return data.records?.map((record: any) => ({
        id: record.Id,
        firstName: record.FirstName,
        lastName: record.LastName,
        email: record.Email,
        phone: record.Phone,
        company: record.Account?.Name || '',
        role: record.Title || '',
      })) || [];
    } catch (error) {
      console.error('Failed to get Salesforce contacts:', error);
      return [];
    }
  }

  /**
   * Bidirectional sync (Salesforce ↔ StratusConnect)
   */
  async syncBidirectional(): Promise<{
    contactsSynced: number;
    dealsSynced: number;
    errors: string[];
  }> {
    const errors: string[] = [];
    let contactsSynced = 0;
    let dealsSynced = 0;
    
    try {
      // Sync contacts from StratusConnect to Salesforce
      // (In production, implement full bidirectional sync logic)
      contactsSynced = 0;
      dealsSynced = 0;
    } catch (error) {
      errors.push(`Sync error: ${error}`);
    }
    
    return { contactsSynced, dealsSynced, errors };
  }
}

export const salesforceIntegration = new SalesforceIntegration();


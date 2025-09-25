// KYC Document Management Service
// Handles document upload, verification, and compliance

import { supabase } from '@/integrations/supabase/client';

export interface KYCDocument {
  id: string;
  user_id: string;
  document_type: 'passport' | 'drivers_license' | 'pilot_license' | 'insurance' | 'aircraft_registration' | 'other';
  file_url: string;
  file_hash: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason?: string;
  approved_at?: string;
  rejected_at?: string;
  created_at: string;
  metadata?: {
    expiry_date?: string;
    document_number?: string;
    issuing_country?: string;
    extracted_text?: string;
  };
}

export interface KYCVerificationResult {
  document: KYCDocument;
  is_valid: boolean;
  confidence_score: number;
  extracted_data: {
    document_number?: string;
    expiry_date?: string;
    issuing_country?: string;
    full_name?: string;
    birth_date?: string;
  };
  verification_notes: string[];
}

export class KYCService {
  private static instance: KYCService;

  static getInstance(): KYCService {
    if (!KYCService.instance) {
      KYCService.instance = new KYCService();
    }
    return KYCService.instance;
  }

  // Upload document
  async uploadDocument(
    userId: string,
    file: File,
    documentType: KYCDocument['document_type'],
    metadata?: any
  ): Promise<KYCDocument> {
    try {
      // Generate unique filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}/${documentType}_${Date.now()}.${fileExt}`;
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('kyc-documents')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('kyc-documents')
        .getPublicUrl(fileName);

      // Calculate file hash
      const fileHash = await this.calculateFileHash(file);

      // Save document record
      const { data, error } = await supabase
        .from('kyc_documents')
        .insert({
          user_id: userId,
          document_type: documentType,
          file_url: urlData.publicUrl,
          file_hash: fileHash,
          status: 'pending',
          metadata: metadata || {},
          created_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      // Trigger automatic verification
      this.verifyDocument(data.id);

      return data;

    } catch (error) {
      console.error('Error uploading KYC document:', error);
      throw error;
    }
  }

  // Calculate file hash for integrity checking
  private async calculateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  // Verify document using OCR and validation
  async verifyDocument(documentId: string): Promise<KYCVerificationResult> {
    try {
      const { data: document, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('id', documentId)
        .single();

      if (error) throw error;

      // Mock OCR and validation (in production, integrate with real OCR service)
      const verificationResult = await this.performOCRVerification(document);

      // Update document with verification results
      const { error: updateError } = await supabase
        .from('kyc_documents')
        .update({
          metadata: {
            ...document.metadata,
            ...verificationResult.extracted_data,
            verification_confidence: verificationResult.confidence_score
          },
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (updateError) throw updateError;

      return verificationResult;

    } catch (error) {
      console.error('Error verifying KYC document:', error);
      throw error;
    }
  }

  // Mock OCR verification (replace with real OCR service)
  private async performOCRVerification(document: KYCDocument): Promise<KYCVerificationResult> {
    // Simulate OCR processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock extracted data based on document type
    const mockData = this.generateMockExtractedData(document.document_type);
    
    // Mock validation logic
    const is_valid = Math.random() > 0.1; // 90% success rate
    const confidence_score = Math.random() * 0.3 + 0.7; // 70-100% confidence

    const verification_notes = [];
    if (mockData.expiry_date) {
      const expiryDate = new Date(mockData.expiry_date);
      const now = new Date();
      if (expiryDate < now) {
        verification_notes.push('Document has expired');
      } else if (expiryDate < new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)) {
        verification_notes.push('Document expires within 30 days');
      }
    }

    if (confidence_score < 0.8) {
      verification_notes.push('Low confidence in extracted data');
    }

    return {
      document,
      is_valid,
      confidence_score,
      extracted_data: mockData,
      verification_notes
    };
  }

  // Generate mock extracted data based on document type
  private generateMockExtractedData(documentType: string): any {
    const mockData = {
      document_number: Math.random().toString(36).substring(2, 15).toUpperCase(),
      issuing_country: ['US', 'UK', 'CA', 'AU', 'DE'][Math.floor(Math.random() * 5)],
      full_name: 'John Doe',
      birth_date: '1990-01-01'
    };

    switch (documentType) {
      case 'passport':
        mockData.document_number = 'P' + Math.random().toString().substring(2, 9);
        mockData.expiry_date = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 10).toISOString().split('T')[0];
        break;
      case 'drivers_license':
        mockData.document_number = 'DL' + Math.random().toString().substring(2, 10);
        mockData.expiry_date = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 5).toISOString().split('T')[0];
        break;
      case 'pilot_license':
        mockData.document_number = 'PL' + Math.random().toString().substring(2, 8);
        mockData.expiry_date = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 2).toISOString().split('T')[0];
        break;
      case 'insurance':
        mockData.document_number = 'INS' + Math.random().toString().substring(2, 12);
        mockData.expiry_date = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        break;
      case 'aircraft_registration':
        mockData.document_number = 'N' + Math.random().toString().substring(2, 6);
        mockData.expiry_date = new Date(Date.now() + Math.random() * 365 * 24 * 60 * 60 * 1000 * 3).toISOString().split('T')[0];
        break;
    }

    return mockData;
  }

  // Approve document
  async approveDocument(documentId: string, approverId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('kyc_documents')
        .update({
          status: 'approved',
          approved_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;

      // Log admin action
      const { error: logError } = await supabase
        .from('security_events')
        .insert({
          event_type: 'admin_action',
          severity: 'medium',
          message: `KYC document approved`,
          user_id: approverId,
          metadata: { document_id: documentId },
          created_at: new Date().toISOString()
        });

      if (logError) console.error('Error logging admin action:', logError);

    } catch (error) {
      console.error('Error approving KYC document:', error);
      throw error;
    }
  }

  // Reject document
  async rejectDocument(documentId: string, reason: string, approverId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('kyc_documents')
        .update({
          status: 'rejected',
          rejection_reason: reason,
          rejected_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('id', documentId);

      if (error) throw error;

      // Log admin action
      const { error: logError } = await supabase
        .from('security_events')
        .insert({
          event_type: 'admin_action',
          severity: 'medium',
          message: `KYC document rejected: ${reason}`,
          user_id: approverId,
          metadata: { document_id: documentId, reason },
          created_at: new Date().toISOString()
        });

      if (logError) console.error('Error logging admin action:', logError);

    } catch (error) {
      console.error('Error rejecting KYC document:', error);
      throw error;
    }
  }

  // Get user's KYC documents
  async getUserDocuments(userId: string): Promise<KYCDocument[]> {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error getting user KYC documents:', error);
      return [];
    }
  }

  // Get all pending KYC documents
  async getPendingDocuments(): Promise<KYCDocument[]> {
    try {
      const { data, error } = await supabase
        .from('kyc_documents')
        .select(`
          *,
          user:user_id(full_name, email)
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];

    } catch (error) {
      console.error('Error getting pending KYC documents:', error);
      return [];
    }
  }

  // Delete document
  async deleteDocument(documentId: string): Promise<void> {
    try {
      // Get document info first
      const { data: document, error: fetchError } = await supabase
        .from('kyc_documents')
        .select('file_url')
        .eq('id', documentId)
        .single();

      if (fetchError) throw fetchError;

      // Delete from storage
      const fileName = document.file_url.split('/').pop();
      if (fileName) {
        const { error: storageError } = await supabase.storage
          .from('kyc-documents')
          .remove([fileName]);

        if (storageError) console.error('Error deleting file from storage:', storageError);
      }

      // Delete from database
      const { error } = await supabase
        .from('kyc_documents')
        .delete()
        .eq('id', documentId);

      if (error) throw error;

    } catch (error) {
      console.error('Error deleting KYC document:', error);
      throw error;
    }
  }

  // Check if user has all required documents
  async checkUserCompleteness(userId: string): Promise<{
    is_complete: boolean;
    missing_documents: string[];
    expired_documents: string[];
  }> {
    try {
      const documents = await this.getUserDocuments(userId);
      const requiredTypes = ['passport', 'pilot_license', 'insurance'];
      
      const missing_documents = requiredTypes.filter(type => 
        !documents.some(doc => doc.document_type === type && doc.status === 'approved')
      );

      const expired_documents = documents
        .filter(doc => {
          if (!doc.metadata?.expiry_date) return false;
          const expiryDate = new Date(doc.metadata.expiry_date);
          return expiryDate < new Date();
        })
        .map(doc => doc.document_type);

      return {
        is_complete: missing_documents.length === 0 && expired_documents.length === 0,
        missing_documents,
        expired_documents
      };

    } catch (error) {
      console.error('Error checking user completeness:', error);
      return {
        is_complete: false,
        missing_documents: [],
        expired_documents: []
      };
    }
  }
}

// Export singleton instance
export const kycService = KYCService.getInstance();

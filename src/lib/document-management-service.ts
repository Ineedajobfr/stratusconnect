// Document Management Service - Contracts, invoices, certificates, compliance
// Secure storage and retrieval of all aviation documents

import { supabase } from '@/integrations/supabase/client';

export interface Document {
  id: string;
  name: string;
  type: DocumentType;
  category: string;
  url: string;
  uploadedBy: string;
  uploadedAt: string;
  size: number;
  mimeType: string;
  expiryDate?: string;
  status: 'active' | 'expired' | 'pending_review' | 'archived';
  associatedEntity?: string; // booking_id, aircraft_id, user_id, etc.
  tags: string[];
  version: number;
  previousVersions: string[];
}

export type DocumentType =
  | 'contract'
  | 'invoice'
  | 'receipt'
  | 'certificate'
  | 'insurance'
  | 'flight_log'
  | 'compliance'
  | 'maintenance_record'
  | 'license'
  | 'medical'
  | 'training'
  | 'other';

export interface Contract {
  id: string;
  bookingId: string;
  brokerId: string;
  operatorId: string;
  terms: string;
  value: number;
  currency: string;
  signedByBroker: boolean;
  signedByOperator: boolean;
  brokerSignature?: string;
  operatorSignature?: string;
  createdAt: string;
  signedAt?: string;
  documentUrl: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  issuedTo: string;
  issuedBy: string;
  amount: number;
  currency: string;
  dueDate: string;
  paidAt?: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  lineItems: InvoiceLineItem[];
  documentUrl: string;
  createdAt: string;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Receipt {
  id: string;
  receiptNumber: string;
  paymentId: string;
  amount: number;
  currency: string;
  paidBy: string;
  paidTo: string;
  paymentMethod: string;
  transactionId: string;
  documentUrl: string;
  createdAt: string;
}

export interface Certificate {
  id: string;
  type: string;
  number: string;
  holderId: string;
  holderName: string;
  issueDate: string;
  expiryDate: string;
  issuingAuthority: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'suspended';
  documentUrl: string;
  verificationUrl?: string;
}

export interface FlightLog {
  id: string;
  flightId: string;
  pilotId: string;
  aircraftRegistration: string;
  route: string;
  departureTime: string;
  arrivalTime: string;
  flightTime: number;
  picTime?: number;
  instrumentTime?: number;
  nightTime?: number;
  remarks: string;
  documentUrl: string;
}

class DocumentManagementService {
  // Get all documents for a user/entity
  async getDocuments(
    userId: string,
    filters?: {
      type?: DocumentType;
      category?: string;
      status?: string;
      associatedEntity?: string;
    }
  ): Promise<Document[]> {
    try {
      let query = supabase
        .from('documents')
        .select('*')
        .eq('user_id', userId)
        .order('uploaded_at', { ascending: false });

      if (filters?.type) query = query.eq('type', filters.type);
      if (filters?.category) query = query.eq('category', filters.category);
      if (filters?.status) query = query.eq('status', filters.status);
      if (filters?.associatedEntity) query = query.eq('associated_entity', filters.associatedEntity);

      const { data, error } = await query;

      if (error) throw error;

      return (data || []).map(doc => ({
        id: doc.id,
        name: doc.name,
        type: doc.type as DocumentType,
        category: doc.category || 'General',
        url: doc.url,
        uploadedBy: doc.uploaded_by,
        uploadedAt: doc.uploaded_at,
        size: doc.size || 0,
        mimeType: doc.mime_type || 'application/pdf',
        expiryDate: doc.expiry_date,
        status: doc.status as any,
        associatedEntity: doc.associated_entity,
        tags: doc.tags || [],
        version: doc.version || 1,
        previousVersions: doc.previous_versions || [],
      }));
    } catch (error) {
      console.error('Failed to fetch documents:', error);
      return [];
    }
  }

  // Upload document
  async uploadDocument(
    file: File,
    userId: string,
    metadata: {
      type: DocumentType;
      category: string;
      expiryDate?: string;
      associatedEntity?: string;
      tags?: string[];
    }
  ): Promise<Document | null> {
    try {
      // Upload to storage
      const fileName = `${userId}/${metadata.type}/${Date.now()}-${file.name}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      // Save metadata to database
      const { data: docData, error: docError } = await supabase
        .from('documents')
        .insert({
          name: file.name,
          type: metadata.type,
          category: metadata.category,
          url: urlData.publicUrl,
          uploaded_by: userId,
          user_id: userId,
          uploaded_at: new Date().toISOString(),
          size: file.size,
          mime_type: file.type,
          expiry_date: metadata.expiryDate,
          status: 'active',
          associated_entity: metadata.associatedEntity,
          tags: metadata.tags || [],
          version: 1,
        })
        .select()
        .single();

      if (docError) throw docError;

      return {
        id: docData.id,
        name: docData.name,
        type: docData.type as DocumentType,
        category: docData.category,
        url: docData.url,
        uploadedBy: docData.uploaded_by,
        uploadedAt: docData.uploaded_at,
        size: docData.size,
        mimeType: docData.mime_type,
        expiryDate: docData.expiry_date,
        status: docData.status as any,
        associatedEntity: docData.associated_entity,
        tags: docData.tags || [],
        version: docData.version,
        previousVersions: [],
      };
    } catch (error) {
      console.error('Failed to upload document:', error);
      return null;
    }
  }

  // Generate contract PDF
  async generateContract(contractData: {
    bookingId: string;
    brokerId: string;
    operatorId: string;
    terms: string;
    value: number;
    currency: string;
  }): Promise<Contract | null> {
    try {
      // Generate contract document
      const contractHtml = this.generateContractHTML(contractData);
      
      // In production, would use a PDF generation service
      const contractUrl = `https://stratus-contracts.com/${contractData.bookingId}.pdf`;

      const { data, error } = await supabase
        .from('contracts')
        .insert({
          booking_id: contractData.bookingId,
          broker_id: contractData.brokerId,
          operator_id: contractData.operatorId,
          terms: contractData.terms,
          value: contractData.value,
          currency: contractData.currency,
          signed_by_broker: false,
          signed_by_operator: false,
          document_url: contractUrl,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        bookingId: data.booking_id,
        brokerId: data.broker_id,
        operatorId: data.operator_id,
        terms: data.terms,
        value: data.value,
        currency: data.currency,
        signedByBroker: data.signed_by_broker,
        signedByOperator: data.signed_by_operator,
        createdAt: data.created_at,
        documentUrl: data.document_url,
      };
    } catch (error) {
      console.error('Failed to generate contract:', error);
      return null;
    }
  }

  // Generate invoice
  async generateInvoice(invoiceData: {
    bookingId: string;
    issuedTo: string;
    issuedBy: string;
    lineItems: InvoiceLineItem[];
    dueDate: string;
  }): Promise<Invoice | null> {
    try {
      const amount = invoiceData.lineItems.reduce((sum, item) => sum + item.total, 0);
      const invoiceNumber = `INV-${Date.now()}`;

      const { data, error } = await supabase
        .from('invoices')
        .insert({
          invoice_number: invoiceNumber,
          booking_id: invoiceData.bookingId,
          issued_to: invoiceData.issuedTo,
          issued_by: invoiceData.issuedBy,
          amount,
          currency: 'USD',
          due_date: invoiceData.dueDate,
          status: 'sent',
          line_items: invoiceData.lineItems,
          document_url: `https://stratus-invoices.com/${invoiceNumber}.pdf`,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        invoiceNumber: data.invoice_number,
        bookingId: data.booking_id,
        issuedTo: data.issued_to,
        issuedBy: data.issued_by,
        amount: data.amount,
        currency: data.currency,
        dueDate: data.due_date,
        status: data.status as any,
        lineItems: data.line_items,
        documentUrl: data.document_url,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Failed to generate invoice:', error);
      return null;
    }
  }

  // Generate receipt
  async generateReceipt(receiptData: {
    paymentId: string;
    amount: number;
    paidBy: string;
    paidTo: string;
    paymentMethod: string;
    transactionId: string;
  }): Promise<Receipt | null> {
    try {
      const receiptNumber = `REC-${Date.now()}`;

      const { data, error } = await supabase
        .from('receipts')
        .insert({
          receipt_number: receiptNumber,
          payment_id: receiptData.paymentId,
          amount: receiptData.amount,
          currency: 'USD',
          paid_by: receiptData.paidBy,
          paid_to: receiptData.paidTo,
          payment_method: receiptData.paymentMethod,
          transaction_id: receiptData.transactionId,
          document_url: `https://stratus-receipts.com/${receiptNumber}.pdf`,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      return {
        id: data.id,
        receiptNumber: data.receipt_number,
        paymentId: data.payment_id,
        amount: data.amount,
        currency: data.currency,
        paidBy: data.paid_by,
        paidTo: data.paid_to,
        paymentMethod: data.payment_method,
        transactionId: data.transaction_id,
        documentUrl: data.document_url,
        createdAt: data.created_at,
      };
    } catch (error) {
      console.error('Failed to generate receipt:', error);
      return null;
    }
  }

  // Get certificates for a user
  async getCertificates(userId: string): Promise<Certificate[]> {
    try {
      const { data, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('holder_id', userId)
        .order('expiry_date');

      if (error) throw error;

      return (data || []).map(cert => {
        const expiryDate = new Date(cert.expiry_date);
        const daysUntilExpiry = Math.floor((expiryDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        
        let status: 'valid' | 'expiring_soon' | 'expired' | 'suspended' = 'valid';
        if (cert.suspended) status = 'suspended';
        else if (daysUntilExpiry < 0) status = 'expired';
        else if (daysUntilExpiry < 60) status = 'expiring_soon';

        return {
          id: cert.id,
          type: cert.type,
          number: cert.number,
          holderId: cert.holder_id,
          holderName: cert.holder_name,
          issueDate: cert.issue_date,
          expiryDate: cert.expiry_date,
          issuingAuthority: cert.issuing_authority,
          status,
          documentUrl: cert.document_url,
          verificationUrl: cert.verification_url,
        };
      });
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
      return [];
    }
  }

  // Get flight logs
  async getFlightLogs(pilotId: string): Promise<FlightLog[]> {
    try {
      const { data, error } = await supabase
        .from('flight_logs')
        .select('*')
        .eq('pilot_id', pilotId)
        .order('departure_time', { ascending: false });

      if (error) throw error;

      return (data || []).map(log => ({
        id: log.id,
        flightId: log.flight_id,
        pilotId: log.pilot_id,
        aircraftRegistration: log.aircraft_registration,
        route: log.route,
        departureTime: log.departure_time,
        arrivalTime: log.arrival_time,
        flightTime: log.flight_time,
        picTime: log.pic_time,
        instrumentTime: log.instrument_time,
        nightTime: log.night_time,
        remarks: log.remarks || '',
        documentUrl: log.document_url || '',
      }));
    } catch (error) {
      console.error('Failed to fetch flight logs:', error);
      return [];
    }
  }

  // Archive document
  async archiveDocument(documentId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('documents')
        .update({ status: 'archived' })
        .eq('id', documentId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Failed to archive document:', error);
      return false;
    }
  }

  // Generate contract HTML (helper)
  private generateContractHTML(contractData: any): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Charter Contract - ${contractData.bookingId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 40px; }
            .header { text-align: center; margin-bottom: 40px; }
            .terms { margin: 20px 0; line-height: 1.6; }
            .signature { margin-top: 60px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>CHARTER AGREEMENT</h1>
            <p>Contract Value: ${contractData.currency} ${contractData.value.toLocaleString()}</p>
          </div>
          <div class="terms">
            <h2>Terms and Conditions</h2>
            <p>${contractData.terms}</p>
          </div>
          <div class="signature">
            <p>Broker Signature: _____________________ Date: _____</p>
            <p>Operator Signature: _____________________ Date: _____</p>
          </div>
        </body>
      </html>
    `;
  }
}

export const documentManagementService = new DocumentManagementService();


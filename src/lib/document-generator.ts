// Document Auto-Generation Service
// Generates contracts, receipts, invoices, agreements, and certificates

import { supabase } from '@/integrations/supabase/client';

export interface DocumentTemplate {
  type: 'contract' | 'receipt' | 'invoice' | 'agreement' | 'certificate';
  title: string;
  content: string;
  variables: Record<string, any>;
}

export interface GeneratedDocument {
  id: string;
  document_type: string;
  title: string;
  file_url: string;
  file_name: string;
  created_at: string;
  metadata: Record<string, any>;
}

class DocumentGeneratorService {
  // Generate a contract document
  async generateContract(data: {
    dealId: string;
    partyA: { name: string; company: string; email: string };
    partyB: { name: string; company: string; email: string };
    terms: string[];
    amount: number;
    currency: string;
    startDate: string;
    endDate: string;
    additionalTerms?: string;
  }): Promise<GeneratedDocument> {
    const contractNumber = this.generateDocumentNumber('CTR');
    const htmlContent = this.createContractHTML(contractNumber, data);
    
    return this.saveDocument({
      document_type: 'contract',
      title: `Charter Agreement ${contractNumber}`,
      content: htmlContent,
      metadata: {
        contract_number: contractNumber,
        deal_id: data.dealId,
        parties: [data.partyA, data.partyB],
        amount: data.amount,
        currency: data.currency,
        dates: { start: data.startDate, end: data.endDate }
      }
    });
  }

  // Generate a receipt document
  async generateReceipt(data: {
    dealId: string;
    payerName: string;
    payeeName: string;
    payeeCompany: string;
    amount: number;
    currency: string;
    paymentMethod: string;
    transactionId: string;
    description: string;
    date?: string;
  }): Promise<GeneratedDocument> {
    const receiptNumber = this.generateDocumentNumber('RCP');
    const htmlContent = this.createReceiptHTML(receiptNumber, data);
    
    return this.saveDocument({
      document_type: 'receipt',
      title: `Payment Receipt ${receiptNumber}`,
      content: htmlContent,
      metadata: {
        receipt_number: receiptNumber,
        deal_id: data.dealId,
        payer: data.payerName,
        payee: data.payeeName,
        amount: data.amount,
        currency: data.currency,
        transaction_id: data.transactionId,
        payment_method: data.paymentMethod
      }
    });
  }

  // Generate an invoice document
  async generateInvoice(data: {
    dealId: string;
    invoiceFrom: { name: string; company: string; address: string; email: string };
    invoiceTo: { name: string; company: string; address: string; email: string };
    lineItems: Array<{ description: string; quantity: number; rate: number; amount: number }>;
    subtotal: number;
    tax: number;
    total: number;
    currency: string;
    dueDate: string;
    notes?: string;
  }): Promise<GeneratedDocument> {
    const invoiceNumber = this.generateDocumentNumber('INV');
    const htmlContent = this.createInvoiceHTML(invoiceNumber, data);
    
    return this.saveDocument({
      document_type: 'invoice',
      title: `Invoice ${invoiceNumber}`,
      content: htmlContent,
      metadata: {
        invoice_number: invoiceNumber,
        deal_id: data.dealId,
        from: data.invoiceFrom,
        to: data.invoiceTo,
        line_items: data.lineItems,
        totals: { subtotal: data.subtotal, tax: data.tax, total: data.total },
        currency: data.currency,
        due_date: data.dueDate
      }
    });
  }

  // Generate an agreement document
  async generateAgreement(data: {
    dealId: string;
    agreementType: string;
    parties: Array<{ name: string; company: string; role: string }>;
    terms: string[];
    effectiveDate: string;
    expirationDate?: string;
    additionalClauses?: string;
  }): Promise<GeneratedDocument> {
    const agreementNumber = this.generateDocumentNumber('AGR');
    const htmlContent = this.createAgreementHTML(agreementNumber, data);
    
    return this.saveDocument({
      document_type: 'agreement',
      title: `${data.agreementType} Agreement ${agreementNumber}`,
      content: htmlContent,
      metadata: {
        agreement_number: agreementNumber,
        deal_id: data.dealId,
        agreement_type: data.agreementType,
        parties: data.parties,
        effective_date: data.effectiveDate,
        expiration_date: data.expirationDate
      }
    });
  }

  // Generate a certificate document
  async generateCertificate(data: {
    certificateType: string;
    recipientName: string;
    recipientCompany?: string;
    issuedBy: string;
    issuedByTitle: string;
    description: string;
    issueDate?: string;
    expirationDate?: string;
    certificateId?: string;
  }): Promise<GeneratedDocument> {
    const certNumber = data.certificateId || this.generateDocumentNumber('CERT');
    const htmlContent = this.createCertificateHTML(certNumber, data);
    
    return this.saveDocument({
      document_type: 'certificate',
      title: `${data.certificateType} Certificate ${certNumber}`,
      content: htmlContent,
      metadata: {
        certificate_number: certNumber,
        certificate_type: data.certificateType,
        recipient: data.recipientName,
        company: data.recipientCompany,
        issued_by: data.issuedBy,
        issue_date: data.issueDate || new Date().toISOString(),
        expiration_date: data.expirationDate
      }
    });
  }

  // Helper: Generate unique document number
  private generateDocumentNumber(prefix: string): string {
    const timestamp = Date.now();
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return `${prefix}-${timestamp}-${random}`;
  }

  // Helper: Create contract HTML
  private createContractHTML(contractNumber: string, data: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Charter Agreement ${contractNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.6; }
    .header { text-align: center; margin-bottom: 40px; border-bottom: 3px solid #333; padding-bottom: 20px; }
    .header h1 { margin: 0; color: #1a1a1a; }
    .header p { margin: 5px 0; color: #666; }
    .section { margin: 30px 0; }
    .section-title { font-size: 18px; font-weight: bold; margin-bottom: 15px; color: #1a1a1a; border-bottom: 1px solid #ddd; padding-bottom: 5px; }
    .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
    .party { padding: 15px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9; }
    .party-label { font-weight: bold; color: #333; margin-bottom: 10px; }
    .terms-list { list-style: decimal; padding-left: 25px; }
    .terms-list li { margin: 10px 0; }
    .financial { background: #f0f8ff; padding: 15px; border-radius: 5px; margin: 20px 0; }
    .signatures { margin-top: 60px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
    .signature-block { border-top: 2px solid #333; padding-top: 10px; }
    .footer { margin-top: 40px; font-size: 12px; color: #666; text-align: center; border-top: 1px solid #ddd; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="header">
    <h1>CHARTER AGREEMENT</h1>
    <p>Contract Number: ${contractNumber}</p>
    <p>Date: ${new Date().toLocaleDateString()}</p>
  </div>

  <div class="section">
    <div class="section-title">Parties to this Agreement</div>
    <div class="parties">
      <div class="party">
        <div class="party-label">Party A (Broker)</div>
        <p><strong>${data.partyA.name}</strong></p>
        <p>${data.partyA.company}</p>
        <p>${data.partyA.email}</p>
      </div>
      <div class="party">
        <div class="party-label">Party B (Operator)</div>
        <p><strong>${data.partyB.name}</strong></p>
        <p>${data.partyB.company}</p>
        <p>${data.partyB.email}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Terms and Conditions</div>
    <ol class="terms-list">
      ${data.terms.map((term: string) => `<li>${term}</li>`).join('')}
    </ol>
    ${data.additionalTerms ? `<p><strong>Additional Terms:</strong> ${data.additionalTerms}</p>` : ''}
  </div>

  <div class="section">
    <div class="section-title">Financial Terms</div>
    <div class="financial">
      <p><strong>Total Contract Value:</strong> ${data.currency} ${data.amount.toLocaleString()}</p>
      <p><strong>Contract Period:</strong> ${new Date(data.startDate).toLocaleDateString()} to ${new Date(data.endDate).toLocaleDateString()}</p>
    </div>
  </div>

  <div class="signatures">
    <div class="signature-block">
      <p><strong>Party A Signature</strong></p>
      <p>${data.partyA.name}</p>
      <p>Date: _________________</p>
    </div>
    <div class="signature-block">
      <p><strong>Party B Signature</strong></p>
      <p>${data.partyB.name}</p>
      <p>Date: _________________</p>
    </div>
  </div>

  <div class="footer">
    <p>This document was electronically generated by StratusConnect</p>
    <p>Document ID: ${contractNumber} | Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
    `.trim();
  }

  // Helper: Create receipt HTML
  private createReceiptHTML(receiptNumber: string, data: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Payment Receipt ${receiptNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; }
    .receipt { border: 2px solid #333; padding: 30px; border-radius: 10px; }
    .header { text-align: center; margin-bottom: 30px; }
    .header h1 { margin: 0; color: #2d5016; }
    .receipt-number { font-size: 14px; color: #666; margin-top: 10px; }
    .section { margin: 20px 0; padding: 15px; background: #f9f9f9; border-radius: 5px; }
    .row { display: flex; justify-content: space-between; margin: 10px 0; }
    .label { font-weight: bold; color: #333; }
    .value { color: #666; }
    .amount-section { background: #d4edda; padding: 20px; border-radius: 5px; text-align: center; margin: 20px 0; }
    .amount { font-size: 32px; font-weight: bold; color: #155724; }
    .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>PAYMENT RECEIPT</h1>
      <div class="receipt-number">Receipt #${receiptNumber}</div>
      <p>${data.date || new Date().toLocaleDateString()}</p>
    </div>

    <div class="section">
      <div class="row">
        <span class="label">Paid By:</span>
        <span class="value">${data.payerName}</span>
      </div>
      <div class="row">
        <span class="label">Paid To:</span>
        <span class="value">${data.payeeName} (${data.payeeCompany})</span>
      </div>
      <div class="row">
        <span class="label">Payment Method:</span>
        <span class="value">${data.paymentMethod}</span>
      </div>
      <div class="row">
        <span class="label">Transaction ID:</span>
        <span class="value">${data.transactionId}</span>
      </div>
      <div class="row">
        <span class="label">Description:</span>
        <span class="value">${data.description}</span>
      </div>
    </div>

    <div class="amount-section">
      <div class="label" style="font-size: 16px; margin-bottom: 10px;">Total Amount Paid</div>
      <div class="amount">${data.currency} ${data.amount.toLocaleString()}</div>
    </div>

    <div class="footer">
      <p>Thank you for your payment!</p>
      <p>This receipt was electronically generated by StratusConnect</p>
      <p>Generated: ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  // Helper: Create invoice HTML
  private createInvoiceHTML(invoiceNumber: string, data: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
    .invoice-title { font-size: 36px; font-weight: bold; color: #1a1a1a; }
    .invoice-number { font-size: 14px; color: #666; }
    .addresses { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin: 30px 0; }
    .address-block { padding: 15px; background: #f9f9f9; border-radius: 5px; }
    .address-label { font-weight: bold; margin-bottom: 10px; color: #333; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f0f0f0; font-weight: bold; }
    .totals { margin-top: 20px; text-align: right; }
    .totals-row { display: flex; justify-content: flex-end; margin: 10px 0; }
    .totals-label { width: 150px; text-align: right; margin-right: 20px; font-weight: bold; }
    .total-amount { font-size: 24px; font-weight: bold; color: #2d5016; }
    .notes { margin-top: 30px; padding: 15px; background: #fffacd; border-radius: 5px; }
    .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="invoice-title">INVOICE</div>
      <div class="invoice-number">Invoice #${invoiceNumber}</div>
      <div class="invoice-number">Date: ${new Date().toLocaleDateString()}</div>
      <div class="invoice-number">Due Date: ${new Date(data.dueDate).toLocaleDateString()}</div>
    </div>
  </div>

  <div class="addresses">
    <div class="address-block">
      <div class="address-label">FROM:</div>
      <p><strong>${data.invoiceFrom.company}</strong></p>
      <p>${data.invoiceFrom.name}</p>
      <p>${data.invoiceFrom.address}</p>
      <p>${data.invoiceFrom.email}</p>
    </div>
    <div class="address-block">
      <div class="address-label">TO:</div>
      <p><strong>${data.invoiceTo.company}</strong></p>
      <p>${data.invoiceTo.name}</p>
      <p>${data.invoiceTo.address}</p>
      <p>${data.invoiceTo.email}</p>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>Quantity</th>
        <th>Rate</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      ${data.lineItems.map((item: any) => `
        <tr>
          <td>${item.description}</td>
          <td>${item.quantity}</td>
          <td>${data.currency} ${item.rate.toLocaleString()}</td>
          <td>${data.currency} ${item.amount.toLocaleString()}</td>
        </tr>
      `).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="totals-row">
      <div class="totals-label">Subtotal:</div>
      <div>${data.currency} ${data.subtotal.toLocaleString()}</div>
    </div>
    <div class="totals-row">
      <div class="totals-label">Tax:</div>
      <div>${data.currency} ${data.tax.toLocaleString()}</div>
    </div>
    <div class="totals-row" style="border-top: 2px solid #333; padding-top: 10px; margin-top: 10px;">
      <div class="totals-label">Total:</div>
      <div class="total-amount">${data.currency} ${data.total.toLocaleString()}</div>
    </div>
  </div>

  ${data.notes ? `
    <div class="notes">
      <strong>Notes:</strong>
      <p>${data.notes}</p>
    </div>
  ` : ''}

  <div class="footer">
    <p>This invoice was electronically generated by StratusConnect</p>
    <p>Invoice ID: ${invoiceNumber} | Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
    `.trim();
  }

  // Helper: Create agreement HTML
  private createAgreementHTML(agreementNumber: string, data: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.agreementType} Agreement ${agreementNumber}</title>
  <style>
    body { font-family: 'Times New Roman', serif; max-width: 800px; margin: 0 auto; padding: 40px; line-height: 1.8; }
    .header { text-align: center; margin-bottom: 40px; }
    .header h1 { margin: 0; text-transform: uppercase; }
    .agreement-number { margin-top: 10px; font-size: 14px; }
    .section { margin: 30px 0; }
    .section-title { font-weight: bold; margin: 20px 0 10px 0; text-decoration: underline; }
    .parties { margin: 20px 0; }
    .party { margin: 15px 0; padding-left: 20px; }
    .terms { list-style: decimal; padding-left: 40px; }
    .terms li { margin: 15px 0; }
    .signatures { margin-top: 60px; }
    .signature-line { margin: 40px 0; border-top: 1px solid #000; padding-top: 5px; }
    .footer { margin-top: 40px; font-size: 12px; text-align: center; }
  </style>
</head>
<body>
  <div class="header">
    <h1>${data.agreementType} AGREEMENT</h1>
    <div class="agreement-number">Agreement Number: ${agreementNumber}</div>
    <div class="agreement-number">Effective Date: ${new Date(data.effectiveDate).toLocaleDateString()}</div>
    ${data.expirationDate ? `<div class="agreement-number">Expiration Date: ${new Date(data.expirationDate).toLocaleDateString()}</div>` : ''}
  </div>

  <div class="section">
    <div class="section-title">PARTIES</div>
    <div class="parties">
      ${data.parties.map((party: any, index: number) => `
        <div class="party">
          <p><strong>Party ${String.fromCharCode(65 + index)} (${party.role}):</strong></p>
          <p>${party.name}, ${party.company}</p>
        </div>
      `).join('')}
    </div>
  </div>

  <div class="section">
    <div class="section-title">TERMS AND CONDITIONS</div>
    <ol class="terms">
      ${data.terms.map((term: string) => `<li>${term}</li>`).join('')}
    </ol>
    ${data.additionalClauses ? `
      <div class="section-title">ADDITIONAL CLAUSES</div>
      <p>${data.additionalClauses}</p>
    ` : ''}
  </div>

  <div class="signatures">
    ${data.parties.map((party: any) => `
      <div class="signature-line">
        <p><strong>${party.role}:</strong></p>
        <p>Signature: _________________________________</p>
        <p>Name: ${party.name}</p>
        <p>Date: _________________________________</p>
      </div>
    `).join('')}
  </div>

  <div class="footer">
    <p>This agreement was electronically generated by StratusConnect</p>
    <p>Agreement ID: ${agreementNumber} | Generated: ${new Date().toLocaleString()}</p>
  </div>
</body>
</html>
    `.trim();
  }

  // Helper: Create certificate HTML
  private createCertificateHTML(certNumber: string, data: any): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${data.certificateType} Certificate</title>
  <style>
    body { font-family: 'Georgia', serif; max-width: 900px; margin: 0 auto; padding: 60px; background: #f9f9f9; }
    .certificate { background: white; border: 15px solid #2d5016; padding: 60px; text-align: center; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
    .certificate-header { margin-bottom: 40px; }
    .certificate-title { font-size: 48px; font-weight: bold; color: #2d5016; margin: 0; letter-spacing: 2px; text-transform: uppercase; }
    .certificate-subtitle { font-size: 24px; color: #666; margin: 10px 0; }
    .certificate-body { margin: 40px 0; line-height: 2; }
    .recipient-name { font-size: 36px; font-weight: bold; color: #1a1a1a; margin: 20px 0; text-decoration: underline; }
    .certificate-text { font-size: 18px; color: #333; }
    .description { margin: 30px 0; font-size: 16px; font-style: italic; color: #666; }
    .certificate-footer { margin-top: 60px; display: flex; justify-content: space-around; }
    .signature-section { text-align: center; }
    .signature-line { border-top: 2px solid #000; margin-top: 40px; padding-top: 10px; min-width: 200px; }
    .certificate-number { margin-top: 40px; font-size: 12px; color: #999; }
  </style>
</head>
<body>
  <div class="certificate">
    <div class="certificate-header">
      <div class="certificate-title">CERTIFICATE</div>
      <div class="certificate-subtitle">${data.certificateType}</div>
    </div>

    <div class="certificate-body">
      <p class="certificate-text">This is to certify that</p>
      <div class="recipient-name">${data.recipientName}</div>
      ${data.recipientCompany ? `<p class="certificate-text">${data.recipientCompany}</p>` : ''}
      
      <div class="description">
        <p>${data.description}</p>
      </div>

      <p class="certificate-text">Issued on ${new Date(data.issueDate || Date.now()).toLocaleDateString()}</p>
      ${data.expirationDate ? `<p class="certificate-text">Valid until ${new Date(data.expirationDate).toLocaleDateString()}</p>` : ''}
    </div>

    <div class="certificate-footer">
      <div class="signature-section">
        <div class="signature-line">
          <p><strong>${data.issuedBy}</strong></p>
          <p>${data.issuedByTitle}</p>
        </div>
      </div>
    </div>

    <div class="certificate-number">
      <p>Certificate ID: ${certNumber}</p>
      <p>Issued by StratusConnect | ${new Date().toLocaleString()}</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  // Helper: Save document to storage
  private async saveDocument(doc: {
    document_type: string;
    title: string;
    content: string;
    metadata: Record<string, any>;
  }): Promise<GeneratedDocument> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Convert HTML to blob
      const blob = new Blob([doc.content], { type: 'text/html' });
      const fileName = `${doc.metadata[`${doc.document_type}_number`] || Date.now()}.html`;

      // In a real implementation, you would upload to Supabase Storage
      // For now, we'll create a data URL
      const reader = new FileReader();
      const fileUrl = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Save document metadata to database
      const { data, error } = await supabase
        .from('document_storage')
        .insert({
          user_id: user.id,
          deal_id: doc.metadata.deal_id,
          document_type: doc.document_type,
          title: doc.title,
          description: `Auto-generated ${doc.document_type}`,
          file_url: fileUrl,
          file_name: fileName,
          file_size: blob.size,
          mime_type: 'text/html',
          is_public: false,
          tags: ['auto-generated', doc.document_type],
          metadata: doc.metadata
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Error saving document:', error);
      throw error;
    }
  }

  // Download document as PDF (requires backend service)
  async downloadAsPDF(documentId: string): Promise<void> {
    // This would call a backend service to convert HTML to PDF
    // For now, we'll just open the HTML in a new window
    const { data, error } = await supabase
      .from('document_storage')
      .select('file_url, title')
      .eq('id', documentId)
      .single();

    if (error) throw error;

    const win = window.open('', '_blank');
    if (win) {
      win.document.write(atob(data.file_url.split(',')[1]));
      win.document.title = data.title;
    }
  }
}

export const documentGenerator = new DocumentGeneratorService();


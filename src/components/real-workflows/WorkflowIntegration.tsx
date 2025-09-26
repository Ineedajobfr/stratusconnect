// Real Workflow Integration Component - Connects all real workflows
// This component provides a unified interface for all real workflow systems

import React, { createContext, useContext, useEffect, useState } from 'react';
import { RFQWorkflow, RFQData } from '@/lib/real-workflows/rfq-workflow';
import { EscrowWorkflow, Deal } from '@/lib/real-workflows/escrow-workflow';
import { ContractWorkflow, Contract, Receipt } from '@/lib/real-workflows/contract-workflow';
import { JobBoardWorkflow, JobPost, JobApplication } from '@/lib/real-workflows/job-board-workflow';
import { SecurityWorkflow, SecurityEvent, ThreatDetection } from '@/lib/real-workflows/security-workflow';
import { useAuth } from '@/contexts/AuthContext';

interface WorkflowContextType {
  // RFQ Workflow
  rfqs: RFQData[];
  createRFQ: (rfqData: Omit<RFQData, 'id' | 'created_at' | 'updated_at'>) => Promise<RFQData>;
  updateRFQStatus: (rfqId: string, status: RFQData['status']) => Promise<void>;
  submitQuote: (quoteData: any) => Promise<any>;
  acceptQuote: (quoteId: string) => Promise<void>;
  rejectQuote: (quoteId: string, reason?: string) => Promise<void>;

  // Escrow Workflow
  deals: Deal[];
  createEscrow: (dealData: any) => Promise<Deal>;
  processPayment: (dealId: string, paymentMethodId: string) => Promise<void>;
  releaseFunds: (dealId: string, releaseAmount?: number) => Promise<void>;
  processRefund: (dealId: string, refundAmount?: number, reason?: string) => Promise<void>;

  // Contract Workflow
  contracts: Contract[];
  receipts: Receipt[];
  generateContract: (dealId: string, templateId: string, customFields: any) => Promise<Contract>;
  signContract: (contractId: string, signatureData: string, ipAddress: string, userAgent: string) => Promise<any>;
  generateReceipt: (dealId: string, receiptType: any, amount: number, description: string, payerId: string, payeeId: string) => Promise<Receipt>;

  // Job Board Workflow
  jobs: JobPost[];
  applications: JobApplication[];
  createJobPost: (jobData: any) => Promise<JobPost>;
  applyToJob: (applicationData: any) => Promise<JobApplication>;
  updateApplicationStatus: (applicationId: string, status: string) => Promise<void>;

  // Security Workflow
  securityEvents: SecurityEvent[];
  threats: ThreatDetection[];
  logSecurityEvent: (eventData: any) => Promise<SecurityEvent>;
  checkRateLimit: (userId: string, endpoint: string) => Promise<{ allowed: boolean; remaining: number; resetTime: string }>;

  // Loading states
  loading: {
    rfqs: boolean;
    deals: boolean;
    contracts: boolean;
    jobs: boolean;
    security: boolean;
  };

  // Error states
  errors: {
    rfqs: string | null;
    deals: string | null;
    contracts: string | null;
    jobs: string | null;
    security: string | null;
  };
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(undefined);

export const useWorkflows = () => {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error('useWorkflows must be used within a WorkflowProvider');
  }
  return context;
};

interface WorkflowProviderProps {
  children: React.ReactNode;
}

export const WorkflowProvider: React.FC<WorkflowProviderProps> = ({ children }) => {
  const { user } = useAuth();
  
  // State for all workflows
  const [rfqs, setRfqs] = useState<RFQData[]>([]);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [threats, setThreats] = useState<ThreatDetection[]>([]);

  const [loading, setLoading] = useState({
    rfqs: false,
    deals: false,
    contracts: false,
    jobs: false,
    security: false
  });

  const [errors, setErrors] = useState({
    rfqs: null as string | null,
    deals: null as string | null,
    contracts: null as string | null,
    jobs: null as string | null,
    security: null as string | null
  });

  // Load all data when user changes
  useEffect(() => {
    if (user?.id) {
      loadAllData();
    }
  }, [user?.id]);

  const loadAllData = async () => {
    await Promise.all([
      loadRFQs(),
      loadDeals(),
      loadContracts(),
      loadJobs(),
      loadSecurityEvents()
    ]);
  };

  const loadRFQs = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(prev => ({ ...prev, rfqs: true }));
      setErrors(prev => ({ ...prev, rfqs: null }));
      
      const data = await RFQWorkflow.getBrokerRFQs(user.id);
      setRfqs(data);
    } catch (error) {
      console.error('Error loading RFQs:', error);
      setErrors(prev => ({ ...prev, rfqs: 'Failed to load RFQs' }));
    } finally {
      setLoading(prev => ({ ...prev, rfqs: false }));
    }
  };

  const loadDeals = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(prev => ({ ...prev, deals: true }));
      setErrors(prev => ({ ...prev, deals: null }));
      
      // This would need to be implemented in EscrowWorkflow
      // const data = await EscrowWorkflow.getUserDeals(user.id);
      // setDeals(data);
    } catch (error) {
      console.error('Error loading deals:', error);
      setErrors(prev => ({ ...prev, deals: 'Failed to load deals' }));
    } finally {
      setLoading(prev => ({ ...prev, deals: false }));
    }
  };

  const loadContracts = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(prev => ({ ...prev, contracts: true }));
      setErrors(prev => ({ ...prev, contracts: null }));
      
      // This would need to be implemented in ContractWorkflow
      // const data = await ContractWorkflow.getUserContracts(user.id);
      // setContracts(data);
    } catch (error) {
      console.error('Error loading contracts:', error);
      setErrors(prev => ({ ...prev, contracts: 'Failed to load contracts' }));
    } finally {
      setLoading(prev => ({ ...prev, contracts: false }));
    }
  };

  const loadJobs = async () => {
    try {
      setLoading(prev => ({ ...prev, jobs: true }));
      setErrors(prev => ({ ...prev, jobs: null }));
      
      const data = await JobBoardWorkflow.getJobs({});
      setJobs(data);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setErrors(prev => ({ ...prev, jobs: 'Failed to load jobs' }));
    } finally {
      setLoading(prev => ({ ...prev, jobs: false }));
    }
  };

  const loadSecurityEvents = async () => {
    if (!user?.id) return;
    
    try {
      setLoading(prev => ({ ...prev, security: true }));
      setErrors(prev => ({ ...prev, security: null }));
      
      // This would need to be implemented in SecurityWorkflow
      // const data = await SecurityWorkflow.getUserSecurityEvents(user.id);
      // setSecurityEvents(data);
    } catch (error) {
      console.error('Error loading security events:', error);
      setErrors(prev => ({ ...prev, security: 'Failed to load security events' }));
    } finally {
      setLoading(prev => ({ ...prev, security: false }));
    }
  };

  // RFQ Workflow methods
  const createRFQ = async (rfqData: Omit<RFQData, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const data = await RFQWorkflow.createRFQ(rfqData);
      setRfqs(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating RFQ:', error);
      throw error;
    }
  };

  const updateRFQStatus = async (rfqId: string, status: RFQData['status']) => {
    try {
      await RFQWorkflow.updateRFQStatus(rfqId, status);
      setRfqs(prev => prev.map(rfq => 
        rfq.id === rfqId ? { ...rfq, status } : rfq
      ));
    } catch (error) {
      console.error('Error updating RFQ status:', error);
      throw error;
    }
  };

  const submitQuote = async (quoteData: any) => {
    try {
      const data = await RFQWorkflow.submitQuote(quoteData);
      // Refresh RFQs to get updated quote count
      await loadRFQs();
      return data;
    } catch (error) {
      console.error('Error submitting quote:', error);
      throw error;
    }
  };

  const acceptQuote = async (quoteId: string) => {
    try {
      await RFQWorkflow.acceptQuote(quoteId);
      // Refresh RFQs and deals
      await Promise.all([loadRFQs(), loadDeals()]);
    } catch (error) {
      console.error('Error accepting quote:', error);
      throw error;
    }
  };

  const rejectQuote = async (quoteId: string, reason?: string) => {
    try {
      await RFQWorkflow.rejectQuote(quoteId, reason);
      // Refresh RFQs
      await loadRFQs();
    } catch (error) {
      console.error('Error rejecting quote:', error);
      throw error;
    }
  };

  // Escrow Workflow methods
  const createEscrow = async (dealData: any) => {
    try {
      const data = await EscrowWorkflow.createEscrow(dealData);
      setDeals(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating escrow:', error);
      throw error;
    }
  };

  const processPayment = async (dealId: string, paymentMethodId: string) => {
    try {
      await EscrowWorkflow.processPayment(dealId, paymentMethodId);
      // Refresh deals
      await loadDeals();
    } catch (error) {
      console.error('Error processing payment:', error);
      throw error;
    }
  };

  const releaseFunds = async (dealId: string, releaseAmount?: number) => {
    try {
      await EscrowWorkflow.releaseFunds(dealId, releaseAmount);
      // Refresh deals
      await loadDeals();
    } catch (error) {
      console.error('Error releasing funds:', error);
      throw error;
    }
  };

  const processRefund = async (dealId: string, refundAmount?: number, reason?: string) => {
    try {
      await EscrowWorkflow.processRefund(dealId, refundAmount, reason);
      // Refresh deals
      await loadDeals();
    } catch (error) {
      console.error('Error processing refund:', error);
      throw error;
    }
  };

  // Contract Workflow methods
  const generateContract = async (dealId: string, templateId: string, customFields: any) => {
    try {
      const data = await ContractWorkflow.generateContract(dealId, templateId, customFields);
      setContracts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error generating contract:', error);
      throw error;
    }
  };

  const signContract = async (contractId: string, signatureData: string, ipAddress: string, userAgent: string) => {
    try {
      const data = await ContractWorkflow.signContract(contractId, signatureData, ipAddress, userAgent);
      // Refresh contracts
      await loadContracts();
      return data;
    } catch (error) {
      console.error('Error signing contract:', error);
      throw error;
    }
  };

  const generateReceipt = async (dealId: string, receiptType: any, amount: number, description: string, payerId: string, payeeId: string) => {
    try {
      const data = await ContractWorkflow.generateReceipt(dealId, receiptType, amount, description, payerId, payeeId);
      setReceipts(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error generating receipt:', error);
      throw error;
    }
  };

  // Job Board Workflow methods
  const createJobPost = async (jobData: any) => {
    try {
      const data = await JobBoardWorkflow.createJobPost(jobData);
      setJobs(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error creating job post:', error);
      throw error;
    }
  };

  const applyToJob = async (applicationData: any) => {
    try {
      const data = await JobBoardWorkflow.applyToJob(applicationData);
      setApplications(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error applying to job:', error);
      throw error;
    }
  };

  const updateApplicationStatus = async (applicationId: string, status: string) => {
    try {
      await JobBoardWorkflow.updateApplicationStatus(applicationId, status);
      // Refresh applications
      if (user?.id) {
        const data = await JobBoardWorkflow.getUserApplications(user.id);
        setApplications(data);
      }
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  };

  // Security Workflow methods
  const logSecurityEvent = async (eventData: any) => {
    try {
      const data = await SecurityWorkflow.logSecurityEvent(eventData);
      setSecurityEvents(prev => [data, ...prev]);
      return data;
    } catch (error) {
      console.error('Error logging security event:', error);
      throw error;
    }
  };

  const checkRateLimit = async (userId: string, endpoint: string) => {
    try {
      return await SecurityWorkflow.checkRateLimit(userId, endpoint);
    } catch (error) {
      console.error('Error checking rate limit:', error);
      throw error;
    }
  };

  const value: WorkflowContextType = {
    // Data
    rfqs,
    deals,
    contracts,
    receipts,
    jobs,
    applications,
    securityEvents,
    threats,

    // RFQ methods
    createRFQ,
    updateRFQStatus,
    submitQuote,
    acceptQuote,
    rejectQuote,

    // Escrow methods
    createEscrow,
    processPayment,
    releaseFunds,
    processRefund,

    // Contract methods
    generateContract,
    signContract,
    generateReceipt,

    // Job Board methods
    createJobPost,
    applyToJob,
    updateApplicationStatus,

    // Security methods
    logSecurityEvent,
    checkRateLimit,

    // Loading and error states
    loading,
    errors
  };

  return (
    <WorkflowContext.Provider value={value}>
      {children}
    </WorkflowContext.Provider>
  );
};

export default WorkflowProvider;

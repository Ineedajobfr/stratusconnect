// Stub modules for complex libraries to avoid build issues

// Performance monitoring stub
export const usePerformanceMonitoring = () => ({
  metrics: [],
  trackMetric: () => {},
  startMonitoring: () => {}
});

// Evidence receipt stub  
export interface EvidenceReceipt {
  id: string;
  timestamp: string;
  data: string;
  [key: string]: any;
}

// Flow stubs
export interface CharterDealFlow {
  id: string;
  dealId: string;
  route: string;
  aircraft: string;
  departureDate: string;
  totalAmount: number;
  type: string;
  amount: number;
  currency: string;
  brokerId: string;
  operatorId: string;
}

export interface FeeCalculation {
  platform: number;
  broker: number;
  total: number;
}

// Voice scripts stub
export const voiceScripts = {
  welcome: 'Welcome to StratusConnect',
  userManuals: {
    broker: 'Broker manual content',
    operator: 'Operator manual content'
  }
};
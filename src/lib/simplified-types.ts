// Simplified types to avoid complex TypeScript issues

export interface SimpleReceipt {
  id: string;
  timestamp: string;
  amount: number;
  data: string;
  [key: string]: any;
}

export interface SimpleMetrics {
  uptime: number;
  responseTime: number;
  status: string;
  timestamp: string;
}

export interface SimpleFlow {
  id: string;
  type: string;
  status: string;
  data: Record<string, any>;
}

export interface SimpleFee {
  platform: number;
  broker: number;
  total: number;
}

export interface SimpleAudit {
  auditHash: string;
  totalAmount: number;
  platformFee: number;
  netToOperator: number;
}
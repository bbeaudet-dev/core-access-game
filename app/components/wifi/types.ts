export interface NetworkInfo {
  name: string;
  strength: number;
  security: string;
  frequency: string;
  channel: number;
}

export interface ConnectionStatus {
  isConnected: boolean;
  networkName: string;
  ipAddress: string;
  signalStrength: number;
} 
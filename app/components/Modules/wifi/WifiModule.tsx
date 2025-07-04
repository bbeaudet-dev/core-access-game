import * as Network from 'expo-network';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import ScreenTemplate from '../../ui/ScreenTemplate';
import ConnectionStatus from './ConnectionStatus';
import NetworkList from './NetworkList';
import NetworkScanner from './NetworkScanner';
import NetworkStats from './NetworkStats';

interface NetworkInfo {
  name: string;
  strength: number;
  security: string;
  frequency: string;
  channel: number;
}

interface ConnectionStatusType {
  isConnected: boolean;
  networkName: string;
  ipAddress: string;
  signalStrength: number;
}

interface WifiModuleProps {
  onGoHome: () => void;
}

export default function WifiModule({ onGoHome }: WifiModuleProps) {
  const [connection, setConnection] = useState<ConnectionStatusType>({
    isConnected: false,
    networkName: '',
    ipAddress: '',
    signalStrength: 0
  });
  const [isScanning, setIsScanning] = useState(false);
  const [availableNetworks, setAvailableNetworks] = useState<NetworkInfo[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkNetworkStatus();
  }, []);

  const checkNetworkStatus = async () => {
    try {
      if (Platform.OS === 'web') {
        setError('Network info not available on web');
        return;
      }

      const networkState = await Network.getNetworkStateAsync();
      const isConnected = networkState.isConnected || false;
      
      if (isConnected) {
        const ip = await Network.getIpAddressAsync();
        const networkName = 'CORE_NETWORK_' + Math.floor(Math.random() * 1000);
        const signalStrength = Math.floor(Math.random() * 40) + 60; // 60-100%
        
        setConnection({
          isConnected,
          networkName,
          ipAddress: ip,
          signalStrength
        });
      } else {
        setConnection({
          isConnected: false,
          networkName: '',
          ipAddress: '',
          signalStrength: 0
        });
      }
    } catch (err) {
      setError('Failed to get network information');
    }
  };

  const scanNetworks = async () => {
    setIsScanning(true);
    setError(null);
    
    try {
      // Simulate network scanning
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockNetworks: NetworkInfo[] = [
        { name: 'CORE_NETWORK_001', strength: 95, security: 'WPA2', frequency: '2.4GHz', channel: 6 },
        { name: 'QUARANTINE_WIFI', strength: 87, security: 'WPA3', frequency: '5GHz', channel: 36 },
        { name: 'EMERGENCY_BACKUP', strength: 72, security: 'WPA2', frequency: '2.4GHz', channel: 11 },
        { name: 'SECURITY_CAM_01', strength: 65, security: 'WEP', frequency: '2.4GHz', channel: 1 },
        { name: 'VAULT_ACCESS', strength: 58, security: 'WPA2', frequency: '5GHz', channel: 40 },
        { name: 'SYSTEM_MAINT', strength: 45, security: 'Open', frequency: '2.4GHz', channel: 9 },
        { name: 'GUEST_NETWORK', strength: 38, security: 'WPA2', frequency: '2.4GHz', channel: 3 },
        { name: 'HIDDEN_NETWORK', strength: 25, security: 'WPA3', frequency: '5GHz', channel: 44 },
      ];
      
      setAvailableNetworks(mockNetworks);
    } catch (err) {
      setError('Failed to scan networks');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <ScreenTemplate title="WIFI" titleColor="blue" onGoHome={onGoHome}>
      {error && !connection.isConnected ? (
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-400 text-center font-mono mb-4">
            {error}
          </Text>
          <Text className="text-gray-400 text-center font-mono text-sm">
            Try on a physical device
          </Text>
        </View>
      ) : (
        <View className="space-y-4">
          <ConnectionStatus connection={connection} />
          <NetworkScanner isScanning={isScanning} onScan={scanNetworks} />
          <NetworkList networks={availableNetworks} />
          <NetworkStats networks={availableNetworks} />
        </View>
      )}
    </ScreenTemplate>
  );
} 
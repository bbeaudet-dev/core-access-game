import { Text, View } from 'react-native';
import { NetworkInfo } from './types';

interface NetworkStatsProps {
  networks: NetworkInfo[];
}

export default function NetworkStats({ networks }: NetworkStatsProps) {
  const totalNetworks = networks.length;
  const secureNetworks = networks.filter(n => n.security !== 'Open').length;
  const fiveGhzNetworks = networks.filter(n => n.frequency === '5GHz').length;
  const averageSignal = networks.length > 0 
    ? Math.round(networks.reduce((sum, n) => sum + n.strength, 0) / networks.length) 
    : 0;

  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">NETWORK STATS</Text>
      <Text className="text-gray-300 text-sm font-mono">Total Networks: {totalNetworks}</Text>
      <Text className="text-gray-300 text-sm font-mono">Secure Networks: {secureNetworks}</Text>
      <Text className="text-gray-300 text-sm font-mono">5GHz Networks: {fiveGhzNetworks}</Text>
      <Text className="text-gray-300 text-sm font-mono">Average Signal: {averageSignal}%</Text>
    </View>
  );
} 
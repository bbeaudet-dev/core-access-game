import { Text, View } from 'react-native';
import { NetworkInfo } from './types';

interface NetworkListProps {
  networks: NetworkInfo[];
}

export default function NetworkList({ networks }: NetworkListProps) {
  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400';
    if (strength >= 60) return 'text-yellow-400';
    if (strength >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  const getSignalBars = (strength: number) => {
    const bars = Math.floor(strength / 20);
    return '█'.repeat(bars) + '░'.repeat(5 - bars);
  };

  if (networks.length === 0) return null;

  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">AVAILABLE NETWORKS</Text>
      <View className="space-y-2">
        {networks.map((network, index) => (
          <View key={index} className="flex-row justify-between items-center py-2 border-b border-gray-700">
            <View className="flex-1">
              <Text className="text-white text-sm font-mono">{network.name}</Text>
              <Text className="text-gray-500 text-xs font-mono">
                {network.security} • {network.frequency} • Ch.{network.channel}
              </Text>
            </View>
            <View className="items-end">
              <Text className={`text-sm font-mono ${getSignalColor(network.strength)}`}>
                {network.strength}%
              </Text>
              <Text className="text-gray-500 text-xs font-mono">
                {getSignalBars(network.strength)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
} 
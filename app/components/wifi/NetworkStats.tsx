import { Text, View } from 'react-native'
import { NetworkInfo } from './NetworkList'

interface NetworkStatsProps {
  networks: NetworkInfo[]
}

export default function NetworkStats({ networks }: NetworkStatsProps) {
  const totalNetworks = networks.length
  const secureNetworks = networks.filter(n => n.security !== 'Open').length
  const avgSignalStrength = networks.length > 0 
    ? Math.round(networks.reduce((sum, n) => sum + n.strength, 0) / networks.length)
    : 0

  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">NETWORK STATS</Text>
      <Text className="text-blue-400 text-lg font-mono mb-1">Total: {totalNetworks}</Text>
      <Text className="text-green-400 text-lg font-mono mb-1">Secure: {secureNetworks}</Text>
      <Text className="text-yellow-400 text-lg font-mono">Avg Signal: {avgSignalStrength}%</Text>
    </View>
  )
} 
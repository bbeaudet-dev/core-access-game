import { Text, View } from 'react-native'

export interface NetworkInfo {
  name: string
  strength: number
  security: string
  frequency: string
  channel: number
}

interface NetworkListProps {
  networks: NetworkInfo[]
}

export default function NetworkList({ networks }: NetworkListProps) {
  const getSignalColor = (strength: number) => {
    if (strength >= 80) return 'text-green-400'
    if (strength >= 60) return 'text-yellow-400'
    if (strength >= 40) return 'text-orange-400'
    return 'text-red-400'
  }

  const getSignalBars = (strength: number) => {
    const bars = Math.floor(strength / 20)
    return '█'.repeat(bars) + '░'.repeat(5 - bars)
  }

  if (networks.length === 0) return null

  return (
    <View className="space-y-2">
      <Text className="text-gray-400 text-sm font-mono mb-2">AVAILABLE NETWORKS</Text>
      {networks.map((network, index) => (
        <View key={index} className="bg-gray-900 p-3 rounded-lg">
          <Text className="text-blue-400 font-mono mb-1">{network.name}</Text>
          <Text className="text-gray-300 text-sm font-mono">Signal: {network.strength}%</Text>
          <Text className="text-gray-300 text-sm font-mono">Security: {network.security}</Text>
          <Text className="text-gray-300 text-sm font-mono">Channel: {network.channel}</Text>
        </View>
      ))}
    </View>
  )
} 
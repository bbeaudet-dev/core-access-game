import { Text, View } from 'react-native'

export interface ConnectionStatus {
  isConnected: boolean
  networkName: string
  ipAddress: string
  signalStrength: number
}

interface ConnectionStatusProps {
  connection: ConnectionStatus
}

export default function ConnectionStatus({ connection }: ConnectionStatusProps) {
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

  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT CONNECTION</Text>
      <Text className={`text-lg font-mono mb-1 ${connection.isConnected ? 'text-green-400' : 'text-red-400'}`}>
        {connection.isConnected ? 'CONNECTED' : 'DISCONNECTED'}
      </Text>
      {connection.isConnected && (
        <>
          <Text className="text-blue-400 text-base font-mono mb-1">{connection.networkName}</Text>
          <Text className="text-gray-300 text-sm font-mono mb-1">IP: {connection.ipAddress}</Text>
          <Text className={`text-sm font-mono ${getSignalColor(connection.signalStrength)}`}>
            Signal: {connection.signalStrength}% {getSignalBars(connection.signalStrength)}
          </Text>
        </>
      )}
    </View>
  )
} 
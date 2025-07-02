import { Text, TouchableOpacity, View } from 'react-native'

interface NetworkScannerProps {
  isScanning: boolean
  onScan: () => void
}

export default function NetworkScanner({ isScanning, onScan }: NetworkScannerProps) {
  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">NETWORK SCANNER</Text>
      <TouchableOpacity
        onPress={onScan}
        disabled={isScanning}
        className={`p-3 rounded-lg ${isScanning ? 'bg-gray-600' : 'bg-blue-600'}`}
      >
        <Text className="text-white text-center font-mono">
          {isScanning ? 'SCANNING...' : 'SCAN NETWORKS'}
        </Text>
      </TouchableOpacity>
    </View>
  )
} 
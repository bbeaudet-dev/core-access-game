import { Text, TouchableOpacity, View } from 'react-native'

interface AccelerometerControlsProps {
  isActive: boolean
  onToggle: () => void
  onReset: () => void
}

export default function AccelerometerControls({ 
  isActive, 
  onToggle, 
  onReset 
}: AccelerometerControlsProps) {
  return (
    <View className="space-y-3 flex flex-row justify-between">
      <TouchableOpacity
        onPress={onToggle}
        className={`flex-1 p-3 rounded-lg border ${
          isActive ? 'bg-red-900 border-red-500' : 'bg-green-900 border-green-500'
        }`}
      >
        <Text className={`text-center font-bold ${isActive ? 'text-red-400' : 'text-green-400'}`}>
          {isActive ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onReset}
        className="flex-1 p-3 rounded-lg border bg-gray-700 border-gray-500 ml-3"
      >
        <Text className="text-gray-300 text-center font-bold">RESET</Text>
      </TouchableOpacity>
    </View>
  )
} 
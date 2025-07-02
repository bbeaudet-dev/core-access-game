import { Text, View } from 'react-native'

export default function CameraPlaceholder() {
  return (
    <View className="bg-gray-800 rounded-lg p-4 mb-4">
      <View className="bg-gray-700 rounded-lg p-8 items-center justify-center">
        <Text className="text-gray-400 text-4xl mb-2">📷</Text>
        <Text className="text-gray-400 text-center text-sm">Camera View</Text>
        <Text className="text-gray-500 text-center text-xs mt-1">Placeholder</Text>
      </View>
    </View>
  )
} 
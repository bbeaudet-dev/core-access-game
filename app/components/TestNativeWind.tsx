import { Text, View } from 'react-native'

export default function TestNativeWind() {
  return (
    <View className="flex-1 items-center justify-center bg-blue-500">
      <Text className="text-white text-xl font-bold">
        NativeWind Test - If you see this styled, it's working!
      </Text>
      <View className="mt-4 p-4 bg-red-500 rounded-lg">
        <Text className="text-white">Red box test</Text>
      </View>
    </View>
  )
} 
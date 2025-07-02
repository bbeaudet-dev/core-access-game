import { Text, TouchableOpacity, View } from 'react-native'

interface GuestModeButtonProps {
  onPress: () => void
}

export default function GuestModeButton({ onPress }: GuestModeButtonProps) {
  return (
    <View className="mt-6 pt-6 border-t border-gray-700">
      <TouchableOpacity
        className="w-full p-4 rounded-lg bg-gray-700"
        onPress={onPress}
      >
        <Text className="text-gray-300 text-center font-bold">
          Continue as Guest
        </Text>
      </TouchableOpacity>
      <Text className="text-gray-500 text-center text-sm mt-2">
        No account required - progress not saved
      </Text>
    </View>
  )
} 
import { Text, TouchableOpacity, View } from 'react-native';

interface GuestModeProps {
  onGuestMode: () => void;
}

export default function GuestMode({ onGuestMode }: GuestModeProps) {
  return (
    <View className="mt-6 pt-6 border-t border-gray-700">
      <TouchableOpacity
        className="w-full p-4 rounded-lg bg-gray-700"
        onPress={onGuestMode}
      >
        <Text className="text-gray-300 text-center font-bold">
          Continue as Guest
        </Text>
      </TouchableOpacity>
      <Text className="text-gray-500 text-center text-sm mt-2">
        No account required - progress not saved
      </Text>
    </View>
  );
} 
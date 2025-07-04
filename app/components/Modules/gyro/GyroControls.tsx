import { Text, TouchableOpacity, View } from 'react-native';

interface GyroControlsProps {
  subscription: any;
  onToggleGyroscope: () => void;
  onResetMaxSpeed: () => void;
}

export default function GyroControls({ subscription, onToggleGyroscope, onResetMaxSpeed }: GyroControlsProps) {
  return (
    <View className="space-y-3 flex flex-row justify-between">
      <TouchableOpacity
        onPress={onToggleGyroscope}
        className={`p-3 rounded-lg flex-1 mr-2 ${subscription ? 'bg-red-600' : 'bg-green-600'}`}
      >
        <Text className="text-white text-center font-mono">
          {subscription ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onResetMaxSpeed}
        className="bg-gray-700 p-3 rounded-lg flex-1 ml-2"
      >
        <Text className="text-white text-center font-mono">RESET MAX</Text>
      </TouchableOpacity>
    </View>
  );
} 
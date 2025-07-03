import { Text, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';

interface AccelerometerUnavailableProps {
  error: string | null;
  onGoHome: () => void;
}

export default function AccelerometerUnavailable({ error, onGoHome }: AccelerometerUnavailableProps) {
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="ACCELEROMETER" color="purple" />
          <View className="flex-1 justify-center items-center">
            <Text className="text-red-400 text-center font-mono mb-4">
              {error || 'Accelerometer not available'}
            </Text>
            <Text className="text-gray-400 text-center font-mono text-sm">
              Try on a physical device
            </Text>
          </View>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
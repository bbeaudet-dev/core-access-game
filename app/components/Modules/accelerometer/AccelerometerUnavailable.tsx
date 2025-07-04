import { Text, View } from 'react-native';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface AccelerometerUnavailableProps {
  error: string | null;
  onGoHome: () => void;
}

export default function AccelerometerUnavailable({ error, onGoHome }: AccelerometerUnavailableProps) {
  return (
    <ScreenTemplate title="ACCELEROMETER" titleColor="purple" onGoHome={onGoHome}>
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-400 text-center font-mono mb-4">
          {error || 'Accelerometer not available'}
        </Text>
        <Text className="text-gray-400 text-center font-mono text-sm">
          Try on a physical device
        </Text>
      </View>
    </ScreenTemplate>
  );
} 
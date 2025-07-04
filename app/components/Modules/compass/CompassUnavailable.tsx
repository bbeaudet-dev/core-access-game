import { Text, View } from 'react-native';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface CompassUnavailableProps {
  onGoHome: () => void;
}

export default function CompassUnavailable({ onGoHome }: CompassUnavailableProps) {
  return (
    <ScreenTemplate title="COMPASS" titleColor="blue" onGoHome={onGoHome}>
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 text-lg text-center mb-4">Magnetometer not available</Text>
        <Text className="text-gray-400 text-sm text-center">This device doesn't support magnetometer sensors</Text>
      </View>
    </ScreenTemplate>
  );
} 
import { Text, View } from 'react-native';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface CompassErrorProps {
  error: string;
  onGoHome: () => void;
}

export default function CompassError({ error, onGoHome }: CompassErrorProps) {
  return (
    <ScreenTemplate title="COMPASS" titleColor="blue" onGoHome={onGoHome}>
      <View className="flex-1 justify-center items-center p-5">
        <Text className="text-red-500 text-lg text-center mb-4">Error: {error}</Text>
        <Text className="text-gray-400 text-sm text-center">Try on a mobile device or enable device orientation</Text>
      </View>
    </ScreenTemplate>
  );
} 
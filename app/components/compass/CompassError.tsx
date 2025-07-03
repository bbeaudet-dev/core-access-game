import { Text, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';

interface CompassErrorProps {
  error: string;
  onGoHome: () => void;
}

export default function CompassError({ error, onGoHome }: CompassErrorProps) {
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="COMPASS" color="blue" />
          <View className="flex-1 justify-center items-center p-5">
            <Text className="text-red-500 text-lg text-center mb-4">Error: {error}</Text>
            <Text className="text-gray-400 text-sm text-center">Try on a mobile device or enable device orientation</Text>
          </View>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
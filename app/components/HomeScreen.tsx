import { Text, View } from 'react-native';
import AppIcon from './ui/AppIcon';
import HomeButton from './ui/HomeButton';
import PhoneFrame from './ui/PhoneFrame';

// Define all available modules directly
const ALL_MODULES = [
  { name: 'system', displayName: 'SYSTEM', icon: '⚙️', color: 'bg-red-500' },
  { name: 'clock', displayName: 'CLOCK', icon: '🕐', color: 'bg-yellow-500' },
  { name: 'camera', displayName: 'PHONE CAMERA', icon: '📷', color: 'bg-red-500' },
  { name: 'microphone', displayName: 'MICROPHONE', icon: '🎤', color: 'bg-red-500' },
  { name: 'music', displayName: 'MUSIC', icon: '🎶', color: 'bg-green-500' },
  { name: 'wifi', displayName: 'WIFI', icon: '📡', color: 'bg-blue-500' },
  { name: 'compass', displayName: 'COMPASS', icon: '🧭', color: 'bg-red-500' },
  { name: 'accelerometer', displayName: 'ACCEL', icon: '⏪', color: 'bg-purple-500' },
  { name: 'gyro', displayName: 'GYRO', icon: '🔄', color: 'bg-red-500' },
  { name: 'terminal', displayName: 'TERMINAL', icon: '💻', color: 'bg-red-500' },
  { name: 'logs', displayName: 'LOGS', icon: '📋', color: 'bg-red-500' },
  { name: 'help', displayName: 'HELP', icon: '💡', color: 'bg-blue-500' },
  { name: 'games', displayName: 'GAMES', icon: '🕹️', color: 'bg-red-500' },
];

type ModuleName = typeof ALL_MODULES[number]['name'];

interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void;
}

export default function HomeScreen({ 
  onOpenModule 
}: HomeScreenProps) {
  return (
    <View className="flex-1 bg-gray-900 relative">
      <PhoneFrame>
        <View className="flex-1 bg-black relative">
          <View className="p-5 pt-15 flex-row justify-between items-center" style={{ zIndex: 1 }}>
            <Text className="text-red-500 text-2xl font-bold">EMERGENCY MODE</Text>
          </View>
          
          <View className="flex-1 p-5 my-2" style={{ zIndex: 1 }}>
            <View className="flex-row flex-wrap">
              {ALL_MODULES.map(module => (
                <View key={module.name} className="w-1/4 mb-4">
                  <AppIcon
                    icon={module.icon}
                    name={module.displayName}
                    color={module.color}
                    onPress={() => onOpenModule(module.name)}
                  />
                </View>
              ))}
            </View>
          </View>
          <HomeButton active={false} onPress={() => {}} />
        </View>
      </PhoneFrame>
    </View>
  );
} 
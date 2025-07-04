import { View } from 'react-native';
import AppIconWithHalo from './ui/AppIconWithHalo';
import ScreenTemplate from './ui/ScreenTemplate';

// Define app status types
type AppStatus = 'completed' | 'in-progress' | 'locked' | 'default';

interface AppModule {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  route: string;
  status: AppStatus;
  badge?: string | number;
}

interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void;
}

// Define all modules with their status
const ALL_MODULES: AppModule[] = [
  { name: 'accelerometer', displayName: 'ACCELEROMETER', icon: '📱', color: 'bg-purple-600', route: 'accelerometer', status: 'in-progress' },
  { name: 'barometer', displayName: 'BAROMETER', icon: '🌡️', color: 'bg-blue-600', route: 'barometer', status: 'locked' },
  { name: 'battery', displayName: 'BATTERY', icon: '🔋', color: 'bg-green-600', route: 'battery', status: 'completed' },
  { name: 'calculator', displayName: 'CALCULATOR', icon: '🧮', color: 'bg-orange-600', route: 'calculator', status: 'default' },
  { name: 'camera', displayName: 'CAMERA', icon: '📷', color: 'bg-purple-600', route: 'camera', status: 'locked' },
  { name: 'clock', displayName: 'CLOCK', icon: '⏰', color: 'bg-cyan-600', route: 'clock', status: 'default' },
  { name: 'compass', displayName: 'COMPASS', icon: '🧭', color: 'bg-blue-600', route: 'compass', status: 'in-progress' },
  { name: 'flashlight', displayName: 'FLASHLIGHT', icon: '🔦', color: 'bg-yellow-600', route: 'flashlight', status: 'default' },
  { name: 'games', displayName: 'GAMES', icon: '🎮', color: 'bg-purple-600', route: 'games', status: 'in-progress', badge: '3' },
  { name: 'gyro', displayName: 'GYRO', icon: '🎯', color: 'bg-green-600', route: 'gyro', status: 'completed' },
  { name: 'help', displayName: 'HELP', icon: '❓', color: 'bg-blue-600', route: 'help', status: 'default' },
  { name: 'logs', displayName: 'LOGS', icon: '📋', color: 'bg-red-600', route: 'logs', status: 'default' },
  { name: 'maps', displayName: 'MAPS', icon: '🗺️', color: 'bg-purple-600', route: 'maps', status: 'locked' },
  { name: 'microphone', displayName: 'MICROPHONE', icon: '🎤', color: 'bg-green-600', route: 'microphone', status: 'completed' },
  { name: 'music', displayName: 'MUSIC', icon: '🎵', color: 'bg-pink-600', route: 'music', status: 'default' },
  { name: 'system', displayName: 'SYSTEM', icon: '⚙️', color: 'bg-red-600', route: 'system', status: 'locked' },
  { name: 'terminal', displayName: 'TERMINAL', icon: '💻', color: 'bg-green-600', route: 'terminal', status: 'in-progress' },
  { name: 'weather', displayName: 'WEATHER', icon: '🌤️', color: 'bg-cyan-600', route: 'weather', status: 'default' },
  { name: 'wifi', displayName: 'WIFI', icon: '📡', color: 'bg-blue-600', route: 'wifi', status: 'in-progress' },
];

export default function HomeScreen({ onOpenModule }: HomeScreenProps) {
  const handleAppPress = (moduleName: string) => {
    onOpenModule(moduleName);
  };

  return (
    <ScreenTemplate title="HOME" titleColor="red" showHomeButton={false}>
      <View className="flex-row flex-wrap justify-center pt-4">
        {ALL_MODULES.map(module => (
          <View key={module.name} className="w-1/4 p-2">
            <AppIconWithHalo
              icon={module.icon}
              name={module.displayName}
              color={module.color}
              onPress={() => handleAppPress(module.name)}
              status={module.status}
              badge={module.badge}
            />
          </View>
        ))}
      </View>
    </ScreenTemplate>
  );
} 
import { Text, TouchableOpacity, View } from 'react-native';
import AppIcon from './ui/AppIcon';
import PhoneFrame from './ui/PhoneFrame';

// Define all available modules directly
const ALL_MODULES = [
  { name: 'terminal', displayName: 'TERMINAL', icon: '💻', color: 'bg-red-500' },
  { name: 'system', displayName: 'SYSTEM', icon: '⚙️', color: 'bg-red-500' },
  { name: 'clock', displayName: 'CLOCK', icon: '🕐', color: 'bg-yellow-500' },
  { name: 'gyro', displayName: 'GYRO', icon: '⚡', color: 'bg-red-500' },
  { name: 'compass', displayName: 'COMPASS', icon: '🧭', color: 'bg-red-500' },
  { name: 'microphone', displayName: 'MICROPHONE', icon: '🎵', color: 'bg-red-500' },
  { name: 'camera', displayName: 'PHONE CAMERA', icon: '📷', color: 'bg-red-500' },
  { name: 'accelerometer', displayName: 'ACCELEROMETER', icon: '📊', color: 'bg-purple-500' },
  { name: 'wifi', displayName: 'WIFI', icon: '📡', color: 'bg-blue-500' },
  { name: 'logs', displayName: 'LOGS', icon: '📋', color: 'bg-red-500' },
  { name: 'help', displayName: 'HELP', icon: '💡', color: 'bg-blue-500' },
  { name: 'music', displayName: 'MUSIC', icon: '🎶', color: 'bg-green-500' },
];

type ModuleName = typeof ALL_MODULES[number]['name'];

interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void;
}

export default function HomeScreen({ 
  onOpenModule 
}: HomeScreenProps) {
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-2xl font-bold">EMERGENCY MODE</Text>
        </View>
        
        <View className="flex-1 p-5 justify-center">
          <View className="flex-row flex-wrap justify-center mb-8">
            {ALL_MODULES.map(module => (
              <AppIcon
                key={module.name}
                icon={module.icon}
                name={module.displayName}
                color={module.color}
                onPress={() => onOpenModule(module.name)}
              />
            ))}
          </View>

          <TouchableOpacity 
            className="w-30 h-30 bg-red-500 justify-center items-center self-center rounded-2xl border-3 border-yellow-400" 
          //   onPress={}
          >
            <Text className="text-4xl text-white mb-1">?</Text>
            <Text className="text-xs font-bold text-white">INSPECT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PhoneFrame>
  );
} 
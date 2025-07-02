import { Text, TouchableOpacity, View } from 'react-native'
import AppIcon from './ui/AppIcon'
import PhoneFrame from './ui/PhoneFrame'

interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void
}

export default function HomeScreen({ 
  onOpenModule 
}: HomeScreenProps) {
  // Define all available modules
  const allModules = [
    { name: 'logs', icon: '📋', displayName: 'LOGS', color: 'red' },
    { name: 'terminal', icon: '💻', displayName: 'TERMINAL', color: 'green' },
    { name: 'camera', icon: '📷', displayName: 'CAMERA', color: 'blue' },
    { name: 'microphone', icon: '🎤', displayName: 'MICROPHONE', color: 'purple' },
    { name: 'music', icon: '🎵', displayName: 'MUSIC', color: 'pink' },
    { name: 'compass', icon: '🧭', displayName: 'COMPASS', color: 'cyan' },
    { name: 'gyro', icon: '🎯', displayName: 'GYRO', color: 'orange' },
    { name: 'help', icon: '❓', displayName: 'HELP', color: 'yellow' },
    { name: 'clock', icon: '⏰', displayName: 'CLOCK', color: 'white' },
    { name: 'accelerometer', icon: '📱', displayName: 'ACCEL', color: 'indigo' },
    { name: 'wifi', icon: '📶', displayName: 'WIFI', color: 'lime' },
    { name: 'system', icon: '⚙️', displayName: 'SYSTEM', color: 'gray' },
  ]

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-2xl font-bold">EMERGENCY MODE</Text>
        </View>
        
        <View className="flex-1 p-5 justify-center">
          <View className="flex-row flex-wrap justify-center mb-8">
            {allModules.map(module => (
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
  )
} 
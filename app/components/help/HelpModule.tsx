import { ScrollView, Text, View } from 'react-native'
import HomeButton from '../ui/HomeButton'
import ModuleHeader from '../ui/ModuleHeader'
import PhoneFrame from '../ui/PhoneFrame'

interface HelpModuleProps {
  onGoHome: () => void
}

export default function HelpModule({ onGoHome }: HelpModuleProps) {
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="HELP" color="blue" />
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="space-y-4">
              {/* Welcome */}
              <View className="bg-gray-900 p-4 rounded-lg">
                <Text className="text-blue-400 text-lg font-mono mb-2">WELCOME TO CORE DEFENDER</Text>
                <Text className="text-gray-300 text-sm mb-2">
                  This is an emergency system interface. Use the various modules to explore and interact with the system.
                </Text>
              </View>

              {/* Available Modules */}
              <View className="bg-gray-900 p-4 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">AVAILABLE MODULES</Text>
                <Text className="text-gray-300 text-sm mb-2">📋 LOGS - System logs and information</Text>
                <Text className="text-gray-300 text-sm mb-2">💻 TERMINAL - Command line interface</Text>
                <Text className="text-gray-300 text-sm mb-2">📷 CAMERA - Device camera access</Text>
                <Text className="text-gray-300 text-sm mb-2">🎤 MICROPHONE - Audio input monitoring</Text>
                <Text className="text-gray-300 text-sm mb-2">🎵 MUSIC - Audio playback controls</Text>
                <Text className="text-gray-300 text-sm mb-2">🧭 COMPASS - Direction and orientation</Text>
                <Text className="text-gray-300 text-sm mb-2">🎯 GYRO - Gyroscope sensor data</Text>
                <Text className="text-gray-300 text-sm mb-2">⏰ CLOCK - Time and timer functions</Text>
                <Text className="text-gray-300 text-sm mb-2">📱 ACCEL - Accelerometer sensor data</Text>
                <Text className="text-gray-300 text-sm mb-2">📶 WIFI - Network connectivity</Text>
                <Text className="text-gray-300 text-sm">⚙️ SYSTEM - System settings and information</Text>
              </View>

              {/* Tips */}
              <View className="bg-gray-900 p-4 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">TIPS</Text>
                <Text className="text-gray-300 text-sm mb-2">
                  • Some modules work better on physical devices
                </Text>
                <Text className="text-gray-300 text-sm mb-2">
                  • Explore each module to discover their features
                </Text>
                <Text className="text-gray-300 text-sm mb-2">
                  • Use the home button to return to the main menu
                </Text>
                <Text className="text-gray-300 text-sm">
                  • Check the system module for additional options
                </Text>
              </View>

              {/* Emergency Info */}
              <View className="bg-red-900 p-4 rounded-lg">
                <Text className="text-red-400 text-sm font-mono mb-2">EMERGENCY MODE</Text>
                <Text className="text-red-300 text-sm mb-2">
                  This system is currently in emergency mode. All modules are available for diagnostic purposes.
                </Text>
                <Text className="text-red-300 text-sm">
                  Use the INSPECT button on the home screen for additional functions.
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  )
} 
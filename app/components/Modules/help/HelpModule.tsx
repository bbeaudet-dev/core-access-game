import { ScrollView, Text, View } from 'react-native';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface HelpModuleProps {
  onGoHome: () => void;
}

export default function HelpModule({ onGoHome }: HelpModuleProps) {
  return (
    <ScreenTemplate title="HELP" titleColor="blue" onGoHome={onGoHome}>
      <ScrollView className="flex-col" showsVerticalScrollIndicator={false}>
        <View className="space-y-4">
          {/* Welcome */}
          <View className="bg-gray-900 p-4 rounded-lg">
            <Text className="text-blue-400 text-lg font-mono mb-2">WELCOME TO CORE ACCESS</Text>
            <Text className="text-gray-300 text-sm mb-2">
              This is an emergency system with various modules for monitoring and control.
            </Text>
          </View>

          {/* Available Modules */}
          <View className="bg-gray-900 p-4 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">AVAILABLE MODULES</Text>
            <Text className="text-gray-300 text-sm mb-2">💻 TERMINAL - System terminal access</Text>
            <Text className="text-gray-300 text-sm mb-2">⚙️ SYSTEM - System information and controls</Text>
            <Text className="text-gray-300 text-sm mb-2">🕐 CLOCK - Time, stopwatch, and timer</Text>
            <Text className="text-gray-300 text-sm mb-2">⚡ GYRO - Gyroscope sensor data</Text>
            <Text className="text-gray-300 text-sm mb-2">🧭 COMPASS - Magnetic compass</Text>
            <Text className="text-gray-300 text-sm mb-2">🎵 MICROPHONE - Audio input monitoring</Text>
            <Text className="text-gray-300 text-sm mb-2">📷 PHONE CAMERA - Camera access</Text>
            <Text className="text-gray-300 text-sm mb-2">📊 ACCELEROMETER - Motion detection</Text>
            <Text className="text-gray-300 text-sm mb-2">📡 WIFI - Network scanning</Text>
            <Text className="text-gray-300 text-sm mb-2">📋 LOGS - System logs</Text>
            <Text className="text-gray-300 text-sm mb-2">🎶 MUSIC - Audio playback</Text>
          </View>

          {/* Navigation */}
          <View className="bg-gray-900 p-4 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">NAVIGATION</Text>
            <Text className="text-gray-300 text-sm mb-2">
              • Use the home button (⌂) to return to the main menu
            </Text>
            <Text className="text-gray-300 text-sm mb-2">
              • Tap any module icon to access its features
            </Text>
            <Text className="text-gray-300 text-sm">
              • Each module has its own specialized functions
            </Text>
          </View>

          {/* Tips */}
          <View className="bg-gray-900 p-4 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">TIPS</Text>
            <Text className="text-gray-300 text-sm mb-2">
              • Some modules require device permissions
            </Text>
            <Text className="text-gray-300 text-sm mb-2">
              • Use on a physical device for full sensor access
            </Text>
            <Text className="text-gray-300 text-sm">
              • Check individual modules for specific instructions
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenTemplate>
  );
} 
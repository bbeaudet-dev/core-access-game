import { ScrollView, Text, View } from 'react-native'
import HomeButton from './ui/HomeButton'
import ModuleHeader from './ui/ModuleHeader'
import PhoneFrame from './ui/PhoneFrame'

interface TerminalModuleProps {
  onGoHome: () => void
}

export default function TerminalModule({ onGoHome }: TerminalModuleProps) {
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="TERMINAL" color="green" />
          
          <ScrollView className="flex-1 p-5">
            <Text className="text-green-400 text-base font-mono mb-2">$ system status</Text>
            <Text className="text-green-400 text-base font-mono mb-2">System: COMPROMISED</Text>
            <Text className="text-green-400 text-base font-mono mb-2">Core: LOCKED</Text>
            <Text className="text-green-400 text-base font-mono mb-2">Access: DENIED</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ unlock core</Text>
            <Text className="text-red-400 text-base font-mono mb-2">ERROR: Authentication required</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ inspect vault</Text>
            <Text className="text-yellow-400 text-base font-mono mb-2">WARNING: Multiple access attempts detected</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ help</Text>
            <Text className="text-green-400 text-base font-mono mb-2">Available commands: status, unlock, inspect, help</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ scan modules</Text>
            <Text className="text-green-400 text-base font-mono mb-2">Scanning available modules...</Text>
            <Text className="text-green-400 text-base font-mono mb-2">- Gyroscope: ONLINE</Text>
            <Text className="text-green-400 text-base font-mono mb-2">- Compass: ONLINE</Text>
            <Text className="text-green-400 text-base font-mono mb-2">- Audio: STANDBY</Text>
            <Text className="text-green-400 text-base font-mono mb-2">- Camera: OFFLINE</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ check permissions</Text>
            <Text className="text-yellow-400 text-base font-mono mb-2">WARNING: Insufficient privileges</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ run diagnostics</Text>
            <Text className="text-green-400 text-base font-mono mb-2">Running system diagnostics...</Text>
            <Text className="text-green-400 text-base font-mono mb-2">✓ Core containment: ACTIVE</Text>
            <Text className="text-green-400 text-base font-mono mb-2">✓ Security protocols: ENABLED</Text>
            <Text className="text-red-400 text-base font-mono mb-2">✗ User authentication: FAILED</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ show hints</Text>
            <Text className="text-yellow-400 text-base font-mono mb-2">HINT: Try using the gyroscope at high speeds</Text>
            <Text className="text-yellow-400 text-base font-mono mb-2">HINT: Check the compass for directional clues</Text>
            <Text className="text-yellow-400 text-base font-mono mb-2">HINT: Voice commands may unlock features</Text>
            <Text className="text-green-400 text-base font-mono mb-2">$ exit</Text>
            <Text className="text-green-400 text-base font-mono mb-2">Terminal session ended.</Text>
          </ScrollView>
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  )
} 
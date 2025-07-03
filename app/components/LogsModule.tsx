import { ScrollView, Text, View } from 'react-native';
import HomeButton from './ui/HomeButton';
import ModuleHeader from './ui/ModuleHeader';
import PhoneFrame from './ui/PhoneFrame';

interface LogsModuleProps {
  onGoHome: () => void;
}

export default function LogsModule({ onGoHome }: LogsModuleProps) {
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="SYSTEM LOGS" color="red" />
          
          <ScrollView className="flex-1 p-5">
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:01] Vault door sealed</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:05] Core containment active</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:07] WARNING: Unauthorized access detected</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:10] Security protocols activated</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:15] User authentication required</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:20] HIDDEN: Core location: center panel</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:25] ERROR: Terminal access denied</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:30] Camera module: OFFLINE</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:35] Audio system: STANDBY</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:40] HIDDEN: Inspection count: 0</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:45] Virus scan: IN PROGRESS</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:50] HIDDEN: Try tilting device</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:23:55] System status: COMPROMISED</Text>
            <Text className="text-yellow-400 text-base font-mono mb-2">[2024-01-15 14:24:00] WARNING: Gyroscope readings abnormal</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:05] Compass calibration: REQUIRED</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:10] Clock synchronization: OK</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:15] HIDDEN: Password hint: "core defender"</Text>
            <Text className="text-red-400 text-base font-mono mb-2">[2024-01-15 14:24:20] ERROR: Network connection lost</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:25] Backup systems: ONLINE</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:30] HIDDEN: Try voice commands</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:35] Firewall: ACTIVE</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:40] Encryption: 256-bit AES</Text>
            <Text className="text-yellow-400 text-base font-mono mb-2">[2024-01-15 14:24:45] WARNING: Multiple failed attempts</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:50] HIDDEN: Check help module for clues</Text>
            <Text className="text-green-400 text-base font-mono mb-2">[2024-01-15 14:24:55] System ready for inspection</Text>
          </ScrollView>
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
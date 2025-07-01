import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface LogsModuleProps {
  onGoHome: () => void;
}

export default function LogsModule({ onGoHome }: LogsModuleProps) {
  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <Text className="text-red-500 text-xl font-bold">SYSTEM LOGS</Text>
      </View>
      
      <ScrollView className="flex-1 p-5">
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:01] Vault door sealed</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:05] Core containment active</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:07] WARNING: Unauthorized access detected</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:10] Security protocols activated</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:15] User authentication required</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:20] HIDDEN: Core location: center panel</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:25] ERROR: Terminal access denied</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:30] Camera module: OFFLINE</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:35] Audio system: STANDBY</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:40] HIDDEN: Inspection count: 0</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:45] Virus scan: IN PROGRESS</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:50] HIDDEN: Try tilting device</Text>
        <Text className="text-green-400 text-xs mb-1 font-mono">[2024-01-15 14:23:55] System status: COMPROMISED</Text>
      </ScrollView>
      
      <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10" onPress={onGoHome}>
        <Text className="text-white text-xl font-bold">⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
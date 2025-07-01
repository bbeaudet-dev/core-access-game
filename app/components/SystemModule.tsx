import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface SystemModuleProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
  onSelfDestruct: () => void;
}

export default function SystemModule({ 
  onGoHome, 
  onGoToAbout, 
  onGoToCoreVitals, 
  onSelfDestruct 
}: SystemModuleProps) {
  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <Text className="text-red-500 text-xl font-bold">SYSTEM</Text>
      </View>
      
      <ScrollView className="flex-1 p-5">
        {/* Device Info Section */}
        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">DEVICE</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded" onPress={onGoToAbout}>
            <Text className="text-white text-base">About</Text>
            <Text className="text-green-400 text-sm font-mono">Core Defender v1.0.3</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded" onPress={onGoToCoreVitals}>
            <Text className="text-white text-base">Core Vitals</Text>
            <Text className="text-green-400 text-sm font-mono">⚠️ Unstable</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">SECURITY</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Quarantine Status</Text>
            <Text className="text-green-400 text-sm font-mono">ACTIVE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Virus Scan</Text>
            <Text className="text-green-400 text-sm font-mono">INFECTED</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Access Level</Text>
            <Text className="text-green-400 text-sm font-mono">RESTRICTED</Text>
          </TouchableOpacity>
        </View>

        {/* Hardware Section */}
        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">HARDWARE</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Gyroscope</Text>
            <Text className="text-green-400 text-sm font-mono">ONLINE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Microphone</Text>
            <Text className="text-green-400 text-sm font-mono">STANDBY</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Camera</Text>
            <Text className="text-green-400 text-sm font-mono">OFFLINE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">GPS</Text>
            <Text className="text-green-400 text-sm font-mono">ACTIVE</Text>
          </TouchableOpacity>
        </View>

        {/* System Section */}
        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">SYSTEM</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Emergency Mode</Text>
            <Text className="text-green-400 text-sm font-mono">ENABLED</Text>
          </TouchableOpacity>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Auto-Destruct</Text>
            <Text className="text-green-400 text-sm font-mono">ARMED</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">DANGER ZONE</Text>
          
          <TouchableOpacity className="flex-row justify-between items-center py-4 px-2 bg-red-900 mb-px rounded border border-red-500" onPress={onSelfDestruct}>
            <Text className="text-red-500 text-base font-bold">Self-Destruct</Text>
            <Text className="text-red-500 text-sm font-mono font-bold">TERMINATE DEVICE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10" onPress={onGoHome}>
        <Text className="text-white text-xl font-bold">⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
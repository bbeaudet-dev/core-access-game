import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface AudioModuleProps {
  onGoHome: () => void;
}

export default function AudioModule({ onGoHome }: AudioModuleProps) {
  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <Text className="text-red-500 text-xl font-bold">AUDIO</Text>
      </View>
      
      <View className="flex-1 justify-center items-center">
        <Text className="text-yellow-400 text-base mb-2">Audio system: STANDBY</Text>
        <Text className="text-yellow-400 text-base mb-2">Voice recognition: DISABLED</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: The vault has secrets</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: Say "unlock core"</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: Say "access granted"</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: Say "emergency override"</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: Say "spartan virus"</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: Say "system compromised"</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: Say "quarantine breach"</Text>
        <Text className="text-yellow-400 text-base mb-2">HINT: Say "core detected"</Text>
      </View>
      
      <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10" onPress={onGoHome}>
        <Text className="text-white text-xl font-bold">⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface TerminalModuleProps {
  onGoHome: () => void;
}

export default function TerminalModule({ onGoHome }: TerminalModuleProps) {
  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <Text className="text-red-500 text-xl font-bold">TERMINAL</Text>
      </View>
      
      <View className="flex-1 p-5 justify-center">
        <Text className="text-green-400 text-base font-mono leading-6">CORE_ACCESS:/vault$ _</Text>
        <Text className="text-green-400 text-base font-mono leading-6">Type 'help' for available commands</Text>
        <Text className="text-green-400 text-base font-mono leading-6">Type 'inspect' to examine vault</Text>
        <Text className="text-green-400 text-base font-mono leading-6">Type 'status' for system status</Text>
        <Text className="text-green-400 text-base font-mono leading-6">Type 'scan' to scan for vulnerabilities</Text>
        <Text className="text-green-400 text-base font-mono leading-6">Type 'unlock' to attempt core access</Text>
        <Text className="text-green-400 text-base font-mono leading-6">Type 'clear' to clear terminal</Text>
        <Text className="text-green-400 text-base font-mono leading-6">Type 'exit' to return to vault</Text>
        <Text className="text-green-400 text-base font-mono leading-6">HIDDEN: Try 'tilt' command</Text>
        <Text className="text-green-400 text-base font-mono leading-6">HIDDEN: Try 'voice' command</Text>
      </View>
      
      <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10" onPress={onGoHome}>
        <Text className="text-white text-xl font-bold">⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
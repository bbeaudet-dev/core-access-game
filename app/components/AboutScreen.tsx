import React from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface AboutScreenProps {
  onGoBack: () => void;
}

export default function AboutScreen({ onGoBack }: AboutScreenProps) {
  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <TouchableOpacity onPress={onGoBack}>
          <Text className="text-red-500 text-xl font-bold">← Back</Text>
        </TouchableOpacity>
        <Text className="text-red-500 text-xl font-bold">About</Text>
        <View className="w-12" />
      </View>
      
      <ScrollView className="flex-1 p-5">
        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">DEVICE INFO</Text>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Model</Text>
            <Text className="text-green-400 text-sm font-mono">Core Defender X1</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">OS Version</Text>
            <Text className="text-green-400 text-sm font-mono">CoreOS v1.0.3</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Serial Number</Text>
            <Text className="text-green-400 text-sm font-mono">CD-X1-2024-001</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Manufacturer</Text>
            <Text className="text-green-400 text-sm font-mono">Spartan Systems</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">HARDWARE SPECS</Text>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Processor</Text>
            <Text className="text-green-400 text-sm font-mono">Quantum Core Q1</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Memory</Text>
            <Text className="text-green-400 text-sm font-mono">16GB Neural RAM</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Storage</Text>
            <Text className="text-green-400 text-sm font-mono">1TB Holographic</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Battery</Text>
            <Text className="text-green-400 text-sm font-mono">Infinite Core</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">SENSORS & INPUTS</Text>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Gyroscope</Text>
            <Text className="text-green-400 text-sm font-mono">6-Axis Quantum</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Microphone</Text>
            <Text className="text-green-400 text-sm font-mono">Neural Array</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Camera</Text>
            <Text className="text-green-400 text-sm font-mono">Holographic Lens</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">GPS</Text>
            <Text className="text-green-400 text-sm font-mono">Quantum Positioning</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Haptic Engine</Text>
            <Text className="text-green-400 text-sm font-mono">Neural Feedback</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">SECURITY FEATURES</Text>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Biometric</Text>
            <Text className="text-green-400 text-sm font-mono">Neural Scan</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Encryption</Text>
            <Text className="text-green-400 text-sm font-mono">Quantum Lock</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Firewall</Text>
            <Text className="text-green-400 text-sm font-mono">Neural Barrier</Text>
          </View>
        </View>

        <View className="mb-8">
          <Text className="text-red-500 text-sm font-bold mb-2 uppercase">SPECIAL FEATURES</Text>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Voice Recognition</Text>
            <Text className="text-green-400 text-sm font-mono">Neural AI</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Gesture Control</Text>
            <Text className="text-green-400 text-sm font-mono">Motion Sense</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Time Awareness</Text>
            <Text className="text-green-400 text-sm font-mono">Chronos Sync</Text>
          </View>
          
          <View className="flex-row justify-between items-center py-4 px-2 bg-gray-900 mb-px rounded">
            <Text className="text-white text-base">Location Triggers</Text>
            <Text className="text-green-400 text-sm font-mono">Geo-Aware</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 
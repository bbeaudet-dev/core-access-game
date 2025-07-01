import React from 'react';
import { Animated, Text, View } from 'react-native';

interface InfectionSequenceProps {
  glitchLevel: number;
  terminalText: string;
  fadeAnim: Animated.Value;
}

export default function InfectionSequence({ 
  glitchLevel, 
  terminalText, 
  fadeAnim 
}: InfectionSequenceProps) {
  const progress = (glitchLevel / 6) * 100;
  
  return (
    <View className={`flex-1 bg-black ${glitchLevel >= 2 ? 'bg-red-600' : ''}`}>
      <Animated.View className="flex-1 p-5 justify-center" style={{ opacity: fadeAnim }}>
        <Text className="text-green-400 text-base font-mono leading-6">{terminalText}</Text>
        {glitchLevel >= 3 && <Text className="text-green-400 text-base font-mono">_</Text>}
      </Animated.View>
      
      {glitchLevel >= 4 && (
        <View className="absolute inset-0 bg-red-600 bg-opacity-30 justify-center items-center">
          <Text className="text-white text-2xl font-bold text-center">⚠️ SYSTEM COMPROMISED ⚠️</Text>
        </View>
      )}
    </View>
  );
} 
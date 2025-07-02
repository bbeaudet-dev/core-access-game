import { Animated, Text, View } from 'react-native'

interface InfectionSequenceProps {
  glitchLevel: number
  terminalText: string
  fadeAnim: Animated.Value
}

export default function InfectionSequence({ 
  glitchLevel, 
  terminalText, 
  fadeAnim 
}: InfectionSequenceProps) {
  const progress = (glitchLevel / 6) * 100
  
  return (
    <View className={`flex-1 bg-black justify-center items-center ${glitchLevel >= 2 ? 'bg-red-900' : ''}`}>
      <Animated.View className="p-5" style={{ opacity: fadeAnim }}>
        <Text className="text-green-400 text-base font-mono">{terminalText}</Text>
        {glitchLevel >= 3 && <Text className="text-green-400 text-base font-mono">_</Text>}
      </Animated.View>
      
      {glitchLevel >= 4 && (
        <View className="absolute inset-0 justify-center items-center bg-red-900 bg-opacity-50">
          <Text className="text-red-500 text-xl font-bold">⚠️ SYSTEM COMPROMISED ⚠️</Text>
        </View>
      )}
    </View>
  )
} 
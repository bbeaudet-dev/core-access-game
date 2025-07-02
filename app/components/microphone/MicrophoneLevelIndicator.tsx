import { Animated, Text, View } from 'react-native'

interface MicrophoneLevelIndicatorProps {
  microphoneLevel: number
  microphoneLevelAnim: Animated.Value
}

export default function MicrophoneLevelIndicator({ microphoneLevel, microphoneLevelAnim }: MicrophoneLevelIndicatorProps) {
  return (
    <View className="bg-gray-800 rounded-lg p-4 mb-4">
      <Text className="text-green-400 text-center text-sm mb-2">Mic Level: {Math.round(microphoneLevel)} dB</Text>
      <View className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <Animated.View
          className="h-full bg-green-400 rounded-full"
          style={{
            width: microphoneLevelAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['0%', '100%'],
            }),
          }}
        />
      </View>
    </View>
  )
} 
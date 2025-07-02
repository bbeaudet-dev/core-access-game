import { Text, View } from 'react-native';

interface SpeedDisplayProps {
  currentSpeed: number;
  maxSpeed: number;
}

export default function SpeedDisplay({ currentSpeed, maxSpeed }: SpeedDisplayProps) {
  return (
    <>
      {/* Current Speed */}
      <View className="bg-gray-900 p-4 rounded-lg my-1">
        <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT VELOCITY</Text>
        <Text className="text-green-400 text-3xl font-mono">
          {currentSpeed.toFixed(1)}°/s
        </Text>
      </View>

      {/* Max Speed */}
      <View className="bg-gray-900 p-4 rounded-lg my-1">
        <Text className="text-gray-400 text-sm font-mono mb-2">MAX. ROTATIONAL VELOCITY</Text>
        <Text className="text-blue-400 text-3xl font-mono">
          {maxSpeed.toFixed(1)}°/s
        </Text>
      </View>
    </>
  );
} 
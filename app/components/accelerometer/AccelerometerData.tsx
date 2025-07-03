import { Text, View } from 'react-native';

interface AccelerometerDataProps {
  currentAcceleration: number;
  maxAcceleration: number;
  movementType: string;
  accelerometerData: { x: number; y: number; z: number };
}

export default function AccelerometerData({ 
  currentAcceleration, 
  maxAcceleration, 
  movementType, 
  accelerometerData 
}: AccelerometerDataProps) {
  return (
    <View className="space-y-4">
      {/* Current Acceleration */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT ACCELERATION</Text>
        <Text className="text-purple-400 text-3xl font-mono">
          {currentAcceleration.toFixed(2)} m/s²
        </Text>
      </View>

      {/* Max Acceleration */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">MAX ACCELERATION</Text>
        <Text className="text-blue-400 text-3xl font-mono">
          {maxAcceleration.toFixed(2)} m/s²
        </Text>
      </View>

      {/* Movement Type */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">MOVEMENT TYPE</Text>
        <Text className="text-green-400 text-2xl font-mono">
          {movementType}
        </Text>
      </View>

      {/* Raw Data */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA</Text>
        <Text className="text-gray-300 text-sm font-mono">X: {accelerometerData.x.toFixed(3)}</Text>
        <Text className="text-gray-300 text-sm font-mono">Y: {accelerometerData.y.toFixed(3)}</Text>
        <Text className="text-gray-300 text-sm font-mono">Z: {accelerometerData.z.toFixed(3)}</Text>
      </View>
    </View>
  );
} 
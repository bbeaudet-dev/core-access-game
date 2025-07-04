import { Text, View } from 'react-native';

interface CompassDataProps {
  direction: string;
  heading: number;
  magnetometerData: { x: number; y: number; z: number };
}

export default function CompassData({ direction, heading, magnetometerData }: CompassDataProps) {
  return (
    <View className="items-center">
      <View className="items-center my-4">
        <Text className="text-green-400 text-5xl font-bold font-mono mb-1">{direction}</Text>
        <Text className="text-red-500 text-lg font-bold uppercase">DIRECTION</Text>
      </View>
      <View className="bg-gray-800 p-3 rounded-lg mb-2 items-center w-full max-w-xs">
        <Text className="text-green-400 text-2xl font-mono mb-1">Heading: {heading.toFixed(1)}°</Text>
        <Text className="text-green-400 text-base font-mono mb-1">X: {magnetometerData.x.toFixed(2)}</Text>
        <Text className="text-green-400 text-base font-mono mb-1">Y: {magnetometerData.y.toFixed(2)}</Text>
        <Text className="text-green-400 text-base font-mono mb-1">Z: {magnetometerData.z.toFixed(2)}</Text>
      </View>
    </View>
  );
} 
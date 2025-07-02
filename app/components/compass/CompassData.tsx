import { Text, View } from 'react-native'

interface MagnetometerData {
  x: number
  y: number
  z: number
}

interface CompassDataProps {
  heading: number
  direction: string
  magnetometerData: MagnetometerData
}

export default function CompassData({ heading, direction, magnetometerData }: CompassDataProps) {
  return (
    <View className="space-y-4">
      {/* Heading */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">HEADING</Text>
        <Text className="text-red-400 text-3xl font-mono">
          {heading.toFixed(1)}°
        </Text>
      </View>

      {/* Direction */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">DIRECTION</Text>
        <Text className="text-green-400 text-2xl font-mono">
          {direction}
        </Text>
      </View>

      {/* Raw Data */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA</Text>
        <Text className="text-gray-300 text-sm font-mono">X: {magnetometerData.x.toFixed(3)}</Text>
        <Text className="text-gray-300 text-sm font-mono">Y: {magnetometerData.y.toFixed(3)}</Text>
        <Text className="text-gray-300 text-sm font-mono">Z: {magnetometerData.z.toFixed(3)}</Text>
      </View>
    </View>
  )
} 
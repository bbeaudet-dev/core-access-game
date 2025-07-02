import { Text, TouchableOpacity, View } from 'react-native'

export interface Point2D {
  x: number
  y: number
}

interface TowerDefenseGameProps {
  onEmergencyMode: () => void
}

export default function TowerDefenseGame({ onEmergencyMode }: TowerDefenseGameProps) {
  // Circuit board path coordinates (simplified path)
  const circuitPath: Point2D[] = [
    { x: 0, y: 100 },   // Start
    { x: 50, y: 100 },  // Right
    { x: 50, y: 50 },   // Up
    { x: 150, y: 50 },  // Right
    { x: 150, y: 150 }, // Down
    { x: 250, y: 150 }, // Right
    { x: 250, y: 100 }, // Up
    { x: 300, y: 100 }, // Right (end)
  ]
  const coreX = circuitPath[circuitPath.length - 1].x
  const coreY = circuitPath[circuitPath.length - 1].y

  return (
    <View className="flex-1 bg-black p-4">
      {/* Exit Button */}
      <TouchableOpacity className="absolute right-4 top-4 z-20 bg-red-700 px-4 py-2 rounded" onPress={onEmergencyMode}>
        <Text className="text-white font-mono">Exit</Text>
      </TouchableOpacity>
    </View>
  )
} 
import { Text, View } from 'react-native'

interface GameHeaderProps {
  lives: number
  money: number
  level: number
}

export default function GameHeader({ lives, money, level }: GameHeaderProps) {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="text-green-400 text-lg font-mono">CIRCUIT DEFENSE</Text>
      <View className="flex-row space-x-4">
        <Text className="text-red-400 text-sm font-mono">Lives: {lives}</Text>
        <Text className="text-yellow-400 text-sm font-mono">Money: ${money}</Text>
        <Text className="text-blue-400 text-sm font-mono">Level: {level}</Text>
      </View>
    </View>
  )
} 
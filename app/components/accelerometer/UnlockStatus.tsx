import { Text, View } from 'react-native'

interface UnlockStatusProps {
  isUnlocked: boolean
  unlockThreshold: number
}

export default function UnlockStatus({ isUnlocked, unlockThreshold }: UnlockStatusProps) {
  return (
    <View className="bg-gray-900 p-4 rounded-lg mb-4">
      <Text className="text-gray-400 text-sm font-mono mb-2">STATUS</Text>
      <Text className={`text-2xl font-mono ${isUnlocked ? 'text-green-400' : 'text-red-400'}`}>
        {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
      </Text>
      {!isUnlocked && (
        <Text className="text-gray-500 text-sm font-mono mt-2">
          Need {unlockThreshold} m/s² to unlock WiFi
        </Text>
      )}
      {isUnlocked && (
        <Text className="text-green-400 text-sm font-mono mt-2">
          WiFi module unlocked! 📡
        </Text>
      )}
    </View>
  )
} 
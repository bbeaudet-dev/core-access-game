import { Text, TouchableOpacity, View } from 'react-native'

interface AudioControlsProps {
  isMuted: boolean
  volume: number
  currentTrack: string | null
  onMuteToggle: () => void
  onVolumeChange: (volume: number) => void
  soundEffects: any[]
}

export default function AudioControls({
  isMuted,
  volume,
  currentTrack,
  onMuteToggle,
  onVolumeChange,
  soundEffects
}: AudioControlsProps) {
  return (
    <View className="space-y-4">
      <Text className="text-purple-400 text-lg font-bold">Audio Controls</Text>
      
      {/* Mute Toggle */}
      <TouchableOpacity
        onPress={onMuteToggle}
        className={`p-3 rounded-lg border ${isMuted ? 'bg-red-900 border-red-500' : 'bg-green-900 border-green-500'}`}
      >
        <Text className={`text-center font-bold ${isMuted ? 'text-red-400' : 'text-green-400'}`}>
          {isMuted ? '🔇 MUTED' : '🔊 UNMUTED'}
        </Text>
      </TouchableOpacity>

      {/* Volume Control */}
      <View className="space-y-2">
        <Text className="text-purple-400 text-sm">Volume: {Math.round(volume * 100)}%</Text>
        <View className="flex-row space-x-2">
          {[0, 0.25, 0.5, 0.75, 1].map((vol) => (
            <TouchableOpacity
              key={vol}
              onPress={() => onVolumeChange(vol)}
              className={`flex-1 p-2 rounded ${volume >= vol ? 'bg-purple-600' : 'bg-gray-700'}`}
            >
              <Text className="text-center text-xs text-white">
                {Math.round(vol * 100)}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Current Track Display */}
      {currentTrack && (
        <View className="bg-purple-900 p-3 rounded-lg">
          <Text className="text-purple-400 text-sm">Now Playing:</Text>
          <Text className="text-purple-300 font-bold">
            {soundEffects.find(s => s.id === currentTrack)?.name || 'Unknown Track'}
          </Text>
        </View>
      )}
    </View>
  )
} 
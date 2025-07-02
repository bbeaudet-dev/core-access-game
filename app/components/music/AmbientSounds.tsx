import { Text, TouchableOpacity, View } from 'react-native'

interface AmbientSoundsProps {
  ambientSounds: any[]
  onPlayTrack: (track: any) => void
}

export default function AmbientSounds({
  ambientSounds,
  onPlayTrack
}: AmbientSoundsProps) {
  return (
    <View className="space-y-4">
      <Text className="text-purple-400 text-lg font-bold">Ambient Sounds</Text>
      
      {ambientSounds.map((sound) => (
        <TouchableOpacity
          key={sound.id}
          onPress={() => onPlayTrack(sound)}
          className="p-3 rounded-lg border bg-gray-800 border-gray-600"
        >
          <Text className="font-bold text-purple-400">
            🌊 {sound.name}
          </Text>
          <Text className="text-xs text-gray-400">
            {sound.description}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  )
} 
import { Text, TouchableOpacity, View } from 'react-native'

interface MusicTracksProps {
  musicTracks: any[]
  currentTrack: string | null
  onPlayTrack: (track: any) => void
  onStopMusic: () => void
}

export default function MusicTracks({
  musicTracks,
  currentTrack,
  onPlayTrack,
  onStopMusic
}: MusicTracksProps) {
  return (
    <View className="space-y-4">
      <Text className="text-purple-400 text-lg font-bold">Music</Text>
      
      {musicTracks.map((track) => (
        <TouchableOpacity
          key={track.id}
          onPress={() => onPlayTrack(track)}
          className={`p-3 rounded-lg border ${
            currentTrack === track.id ? 'bg-purple-600 border-purple-400' : 'bg-gray-800 border-gray-600'
          }`}
        >
          <Text className={`font-bold ${currentTrack === track.id ? 'text-purple-200' : 'text-purple-400'}`}>
            🎵 {track.name}
          </Text>
          <Text className={`text-xs ${currentTrack === track.id ? 'text-purple-300' : 'text-gray-400'}`}>
            {track.description}
          </Text>
        </TouchableOpacity>
      ))}

      {currentTrack && (
        <TouchableOpacity
          onPress={onStopMusic}
          className="p-3 rounded-lg border bg-red-900 border-red-500"
        >
          <Text className="text-red-400 text-center font-bold">⏹️ Stop Music</Text>
        </TouchableOpacity>
      )}
    </View>
  )
} 
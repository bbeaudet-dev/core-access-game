import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { ScrollView, Text, TouchableOpacity, View } from 'react-native'
import { SOUND_EFFECTS, SoundManager, playBackgroundMusic, setSoundMuted, setSoundVolume, stopBackgroundMusic } from '../../utils/soundManager'
import HomeButton from '../ui/HomeButton'
import ModuleHeader from '../ui/ModuleHeader'
import PhoneFrame from '../ui/PhoneFrame'

interface MusicModuleProps {
  onGoHome: () => void
}

export default function MusicModule({ onGoHome }: MusicModuleProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync()
        setHasPermission(status === 'granted')
        
        if (status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: false,
            playsInSilentModeIOS: true,
          })
        }
      } catch (error) {
        console.error('Failed to get microphone permissions:', error)
        setHasPermission(false)
      }
    }

    requestPermissions()
    
    // Initialize sound manager state
    const soundManager = SoundManager.getInstance()
    setIsMuted(soundManager.isMutedState())
    setVolume(soundManager.getVolume())
    setCurrentTrack(soundManager.getCurrentMusicTrack())
  }, [])

  const handleMuteToggle = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    setSoundMuted(newMutedState)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setSoundVolume(newVolume)
  }

  const handlePlayTrack = async (track: typeof SOUND_EFFECTS[0]) => {
    if (track.category === 'music') {
      // For now, we'll use placeholder URIs - you'll need to add actual sound files
      const baseUrl = 'https://example.com/sounds' // Replace with your actual sound hosting
      const uri = `${baseUrl}${track.filePath}`
      
      try {
        await playBackgroundMusic(track.id, uri, true)
        setCurrentTrack(track.id)
      } catch (error) {
        console.error('Failed to play track:', error)
      }
    }
  }

  const handleStopMusic = async () => {
    await stopBackgroundMusic()
    setCurrentTrack(null)
  }

  const musicTracks = SOUND_EFFECTS.filter(sound => sound.category === 'music')
  const ambientSounds = SOUND_EFFECTS.filter(sound => sound.category === 'ambient')

  if (hasPermission === null) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="MUSIC" color="purple" />
            <View className="flex-1 p-5 justify-center">
              <Text className="text-purple-400 text-center text-base mb-2">Requesting speaker permission...</Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    )
  }

  if (hasPermission === false) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="MUSIC" color="purple" />
            <View className="flex-1 p-5 justify-center">
              <Text className="text-purple-400 text-center text-base mb-2">Speaker access denied</Text>
              <Text className="text-purple-400 text-center text-base mb-2">Please grant speaker permissions</Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="MUSIC" color="purple" />
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="p-5 space-y-6">
              {/* Audio Controls */}
              <View className="space-y-4">
                <Text className="text-purple-400 text-lg font-bold">Audio Controls</Text>
                
                {/* Mute Toggle */}
                <TouchableOpacity
                  onPress={handleMuteToggle}
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
                        onPress={() => handleVolumeChange(vol)}
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
                      {SOUND_EFFECTS.find(s => s.id === currentTrack)?.name || 'Unknown Track'}
                    </Text>
                  </View>
                )}
              </View>

              {/* Background Music */}
              <View className="space-y-4">
                <Text className="text-purple-400 text-lg font-bold">Background Music</Text>
                
                {musicTracks.map((track) => (
                  <TouchableOpacity
                    key={track.id}
                    onPress={() => handlePlayTrack(track)}
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
                    onPress={handleStopMusic}
                    className="p-3 rounded-lg border bg-red-900 border-red-500"
                  >
                    <Text className="text-red-400 text-center font-bold">⏹️ Stop Music</Text>
                  </TouchableOpacity>
                )}
              </View>

              {/* Ambient Sounds */}
              <View className="space-y-4">
                <Text className="text-purple-400 text-lg font-bold">Ambient Sounds</Text>
                
                {ambientSounds.map((sound) => (
                  <TouchableOpacity
                    key={sound.id}
                    onPress={() => handlePlayTrack(sound)}
                    className="p-3 rounded-lg border bg-gray-800 border-gray-600"
                  >
                    <Text className="text-purple-400 font-bold">
                      🌫️ {sound.name}
                    </Text>
                    <Text className="text-gray-400 text-xs">
                      {sound.description}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Sound Info */}
              <View className="bg-gray-800 p-3 rounded-lg">
                <Text className="text-gray-400 text-xs text-center">
                  💡 Add sound files to public/sounds/ to enable spea playback
                </Text>
                <Text className="text-gray-400 text-xs text-center mt-1">
                  Supported formats: MP3, WAV, M4A
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  )
} 
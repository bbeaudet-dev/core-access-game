import { Audio } from 'expo-av'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SOUND_EFFECTS, SoundManager, playBackgroundMusic, setSoundMuted, setSoundVolume, stopBackgroundMusic } from '../../utils/soundManager'
import HomeButton from '../ui/HomeButton'
import ModuleHeader from '../ui/ModuleHeader'
import PhoneFrame from '../ui/PhoneFrame'
import AmbientSounds from './AmbientSounds'
import AudioControls from './AudioControls'
import MusicTracks from './MusicTracks'

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
              <AudioControls
                isMuted={isMuted}
                volume={volume}
                currentTrack={currentTrack}
                onMuteToggle={handleMuteToggle}
                onVolumeChange={handleVolumeChange}
                soundEffects={SOUND_EFFECTS}
              />

              {/* Background Music */}
              <MusicTracks
                musicTracks={musicTracks}
                currentTrack={currentTrack}
                onPlayTrack={handlePlayTrack}
                onStopMusic={handleStopMusic}
              />

              {/* Ambient Sounds */}
              <AmbientSounds
                ambientSounds={ambientSounds}
                onPlayTrack={handlePlayTrack}
              />
            </View>
          </ScrollView>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  )
} 
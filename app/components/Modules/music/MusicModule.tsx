import { setAudioModeAsync } from 'expo-audio'
import { useEffect, useState } from 'react'
import { ScrollView, Text, View } from 'react-native'
import { SOUND_EFFECTS, SoundManager, pauseBackgroundMusic, playBackgroundMusic, resumeBackgroundMusic, setSoundMuted, setSoundVolume, stopBackgroundMusic } from '../../../utils/soundManager'
import ScreenTemplate from '../../ui/ScreenTemplate'
import AudioControls from './AudioControls'
import MusicTracks from './MusicTracks'

interface MusicModuleProps {
  onGoHome: () => void
}

export default function MusicModule({ onGoHome }: MusicModuleProps) {
  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)

  useEffect(() => {
    const setupAudio = async () => {
      try {
        // Configure the audio mode for playback
        await setAudioModeAsync({
          allowsRecording: false,
          playsInSilentMode: true,
          shouldPlayInBackground: true,
        })
        setHasPermission(true)
      } catch (error) {
        console.error('Failed to setup audio:', error)
        setHasPermission(false)
      }
    }

    setupAudio()
    
    // Initialize sound manager state
    const soundManager = SoundManager.getInstance()
    setIsMuted(soundManager.isMutedState())
    setVolume(soundManager.getVolume())
    setCurrentTrack(soundManager.getCurrentMusicTrack())
    setIsPlaying(soundManager.isBackgroundMusicPlaying())
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
      try {
        // Use the local file directly
        await playBackgroundMusic(track.id, track.file, true)
        setCurrentTrack(track.id)
        setIsPlaying(true)
      } catch (error) {
        console.error('Failed to play track:', error)
      }
    }
  }

  const handleStopMusic = async () => {
    await stopBackgroundMusic()
    setCurrentTrack(null)
    setIsPlaying(false)
  }

  const handlePauseResume = async () => {
    if (isPlaying) {
      await pauseBackgroundMusic()
      setIsPlaying(false)
    } else {
      await resumeBackgroundMusic()
      setIsPlaying(true)
    }
  }

  const musicTracks = SOUND_EFFECTS.filter(sound => sound.category === 'music')

  return (
    <ScreenTemplate title="MUSIC" titleColor="purple" onGoHome={onGoHome}>
          {hasPermission === null ? (
            <View className="flex-1 p-5 justify-center">
              <Text className="text-purple-400 text-center text-base mb-2">Requesting speaker permission...</Text>
            </View>
          ) : hasPermission === false ? (
            <View className="flex-1 p-5 justify-center">
              <Text className="text-purple-400 text-center text-base mb-2">Speaker access denied</Text>
              <Text className="text-purple-400 text-center text-base mb-2">Please grant speaker permissions</Text>
            </View>
          ) : (
            <ScrollView className="flex-col" showsVerticalScrollIndicator={false}>
              <View className="p-5 space-y-6">
                {/* Audio Controls */}
                <AudioControls
                  isMuted={isMuted}
                  volume={volume}
                  currentTrack={currentTrack}
              isPlaying={isPlaying}
                  onMuteToggle={handleMuteToggle}
                  onVolumeChange={handleVolumeChange}
              onPauseResume={handlePauseResume}
                  soundEffects={SOUND_EFFECTS}
                />

                {/* Music */}
                <MusicTracks
                  musicTracks={musicTracks}
                  currentTrack={currentTrack}
                  onPlayTrack={handlePlayTrack}
                  onStopMusic={handleStopMusic}
                />

              </View>
            </ScrollView>
          )}
    </ScreenTemplate>
  )
} 
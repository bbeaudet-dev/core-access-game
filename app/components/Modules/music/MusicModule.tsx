import { setAudioModeAsync } from 'expo-audio'
import { useEffect, useState } from 'react'
import { Text, View } from 'react-native'
import { usePuzzle } from '../../../contexts/PuzzleContext'
import { SOUND_EFFECTS, SoundManager, pauseBackgroundMusic, playSound, resumeBackgroundMusic, setSoundMuted, setSoundVolume } from '../../../utils/soundManager'
import { getModuleBackgroundImage } from '../../../utils/unlockSystem'
import ScreenTemplate from '../../ui/ScreenTemplate'
import AudioControls from './AudioControls'
import MusicTracks from './MusicTracks'

interface MusicModuleProps {
  onGoHome: () => void
}

export default function MusicModule({ onGoHome }: MusicModuleProps) {
  const { getCompletedPuzzles, completePuzzle } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('music', completedPuzzles, false);

  const [isMuted, setIsMuted] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [currentTrack, setCurrentTrack] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [puzzleComplete, setPuzzleComplete] = useState(false);

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

    // Check if puzzle is already completed
    if (completedPuzzles.includes('music_play')) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles]);

  const handleMuteToggle = () => {
    const newMutedState = !isMuted
    setIsMuted(newMutedState)
    setSoundMuted(newMutedState)
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    setSoundVolume(newVolume)
  }

  const handlePlayTrack = (trackName: string) => {
    setCurrentTrack(trackName);
    setIsPlaying(true);
    playSound('sensor_activate');
    
    // Complete puzzle when any track is played
    if (!puzzleComplete) {
      setPuzzleComplete(true);
      completePuzzle('music_play');
    }
  }

  const handleStopTrack = () => {
    setIsPlaying(false);
    setCurrentTrack(null);
    playSound('click');
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
    <ScreenTemplate 
      title="MUSIC" 
      titleColor="purple" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        {/* Music Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MUSIC STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-4xl mr-4">{isPlaying ? '🎵' : '🎶'}</Text>
            <Text className={`text-xl font-mono ${isPlaying ? 'text-green-400' : 'text-gray-400'}`}>
              {isPlaying ? 'PLAYING' : 'STOPPED'}
            </Text>
          </View>
          
          {currentTrack && (
            <Text className="text-center text-gray-300 font-mono mt-2">
              Track: {currentTrack}
            </Text>
          )}
        </View>

        {/* Music Controls */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MUSIC CONTROLS</Text>
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
        </View>

        {/* Music Tracks */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MUSIC TRACKS</Text>
          <MusicTracks
            musicTracks={musicTracks}
            currentTrack={currentTrack}
            onPlayTrack={handlePlayTrack}
            onStopMusic={handleStopTrack}
          />
        </View>
      </View>
    </ScreenTemplate>
  )
} 
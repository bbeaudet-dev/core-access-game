import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
import AudioLevelIndicator from './AudioLevelIndicator';
import AudioWaveform from './AudioWaveform';

interface MicrophoneModuleProps {
  onGoHome: () => void;
}

export default function MicrophoneModule({ onGoHome }: MicrophoneModuleProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [maxAudioLevel, setMaxAudioLevel] = useState(0);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const audioLevelAnim = useRef(new Animated.Value(0)).current;
  
  const { updatePuzzleProgress, completePuzzle } = usePuzzle();

  // Audio level threshold to unlock puzzle
  const UNLOCK_THRESHOLD = 70; // dB

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
            staysActiveInBackground: false,
          });
        }
      } catch (error) {
        console.error('Failed to get microphone permissions:', error);
        setHasPermission(false);
      }
    };

    requestPermissions();
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      
      // Start recording to get audio levels
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          if (status.isRecording) {
            const level = status.metering || 0;
            setAudioLevel(level);
            
            // Update max audio level and check for puzzle completion
            setMaxAudioLevel(prevMax => {
              if (level > prevMax) {
                // Check if we should unlock puzzle
                if (level >= UNLOCK_THRESHOLD && !isUnlocked) {
                  setIsUnlocked(true);
                  completePuzzle('microphone_level');
                }
                
                return level;
              }
              return prevMax;
            });
            
            // Animate the audio level
            Animated.timing(audioLevelAnim, {
              toValue: Math.min(level / 100, 1),
              duration: 100,
              useNativeDriver: false,
            }).start();
          }
        },
        100 // Update every 100ms
      );
      
      setRecording(recording);
    } catch (error) {
      console.error('Failed to start recording:', error);
      setIsListening(false);
    }
  };

  const stopListening = async () => {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        setRecording(null);
      }
      setIsListening(false);
      setAudioLevel(0);
      
      // Reset the audio level animation
      Animated.timing(audioLevelAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: false,
      }).start();
      
      // Reset audio mode to allow music to play again
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
      
      // Re-enable recording for next use
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      });
    } catch (error) {
      console.error('Failed to stop recording:', error);
      setIsListening(false);
      setAudioLevel(0);
    }
  };

  const toggleMicrophone = async () => {
    if (isListening) {
      await stopListening();
    } else {
      await startListening();
    }
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="MICROPHONE" color="green" />
          
          {hasPermission === null ? (
            <View className="flex-1 p-5 justify-center">
              <Text className="text-green-400 text-center text-base mb-2">Requesting microphone permission...</Text>
            </View>
          ) : hasPermission === false ? (
            <View className="flex-1 p-5 justify-center">
              <Text className="text-green-400 text-center text-base mb-2">Microphone access denied</Text>
              <Text className="text-green-400 text-center text-base mb-2">Please grant microphone permissions</Text>
            </View>
          ) : (
            <View className="flex flex-col content-center">
              <View className="mb-6">
                
                {/* Audio Level Indicator Component */}
                <View className="">
                  <AudioLevelIndicator audioLevel={audioLevel} audioLevelAnim={audioLevelAnim} />
                </View>
                
                {/* Live Waveform Component */}
                <View className="">
                  <Text className="text-green-400 text-center text-sm mb-2">Live Waveform</Text>
                  <AudioWaveform audioLevel={audioLevel} />
                </View>
              </View>
              
              {/* Microphone Toggle Button */}
              <View className="flex items-center justify-center">
                <TouchableOpacity
                  onPress={toggleMicrophone}
                  className={`w-20 h-20 rounded-full justify-center items-center m-2 ${
                    isListening ? 'bg-red-500' : 'bg-green-500'
                  }`}
                  activeOpacity={0.8}
                >
                  <Text className="text-white text-2xl">
                    {isListening ? '🔴' : '🎤'}
                  </Text>
                </TouchableOpacity>
              </View>
              
              <Text className="text-green-400 text-center text-lg mb-4">
                {isListening ? '🎤 LIVE AUDIO FEED' : '🎤 Audio System: STANDBY'}
              </Text>
            </View>
          )}
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
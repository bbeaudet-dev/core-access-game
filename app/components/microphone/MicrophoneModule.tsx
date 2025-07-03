import { Audio } from 'expo-av';
import { useEffect, useRef, useState } from 'react';
import { Animated, Text, View } from 'react-native';
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
  const audioLevelAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const { status } = await Audio.requestPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status === 'granted') {
          await Audio.setAudioModeAsync({
            allowsRecordingIOS: true,
            playsInSilentModeIOS: true,
          });
        }
      } catch (error) {
        console.error('Failed to get microphone permissions:', error);
        setHasPermission(false);
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    if (hasPermission && !isListening) {
      startListening();
    }
  }, [hasPermission]);

  const startListening = async () => {
    try {
      setIsListening(true);
      
      // Start recording to get audio levels
      const { recording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY,
        (status) => {
          // This callback gives us audio level information
          if (status.isRecording) {
            const level = status.metering || 0;
            setAudioLevel(level);
            
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
    if (recording) {
      await recording.stopAndUnloadAsync();
      setRecording(null);
    }
    setIsListening(false);
  };

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, []);

  if (hasPermission === null) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="AUDIO" color="green" />
            <View className="flex-1 p-5 justify-center">
              <Text className="text-green-400 text-center text-base mb-2">Requesting microphone permission...</Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  if (hasPermission === false) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="AUDIO" color="green" />
            <View className="flex-1 p-5 justify-center">
              <Text className="text-green-400 text-center text-base mb-2">Microphone access denied</Text>
              <Text className="text-green-400 text-center text-base mb-2">Please grant microphone permissions</Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="AUDIO" color="green" />
          
          <View className="flex-1 p-5">
            <View className="mb-6">
              <Text className="text-green-400 text-center text-lg mb-4">
                {isListening ? '🎤 LIVE AUDIO FEED' : '🎤 Audio System: STANDBY'}
              </Text>
              
              {/* Audio Level Indicator Component */}
              <View className="mb-4">
                <Text className="text-green-400 text-center text-sm mb-2">Audio Level</Text>
                <AudioLevelIndicator audioLevel={audioLevel} audioLevelAnim={audioLevelAnim} />
              </View>
              
              {/* Live Waveform Component */}
              <View className="mb-4">
                <Text className="text-green-400 text-center text-sm mb-2">Live Waveform</Text>
                <AudioWaveform audioLevel={audioLevel} />
              </View>
            </View>
            
            <View className="space-y-3">
              <Text className="text-green-400 text-center text-sm">Voice recognition: {isListening ? 'ACTIVE' : 'DISABLED'}</Text>
              <Text className="text-yellow-400 text-center text-xs">HINT: Try saying "unlock core" or "access granted"</Text>
            </View>
          </View>
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
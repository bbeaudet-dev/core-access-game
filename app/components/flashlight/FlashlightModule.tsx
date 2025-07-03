import * as Brightness from 'expo-brightness';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
import PuzzleStatus from '../ui/PuzzleStatus';

interface FlashlightModuleProps {
  onGoHome: () => void;
}

export default function FlashlightModule({ onGoHome }: FlashlightModuleProps) {
  const [isOn, setIsOn] = useState(false);
  const [originalBrightness, setOriginalBrightness] = useState(0);
  const [isPlayingMorse, setIsPlayingMorse] = useState(false);
  const [morseMessage, setMorseMessage] = useState('SOS');

  useEffect(() => {
    // Store original brightness
    Brightness.getBrightnessAsync().then(setOriginalBrightness);
    
    return () => {
      // Restore original brightness when component unmounts
      Brightness.setBrightnessAsync(originalBrightness);
    };
  }, []);

  const toggleFlashlight = async () => {
    try {
      if (isOn) {
        await Brightness.setBrightnessAsync(originalBrightness);
        setIsOn(false);
      } else {
        await Brightness.setBrightnessAsync(1.0);
        setIsOn(true);
      }
    } catch (error) {
      console.error('Failed to toggle flashlight:', error);
    }
  };

  const playMorseCode = async () => {
    if (isPlayingMorse) return;
    
    setIsPlayingMorse(true);
    const message = morseMessage;
    
    // Morse code timing (in milliseconds)
    const dotDuration = 200;
    const dashDuration = 600;
    const elementGap = 200;
    const letterGap = 600;
    
    const morseAlphabet: { [key: string]: string } = {
      'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
      'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
      'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
      'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
      'Y': '-.--', 'Z': '--..', ' ': ' '
    };

    for (let i = 0; i < message.length; i++) {
      const char = message[i].toUpperCase();
      const morse = morseAlphabet[char];
      
      if (morse && morse !== ' ') {
        for (let j = 0; j < morse.length; j++) {
          const symbol = morse[j];
          
          // Turn on flashlight
          await Brightness.setBrightnessAsync(1.0);
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          
          // Wait for dot or dash duration
          await new Promise(resolve => 
            setTimeout(resolve, symbol === '.' ? dotDuration : dashDuration)
          );
          
          // Turn off flashlight
          await Brightness.setBrightnessAsync(originalBrightness);
          
          // Wait between elements
          if (j < morse.length - 1) {
            await new Promise(resolve => setTimeout(resolve, elementGap));
          }
        }
        
        // Wait between letters
        if (i < message.length - 1) {
          await new Promise(resolve => setTimeout(resolve, letterGap));
        }
      }
    }
    
    setIsPlayingMorse(false);
  };

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="FLASHLIGHT" color="yellow" />
          
          <View className="flex flex-col items-center justify-center flex-1">
            {/* Flashlight Status */}
            <View className="bg-gray-900 p-6 rounded-lg mb-8 w-full">
              <Text className="text-gray-400 text-sm font-mono mb-2 text-center">FLASHLIGHT STATUS</Text>
              <Text className={`text-2xl font-mono text-center ${isOn ? 'text-yellow-400' : 'text-gray-600'}`}>
                {isOn ? '🔦 ON' : '🔦 OFF'}
              </Text>
            </View>

            {/* Morse Code Puzzle Status */}
            <PuzzleStatus
              title="MORSE CODE PUZZLE"
              description="Target: Transmit SOS in morse code"
              isComplete={isPlayingMorse}
              color="yellow"
            />

            {/* Morse Code Section */}
            <View className="bg-gray-900 p-6 rounded-lg mb-8 w-full">
              <Text className="text-gray-400 text-sm font-mono mb-2 text-center">MORSE CODE TRANSMITTER</Text>
              <Text className="text-yellow-400 text-lg font-mono text-center mb-4">
                Message: {morseMessage}
              </Text>
              <TouchableOpacity
                onPress={playMorseCode}
                disabled={isPlayingMorse}
                className={`px-6 py-3 rounded-lg mx-auto ${isPlayingMorse ? 'bg-gray-600' : 'bg-yellow-600'}`}
              >
                <Text className="text-white text-center font-mono">
                  {isPlayingMorse ? 'TRANSMITTING...' : 'TRANSMIT MORSE'}
                </Text>
              </TouchableOpacity>
            </View>

            {/* Manual Control */}
            <View className="bg-gray-900 p-6 rounded-lg mb-8 w-full">
              <Text className="text-gray-400 text-sm font-mono mb-4 text-center">MANUAL CONTROL</Text>
              <TouchableOpacity
                onPress={toggleFlashlight}
                className={`w-24 h-24 rounded-full justify-center items-center mx-auto ${
                  isOn ? 'bg-yellow-500' : 'bg-gray-600'
                }`}
                activeOpacity={0.8}
              >
                <Text className="text-white text-3xl">
                  {isOn ? '🔦' : '⚫'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
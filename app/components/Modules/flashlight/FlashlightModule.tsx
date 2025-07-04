import * as Brightness from 'expo-brightness';
import * as Haptics from 'expo-haptics';
import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface FlashlightModuleProps {
  onGoHome: () => void;
}

export default function FlashlightModule({ onGoHome }: FlashlightModuleProps) {
  const [isOn, setIsOn] = useState(false);
  const [isPlayingMorse, setIsPlayingMorse] = useState(false);
  const [morseMessage, setMorseMessage] = useState('SOS');
  const originalBrightnessRef = useRef<number | null>(null);

  useEffect(() => {
    // Store original brightness when component mounts
    const storeOriginalBrightness = async () => {
      try {
        const brightness = await Brightness.getBrightnessAsync();
        originalBrightnessRef.current = brightness;
      } catch (error) {
        console.error('Failed to get original brightness:', error);
        originalBrightnessRef.current = 0.6; // Fallback
      }
    };
    storeOriginalBrightness();
    
    return () => {
      // Restore original brightness when component unmounts
      if (originalBrightnessRef.current !== null) {
        Brightness.setBrightnessAsync(originalBrightnessRef.current);
      }
    };
  }, []);

  const toggleFlashlight = async () => {
    playSound('ui_button_tap');
    try {
      if (isOn) {
        // Restore original brightness
        if (originalBrightnessRef.current !== null) {
          await Brightness.setBrightnessAsync(originalBrightnessRef.current);
        }
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
    
    playSound('ui_button_tap');
    setIsPlayingMorse(true);
    
    // SOS pattern: ... --- ... (3 dots, 3 dashes, 3 dots)
    const dotDuration = 200; // 200ms for dot
    const dashDuration = 600; // 600ms for dash
    const elementGap = 200; // 200ms between elements
    const letterGap = 600; // 600ms between letters
    const wordGap = 1400; // 1400ms between words
    
    // SOS pattern with alternating brightness
    const sosPattern = [
      // S: ... (3 dots)
      { duration: dotDuration, brightness: 0.75 }, // High brightness
      { duration: elementGap, brightness: 0.5 },   // Low brightness
      { duration: dotDuration, brightness: 0.75 },
      { duration: elementGap, brightness: 0.5 },
      { duration: dotDuration, brightness: 0.75 },
      { duration: letterGap, brightness: 0.5 },
      
      // O: --- (3 dashes)
      { duration: dashDuration, brightness: 0.75 },
      { duration: elementGap, brightness: 0.5 },
      { duration: dashDuration, brightness: 0.75 },
      { duration: elementGap, brightness: 0.5 },
      { duration: dashDuration, brightness: 0.75 },
      { duration: letterGap, brightness: 0.5 },
      
      // S: ... (3 dots)
      { duration: dotDuration, brightness: 0.75 },
      { duration: elementGap, brightness: 0.5 },
      { duration: dotDuration, brightness: 0.75 },
      { duration: elementGap, brightness: 0.5 },
      { duration: dotDuration, brightness: 0.75 },
      { duration: wordGap, brightness: 0.5 },
    ];

    try {
      for (const step of sosPattern) {
        await Brightness.setBrightnessAsync(step.brightness);
        await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        await new Promise(resolve => setTimeout(resolve, step.duration));
      }
      
      // Restore original brightness
      if (originalBrightnessRef.current !== null) {
        await Brightness.setBrightnessAsync(originalBrightnessRef.current);
      }
    } catch (error) {
      console.error('Failed to play SOS morse code:', error);
    } finally {
      setIsPlayingMorse(false);
    }
  };

  const playCustomMorseCode = async () => {
    if (isPlayingMorse) return;
    
    playSound('ui_button_tap');
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

    try {
      for (let i = 0; i < message.length; i++) {
        const char = message[i].toUpperCase();
        const morse = morseAlphabet[char];
        
        if (morse && morse !== ' ') {
          for (let j = 0; j < morse.length; j++) {
            const symbol = morse[j];
            
            // Turn on flashlight with alternating brightness
            const brightness = j % 2 === 0 ? 0.75 : 0.5;
            await Brightness.setBrightnessAsync(brightness);
            await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            
            // Wait for dot or dash duration
            await new Promise(resolve => 
              setTimeout(resolve, symbol === '.' ? dotDuration : dashDuration)
            );
            
            // Turn off flashlight
            if (originalBrightnessRef.current !== null) {
              await Brightness.setBrightnessAsync(originalBrightnessRef.current);
            }
            
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
    } catch (error) {
      console.error('Failed to play morse code:', error);
    } finally {
      // Restore original brightness
      if (originalBrightnessRef.current !== null) {
        await Brightness.setBrightnessAsync(originalBrightnessRef.current);
      }
      setIsPlayingMorse(false);
    }
  };

  return (
    <ScreenTemplate title="FLASHLIGHT" titleColor="yellow" onGoHome={onGoHome}>
      <View className="flex flex-col items-center justify-center">
        {/* Flashlight Status */}
        <View className="bg-gray-900 p-6 rounded-lg mb-8 w-full">
          <Text className="text-gray-400 text-sm font-mono mb-2 text-center">FLASHLIGHT STATUS</Text>
          <Text className={`text-2xl font-mono text-center ${isOn ? 'text-yellow-400' : 'text-gray-600'}`}>
            {isOn ? '🔦 ON' : '🔦 OFF'}
          </Text>
        </View>

        {/* SOS Morse Code Section */}
        <View className="bg-gray-900 p-6 rounded-lg mb-8 w-full">
          <Text className="text-gray-400 text-sm font-mono mb-2 text-center">SOS EMERGENCY SIGNAL</Text>
          <Text className="text-red-400 text-lg font-mono text-center mb-4">
            Pattern: ... --- ... (75% ↔ 50% brightness)
          </Text>
          <TouchableOpacity
            onPress={playMorseCode}
            disabled={isPlayingMorse}
            className={`px-6 py-3 rounded-lg mx-auto ${isPlayingMorse ? 'bg-gray-600' : 'bg-red-600'}`}
          >
            <Text className="text-white text-center font-mono">
              {isPlayingMorse ? 'TRANSMITTING SOS...' : 'TRANSMIT SOS'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Custom Morse Code Section */}
        <View className="bg-gray-900 p-6 rounded-lg mb-8 w-full">
          <Text className="text-gray-400 text-sm font-mono mb-2 text-center">CUSTOM MORSE CODE</Text>
          <Text className="text-yellow-400 text-lg font-mono text-center mb-4">
            Message: {morseMessage}
          </Text>
          <TouchableOpacity
            onPress={playCustomMorseCode}
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
    </ScreenTemplate>
  );
} 
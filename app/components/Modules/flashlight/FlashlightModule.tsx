import * as Brightness from 'expo-brightness';
import { useEffect, useRef, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';
import { getModuleBackgroundImage } from '../../../utils/unlockSystem';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface FlashlightModuleProps {
  onGoHome: () => void;
}

export default function FlashlightModule({ onGoHome }: FlashlightModuleProps) {
  const [isOn, setIsOn] = useState(false);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [morseSequence, setMorseSequence] = useState<string[]>([]);
  const [lastToggleTime, setLastToggleTime] = useState<number>(0);
  const originalBrightnessRef = useRef<number | null>(null);
  
  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('flashlight', completedPuzzles, false);

  // Morse code pattern for SOS: ... --- ...
  const SOS_PATTERN = ['short', 'short', 'short', 'long', 'long', 'long', 'short', 'short', 'short'];

  useEffect(() => {
    // Check if puzzle is already completed
    if (completedPuzzles.includes('flashlight_morse')) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles]);

  const toggleFlashlight = async () => {
    try {
      const newState = !isOn;
      setIsOn(newState);
      
      if (newState) {
        // Store original brightness and set to maximum
        if (originalBrightnessRef.current === null) {
          originalBrightnessRef.current = await Brightness.getBrightnessAsync();
        }
        await Brightness.setBrightnessAsync(1.0);
        playSound('sensor_activate');
      } else {
        // Restore original brightness
        if (originalBrightnessRef.current !== null) {
          await Brightness.setBrightnessAsync(originalBrightnessRef.current);
        }
        playSound('click');
      }

      // Record the toggle for Morse code detection
      const currentTime = Date.now();
      const timeSinceLastToggle = currentTime - lastToggleTime;
      setLastToggleTime(currentTime);

      if (timeSinceLastToggle > 100) { // Debounce rapid toggles
        const duration = timeSinceLastToggle > 400 ? 'long' : 'short';
        setMorseSequence(prev => {
          const newSequence = [...prev, duration];
          
          // Keep only the last 9 elements (SOS pattern length)
          const trimmedSequence = newSequence.slice(-9);
          
          // Check if the pattern matches SOS
          if (trimmedSequence.length === 9 && 
              trimmedSequence.every((item, index) => item === SOS_PATTERN[index])) {
            if (!puzzleComplete) {
              setPuzzleComplete(true);
              completePuzzle('flashlight_morse');
            }
          }
          
          return trimmedSequence;
        });
      }
    } catch (error) {
      console.error('Failed to toggle flashlight:', error);
    }
  };

  const resetMorseSequence = () => {
    setMorseSequence([]);
  };

  return (
    <ScreenTemplate 
      title="FLASHLIGHT" 
      titleColor="yellow" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      <View className="flex flex-col space-y-4">
        {/* Flashlight Status */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">FLASHLIGHT STATUS</Text>
          <View className="flex flex-row items-center justify-center">
            <Text className="text-6xl mr-4">{isOn ? '💡' : '🔦'}</Text>
            <Text className={`text-2xl font-mono ${isOn ? 'text-yellow-400' : 'text-gray-400'}`}>
              {isOn ? 'ILLUMINATED' : 'DARKNESS'}
            </Text>
          </View>
          
          {/* Puzzle Status */}
          {puzzleComplete && (
            <View className="mt-4 p-3 bg-green-900 rounded-lg">
              <Text className="text-green-400 text-center font-mono text-sm">
                ✅ SIGNAL TRANSMISSION COMPLETE
              </Text>
            </View>
          )}
        </View>

        {/* Morse Code Interface */}
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-4">MORSE CODE INTERFACE</Text>
          
          {/* Morse Sequence Display */}
          <View className="bg-gray-800 p-4 rounded-lg mb-4">
            <Text className="text-gray-300 text-sm font-mono mb-2">Current Sequence:</Text>
            <View className="flex flex-row justify-center space-x-2">
              {morseSequence.length > 0 ? (
                morseSequence.map((item, index) => (
                  <Text key={index} className={`text-2xl ${item === 'long' ? 'text-yellow-400' : 'text-green-400'}`}>
                    {item === 'long' ? '—' : '·'}
                  </Text>
                ))
              ) : (
                <Text className="text-gray-500 text-lg">No signal detected</Text>
              )}
            </View>
          </View>

          {/* Controls */}
          <View className="space-y-3">
            <TouchableOpacity
              onPress={toggleFlashlight}
              className={`p-4 rounded-lg ${isOn ? 'bg-yellow-600' : 'bg-gray-700'}`}
            >
              <Text className="text-center font-mono text-lg">
                {isOn ? 'TURN OFF' : 'TURN ON'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={resetMorseSequence}
              className="p-3 bg-gray-700 rounded-lg"
            >
              <Text className="text-center font-mono text-sm text-gray-300">
                RESET SEQUENCE
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Instructions */}
        {!puzzleComplete && (
          <View className="bg-gray-900 p-6 rounded-lg">
            <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE INSTRUCTIONS</Text>
            <Text className="text-yellow-400 text-sm font-mono mb-2">
              Transmit SOS signal using Morse code:
            </Text>
            <Text className="text-gray-300 text-xs font-mono mb-2">
              • Short flash (·) = Quick toggle
            </Text>
            <Text className="text-gray-300 text-xs font-mono mb-2">
              • Long flash (—) = Hold for ~600ms
            </Text>
            <Text className="text-gray-300 text-xs font-mono">
              Pattern: ··· ——— ··· (SOS)
            </Text>
          </View>
        )}
      </View>
    </ScreenTemplate>
  );
} 
import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';

interface NumberGuessGameProps {
  onBackToMenu: () => void;
}

interface NumberGuessState {
  target: number;
  attempts: number;
  maxAttempts: number;
  guess: string;
  feedback: string;
}

export default function NumberGuessGame({ onBackToMenu }: NumberGuessGameProps) {
  const { updatePuzzleProgress } = usePuzzle();
  const [gameState, setGameState] = useState<NumberGuessState>({
    target: Math.floor(Math.random() * 100) + 1,
    attempts: 0,
    maxAttempts: 7,
    guess: '',
    feedback: 'Guess a number between 1 and 100!',
  });

  const makeGuess = () => {
    playSound('ui_button_tap');
    const { target, attempts, maxAttempts, guess } = gameState;
    const guessNum = parseInt(guess);
    
    if (isNaN(guessNum) || guessNum < 1 || guessNum > 100) {
      Alert.alert('Invalid Input', 'Please enter a number between 1 and 100');
      return;
    }

    const newAttempts = attempts + 1;
    let feedback = '';
    let isComplete = false;

    if (guessNum === target) {
      feedback = `Correct! You got it in ${newAttempts} attempts!`;
      isComplete = true;
      updatePuzzleProgress('games_number_guess', 100, true);
    } else if (newAttempts >= maxAttempts) {
      feedback = `Game Over! The number was ${target}`;
      isComplete = true;
    } else {
      feedback = guessNum < target ? 'Too low!' : 'Too high!';
    }

    setGameState((prev: NumberGuessState) => ({
      ...prev,
      attempts: newAttempts,
      guess: '',
      feedback,
    }));

    if (isComplete) {
      setTimeout(() => {
        onBackToMenu();
      }, 2000);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-white text-xl mb-4 text-center">
        {gameState.feedback}
      </Text>
      <Text className="text-gray-400 text-sm mb-4">
        Attempts: {gameState.attempts}/{gameState.maxAttempts}
      </Text>
      
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '1'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '2'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '3'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">3</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '4'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '5'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '6'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">6</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '7'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">7</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '8'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '9'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">9</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: prev.guess + '0'
            }));
          }}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            playSound('ui_button_tap');
            setGameState((prev: NumberGuessState) => ({
              ...prev,
              guess: ''
            }));
          }}
          className="bg-red-600 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">C</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={makeGuess}
          className="bg-green-600 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">✓</Text>
        </TouchableOpacity>
      </View>
      <Text className="text-white text-2xl mb-4">
        {gameState.guess || '0'}
      </Text>
    </View>
  );
} 
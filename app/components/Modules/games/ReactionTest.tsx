import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';

interface ReactionTestProps {
  onBackToMenu: () => void;
}

interface ReactionState {
  startTime: number | null;
  reactionTime: number | null;
  isWaiting: boolean;
  bestTime: number | null;
}

export default function ReactionTest({ onBackToMenu }: ReactionTestProps) {
  const { updatePuzzleProgress } = usePuzzle();
  const [gameState, setGameState] = useState<ReactionState>({
    startTime: null,
    reactionTime: null,
    isWaiting: false,
    bestTime: null,
  });

  const startTest = () => {
    playSound('ui_button_tap');
    const delay = Math.random() * 3000 + 1000; // 1-4 seconds
    
    setGameState(prev => ({
      ...prev,
      isWaiting: true,
      reactionTime: null,
    }));

    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        startTime: Date.now(),
        isWaiting: false,
      }));
    }, delay);
  };

  const handleReactionTap = () => {
    if (!gameState.startTime || gameState.isWaiting) return;

    playSound('ui_button_tap');
    const reactionTime = Date.now() - gameState.startTime;
    const newBestTime = gameState.bestTime === null || reactionTime < gameState.bestTime 
      ? reactionTime 
      : gameState.bestTime;

    setGameState(prev => ({
      ...prev,
      reactionTime,
      bestTime: newBestTime,
      startTime: null,
    }));

    if (reactionTime < 200) {
      updatePuzzleProgress('games_reaction', 100, true);
    }
  };

  const resetGame = () => {
    playSound('ui_button_tap');
    setGameState({
      startTime: null,
      reactionTime: null,
      isWaiting: false,
      bestTime: gameState.bestTime,
    });
  };

  return (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-white text-lg mb-4">
        Reaction Time Test
      </Text>
      
      {gameState.bestTime && (
        <Text className="text-green-400 text-sm mb-4">
          Best: {gameState.bestTime}ms
        </Text>
      )}
      
      {gameState.reactionTime && (
        <Text className="text-yellow-400 text-lg mb-4">
          Your time: {gameState.reactionTime}ms
        </Text>
      )}
      
      <TouchableOpacity
        onPress={gameState.isWaiting || gameState.startTime ? handleReactionTap : startTest}
        className={`w-48 h-48 rounded-full items-center justify-center ${
          gameState.isWaiting 
            ? 'bg-yellow-600' 
            : gameState.startTime 
            ? 'bg-green-600' 
            : 'bg-blue-600'
        }`}
      >
        <Text className="text-white text-xl text-center font-mono">
          {gameState.isWaiting 
            ? 'WAIT...' 
            : gameState.startTime 
            ? 'TAP NOW!' 
            : 'START TEST'
          }
        </Text>
      </TouchableOpacity>
      
      {gameState.reactionTime && (
        <TouchableOpacity
          onPress={resetGame}
          className="bg-gray-600 px-6 py-3 rounded-lg mt-6"
        >
          <Text className="text-white text-center font-mono">TRY AGAIN</Text>
        </TouchableOpacity>
      )}
    </View>
  );
} 
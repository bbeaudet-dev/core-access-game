import { useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import HomeButton from '../../ui/HomeButton';
import ModuleHeader from '../../ui/ModuleHeader';
import PhoneFrame from '../../ui/PhoneFrame';

interface GamesModuleProps {
  onGoHome: () => void;
}

type GameType = 'numberGuess' | 'memory' | 'reaction';

interface GameState {
  currentGame: GameType | null;
  numberGuess: {
    target: number;
    attempts: number;
    maxAttempts: number;
    guess: string;
    feedback: string;
  };
  memory: {
    sequence: number[];
    playerSequence: number[];
    level: number;
    showingSequence: boolean;
  };
  reaction: {
    startTime: number | null;
    reactionTime: number | null;
    isWaiting: boolean;
    bestTime: number | null;
  };
}

export default function GamesModule({ onGoHome }: GamesModuleProps) {
  const { updatePuzzleProgress } = usePuzzle();
  const [gameState, setGameState] = useState<GameState>({
    currentGame: null,
    numberGuess: {
      target: 0,
      attempts: 0,
      maxAttempts: 7,
      guess: '',
      feedback: '',
    },
    memory: {
      sequence: [],
      playerSequence: [],
      level: 1,
      showingSequence: false,
    },
    reaction: {
      startTime: null,
      reactionTime: null,
      isWaiting: false,
      bestTime: null,
    },
  });

  const startNumberGuess = () => {
    const target = Math.floor(Math.random() * 100) + 1;
    setGameState(prev => ({
      ...prev,
      currentGame: 'numberGuess',
      numberGuess: {
        target,
        attempts: 0,
        maxAttempts: 7,
        guess: '',
        feedback: 'Guess a number between 1 and 100!',
      },
    }));
  };

  const makeGuess = () => {
    const { target, attempts, maxAttempts, guess } = gameState.numberGuess;
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

    setGameState(prev => ({
      ...prev,
      numberGuess: {
        ...prev.numberGuess,
        attempts: newAttempts,
        guess: '',
        feedback,
      },
    }));

    if (isComplete) {
      setTimeout(() => {
        setGameState(prev => ({ ...prev, currentGame: null }));
      }, 2000);
    }
  };

  const startMemoryGame = () => {
    const sequence = Array.from({ length: 3 }, () => Math.floor(Math.random() * 4));
    setGameState(prev => ({
      ...prev,
      currentGame: 'memory',
      memory: {
        sequence,
        playerSequence: [],
        level: 1,
        showingSequence: true,
      },
    }));
    
    showSequence(sequence);
  };

  const showSequence = (sequence: number[], index = 0) => {
    if (index >= sequence.length) {
      setGameState(prev => ({
        ...prev,
        memory: { ...prev.memory, showingSequence: false },
      }));
      return;
    }

    setTimeout(() => {
      showSequence(sequence, index + 1);
    }, 1000);
  };

  const addToPlayerSequence = (number: number) => {
    if (gameState.memory.showingSequence) return;

    const newPlayerSequence = [...gameState.memory.playerSequence, number];
    setGameState(prev => ({
      ...prev,
      memory: { ...prev.memory, playerSequence: newPlayerSequence },
    }));

    // Check if sequence is correct so far
    const isCorrect = newPlayerSequence.every((num, i) => num === gameState.memory.sequence[i]);
    
    if (!isCorrect) {
      Alert.alert('Game Over', `You got ${newPlayerSequence.length - 1} correct!`);
      setGameState(prev => ({ ...prev, currentGame: null }));
      return;
    }

    if (newPlayerSequence.length === gameState.memory.sequence.length) {
      // Level complete
      const newLevel = gameState.memory.level + 1;
      const newSequence = Array.from({ length: 3 + newLevel }, () => Math.floor(Math.random() * 4));
      
      setGameState(prev => ({
        ...prev,
        memory: {
          sequence: newSequence,
          playerSequence: [],
          level: newLevel,
          showingSequence: true,
        },
      }));
      
      showSequence(newSequence);
      
      if (newLevel >= 5) {
        updatePuzzleProgress('games_memory', 100, true);
        Alert.alert('Congratulations!', 'You completed 5 levels!');
        setTimeout(() => {
          setGameState(prev => ({ ...prev, currentGame: null }));
        }, 2000);
      }
    }
  };

  const startReactionTest = () => {
    setGameState(prev => ({
      ...prev,
      currentGame: 'reaction',
      reaction: {
        startTime: null,
        reactionTime: null,
        isWaiting: true,
        bestTime: prev.reaction.bestTime,
      },
    }));

    // Random delay between 1-5 seconds
    const delay = Math.random() * 4000 + 1000;
    setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        reaction: {
          ...prev.reaction,
          startTime: Date.now(),
          isWaiting: false,
        },
      }));
    }, delay);
  };

  const handleReactionTap = () => {
    if (gameState.reaction.isWaiting || gameState.reaction.startTime === null) return;

    const reactionTime = Date.now() - gameState.reaction.startTime;
    const bestTime = gameState.reaction.bestTime === null || reactionTime < gameState.reaction.bestTime 
      ? reactionTime 
      : gameState.reaction.bestTime;

    setGameState(prev => ({
      ...prev,
      reaction: {
        ...prev.reaction,
        reactionTime,
        bestTime,
        isWaiting: false,
        startTime: null,
      },
    }));

    if (reactionTime < 200) {
      updatePuzzleProgress('games_reaction', 100, true);
    }
  };

  const resetGame = () => {
    setGameState(prev => ({ ...prev, currentGame: null }));
  };

  const renderNumberGuess = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-green-400 text-lg mb-4 text-center">
        {gameState.numberGuess.feedback}
      </Text>
      <Text className="text-gray-400 mb-4">
        Attempts: {gameState.numberGuess.attempts}/{gameState.numberGuess.maxAttempts}
      </Text>
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '1' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '2' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">2</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '3' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">3</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '4' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">4</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '5' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">5</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '6' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">6</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '7' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">7</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '8' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">8</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '9' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">9</Text>
        </TouchableOpacity>
      </View>
      <View className="flex-row mb-4">
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: prev.numberGuess.guess + '0' }
          }))}
          className="bg-gray-700 p-4 m-1 rounded"
        >
          <Text className="text-white text-xl">0</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setGameState(prev => ({
            ...prev,
            numberGuess: { ...prev.numberGuess, guess: '' }
          }))}
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
        {gameState.numberGuess.guess || '0'}
      </Text>
    </View>
  );

  const renderMemoryGame = () => (
    <View className="flex-1 justify-center items-center p-4">
      <Text className="text-blue-400 text-lg mb-4">
        Level {gameState.memory.level}
      </Text>
      {gameState.memory.showingSequence ? (
        <Text className="text-yellow-400 text-lg mb-4">
          Watch the sequence...
        </Text>
      ) : (
        <Text className="text-green-400 text-lg mb-4">
          Repeat the sequence!
        </Text>
      )}
      <View className="grid grid-cols-2 gap-4">
        {[0, 1, 2, 3].map(num => (
          <TouchableOpacity
            key={num}
            onPress={() => addToPlayerSequence(num)}
            disabled={gameState.memory.showingSequence}
            className={`w-20 h-20 rounded-lg items-center justify-center ${
              gameState.memory.showingSequence ? 'bg-gray-600' : 'bg-blue-600'
            }`}
          >
            <Text className="text-white text-2xl">{num}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderReactionTest = () => (
    <View className="flex-1 justify-center items-center p-4">
      <TouchableOpacity
        onPress={handleReactionTap}
        className={`w-48 h-48 rounded-full items-center justify-center ${
          gameState.reaction.isWaiting 
            ? 'bg-yellow-600' 
            : gameState.reaction.startTime 
              ? 'bg-green-600' 
              : 'bg-gray-600'
        }`}
      >
        <Text className="text-white text-xl text-center">
          {gameState.reaction.isWaiting 
            ? 'Wait for green...' 
            : gameState.reaction.startTime 
              ? 'TAP NOW!' 
              : 'Tap to start'}
        </Text>
      </TouchableOpacity>
      
      {gameState.reaction.reactionTime !== null && (
        <Text className="text-green-400 text-lg mt-4">
          Reaction time: {gameState.reaction.reactionTime}ms
        </Text>
      )}
      
      {gameState.reaction.bestTime !== null && (
        <Text className="text-blue-400 text-lg mt-2">
          Best time: {gameState.reaction.bestTime}ms
        </Text>
      )}
    </View>
  );

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <ModuleHeader name="GAMES" color="purple" />
        
        {gameState.currentGame ? (
          <View className="flex-1">
            {gameState.currentGame === 'numberGuess' && renderNumberGuess()}
            {gameState.currentGame === 'memory' && renderMemoryGame()}
            {gameState.currentGame === 'reaction' && renderReactionTest()}
            
            <TouchableOpacity
              onPress={resetGame}
              className="bg-gray-700 p-3 mx-4 mb-4 rounded-lg"
            >
              <Text className="text-white text-center">Back to Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-white text-xl mb-8 text-center">
              Choose a game to play
            </Text>
            
            <TouchableOpacity
              onPress={startNumberGuess}
              className="bg-blue-600 p-4 rounded-lg mb-4 w-full"
            >
              <Text className="text-white text-center text-lg">Number Guessing</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={startMemoryGame}
              className="bg-green-600 p-4 rounded-lg mb-4 w-full"
            >
              <Text className="text-white text-center text-lg">Memory Game</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={startReactionTest}
              className="bg-red-600 p-4 rounded-lg mb-4 w-full"
            >
              <Text className="text-white text-center text-lg">Reaction Test</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';
import { getModuleBackgroundImage } from '../../../utils/unlockSystem';
import ScreenTemplate from '../../ui/ScreenTemplate';
import MemoryGame from './MemoryGame';
import NumberGuessGame from './NumberGuessGame';
import ReactionTest from './ReactionTest';

interface GamesModuleProps {
  onGoHome: () => void;
}

type GameType = 'numberGuess' | 'memory' | 'reaction';

export default function GamesModule({ onGoHome }: GamesModuleProps) {
  const [currentGame, setCurrentGame] = useState<GameType | null>(null);
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState<Set<GameType>>(new Set());

  const { completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('games', completedPuzzles, false);

  // Check if puzzle is already completed
  if (completedPuzzles.includes('games_play') && !puzzleComplete) {
    setPuzzleComplete(true);
  }

  const handleGameSelect = (gameType: GameType) => {
    setCurrentGame(gameType);
    playSound('click');
  };

  const handleGameComplete = (gameType: GameType) => {
    const newGamesPlayed = new Set(gamesPlayed);
    newGamesPlayed.add(gameType);
    setGamesPlayed(newGamesPlayed);
    
    // Complete puzzle when any game is played
    if (!puzzleComplete) {
      setPuzzleComplete(true);
      completePuzzle('games_play');
      playSound('success');
    }
  };

  const handleBackToMenu = () => {
    setCurrentGame(null);
    playSound('click');
  };

  const renderGameMenu = () => (
    <View className="flex flex-col space-y-4">
      {/* Games Status */}
      <View className="bg-gray-900 p-6 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-4">GAMES STATUS</Text>
        <View className="flex flex-row items-center justify-center">
          <Text className="text-4xl mr-4">🎮</Text>
          <Text className="text-xl font-mono text-red-400">
            {gamesPlayed.size > 0 ? 'ACTIVE' : 'STANDBY'}
          </Text>
        </View>
        
        {/* Puzzle Status */}
        {puzzleComplete && (
          <View className="mt-4 p-3 bg-green-900 rounded-lg">
            <Text className="text-green-400 text-center font-mono text-sm">
              ✅ GAMING SYSTEMS ONLINE
            </Text>
          </View>
        )}
      </View>

      {/* Puzzle Instructions */}
      {!puzzleComplete && (
        <View className="bg-gray-900 p-6 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">PUZZLE INSTRUCTIONS</Text>
          <Text className="text-red-400 text-sm font-mono mb-2">
            Test gaming systems by playing any available game
          </Text>
        </View>
      )}

      {/* Game Selection */}
      <View className="bg-gray-900 p-6 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-4">SELECT GAME</Text>
        <View className="space-y-3">
          <TouchableOpacity
            onPress={() => handleGameSelect('numberGuess')}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <View className="flex flex-row items-center">
              <Text className="text-2xl mr-3">🔢</Text>
              <View className="flex-1">
                <Text className="text-white font-mono text-lg">Number Guess</Text>
                <Text className="text-gray-400 font-mono text-sm">
                  {gamesPlayed.has('numberGuess') ? '✅ Completed' : 'Guess the number'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleGameSelect('memory')}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <View className="flex flex-row items-center">
              <Text className="text-2xl mr-3">🧠</Text>
              <View className="flex-1">
                <Text className="text-white font-mono text-lg">Memory Game</Text>
                <Text className="text-gray-400 font-mono text-sm">
                  {gamesPlayed.has('memory') ? '✅ Completed' : 'Match the cards'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => handleGameSelect('reaction')}
            className="p-4 bg-gray-700 rounded-lg"
          >
            <View className="flex flex-row items-center">
              <Text className="text-2xl mr-3">⚡</Text>
              <View className="flex-1">
                <Text className="text-white font-mono text-lg">Reaction Test</Text>
                <Text className="text-gray-400 font-mono text-sm">
                  {gamesPlayed.has('reaction') ? '✅ Completed' : 'Test your reflexes'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  const renderCurrentGame = () => {
    switch (currentGame) {
      case 'numberGuess':
        return <NumberGuessGame onBackToMenu={handleBackToMenu} onComplete={() => handleGameComplete('numberGuess')} />;
      case 'memory':
        return <MemoryGame onBackToMenu={handleBackToMenu} onComplete={() => handleGameComplete('memory')} />;
      case 'reaction':
        return <ReactionTest onBackToMenu={handleBackToMenu} onComplete={() => handleGameComplete('reaction')} />;
      default:
        return null;
    }
  };

  return (
    <ScreenTemplate 
      title="GAMES" 
      titleColor="red" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
      {currentGame ? (
        <View className="flex flex-col space-y-4">
          {/* Game Header */}
          <View className="bg-gray-900 p-4 rounded-lg">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-gray-400 font-mono text-sm">
                Playing: {currentGame === 'numberGuess' ? 'Number Guess' : 
                         currentGame === 'memory' ? 'Memory Game' : 'Reaction Test'}
              </Text>
              <TouchableOpacity
                onPress={handleBackToMenu}
                className="px-3 py-1 bg-gray-700 rounded-lg"
              >
                <Text className="text-gray-300 font-mono text-sm">BACK</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Current Game */}
          {renderCurrentGame()}
        </View>
      ) : (
        renderGameMenu()
      )}
    </ScreenTemplate>
  );
} 
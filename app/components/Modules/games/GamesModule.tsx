import { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../../utils/soundManager';
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

  const startGame = (gameType: GameType) => {
    playSound('ui_button_tap');
    setCurrentGame(gameType);
  };

  const backToMenu = () => {
    playSound('ui_button_tap');
    setCurrentGame(null);
  };

  if (currentGame === 'numberGuess') {
    return <NumberGuessGame onBackToMenu={backToMenu} />;
  }

  if (currentGame === 'memory') {
    return <MemoryGame onBackToMenu={backToMenu} />;
  }

  if (currentGame === 'reaction') {
    return <ReactionTest onBackToMenu={backToMenu} />;
  }

  return (
    <ScreenTemplate title="GAMES" titleColor="purple" onGoHome={onGoHome}>
      <View className="flex-1 justify-center items-center p-4">
        <Text className="text-white text-2xl mb-8 text-center font-mono">
          GAME CENTER
        </Text>
        
        <View className="space-y-4 w-full max-w-sm">
          <TouchableOpacity
            onPress={() => startGame('numberGuess')}
            className="bg-blue-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-mono text-lg">
              NUMBER GUESS
            </Text>
            <Text className="text-blue-200 text-center text-sm mt-1">
              Guess the number in 7 attempts
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => startGame('memory')}
            className="bg-green-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-mono text-lg">
              MEMORY SEQUENCE
            </Text>
            <Text className="text-green-200 text-center text-sm mt-1">
              Remember and repeat the pattern
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            onPress={() => startGame('reaction')}
            className="bg-purple-600 p-4 rounded-lg"
          >
            <Text className="text-white text-center font-mono text-lg">
              REACTION TEST
            </Text>
            <Text className="text-purple-200 text-center text-sm mt-1">
              Test your reflexes
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScreenTemplate>
  );
} 
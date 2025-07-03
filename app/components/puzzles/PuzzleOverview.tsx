import { Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import { DEFAULT_PUZZLES, PUZZLE_TYPES } from './types';

interface PuzzleOverviewProps {
  onPuzzlePress?: (puzzleId: string) => void;
}

export default function PuzzleOverview({ onPuzzlePress }: PuzzleOverviewProps) {
  const { puzzleState, getCompletionPercentage } = usePuzzle();

  const getPuzzleIcon = (puzzleId: string) => {
    switch (puzzleId) {
      case PUZZLE_TYPES.BATTERY_CHARGE:
        return '🔋';
      case PUZZLE_TYPES.FLASHLIGHT_MORSE:
        return '🔦';
      case PUZZLE_TYPES.BAROMETER_BLOW:
        return '💨';
      case PUZZLE_TYPES.LOCATION_NAVIGATE:
        return '🗺️';
      case PUZZLE_TYPES.ACCELEROMETER_MOVEMENT:
        return '📱';
      case PUZZLE_TYPES.GYROSCOPE_ROTATION:
        return '🔄';
      case PUZZLE_TYPES.MICROPHONE_LEVEL:
        return '🎤';
      case PUZZLE_TYPES.COMPASS_ORIENTATION:
        return '🧭';
      default:
        return '❓';
    }
  };

  const getColorClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      green: 'text-green-400',
      yellow: 'text-yellow-400',
      blue: 'text-blue-400',
      purple: 'text-purple-400',
      red: 'text-red-400',
      orange: 'text-orange-400',
      pink: 'text-pink-400',
      cyan: 'text-cyan-400',
    };
    return colorMap[color] || 'text-gray-400';
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-400';
    if (progress >= 50) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <View className="bg-gray-900 p-6 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-4">SYSTEM RESTORATION PROGRESS</Text>
      
      {/* Overall Progress */}
      <View className="mb-6">
        <View className="flex flex-row justify-between items-center mb-2">
          <Text className="text-gray-300 font-mono">Overall Progress</Text>
          <Text className="text-gray-300 font-mono">{Math.round(getCompletionPercentage())}%</Text>
        </View>
        <View className="w-full bg-gray-800 rounded-full h-3">
          <View 
            className={`h-3 rounded-full ${getProgressColor(getCompletionPercentage())}`}
            style={{ width: `${getCompletionPercentage()}%` }}
          />
        </View>
      </View>

      {/* Puzzle List */}
      <View className="space-y-3">
        {Object.entries(DEFAULT_PUZZLES).map(([puzzleId, config]) => {
          const state = puzzleState[puzzleId];
          const isComplete = state?.isComplete || false;
          const progress = state?.progress || 0;
          
          return (
            <TouchableOpacity
              key={puzzleId}
              onPress={() => onPuzzlePress?.(puzzleId)}
              className={`p-4 rounded-lg border ${
                isComplete ? 'border-green-500 bg-green-900/20' : 'border-gray-700 bg-gray-800'
              }`}
              activeOpacity={0.7}
            >
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center flex-1">
                  <Text className="text-2xl mr-3">{getPuzzleIcon(puzzleId)}</Text>
                  <View className="flex-1">
                    <Text className={`font-mono text-sm ${getColorClass(config.color)}`}>
                      {config.name}
                    </Text>
                    <Text className="text-gray-400 text-xs font-mono">
                      {config.description}
                    </Text>
                  </View>
                </View>
                
                <View className="flex items-end">
                  <Text className={`text-xs font-mono ${isComplete ? 'text-green-400' : 'text-gray-500'}`}>
                    {isComplete ? 'COMPLETE' : `${Math.round(progress)}%`}
                  </Text>
                  {!isComplete && (
                    <View className="w-16 bg-gray-700 rounded-full h-1 mt-1">
                      <View 
                        className={`h-1 rounded-full ${getProgressColor(progress)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
} 
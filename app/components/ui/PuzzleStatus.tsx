import { Text, View } from 'react-native';

interface PuzzleStatusProps {
  title: string;
  description: string;
  isComplete: boolean;
  color?: string;
  showProgress?: boolean;
  progress?: number;
  progressMax?: number;
}

export default function PuzzleStatus({
  title,
  description,
  isComplete,
  color = 'green',
  showProgress = false,
  progress = 0,
  progressMax = 100
}: PuzzleStatusProps) {
  const getColorClass = (baseColor: string) => {
    return isComplete ? `text-${baseColor}-400` : 'text-red-400';
  };

  const getProgressColor = () => {
    const percentage = progress / progressMax;
    if (percentage >= 0.8) return 'bg-green-400';
    if (percentage >= 0.5) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  return (
    <View className="bg-gray-900 p-6 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">{title}</Text>
      <Text className="text-gray-300 font-mono text-center mb-2">
        {description}
      </Text>
      
      {showProgress && (
        <View className="w-full bg-gray-800 rounded-full h-3 mb-3">
          <View 
            className={`h-3 rounded-full ${getProgressColor()}`}
            style={{ width: `${Math.min((progress / progressMax) * 100, 100)}%` }}
          />
        </View>
      )}
      
      <Text className={`font-mono text-center ${getColorClass(color)}`}>
        {isComplete ? '✅ PUZZLE COMPLETE' : '❌ PUZZLE INCOMPLETE'}
      </Text>
    </View>
  );
} 
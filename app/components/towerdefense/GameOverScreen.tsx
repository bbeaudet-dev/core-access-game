import { Text, View } from 'react-native';

interface GameOverScreenProps {
  level: number;
}

export default function GameOverScreen({ level }: GameOverScreenProps) {
  return (
    <View className="flex-1 bg-black p-4 justify-center items-center">
      <Text className="text-red-400 text-2xl font-mono mb-4">
        {level === 1 ? 'LEVEL COMPLETE!' : 'CORE BREACHED!'}
      </Text>
      <Text className="text-gray-400 text-center font-mono mb-4">
        {level === 1 
          ? 'Level 2 will be much harder...' 
          : 'Emergency protocols activated'
        }
      </Text>
      {level === 2 && (
        <Text className="text-yellow-400 text-center font-mono">
          Initiating emergency boot sequence...
        </Text>
      )}
    </View>
  );
} 
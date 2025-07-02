import { Text, TouchableOpacity, View } from 'react-native';

interface GameControlsProps {
  wave: number;
  bugsCount: number;
  waveInProgress: boolean;
  level: number;
  onStartWave: () => void;
}

export default function GameControls({ 
  wave, 
  bugsCount, 
  waveInProgress, 
  level, 
  onStartWave 
}: GameControlsProps) {
  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <View className="flex-row justify-between items-center">
        <Text className="text-gray-400 text-sm font-mono">
          Wave {wave} • Bugs: {bugsCount}
        </Text>
        <TouchableOpacity
          className="bg-green-600 p-2 rounded-lg"
          onPress={onStartWave}
          disabled={waveInProgress}
        >
          <Text className="text-white text-center font-mono text-sm">
            {waveInProgress ? 'WAVE IN PROGRESS' : 'START WAVE'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text className="text-yellow-400 text-center font-mono text-xs mt-2">
        {level === 1 
          ? 'Defend the circuit board from bugs!' 
          : 'This level is much harder...'
        }
      </Text>
    </View>
  );
} 
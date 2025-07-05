import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../../utils/soundManager';

interface AccelerometerControlsProps {
  subscription: any;
  onToggleAccelerometer: () => void;
  onResetMaxAcceleration: () => void;
  unitType: string;
  onToggleUnit: () => void;
}

export default function AccelerometerControls({ 
  subscription, 
  onToggleAccelerometer, 
  onResetMaxAcceleration,
  unitType,
  onToggleUnit
}: AccelerometerControlsProps) {
  const handleToggle = () => {
    playSound('ui_button_tap');
    onToggleAccelerometer();
  };

  const handleReset = () => {
    playSound('ui_button_tap');
    onResetMaxAcceleration();
  };

  const handleUnitToggle = () => {
    playSound('ui_button_tap');
    onToggleUnit();
  };

  return (
    <View className="space-y-3">
      <View className="flex flex-row justify-between space-x-2">
        <TouchableOpacity
          onPress={handleToggle}
          className={`p-3 rounded-lg flex-1 ${subscription ? 'bg-red-600' : 'bg-green-600'}`}
        >
          <Text className="text-white text-center font-mono">
            {subscription ? 'STOP' : 'START'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleReset}
          className="bg-gray-700 p-3 rounded-lg flex-1"
        >
          <Text className="text-white text-center font-mono">RESET</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleUnitToggle}
          className="bg-purple-600 p-3 rounded-lg flex-1"
        >
          <Text className="text-white text-center font-mono">{unitType}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 
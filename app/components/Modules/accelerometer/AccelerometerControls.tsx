import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../../utils/soundManager';

interface AccelerometerControlsProps {
  subscription: any;
  onToggleAccelerometer: () => void;
  onResetMaxAcceleration: () => void;
}

export default function AccelerometerControls({ 
  subscription, 
  onToggleAccelerometer, 
  onResetMaxAcceleration 
}: AccelerometerControlsProps) {
  const handleToggle = () => {
    playSound('ui_button_tap');
    onToggleAccelerometer();
  };

  const handleReset = () => {
    playSound('ui_button_tap');
    onResetMaxAcceleration();
  };

  return (
    <View className="space-y-3 flex flex-row justify-between">
      <TouchableOpacity
        onPress={handleToggle}
        className={`p-3 rounded-lg flex-1 mr-2 ${subscription ? 'bg-red-600' : 'bg-green-600'}`}
      >
        <Text className="text-white text-center font-mono">
          {subscription ? 'STOP' : 'START'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleReset}
        className="bg-gray-700 p-3 rounded-lg flex-1 ml-2"
      >
        <Text className="text-white text-center font-mono">RESET</Text>
      </TouchableOpacity>
    </View>
  );
} 
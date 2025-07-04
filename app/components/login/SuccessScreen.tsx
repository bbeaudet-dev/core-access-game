import { useEffect } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../utils/soundManager';

interface SuccessScreenProps {
  type: 'signup' | 'signin' | 'guest';
  guestUsername?: string;
  onContinue: () => void;
}

export default function SuccessScreen({ type, guestUsername, onContinue }: SuccessScreenProps) {
  useEffect(() => {
    // Play success sound when component mounts
    playSound('ui_login_success');
  }, []);

  const getTitle = () => {
    switch (type) {
      case 'signup':
        return 'Successfully signed up!';
      case 'signin':
        return 'Successfully signed in!';
      case 'guest':
        return `Welcome, ${guestUsername}!`;
    }
  };

  const getSubtitle = () => {
    if (type === 'guest') {
      return 'Guest mode - progress will not be saved';
    }
    return null;
  };

  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <Text className="text-green-400 text-2xl mb-4">{getTitle()}</Text>
      {getSubtitle() && (
        <Text className="text-gray-400 text-center mb-6">{getSubtitle()}</Text>
      )}
      <TouchableOpacity
        className="bg-green-600 p-4 rounded-lg"
        onPress={onContinue}
      >
        <Text className="text-white font-bold">Continue to Game</Text>
      </TouchableOpacity>
    </View>
  );
} 
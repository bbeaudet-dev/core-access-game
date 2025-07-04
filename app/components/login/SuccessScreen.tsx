import { Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../utils/soundManager';
import AnimatedBackground from '../ui/AnimatedBackground';

interface SuccessScreenProps {
  type: 'signup' | 'signin' | 'guest';
  guestUsername?: string;
  onContinue: () => void;
}

export default function SuccessScreen({ type, guestUsername, onContinue }: SuccessScreenProps) {
  const handleContinue = () => {
    playSound('ui_login_success');
    onContinue();
  };

  const getTitle = () => {
    switch (type) {
      case 'signup':
        return 'ACCOUNT_CREATED';
      case 'signin':
        return 'ACCESS_GRANTED';
      case 'guest':
        return 'GUEST_ACCESS';
      default:
        return 'SUCCESS';
    }
  };

  const getMessage = () => {
    switch (type) {
      case 'signup':
        return 'Your account has been successfully created. Welcome to the system.';
      case 'signin':
        return 'Authentication successful. Access granted to all MODULES.';
      case 'guest':
        return `Welcome, ${guestUsername}. You are now in guest mode with limited access.`;
      default:
        return 'Operation completed successfully.';
    }
  };

  return (
    <AnimatedBackground 
      source={require('../../../assets/animations/red_eye_anim2.mp4')}
      opacity={1.0}
      isVideo={true}
      shouldLoop={true}
      shouldPlay={true}
    >
      <View className="flex-1 justify-center items-center px-8">
        <View className="bg-black/80 p-8 rounded-lg border border-red-500">
          <Text className="text-3xl font-bold text-red-500 text-center mb-4">
            {getTitle()}
          </Text>
          
          <Text className="text-white text-center mb-8 leading-6">
            {getMessage()}
          </Text>
          
          <TouchableOpacity
            className="bg-red-600 py-3 px-6 rounded-lg"
            onPress={handleContinue}
          >
            <Text className="text-white font-bold text-center">
              CONTINUE
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </AnimatedBackground>
  );
} 
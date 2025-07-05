import { useEffect, useRef, useState } from 'react';
import { Animated, Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../utils/soundManager';
import BugAnimation from '../infection/BugAnimation';
import AnimatedBackground from '../ui/AnimatedBackground';

interface WelcomeGameScreenProps {
  type: 'signup' | 'signin' | 'guest';
  guestUsername?: string;
  onDownload: () => void;
}

export default function WelcomeGameScreen({ type, guestUsername, onDownload }: WelcomeGameScreenProps) {
  const [showBugAnimation, setShowBugAnimation] = useState(false);
  const buttonRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const textPulseAnim = useRef(new Animated.Value(1)).current;
  // Pulsing animation for the button
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
    return () => pulse.stop();
  }, []);

  // More intense pulsing animation for the text
  useEffect(() => {
    const textPulse = Animated.loop(
      Animated.sequence([
        Animated.timing(textPulseAnim, {
          toValue: 1.3,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(textPulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    textPulse.start();
    return () => textPulse.stop();
  }, []);





  const handleDownload = () => {
    playSound('ui_app_launch');
    // Cut straight to infection sequence
    setShowBugAnimation(true);
  };

  const handleBugAnimationComplete = () => {
    setShowBugAnimation(false);
    onDownload();
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
        return `Welcome, ${guestUsername}.`;
      default:
        return 'Operation completed successfully.';
    }
  };

  return (
    <AnimatedBackground 
      source={require('../../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg')}
      opacity={1.0}
      isVideo={false}
      shouldLoop={false}
      shouldPlay={false}
      resizeMode="cover"
    >
      <View className="flex-1 px-10 justify-center">
        {/* Welcome Section */}
        <View className="items-center mb-12">
          <View className="bg-black/80 py-6 px-8 rounded-lg border border-green-400">
            <Text className="text-3xl font-bold text-green-400 text-center mb-3">
              {getTitle()}
            </Text>
            
            <Text className="text-white text-center leading-6">
              {getMessage()}
            </Text>
          </View>
        </View>

        {/* Game Menu Section */}
        <View className="items-center">
          <View className="items-center mb-8">
            <Text style={{ fontFamily: 'OCR-A' }} className="text-4xl font-bold text-green-400 mb-2 pt-10">CORE DEFENDER</Text>
            <Text className="text-lg text-gray-400">Defend the Digital Realm</Text>
          </View>
          
          <View className="items-center mb-8">
            <Text className="text-center text-gray-300 mb-6 leading-6">
              Experience the ultimate tower defense game! 
              Build powerful defenses and protect your digital core from waves of malicious invaders.
            </Text>
            
            <Animated.View style={{ transform: [{ scale: pulseAnim }], position: 'relative' }}>
            <TouchableOpacity 
              className="bg-green-600 px-8 py-4 rounded-lg mb-6" 
              onPress={handleDownload}
              disabled={showBugAnimation}
            >
                <Animated.View style={{ transform: [{ scale: textPulseAnim }] }}>
                  <Text className="text-white font-bold text-xl text-center">DOWNLOAD NOW</Text>
                </Animated.View>
                <Text className="text-white text-sm text-center mt-1">
                  Free • 4.8★ • 10M+ Downloads
                </Text>
            </TouchableOpacity>
            </Animated.View>
            
            <View className="items-center">
              <Text className="text-gray-400 mb-2">🎮 50+ Levels</Text>
              <Text className="text-gray-400 mb-2">⚡ Real-time Strategy</Text>
              <Text className="text-gray-400 mb-2">🏆 Global Leaderboards</Text>
              <Text className="text-gray-400 mb-2">🎨 Stunning Graphics</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Bug Animation Overlay */}
      {showBugAnimation && (
        <BugAnimation 
          onComplete={handleBugAnimationComplete} 
        />
      )}
    </AnimatedBackground>
  );
} 
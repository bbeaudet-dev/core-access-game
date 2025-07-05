import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import AnimatedBackground from '../ui/AnimatedBackground';
import GlitchText from '../ui/GlitchText';
import LoginForm from './LoginForm';

interface LoginScreenProps {
  onLoginSuccess: (type: 'signup' | 'signin' | 'guest', username?: string) => void;
}

// Words related to the game - tower defense, cybersecurity, hacking, etc.
const GAME_WORDS = [
  { word: 'ACCESS', color: '#10B981' }, // green
  { word: 'BREACHED', color: '#EF4444' }, // red
  { word: 'DEFENSE', color: '#8B5CF6' }, // purple
  { word: 'FIREWALL', color: '#F59E0B' }, // amber
  { word: 'HACKED', color: '#EF4444' }, // red
  { word: 'INFECTED', color: '#EF4444' }, // red
  { word: 'LOCKDOWN', color: '#F59E0B' }, // amber
  { word: 'QUARANTINED', color: '#06B6D4' }, // cyan
  { word: 'SECURE', color: '#10B981' }, // green
  { word: 'SYSTEM', color: '#8B5CF6' }, // purple
  { word: 'TERMINAL', color: '#8B5CF6' }, // purple
  { word: 'VIRUS', color: '#EF4444' }, // red
  { word: 'VAULT', color: '#8B5CF6' }, // purple
  { word: 'ZEROED', color: '#06B6D4' }, // cyan
  { word: 'NEUTRALIZED', color: '#06B6D4' }, // cyan
  { word: 'CONTAINED', color: '#06B6D4' }, // cyan
  { word: 'DEACTIVATED', color: '#F59E0B' }, // amber
  { word: 'DELETED', color: '#EF4444' }, // red
  { word: 'DISABLED', color: '#F59E0B' }, // amber
];

// Generate random guest username
const generateGuestUsername = () => {
  const prefixes = ['USER', 'AGENT', 'OPERATOR', 'SYSTEM', 'CORE'];
  const suffixes = ['001', '007', '1337', '404', '777', '999'];
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
  return `${prefix}_${suffix}`;
};

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [welcomeType, setWelcomeType] = useState<'signup' | 'signin' | 'guest'>('signin');
  
  // Animation states
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(1)).current;
  const verticalAnim = useRef(new Animated.Value(0)).current;
  
  const { signIn, signUp, isLoading, completeAuth, guestSignIn } = useAuth();

  // Word cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % GAME_WORDS.length);
      triggerGlitchEffect();
    }, 2000); // Slower cycling for better performance

    return () => clearInterval(interval);
  }, []);

  const triggerGlitchEffect = () => {
    setIsGlitching(true);
    
    // Simplified glitch animation for better performance
    Animated.sequence([
      Animated.timing(glitchAnim, {
        toValue: 1,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(glitchAnim, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsGlitching(false);
    });
  };

  const handleSubmit = async () => {
    setError('');
    if (!email || !password || (isSignUp && !name)) {
      setError('Please fill in all fields');
      return;
    }
    try {
      if (isSignUp) {
        await signUp(email, password, name);
        setWelcomeType('signup');
        setWelcomeMessage(`Welcome, ${name}! Your account has been successfully created.`);
        setShowWelcome(true);
        setTimeout(() => {
        onLoginSuccess('signup');
        }, 3000);
      } else {
        await signIn(email, password);
        setWelcomeType('signin');
        setWelcomeMessage(`Welcome back! Authentication successful.`);
        setShowWelcome(true);
        setTimeout(() => {
        onLoginSuccess('signin');
        }, 3000);
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    }
  };

  const handleGuestMode = () => {
    const username = generateGuestUsername();
    setWelcomeType('guest');
    setWelcomeMessage(`Welcome, ${username}! You are now in guest mode.`);
    setShowWelcome(true);
    setTimeout(() => {
    onLoginSuccess('guest', username);
    }, 3000);
  };

  const handleEmailChange = (text: string) => {
    setEmail(text);
    setError('');
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    setError('');
  };

  const handleNameChange = (text: string) => {
    setName(text);
    setError('');
  };

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1, 
            justifyContent: 'center', 
            alignItems: 'center', 
            paddingHorizontal: 50,
            paddingTop: 20
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: 20 }}>
            <View style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.8,
              shadowRadius: 8,
              elevation: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <GlitchText 
                text="CORE_DEFENDER"
                fontSize={32}
                width={300}
                height={80}
                animationSpeed={100}
                animationInterval={3000}
                primaryColor="#E5484D"
                secondaryColor="#12A594"
                baseColor="white"
                opacity={0.9}
                textAlign="center"
              />
            </View>
          </View>
          
          {showWelcome ? (
            <View className="bg-black/80 py-6 px-8 rounded-lg border border-green-400 mb-8">
              <Text className="text-3xl font-bold text-green-400 text-center mb-3">
                {welcomeType === 'signup' ? 'ACCOUNT_CREATED' : 
                 welcomeType === 'signin' ? 'ACCESS_GRANTED' : 'GUEST_ACCESS'}
              </Text>
              <Text className="text-white text-center leading-6">
                {welcomeMessage}
              </Text>
            </View>
          ) : (
          <LoginForm
            email={email}
            password={password}
            name={name}
            isSignUp={isSignUp}
            isLoading={isLoading}
            error={error}
            onEmailChange={handleEmailChange}
            onPasswordChange={handlePasswordChange}
            onNameChange={handleNameChange}
            onSubmit={handleSubmit}
            onToggleMode={handleToggleMode}
            onGuestMode={handleGuestMode}
          />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </AnimatedBackground>
  );
} 

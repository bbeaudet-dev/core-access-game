import { useEffect, useRef, useState } from 'react';
import { Animated, KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import GlitchText from '../ui/GlitchText';
import GuestMode from './GuestMode';
import LoginForm from './LoginForm';
import SuccessScreen from './SuccessScreen';

interface LoginScreenProps {
  onLoginSuccess: () => void;
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
  const [success, setSuccess] = useState<'none' | 'signup' | 'signin' | 'guest'>('none');
  const [guestUsername, setGuestUsername] = useState('');
  
  // Animation states
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const glitchAnim = useRef(new Animated.Value(0)).current;
  const textAnim = useRef(new Animated.Value(1)).current;
  const verticalAnim = useRef(new Animated.Value(0)).current;
  
  const { signIn, signUp, isLoading, completeAuth } = useAuth();

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
        setSuccess('signup');
      } else {
        await signIn(email, password);
        setSuccess('signin');
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    }
  };

  const handleGuestMode = () => {
    const username = generateGuestUsername();
    setGuestUsername(username);
    setSuccess('guest');
  };

  const handleContinue = () => {
    if (success === 'guest') {
      // For guest mode, we need to set authentication state
      completeAuth();
      onLoginSuccess();
    } else {
      completeAuth();
      onLoginSuccess();
    }
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

  if (success !== 'none') {
    return (
      <SuccessScreen
        type={success}
        guestUsername={guestUsername}
        onContinue={handleContinue}
      />
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'black' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={{ 
          flexGrow: 1, 
          justifyContent: 'center', 
          alignItems: 'center', 
          paddingHorizontal: 24,
          paddingTop: 50
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ marginBottom: 40 }}>
          <GlitchText 
            text="CORE_ACCESS"
            fontSize={32}
            width={400}
            height={200}
            animationSpeed={100}
            animationInterval={1800}
            primaryColor="#E5484D"
            secondaryColor="#12A594"
            baseColor="white"
            opacity={0.9}
          />
        </View>
        
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
        />

        <GuestMode onGuestMode={handleGuestMode} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 

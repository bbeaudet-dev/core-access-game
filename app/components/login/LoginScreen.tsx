import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';

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

  if (success === 'signup') {
    return (
      <View className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-green-400 text-2xl mb-4">Successfully signed up!</Text>
        <TouchableOpacity
          className="bg-green-600 p-4 rounded-lg"
          onPress={handleContinue}
        >
          <Text className="text-white font-bold">Continue to Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (success === 'signin') {
    return (
      <View className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-green-400 text-2xl mb-4">Successfully signed in!</Text>
        <TouchableOpacity
          className="bg-green-600 p-4 rounded-lg"
          onPress={handleContinue}
        >
          <Text className="text-white font-bold">Continue to Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (success === 'guest') {
    return (
      <View className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-green-400 text-2xl mb-4">Welcome, {guestUsername}!</Text>
        <Text className="text-gray-400 text-center mb-6">Guest mode - progress will not be saved</Text>
        <TouchableOpacity
          className="bg-green-600 p-4 rounded-lg"
          onPress={handleContinue}
        >
          <Text className="text-white font-bold">Continue to Game</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: 'black' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="w-full max-w-sm">
          {/* Animated Title */}
          <View className="mb-8">
            <Animated.Text 
              className="text-4xl font-bold text-center"
              style={{
                fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
                transform: [
                  {
                    translateX: glitchAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, Math.random() * 4 - 2],
                    }),
                  },
                ],
                opacity: glitchAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [1, 0.8],
                }),
              }}
            >
              <Text style={{ color: GAME_WORDS[currentWordIndex].color }}>CORE_</Text>
              <Text style={{ color: GAME_WORDS[currentWordIndex].color }}>
                {GAME_WORDS[currentWordIndex].word}
          </Text>
            </Animated.Text>
          </View>

          <Text className="text-lg text-gray-400 text-center mb-8">
            {isSignUp ? 'Create Account' : 'Sign In'}
          </Text>

          {error ? (
            <Text className="text-red-400 text-center mb-4 px-4">
              {error}
            </Text>
          ) : null}

          {isSignUp && (
            <TextInput
              className="w-full bg-gray-800 text-white p-4 rounded-lg mb-4 border border-gray-600"
              placeholder="Name (optional)"
              placeholderTextColor="#666"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setError('');
              }}
              returnKeyType="next"
            />
          )}

          <TextInput
            className="w-full bg-gray-800 text-white p-4 rounded-lg mb-4 border border-gray-600"
            placeholder="Email"
            placeholderTextColor="#666"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError('');
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            returnKeyType="next"
          />

          <TextInput
            className="w-full bg-gray-800 text-white p-4 rounded-lg mb-6 border border-gray-600"
            placeholder="Password"
            placeholderTextColor="#666"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setError('');
            }}
            secureTextEntry
            returnKeyType="done"
          />

          <TouchableOpacity
            className={`w-full p-4 rounded-lg mb-4 ${
              isLoading ? 'bg-gray-600' : 'bg-green-600'
            }`}
            onPress={handleSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-bold text-center">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="w-full p-4"
            onPress={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
          >
            <Text className="text-gray-400 text-center">
              {isSignUp 
                ? 'Already have an account? Sign In' 
                : "Don't have an account? Sign Up"
              }
            </Text>
          </TouchableOpacity>

          {/* Guest Mode Button */}
          <View className="mt-6 pt-6 border-t border-gray-700">
            <TouchableOpacity
              className="w-full p-4 rounded-lg bg-gray-700"
              onPress={handleGuestMode}
            >
              <Text className="text-gray-300 text-center font-bold">
                Continue as Guest
              </Text>
            </TouchableOpacity>
            <Text className="text-gray-500 text-center text-sm mt-2">
              No account required - progress not saved
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 

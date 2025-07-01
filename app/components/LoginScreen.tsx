import { useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState<'none' | 'signup' | 'signin'>('none');
  
  const { signIn, signUp, isLoading, completeAuth } = useAuth();

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

  if (success === 'signup') {
    return (
      <View className="flex-1 bg-black justify-center items-center px-6">
        <Text className="text-green-400 text-2xl mb-4">Successfully signed up!</Text>
        <TouchableOpacity
          className="bg-green-600 p-4 rounded-lg"
          onPress={() => { completeAuth(); onLoginSuccess(); }}
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
          onPress={() => { completeAuth(); onLoginSuccess(); }}
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
          <Text className="text-3xl font-bold text-green-400 text-center mb-8">
            CORE ACCESS
          </Text>
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
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
} 
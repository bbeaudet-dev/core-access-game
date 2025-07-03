import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface LoginFormProps {
  email: string;
  password: string;
  name: string;
  isSignUp: boolean;
  isLoading: boolean;
  error: string;
  onEmailChange: (text: string) => void;
  onPasswordChange: (text: string) => void;
  onNameChange: (text: string) => void;
  onSubmit: () => void;
  onToggleMode: () => void;
}

export default function LoginForm({
  email,
  password,
  name,
  isSignUp,
  isLoading,
  error,
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onSubmit,
  onToggleMode
}: LoginFormProps) {
  return (
    <View className="w-full max-w-sm">
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
          onChangeText={onNameChange}
          returnKeyType="next"
        />
      )}

      <TextInput
        className="w-full bg-gray-800 text-white p-4 rounded-lg mb-4 border border-gray-600"
        placeholder="Email"
        placeholderTextColor="#666"
        value={email}
        onChangeText={onEmailChange}
        keyboardType="email-address"
        autoCapitalize="none"
        returnKeyType="next"
      />

      <TextInput
        className="w-full bg-gray-800 text-white p-4 rounded-lg mb-6 border border-gray-600"
        placeholder="Password"
        placeholderTextColor="#666"
        value={password}
        onChangeText={onPasswordChange}
        secureTextEntry
        returnKeyType="done"
      />

      <TouchableOpacity
        className={`w-full p-4 rounded-lg mb-4 ${
          isLoading ? 'bg-gray-600' : 'bg-green-600'
        }`}
        onPress={onSubmit}
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
        onPress={onToggleMode}
      >
        <Text className="text-gray-400 text-center">
          {isSignUp 
            ? 'Already have an account? Sign In' 
            : "Don't have an account? Sign Up"
          }
        </Text>
      </TouchableOpacity>
    </View>
  );
} 
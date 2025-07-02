import { useState } from 'react'
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native'

interface AuthFormProps {
  onSubmit: (email: string, password: string, name?: string) => Promise<void>
  isLoading: boolean
  error: string
  onErrorChange: (error: string) => void
  isSignUp: boolean
  onToggleMode: () => void
}

export default function AuthForm({ 
  onSubmit, 
  isLoading, 
  error, 
  onErrorChange, 
  isSignUp, 
  onToggleMode 
}: AuthFormProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')

  const handleSubmit = async () => {
    if (!email || !password || (isSignUp && !name)) {
      onErrorChange('Please fill in all fields')
      return
    }
    await onSubmit(email, password, isSignUp ? name : undefined)
  }

  const clearError = () => onErrorChange('')

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
          onChangeText={(text) => {
            setName(text)
            clearError()
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
          setEmail(text)
          clearError()
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
          setPassword(text)
          clearError()
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
  )
} 
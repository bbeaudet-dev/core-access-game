import { useState } from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import { useAuth } from '../../contexts/AuthContext'
import AnimatedTitle from './AnimatedTitle'
import AuthForm from './AuthForm'
import GuestModeButton from './GuestModeButton'
import SuccessScreen from './SuccessScreen'

interface LoginScreenProps {
  onLoginSuccess: () => void
}



// Generate random guest username
const generateGuestUsername = () => {
  const prefixes = ['USER', 'AGENT', 'OPERATOR', 'SYSTEM', 'CORE']
  const suffixes = ['001', '007', '1337', '404', '777', '999']
  const prefix = prefixes[Math.floor(Math.random() * prefixes.length)]
  const suffix = suffixes[Math.floor(Math.random() * suffixes.length)]
  return `${prefix}_${suffix}`
}

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isSignUp, setIsSignUp] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState<'none' | 'signup' | 'signin' | 'guest'>('none')
  const [guestUsername, setGuestUsername] = useState('')
  
  const { signIn, signUp, isLoading, completeAuth } = useAuth()

  const handleSubmit = async (email: string, password: string, name?: string) => {
    setError('')
    try {
      if (isSignUp) {
        await signUp(email, password, name || '')
        setSuccess('signup')
      } else {
        await signIn(email, password)
        setSuccess('signin')
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Authentication failed. Please try again.')
    }
  }

  const handleGuestMode = () => {
    const username = generateGuestUsername()
    setGuestUsername(username)
    setSuccess('guest')
  }

  const handleContinue = () => {
    completeAuth()
    onLoginSuccess()
  }

  const handleToggleMode = () => {
    setIsSignUp(!isSignUp)
    setError('')
  }

  // Show success screen if authentication was successful
  if (success !== 'none') {
    return (
      <SuccessScreen
        type={success}
        guestUsername={guestUsername}
        onContinue={handleContinue}
      />
    )
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
            <AnimatedTitle />
          </View>

          {/* Auth Form */}
          <AuthForm
            onSubmit={handleSubmit}
            isLoading={isLoading}
            error={error}
            onErrorChange={setError}
            isSignUp={isSignUp}
            onToggleMode={handleToggleMode}
          />

          {/* Guest Mode Button */}
          <GuestModeButton onPress={handleGuestMode} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
} 

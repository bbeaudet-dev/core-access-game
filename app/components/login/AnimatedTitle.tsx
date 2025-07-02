import { useEffect, useRef, useState } from 'react'
import { Animated, Platform, Text } from 'react-native'

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
]

interface AnimatedTitleProps {
  className?: string
}

export default function AnimatedTitle({ className = "text-4xl font-bold text-center" }: AnimatedTitleProps) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isGlitching, setIsGlitching] = useState(false)
  const glitchAnim = useRef(new Animated.Value(0)).current

  // Word cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % GAME_WORDS.length)
      triggerGlitchEffect()
    }, 2000) // Slower cycling for better performance

    return () => clearInterval(interval)
  }, [])

  const triggerGlitchEffect = () => {
    setIsGlitching(true)
    
    // Title glitch animation
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
      setIsGlitching(false)
    })
  }

  return (
    <Animated.Text 
      className={className}
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
  )
} 
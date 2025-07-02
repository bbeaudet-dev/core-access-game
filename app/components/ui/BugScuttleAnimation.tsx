import { useEffect, useRef } from 'react'
import { Animated, Dimensions, View } from 'react-native'
import Svg, { Circle, Path } from 'react-native-svg'

interface BugScuttleAnimationProps {
  visible: boolean
  onComplete: () => void
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window')

export default function BugScuttleAnimation({ visible, onComplete }: BugScuttleAnimationProps) {
  const bugPosition = useRef(new Animated.ValueXY({ x: screenWidth / 2, y: screenHeight / 2 })).current
  const bugScale = useRef(new Animated.Value(0)).current
  const bugOpacity = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Start animation
      bugScale.setValue(0)
      bugOpacity.setValue(0)
      bugPosition.setValue({ x: screenWidth / 2, y: screenHeight / 2 })
      Animated.sequence([
        Animated.parallel([
          Animated.timing(bugScale, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(bugOpacity, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
        ]),

        // Scuttle to the right edge
        Animated.timing(bugPosition, {
          toValue: { x: screenWidth + 50, y: screenHeight / 2 },
          duration: 2000,
          useNativeDriver: true,
        }),
        
        // Fade out
        Animated.timing(bugOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        onComplete()
      })
    }
  }, [visible])

  if (!visible) return null

  // FIXME: Bug scuttle animation is not working as expected
  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, pointerEvents: 'none', zIndex: 50 }}>
      <Animated.View
        style={{
          position: 'absolute',
          transform: [
            { translateX: bugPosition.x },
            { translateY: bugPosition.y },
            { scale: bugScale },
          ],
          opacity: bugOpacity,
        }}
      >
        <Svg width="40" height="40" viewBox="0 0 40 40">
          {/* Bug body */}
          <Circle cx="20" cy="20" r="8" fill="#ff0000" stroke="#ff6666" strokeWidth="1" />
          
          {/* Bug legs */}
          <Path d="M 12 16 L 8 12" stroke="#ff6666" strokeWidth="2" />
          <Path d="M 28 16 L 32 12" stroke="#ff6666" strokeWidth="2" />
          <Path d="M 12 24 L 8 28" stroke="#ff6666" strokeWidth="2" />
          <Path d="M 28 24 L 32 28" stroke="#ff6666" strokeWidth="2" />
          
          {/* Bug antennae */}
          <Path d="M 16 14 L 14 10" stroke="#ff6666" strokeWidth="1" />
          <Path d="M 24 14 L 26 10" stroke="#ff6666" strokeWidth="1" />
          
          {/* Bug eyes */}
          <Circle cx="17" cy="18" r="1.5" fill="#ffffff" />
          <Circle cx="23" cy="18" r="1.5" fill="#ffffff" />
        </Svg>
      </Animated.View>
    </View>
  )
} 
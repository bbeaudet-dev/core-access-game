import { Gyroscope } from 'expo-sensors'
import { useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import { useHints } from '../../contexts/HintContext'
import { useModuleUnlock } from '../../contexts/ModuleUnlockContext'
import HomeButton from '../ui/HomeButton'
import ModuleHeader from '../ui/ModuleHeader'
import PhoneFrame from '../ui/PhoneFrame'
import GyroControls from './GyroControls'
import SpeedDisplay from './SpeedDisplay'
import SpeedPlot from './SpeedPlot'

interface GyroModuleProps {
  onGoHome: () => void
}

export default function GyroModule({ onGoHome }: GyroModuleProps) {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 })
  const [currentSpeed, setCurrentSpeed] = useState(0)
  const [maxSpeed, setMaxSpeed] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)
  const [isAvailable, setIsAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUnlocked, setIsUnlocked] = useState(false)
  const [speedHistory, setSpeedHistory] = useState<number[]>([]) // For sparkline

  const { checkGyroAchievement } = useHints()
  const { unlockModule } = useModuleUnlock()

  // Speed threshold to unlock (in degrees/second)
  const UNLOCK_THRESHOLD = 50
  // Sparkline settings
  const HISTORY_LENGTH = 200 // 20 seconds at 10Hz

  useEffect(() => {
    checkGyroscopeAvailability()
    return () => _unsubscribe()
  }, [])

  const checkGyroscopeAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web doesn't have gyroscope
        setIsAvailable(false)
        setError('Gyroscope not available on web')
        return
      }

      const isAvailable = await Gyroscope.isAvailableAsync()
      setIsAvailable(isAvailable)
      
      if (!isAvailable) {
        setError('Gyroscope not available on this device')
      }
    } catch (err) {
      setIsAvailable(false)
      setError('Failed to check gyroscope availability')
    }
  }

  const _subscribe = () => {
    if (!isAvailable) return

    setSubscription(
      Gyroscope.addListener((data) => {
        setGyroscopeData(data)
        
        // Calculate speed magnitude (degrees/second)
        const speed = Math.sqrt(
          data.x * data.x + 
          data.y * data.y + 
          data.z * data.z
        )
        setCurrentSpeed(speed)
        setSpeedHistory(prev => {
          const next = [...prev, speed]
          // Keep only the last HISTORY_LENGTH samples
          return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next
        })
        // Update max speed if current speed is higher
        setMaxSpeed(prevMax => {
          if (speed > prevMax) {
            // Check if we should unlock
            if (speed >= UNLOCK_THRESHOLD && !isUnlocked) {
              setIsUnlocked(true)
              unlockModule('compass') // Unlock the next module
            }
            return speed
          }
          return prevMax
        })
      })
    )
    Gyroscope.setUpdateInterval(100) // 10Hz
  }

  const _unsubscribe = () => {
    subscription && subscription.remove()
    setSubscription(null)
  }

  const toggleGyroscope = () => {
    if (subscription) {
      _unsubscribe()
    } else {
      _subscribe()
    }
  }

  const resetMaxSpeed = () => {
    setMaxSpeed(0)
    setIsUnlocked(false)
    setSpeedHistory([])
  }

  // Check for achievements whenever max speed changes
  useEffect(() => {
    checkGyroAchievement(maxSpeed)
  }, [maxSpeed, checkGyroAchievement])

  if (!isAvailable) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="GYRO" color="green" />
            <View className="flex-1 justify-center items-center">
              <Text className="text-red-400 text-center font-mono mb-4">
                {error || 'Gyroscope not available'}
              </Text>
              <Text className="text-gray-400 text-center font-mono text-sm">
                Try on a physical device
              </Text>
            </View>
          </View>
        </View>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="GYRO" color="green" />
          
          {/* Unlock Status */}
          <View className="bg-gray-900 p-4 rounded-lg mb-4">
              <Text className="text-gray-400 text-sm font-mono mb-2">STATUS</Text>
              <Text className={`text-2xl font-mono ${isUnlocked ? 'text-green-400' : 'text-red-400'}`}>
                {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
              </Text>
              {!isUnlocked && (
                <Text className="text-gray-500 text-sm font-mono mt-2">
                  Need {UNLOCK_THRESHOLD}°/s to unlock compass
                </Text>
              )}
              {isUnlocked && (
                <Text className="text-green-400 text-sm font-mono mt-2">
                  Compass module unlocked! 🧭
                </Text>
              )}
            </View>
          
          <View className="space-y-4">
            {/* Speed Display Components */}
            <SpeedDisplay currentSpeed={currentSpeed} maxSpeed={maxSpeed} />

            {/* Speed Plot Component */}
            <SpeedPlot 
              speedHistory={speedHistory} 
              maxSpeed={maxSpeed} 
              historyLength={HISTORY_LENGTH} 
            />
            
            {/* Raw Data */}
            <View className="bg-gray-900 p-4 rounded-lg flex flex-row justify-between my-1">
              <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA</Text>
              <Text className="text-gray-300 text-sm font-mono">X: {gyroscopeData.x.toFixed(2)}</Text>
              <Text className="text-gray-300 text-sm font-mono">Y: {gyroscopeData.y.toFixed(2)}</Text>
              <Text className="text-gray-300 text-sm font-mono">Z: {gyroscopeData.z.toFixed(2)}</Text>
            </View>

            {/* Controls Component */}
            <GyroControls 
              subscription={subscription}
              onToggleGyroscope={toggleGyroscope}
              onResetMaxSpeed={resetMaxSpeed}
            />
          </View>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  )
} 
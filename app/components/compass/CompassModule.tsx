import { Magnetometer } from 'expo-sensors'
import { useEffect, useState } from 'react'
import { Platform, Text, View } from 'react-native'
import { useModuleUnlock } from '../../contexts/ModuleUnlockContext'
import HomeButton from '../ui/HomeButton'
import ModuleHeader from '../ui/ModuleHeader'
import PhoneFrame from '../ui/PhoneFrame'
import CompassData from './CompassData'
import CompassRose from './CompassRose'

interface CompassModuleProps {
  onGoHome: () => void
}

export default function CompassModule({ onGoHome }: CompassModuleProps) {
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 })
  const [heading, setHeading] = useState(0)
  const [subscription, setSubscription] = useState<any>(null)
  const [isAvailable, setIsAvailable] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { unlockModule, isModuleUnlocked } = useModuleUnlock()

  useEffect(() => {
    checkMagnetometerAvailability()
    return () => _unsubscribe()
  }, [])

  useEffect(() => {
    if (isAvailable) {
      _subscribe()
    }
    return () => _unsubscribe()
  }, [isAvailable])

  // Unlock microphone module if facing North (within 10 degrees)
  useEffect(() => {
    if (isAvailable && Math.abs(heading) < 10 && !isModuleUnlocked('microphone')) {
      unlockModule('microphone')
    }
  }, [heading, isAvailable, unlockModule, isModuleUnlocked])

  const checkMagnetometerAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web doesn't have magnetometer
        setIsAvailable(false)
        setError('Magnetometer not available on web')
        return
      }

      const isAvailable = await Magnetometer.isAvailableAsync()
      setIsAvailable(isAvailable)
      
      if (!isAvailable) {
        setError('Magnetometer not available on this device')
      }
    } catch (err) {
      setIsAvailable(false)
      setError('Failed to check magnetometer availability')
    }
  }

  const _subscribe = () => {
    if (!isAvailable) return

    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometerData(data)
        
        // Calculate heading from magnetometer data
        let heading = Math.atan2(data.y, data.x) * 180 / Math.PI
        
        // Normalize to 0-360
        heading = (heading + 360) % 360
        
        setHeading(heading)
      })
    )
  }

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove()
      setSubscription(null)
    }
  }

  // Calculate compass direction from heading
  const getDirection = (heading: number): string => {
    // Normalize heading to 0-360
    const normalizedHeading = ((heading % 360) + 360) % 360
    
    if (normalizedHeading >= 337.5 || normalizedHeading < 22.5) return 'N'
    if (normalizedHeading >= 22.5 && normalizedHeading < 67.5) return 'NE'
    if (normalizedHeading >= 67.5 && normalizedHeading < 112.5) return 'E'
    if (normalizedHeading >= 112.5 && normalizedHeading < 157.5) return 'SE'
    if (normalizedHeading >= 157.5 && normalizedHeading < 202.5) return 'S'
    if (normalizedHeading >= 202.5 && normalizedHeading < 247.5) return 'SW'
    if (normalizedHeading >= 247.5 && normalizedHeading < 292.5) return 'W'
    if (normalizedHeading >= 292.5 && normalizedHeading < 337.5) return 'NW'
    
    return 'N'
  }

  const direction = getDirection(heading)

  if (!isAvailable) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="COMPASS" color="red" />
            <View className="flex-1 justify-center items-center">
              <Text className="text-red-400 text-center font-mono mb-4">
                {error || 'Magnetometer not available'}
              </Text>
              <Text className="text-gray-400 text-center font-mono text-sm">
                Try on a physical device
              </Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    )
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="COMPASS" color="red" />
          
          {/* Compass Rose */}
          <View className="items-center justify-center mb-6">
            <CompassRose heading={heading} />
          </View>
          
          {/* Compass Data */}
          <CompassData
            heading={heading}
            direction={direction}
            magnetometerData={magnetometerData}
          />
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  )
} 
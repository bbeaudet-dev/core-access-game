import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
import AccelerometerControls from './AccelerometerControls';
import AccelerometerData from './AccelerometerData';
import AccelerometerStatus from './AccelerometerStatus';
import AccelerometerUnavailable from './AccelerometerUnavailable';

interface AccelerometerModuleProps {
  onGoHome: () => void;
}

export default function AccelerometerModule({ onGoHome }: AccelerometerModuleProps) {
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [currentAcceleration, setCurrentAcceleration] = useState(0);
  const [maxAcceleration, setMaxAcceleration] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movementType, setMovementType] = useState<string>('STATIONARY');
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Acceleration threshold to unlock WiFi (in m/s²)
  const UNLOCK_THRESHOLD = 15;

  useEffect(() => {
    checkAccelerometerAvailability();
    return () => _unsubscribe();
  }, []);

  // Check for unlock condition
  useEffect(() => {
    if (maxAcceleration >= UNLOCK_THRESHOLD && !isUnlocked) {
      setIsUnlocked(true);
      // WiFi module is now always unlocked, so no need to call unlockModule
    }
  }, [maxAcceleration, isUnlocked]);

  const checkAccelerometerAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsAvailable(false);
        setError('Accelerometer not available on web');
        return;
      }

      const isAvailable = await Accelerometer.isAvailableAsync();
      setIsAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('Accelerometer not available on this device');
      }
    } catch (err) {
      setIsAvailable(false);
      setError('Failed to check accelerometer availability');
    }
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    setSubscription(
      Accelerometer.addListener((data) => {
        setAccelerometerData(data);
        
        // Calculate acceleration magnitude (m/s²)
        const acceleration = Math.sqrt(
          data.x * data.x + 
          data.y * data.y + 
          data.z * data.z
        );
        setCurrentAcceleration(acceleration);
        
        // Update max acceleration
        setMaxAcceleration(prevMax => {
          if (acceleration > prevMax) {
            return acceleration;
          }
          return prevMax;
        });

        // Determine movement type
        if (acceleration < 1) {
          setMovementType('STATIONARY');
        } else if (acceleration < 2.5) {
          setMovementType('WALKING');
        } else if (acceleration < 5) {
          setMovementType('RUNNING');
        } else if (acceleration < 10) {
          setMovementType('VEHICLE');
        } else {
          setMovementType('HIGH SPEED');
        }
      })
    );
    Accelerometer.setUpdateInterval(100); // 10Hz
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const toggleAccelerometer = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const resetMaxAcceleration = () => {
    setMaxAcceleration(0);
    setIsUnlocked(false);
  };

  if (!isAvailable) {
    return <AccelerometerUnavailable error={error} onGoHome={onGoHome} />;
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="ACCELEROMETER" color="purple" />
          
          <AccelerometerStatus 
            isUnlocked={isUnlocked}
            unlockThreshold={UNLOCK_THRESHOLD}
          />
          
          <AccelerometerData 
            currentAcceleration={currentAcceleration}
            maxAcceleration={maxAcceleration}
            movementType={movementType}
            accelerometerData={accelerometerData}
          />

          <AccelerometerControls 
            subscription={subscription}
            onToggleAccelerometer={toggleAccelerometer}
            onResetMaxAcceleration={resetMaxAcceleration}
          />
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
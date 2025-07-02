import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useModuleUnlock } from '../../contexts/ModuleUnlockContext';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';

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

  const { unlockModule } = useModuleUnlock();

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
      unlockModule('wifi');
    }
  }, [maxAcceleration, isUnlocked, unlockModule]);

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
        if (acceleration < 0.5) {
          setMovementType('STATIONARY');
        } else if (acceleration < 2) {
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
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="ACCELEROMETER" color="purple" />
            <View className="flex-1 justify-center items-center">
              <Text className="text-red-400 text-center font-mono mb-4">
                {error || 'Accelerometer not available'}
              </Text>
              <Text className="text-gray-400 text-center font-mono text-sm">
                Try on a physical device
              </Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="ACCELEROMETER" color="purple" />
          
          {/* Unlock Status */}
          <View className="bg-gray-900 p-4 rounded-lg mb-4">
            <Text className="text-gray-400 text-sm font-mono mb-2">STATUS</Text>
            <Text className={`text-2xl font-mono ${isUnlocked ? 'text-green-400' : 'text-red-400'}`}>
              {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
            </Text>
            {!isUnlocked && (
              <Text className="text-gray-500 text-sm font-mono mt-2">
                Need {UNLOCK_THRESHOLD} m/s² to unlock WiFi
              </Text>
            )}
            {isUnlocked && (
              <Text className="text-green-400 text-sm font-mono mt-2">
                WiFi module unlocked! 📡
              </Text>
            )}
          </View>
          
          <View className="space-y-4">
            {/* Current Acceleration */}
            <View className="bg-gray-900 p-4 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT ACCELERATION</Text>
              <Text className="text-purple-400 text-3xl font-mono">
                {currentAcceleration.toFixed(2)} m/s²
              </Text>
            </View>

            {/* Max Acceleration */}
            <View className="bg-gray-900 p-4 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">MAX ACCELERATION</Text>
              <Text className="text-blue-400 text-3xl font-mono">
                {maxAcceleration.toFixed(2)} m/s²
              </Text>
            </View>

            {/* Movement Type */}
            <View className="bg-gray-900 p-4 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">MOVEMENT TYPE</Text>
              <Text className="text-green-400 text-2xl font-mono">
                {movementType}
              </Text>
            </View>

            {/* Raw Data */}
            <View className="bg-gray-900 p-4 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA</Text>
              <Text className="text-gray-300 text-sm font-mono">X: {accelerometerData.x.toFixed(3)}</Text>
              <Text className="text-gray-300 text-sm font-mono">Y: {accelerometerData.y.toFixed(3)}</Text>
              <Text className="text-gray-300 text-sm font-mono">Z: {accelerometerData.z.toFixed(3)}</Text>
            </View>

            {/* Controls */}
            <View className="space-y-3 flex flex-row justify-between">
              <TouchableOpacity
                onPress={toggleAccelerometer}
                className={`p-3 rounded-lg flex-1 mr-2 ${subscription ? 'bg-red-600' : 'bg-green-600'}`}
              >
                <Text className="text-white text-center font-mono">
                  {subscription ? 'STOP' : 'START'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={resetMaxAcceleration}
                className="bg-gray-700 p-3 rounded-lg flex-1 ml-2"
              >
                <Text className="text-white text-center font-mono">RESET</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
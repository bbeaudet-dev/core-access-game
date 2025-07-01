import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface GyroModuleProps {
  onGoHome: () => void;
}

export default function GyroModule({ onGoHome }: GyroModuleProps) {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [currentSpeed, setCurrentSpeed] = useState(0);
  const [maxSpeed, setMaxSpeed] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Speed threshold to unlock (in degrees/second)
  const UNLOCK_THRESHOLD = 500;

  useEffect(() => {
    checkGyroscopeAvailability();
    return () => _unsubscribe();
  }, []);

  const checkGyroscopeAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web doesn't have gyroscope
        setIsAvailable(false);
        setError('Gyroscope not available on web');
        return;
      }

      const isAvailable = await Gyroscope.isAvailableAsync();
      setIsAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('Gyroscope not available on this device');
      }
    } catch (err) {
      setIsAvailable(false);
      setError('Failed to check gyroscope availability');
    }
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    setSubscription(
      Gyroscope.addListener((data) => {
        setGyroscopeData(data);
        
        // Calculate speed magnitude (degrees/second)
        const speed = Math.sqrt(
          data.x * data.x + 
          data.y * data.y + 
          data.z * data.z
        );
        
        setCurrentSpeed(speed);
        
        // Update max speed if current speed is higher
        if (speed > maxSpeed) {
          setMaxSpeed(speed);
          
          // Check if we should unlock
          if (speed >= UNLOCK_THRESHOLD && !isUnlocked) {
            setIsUnlocked(true);
          }
        }
      })
    );
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const toggleGyroscope = () => {
    if (subscription) {
      _unsubscribe();
    } else {
      _subscribe();
    }
  };

  const resetMaxSpeed = () => {
    setMaxSpeed(0);
    setIsUnlocked(false);
  };

  if (!isAvailable) {
    return (
      <View className="flex-1 bg-black p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-green-400 text-lg font-mono">GYRO</Text>
          <TouchableOpacity onPress={onGoHome}>
            <Text className="text-green-400 text-sm font-mono">HOME</Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-400 text-center font-mono mb-4">
            {error || 'Gyroscope not available'}
          </Text>
          <Text className="text-gray-400 text-center font-mono text-sm">
            Try on a physical device
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black p-4">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-green-400 text-lg font-mono">GYRO</Text>
        <TouchableOpacity onPress={onGoHome}>
          <Text className="text-green-400 text-sm font-mono">HOME</Text>
        </TouchableOpacity>
      </View>

      <View className="flex-1 space-y-6">
        {/* Current Speed */}
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT SPEED</Text>
          <Text className="text-green-400 text-3xl font-mono">
            {currentSpeed.toFixed(1)}°/s
          </Text>
        </View>

        {/* Max Speed */}
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">MAX SPEED</Text>
          <Text className="text-blue-400 text-3xl font-mono">
            {maxSpeed.toFixed(1)}°/s
          </Text>
        </View>

        {/* Unlock Status */}
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">STATUS</Text>
          <Text className={`text-2xl font-mono ${isUnlocked ? 'text-green-400' : 'text-red-400'}`}>
            {isUnlocked ? 'UNLOCKED' : 'LOCKED'}
          </Text>
          {!isUnlocked && (
            <Text className="text-gray-500 text-sm font-mono mt-2">
              Need {UNLOCK_THRESHOLD}°/s to unlock
            </Text>
          )}
        </View>

        {/* Controls */}
        <View className="space-y-3">
          <TouchableOpacity
            onPress={toggleGyroscope}
            className={`p-3 rounded-lg ${subscription ? 'bg-red-600' : 'bg-green-600'}`}
          >
            <Text className="text-white text-center font-mono">
              {subscription ? 'STOP' : 'START'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={resetMaxSpeed}
            className="bg-gray-700 p-3 rounded-lg"
          >
            <Text className="text-white text-center font-mono">RESET</Text>
          </TouchableOpacity>
        </View>

        {/* Raw Data */}
        <View className="bg-gray-900 p-4 rounded-lg">
          <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA</Text>
          <Text className="text-gray-300 text-sm font-mono">
            X: {gyroscopeData.x.toFixed(2)}°/s
          </Text>
          <Text className="text-gray-300 text-sm font-mono">
            Y: {gyroscopeData.y.toFixed(2)}°/s
          </Text>
          <Text className="text-gray-300 text-sm font-mono">
            Z: {gyroscopeData.z.toFixed(2)}°/s
          </Text>
        </View>
      </View>
    </View>
  );
} 
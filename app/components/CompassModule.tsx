import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface CompassModuleProps {
  onGoHome: () => void;
}

export default function CompassModule({ onGoHome }: CompassModuleProps) {
  const [gyroData, setGyroData] = useState({ x: 0, y: 0, z: 0 });
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkGyroscopeAvailability();
    return () => _unsubscribe();
  }, []);

  const checkGyroscopeAvailability = async () => {
    try {
      // For web, we'll use a different approach
      if (Platform.OS === 'web') {
        // Check if DeviceOrientationEvent is available
        if (typeof window !== 'undefined' && 'DeviceOrientationEvent' in window) {
          setIsAvailable(true);
          _subscribeWeb();
        } else {
          setError('Device orientation not supported in this browser');
          setIsAvailable(false);
        }
      } else {
        // Native implementation
        const isAvailable = await Gyroscope.isAvailableAsync();
        setIsAvailable(isAvailable);
        if (isAvailable) {
          _subscribe();
        }
      }
    } catch (error) {
      console.log('Gyroscope not available:', error);
      setError('Failed to access gyroscope');
      setIsAvailable(false);
    }
  };

  const _subscribeWeb = () => {
    try {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null && event.beta !== null && event.gamma !== null) {
          setGyroData({
            x: event.alpha,
            y: event.beta,
            z: event.gamma
          });
        }
      };

      window.addEventListener('deviceorientation', handleOrientation);
      
      // Store the event listener for cleanup
      setSubscription({
        remove: () => window.removeEventListener('deviceorientation', handleOrientation)
      });
    } catch (error) {
      console.log('Error subscribing to device orientation:', error);
      setError('Failed to access device orientation');
    }
  };

  const _subscribe = () => {
    try {
      const subscription = Gyroscope.addListener((gyroscopeData) => {
        setGyroData(gyroscopeData);
      });
      setSubscription(subscription);
      Gyroscope.setUpdateInterval(100); // Update every 100ms
    } catch (error) {
      console.log('Error subscribing to gyroscope:', error);
      setError('Failed to access gyroscope');
    }
  };

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  // Calculate compass direction from gyroscope data
  const getDirection = (x: number, y: number, z: number) => {
    // Simple direction calculation based on Y-axis rotation
    const angle = Math.atan2(y, x) * 180 / Math.PI;
    const normalizedAngle = (angle + 360) % 360;
    
    if (normalizedAngle >= 315 || normalizedAngle < 45) return 'N';
    if (normalizedAngle >= 45 && normalizedAngle < 135) return 'E';
    if (normalizedAngle >= 135 && normalizedAngle < 225) return 'S';
    if (normalizedAngle >= 225 && normalizedAngle < 315) return 'W';
    
    return 'N';
  };

  const direction = getDirection(gyroData.x, gyroData.y, gyroData.z);

  if (error) {
    return (
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-xl font-bold">COMPASS</Text>
          <Text className="text-red-500 text-xs">Device Orientation</Text>
        </View>
        
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg text-center mb-4">Error: {error}</Text>
          <Text className="text-gray-400 text-sm text-center">Try on a mobile device or enable device orientation</Text>
        </View>

        <TouchableOpacity 
          className="absolute bottom-10 left-1/2 -ml-7 w-14 h-14 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10"
          onPress={onGoHome}
        >
          <Text className="text-white text-xl font-bold">⌂</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!isAvailable) {
    return (
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-xl font-bold">COMPASS</Text>
          <Text className="text-red-500 text-xs">Device Orientation</Text>
        </View>
        
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg text-center mb-4">Gyroscope not available</Text>
          <Text className="text-gray-400 text-sm text-center">This device doesn't support gyroscope sensors</Text>
        </View>

        <TouchableOpacity 
          className="absolute bottom-10 left-1/2 -ml-7 w-14 h-14 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10"
          onPress={onGoHome}
        >
          <Text className="text-white text-xl font-bold">⌂</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <Text className="text-red-500 text-xl font-bold">COMPASS</Text>
        <Text className="text-red-500 text-xs">Device Orientation</Text>
      </View>
      
      <View className="flex-1 justify-center items-center p-5">
        <View className="items-center mb-10">
          <Text className="text-green-400 text-6xl font-bold font-mono mb-2">{direction}</Text>
          <Text className="text-red-500 text-base font-bold uppercase">DIRECTION</Text>
        </View>
        
        <View className="bg-gray-800 p-5 rounded-lg mb-8 items-center">
          <Text className="text-green-400 text-base font-mono mb-1">X: {gyroData.x.toFixed(2)}</Text>
          <Text className="text-green-400 text-base font-mono mb-1">Y: {gyroData.y.toFixed(2)}</Text>
          <Text className="text-green-400 text-base font-mono mb-1">Z: {gyroData.z.toFixed(2)}</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-yellow-400 text-sm text-center mb-2">Tilt your device to see changes</Text>
          <Text className="text-yellow-400 text-sm text-center mb-2">Try rotating in different directions</Text>
          <Text className="text-yellow-400 text-sm text-center mb-2">HINT: Point North to unlock secrets</Text>
        </View>
      </View>

      <TouchableOpacity 
        className="absolute bottom-10 left-1/2 -ml-7 w-14 h-14 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10"
        onPress={onGoHome}
      >
        <Text className="text-white text-xl font-bold">⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
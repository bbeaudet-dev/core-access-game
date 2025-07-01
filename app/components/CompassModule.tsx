import { Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';

interface CompassModuleProps {
  onGoHome: () => void;
}

export default function CompassModule({ onGoHome }: CompassModuleProps) {
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [heading, setHeading] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkMagnetometerAvailability();
    return () => _unsubscribe();
  }, []);

  const checkMagnetometerAvailability = async () => {
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
        const isAvailable = await Magnetometer.isAvailableAsync();
        setIsAvailable(isAvailable);
        if (isAvailable) {
          _subscribe();
        }
      }
    } catch (error) {
      console.log('Magnetometer not available:', error);
      setError('Failed to access magnetometer');
      setIsAvailable(false);
    }
  };

  const _subscribeWeb = () => {
    try {
      const handleOrientation = (event: DeviceOrientationEvent) => {
        if (event.alpha !== null) {
          // alpha is the compass heading (0-360 degrees)
          const heading = event.alpha;
          setHeading(heading);
          setMagnetometerData({
            x: event.alpha || 0,
            y: event.beta || 0,
            z: event.gamma || 0
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
      const subscription = Magnetometer.addListener((magnetometerData) => {
        setMagnetometerData(magnetometerData);
        
        // Calculate heading from magnetometer data
        const { x, y } = magnetometerData;
        let heading = Math.atan2(y, x) * 180 / Math.PI;
        heading = (heading + 360) % 360; // Normalize to 0-360
        setHeading(heading);
      });
      setSubscription(subscription);
      Magnetometer.setUpdateInterval(100); // Update every 100ms
    } catch (error) {
      console.log('Error subscribing to magnetometer:', error);
      setError('Failed to access magnetometer');
    }
  };

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  // Calculate compass direction from heading
  const getDirection = (heading: number): string => {
    // Normalize heading to 0-360
    const normalizedHeading = ((heading % 360) + 360) % 360;
    
    if (normalizedHeading >= 337.5 || normalizedHeading < 22.5) return 'N';
    if (normalizedHeading >= 22.5 && normalizedHeading < 67.5) return 'NE';
    if (normalizedHeading >= 67.5 && normalizedHeading < 112.5) return 'E';
    if (normalizedHeading >= 112.5 && normalizedHeading < 157.5) return 'SE';
    if (normalizedHeading >= 157.5 && normalizedHeading < 202.5) return 'S';
    if (normalizedHeading >= 202.5 && normalizedHeading < 247.5) return 'SW';
    if (normalizedHeading >= 247.5 && normalizedHeading < 292.5) return 'W';
    if (normalizedHeading >= 292.5 && normalizedHeading < 337.5) return 'NW';
    
    return 'N';
  };

  const direction = getDirection(heading);

  if (error) {
    return (
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-xl font-bold">COMPASS</Text>
          <Text className="text-red-500 text-xs">Magnetic North</Text>
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
          <Text className="text-red-500 text-xs">Magnetic North</Text>
        </View>
        
        <View className="flex-1 justify-center items-center p-5">
          <Text className="text-red-500 text-lg text-center mb-4">Magnetometer not available</Text>
          <Text className="text-gray-400 text-sm text-center">This device doesn't support magnetometer sensors</Text>
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
        <Text className="text-red-500 text-xs">Magnetic North</Text>
      </View>
      
      <View className="flex-1 justify-center items-center p-5">
        <View className="items-center mb-10">
          <Text className="text-green-400 text-6xl font-bold font-mono mb-2">{direction}</Text>
          <Text className="text-red-500 text-base font-bold uppercase">DIRECTION</Text>
        </View>
        
        <View className="bg-gray-800 p-5 rounded-lg mb-8 items-center">
          <Text className="text-green-400 text-base font-mono mb-1">Heading: {heading.toFixed(1)}°</Text>
          <Text className="text-green-400 text-base font-mono mb-1">X: {magnetometerData.x.toFixed(2)}</Text>
          <Text className="text-green-400 text-base font-mono mb-1">Y: {magnetometerData.y.toFixed(2)}</Text>
          <Text className="text-green-400 text-base font-mono mb-1">Z: {magnetometerData.z.toFixed(2)}</Text>
        </View>
        
        <View className="items-center">
          <Text className="text-yellow-400 text-sm text-center mb-2">Point your device North to see N</Text>
          <Text className="text-yellow-400 text-sm text-center mb-2">Rotate to see E, S, W directions</Text>
          <Text className="text-yellow-400 text-sm text-center mb-2">HINT: True North points to magnetic north</Text>
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
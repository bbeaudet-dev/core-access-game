import { Barometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
import PuzzleStatus from '../ui/PuzzleStatus';

interface BarometerModuleProps {
  onGoHome: () => void;
}

export default function BarometerModule({ onGoHome }: BarometerModuleProps) {
  const [pressure, setPressure] = useState<number | null>(null);
  const [relativeAltitude, setRelativeAltitude] = useState<number | null>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [maxPressure, setMaxPressure] = useState(0);
  const [pressureHistory, setPressureHistory] = useState<number[]>([]);
  const [blowDetected, setBlowDetected] = useState(false);

  // Blowing detection settings
  const BLOW_THRESHOLD = 5; // hPa pressure increase
  const HISTORY_LENGTH = 50;

  useEffect(() => {
    checkBarometerAvailability();
    return () => _unsubscribe();
  }, []);

  const checkBarometerAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsAvailable(false);
        return;
      }

      const isAvailable = await Barometer.isAvailableAsync();
      setIsAvailable(isAvailable);
      
      if (isAvailable) {
        _subscribe();
      }
    } catch (err) {
      setIsAvailable(false);
    }
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    setSubscription(
      Barometer.addListener((data) => {
        setPressure(data.pressure || null);
        setRelativeAltitude(data.relativeAltitude || null);
        
        // Update pressure history
        setPressureHistory(prev => {
          const next = [...prev, data.pressure];
          return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
        });
        
        // Update max pressure
        setMaxPressure(prevMax => {
          if (data.pressure > prevMax) {
            return data.pressure;
          }
          return prevMax;
        });

        // Detect blowing (pressure increase)
        if (pressureHistory.length > 0) {
          const recentPressure = pressureHistory[pressureHistory.length - 1];
          const pressureChange = data.pressure - recentPressure;
          
          if (pressureChange > BLOW_THRESHOLD) {
            setBlowDetected(true);
            // Reset after 2 seconds
            setTimeout(() => setBlowDetected(false), 2000);
          }
        }
      })
    );
    Barometer.setUpdateInterval(100); // 10Hz
  };

  const _unsubscribe = () => {
    subscription && subscription.remove();
    setSubscription(null);
  };

  const resetMaxPressure = () => {
    setMaxPressure(0);
    setBlowDetected(false);
  };

  if (!isAvailable) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="BAROMETER" color="blue" />
            <View className="flex-1 p-5 justify-center">
              <Text className="text-blue-400 text-center text-base mb-2">Barometer not available</Text>
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
          <ModuleHeader name="BAROMETER" color="blue" />
          
          <View className="flex flex-col space-y-4">
            {/* Current Pressure */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT PRESSURE</Text>
              <Text className="text-blue-400 text-3xl font-mono text-center">
                {pressure !== null ? `${pressure.toFixed(1)} hPa` : '--'}
              </Text>
            </View>

            {/* Relative Altitude */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">RELATIVE ALTITUDE</Text>
              <Text className="text-blue-400 text-2xl font-mono text-center">
                {relativeAltitude !== null ? `${relativeAltitude.toFixed(1)} m` : '--'}
              </Text>
            </View>

            {/* Max Pressure */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">MAX PRESSURE</Text>
              <Text className="text-green-400 text-2xl font-mono text-center">
                {maxPressure.toFixed(1)} hPa
              </Text>
            </View>

            {/* Blow Detection */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">BLOW DETECTION</Text>
              <View className="flex flex-row items-center justify-center">
                <Text className={`text-4xl mr-4 ${blowDetected ? 'text-yellow-400' : 'text-gray-600'}`}>
                  💨
                </Text>
                <Text className={`text-2xl font-mono ${blowDetected ? 'text-yellow-400' : 'text-gray-600'}`}>
                  {blowDetected ? 'BLOW DETECTED!' : 'WAITING FOR BLOW'}
                </Text>
              </View>
            </View>

            {/* Puzzle Status */}
            <PuzzleStatus
              title="PUZZLE STATUS"
              description="Target: Blow into the device"
              isComplete={blowDetected}
              color="blue"
            />

            {/* Pressure Graph Placeholder */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">PRESSURE HISTORY</Text>
              <View className="h-20 bg-gray-800 rounded-lg flex items-center justify-center">
                <Text className="text-gray-500 text-xs font-mono">
                  {pressureHistory.length} readings
                </Text>
              </View>
            </View>
          </View>
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
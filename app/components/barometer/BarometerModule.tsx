import { Barometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import PressurePlot from '../ui/LiveDataPlot';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';

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

  // Pressure history settings
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

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="BAROMETER" color="blue" />
          
          {!isAvailable ? (
            <View className="flex-1 p-5 justify-center">
              <Text className="text-blue-400 text-center text-base mb-2">Barometer not available</Text>
            </View>
          ) : (
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

              {/* Blow Detection - Note about using microphone */}
              <View className="bg-gray-900 p-6 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">BLOW DETECTION</Text>
                <View className="flex flex-col items-center justify-center">
                  <Text className="text-4xl mb-4">💨</Text>
                  <Text className="text-yellow-400 text-lg font-mono text-center mb-2">
                    Use Microphone Module
                  </Text>
                  <Text className="text-gray-500 text-sm font-mono text-center">
                    Barometer measures air pressure, not airflow
                  </Text>
                </View>
              </View>

              {/* Pressure Plot */}
              <PressurePlot 
                speedHistory={pressureHistory}
                maxSpeed={maxPressure} 
                historyLength={HISTORY_LENGTH}
                unitType="hPa"
                normalized={false}
                title="PRESSURE PLOT"
                color="blue"
              />

              {/* Reset Button */}
              <View className="bg-gray-900 p-6 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">CONTROLS</Text>
                <View className="flex flex-row justify-center">
                  <TouchableOpacity
                    onPress={resetMaxPressure}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white text-center font-mono">Reset Max</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
import { Gyroscope } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { useHints } from '../../contexts/HintContext';
import { usePuzzle } from '../../contexts/PuzzleContext';

import HomeButton from '../ui/HomeButton';
import GyroPlot from '../ui/LiveDataPlot';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
import GyroControls from './GyroControls';
import SpeedDisplay from './SpeedDisplay';

interface GyroModuleProps {
  onGoHome: () => void;
}

export default function GyroModule({ onGoHome }: GyroModuleProps) {
  const [gyroscopeData, setGyroscopeData] = useState({ x: 0, y: 0, z: 0 });
  const [currentAngularVelocity, setCurrentAngularVelocity] = useState(0);
  const [maxAngularVelocity, setMaxAngularVelocity] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [angularVelocityHistory, setAngularVelocityHistory] = useState<number[]>([]); // For sparkline

  const { checkGyroAchievement } = useHints();
  const { updatePuzzleProgress, completePuzzle } = usePuzzle();

  // Angular velocity threshold to unlock puzzle (in degrees/second)
  const UNLOCK_THRESHOLD = 50; // deg/s
  const HISTORY_LENGTH = 200; // 20 seconds at 10Hz

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
        
        // Calculate angular velocity magnitude (degrees/second)
        const angularVelocity = Math.sqrt(
          data.x * data.x + 
          data.y * data.y + 
          data.z * data.z
        );
        setCurrentAngularVelocity(angularVelocity);
        setAngularVelocityHistory(prev => {
          const next = [...prev, angularVelocity];
          // Keep only the last HISTORY_LENGTH samples
          return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
        });
        // Update max angular velocity if current is higher
        setMaxAngularVelocity(prevMax => {
          if (angularVelocity > prevMax) {
            // Check if we should unlock puzzle
            if (angularVelocity >= UNLOCK_THRESHOLD && !isUnlocked) {
              setIsUnlocked(true);
              completePuzzle('gyroscope_rotation');
            }
            
            return angularVelocity;
          }
          return prevMax;
        });
      })
    );
    Gyroscope.setUpdateInterval(100); // 10Hz
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

  const resetMaxAngularVelocity = () => {
    setMaxAngularVelocity(0);
    setIsUnlocked(false);
    setAngularVelocityHistory([]);
  };

  // Check for achievements whenever max angular velocity changes
  useEffect(() => {
    checkGyroAchievement(maxAngularVelocity);
  }, [maxAngularVelocity, checkGyroAchievement]);

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="GYRO" color="green" />
          
          {!isAvailable ? (
            <View className="flex-1 justify-center items-center">
              <Text className="text-red-400 text-center font-mono mb-4">
                {error || 'Gyroscope not available'}
              </Text>
              <Text className="text-gray-400 text-center font-mono text-sm">
                Try on a physical device
              </Text>
            </View>
          ) : (
            <>
              
              <View className="space-y-4">
                {/* Angular Velocity Display Components */}
                <SpeedDisplay currentSpeed={currentAngularVelocity} maxSpeed={maxAngularVelocity} />

                {/* Angular Velocity Plot Component */}
                <GyroPlot 
                  speedHistory={angularVelocityHistory} 
                  maxSpeed={maxAngularVelocity} 
                  historyLength={HISTORY_LENGTH}
                  unitType="deg/s"
                  title="ANGULAR VELOCITY PLOT"
                  color="green"
                />
                
                {/* Raw Data */}
                <View className="bg-gray-900 p-4 rounded-lg flex flex-row justify-between my-1">
                  <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA (deg/s)</Text>
                  <Text className="text-gray-300 text-sm font-mono">X: {gyroscopeData.x.toFixed(2)}</Text>
                  <Text className="text-gray-300 text-sm font-mono">Y: {gyroscopeData.y.toFixed(2)}</Text>
                  <Text className="text-gray-300 text-sm font-mono">Z: {gyroscopeData.z.toFixed(2)}</Text>
                </View>

                {/* Controls Component */}
                <GyroControls 
                  subscription={subscription}
                  onToggleGyroscope={toggleGyroscope}
                  onResetMaxSpeed={resetMaxAngularVelocity}
                />
              </View>
            </>
          )}
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
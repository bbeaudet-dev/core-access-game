import { Gyroscope } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { useHints } from '../../../contexts/HintContext';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';

import HomeButton from '../../ui/HomeButton';
import GyroPlot from '../../ui/LiveDataPlot';
import ModuleHeader from '../../ui/ModuleHeader';
import PhoneFrame from '../../ui/PhoneFrame';
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
  const [angularVelocityHistory, setAngularVelocityHistory] = useState<number[]>([]);

  // Spin counter puzzle state
  const [totalRotation, setTotalRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [isSpinPuzzleActive, setIsSpinPuzzleActive] = useState(false);
  const [spinPuzzleComplete, setSpinPuzzleComplete] = useState(false);
  const [targetSpins, setTargetSpins] = useState(100);
  const lastUpdateTimeRef = useRef(Date.now());

  const { checkGyroAchievement } = useHints();
  const { updatePuzzleProgress, completePuzzle } = usePuzzle();

  const UNLOCK_THRESHOLD = 50; // deg/s
  const HISTORY_LENGTH = 200;
  const MIN_ANGULAR_VELOCITY_THRESHOLD = 10; // deg/s minimum to count as spinning

  useEffect(() => {
    checkGyroscopeAvailability();
    return () => _unsubscribe();
  }, []);

  const checkGyroscopeAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
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

    // Play sensor activation sound
    playSound('sensor_activate');

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
          return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
        });

        // Update max angular velocity
        setMaxAngularVelocity(prevMax => {
          if (angularVelocity > prevMax) {
            if (angularVelocity >= UNLOCK_THRESHOLD && !isUnlocked) {
              setIsUnlocked(true);
              completePuzzle('gyroscope_rotation');
            }
            return angularVelocity;
          }
          return prevMax;
        });

        // Spin counter logic
        if (isSpinPuzzleActive && angularVelocity > MIN_ANGULAR_VELOCITY_THRESHOLD) {
          const now = Date.now();
          const timeDiff = (now - lastUpdateTimeRef.current) / 1000; // seconds
          
          // Calculate rotation in this time step
          const rotationInStep = angularVelocity * timeDiff;
          
          // Determine direction based on Z-axis (most reliable for phone rotation)
          const rotationDirection = data.z >= 0 ? 1 : -1;
          const signedRotation = rotationInStep * rotationDirection;
          
          setTotalRotation(prev => {
            const newTotal = prev + signedRotation;
            
            // Count complete rotations (360 degrees)
            const newSpinCount = Math.floor(Math.abs(newTotal) / 360);
            setSpinCount(newSpinCount);
            
            // Check if puzzle is complete
            if (newSpinCount >= targetSpins && !spinPuzzleComplete) {
              setSpinPuzzleComplete(true);
              completePuzzle('gyroscope_spin_count');
            }
            
            return newTotal;
          });
          
          lastUpdateTimeRef.current = now;
        }
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

  const startSpinPuzzle = () => {
    setIsSpinPuzzleActive(true);
    setSpinPuzzleComplete(false);
    setTotalRotation(0);
    setSpinCount(0);
    lastUpdateTimeRef.current = Date.now();
  };

  const stopSpinPuzzle = () => {
    setIsSpinPuzzleActive(false);
    setSpinPuzzleComplete(false);
  };

  const resetSpinPuzzle = () => {
    setTotalRotation(0);
    setSpinCount(0);
    setSpinPuzzleComplete(false);
  };

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

                {/* Spin Counter Puzzle */}
                <View className="bg-gray-900 p-4 rounded-lg">
                  <Text className="text-gray-400 text-sm font-mono mb-2 text-center">SPIN COUNTER PUZZLE</Text>
                  
                  {!isSpinPuzzleActive ? (
                    <View className="space-y-2">
                      <Text className="text-green-400 text-center font-mono">
                        Spin the device {targetSpins} times
                      </Text>
                      <TouchableOpacity
                        onPress={startSpinPuzzle}
                        className="bg-green-600 px-4 py-2 rounded-lg mx-auto"
                      >
                        <Text className="text-white font-mono text-center">START SPIN PUZZLE</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View className="space-y-2">
                      <Text className="text-yellow-400 text-center font-mono">
                        Spins: {spinCount} / {targetSpins}
                      </Text>
                      <Text className="text-green-400 text-center font-mono">
                        Total Rotation: {totalRotation.toFixed(1)}°
                      </Text>
                      {spinPuzzleComplete && (
                        <Text className="text-green-400 text-center font-mono font-bold">
                          SPIN PUZZLE COMPLETE!
                        </Text>
                      )}
                      <View className="flex-row justify-center space-x-2">
                        <TouchableOpacity
                          onPress={stopSpinPuzzle}
                          className="bg-red-600 px-4 py-2 rounded-lg"
                        >
                          <Text className="text-white font-mono">STOP</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={resetSpinPuzzle}
                          className="bg-blue-600 px-4 py-2 rounded-lg"
                        >
                          <Text className="text-white font-mono">RESET</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </View>

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
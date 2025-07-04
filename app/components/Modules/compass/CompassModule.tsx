import { Magnetometer } from 'expo-sensors';
import { useEffect, useRef, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';

import { playSound } from '@/app/utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';
import CompassData from './CompassData';
import CompassDisplay from './CompassDisplay';
import CompassError from './CompassError';
import CompassUnavailable from './CompassUnavailable';

interface CompassModuleProps {
  onGoHome: () => void;
}

export default function CompassModule({ onGoHome }: CompassModuleProps) {
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [heading, setHeading] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Timer state for direction puzzles
  const [currentDirection, setCurrentDirection] = useState('N');
  const [targetDirection, setTargetDirection] = useState('N');
  const [timeInDirection, setTimeInDirection] = useState(0);
  const [isDirectionPuzzleActive, setIsDirectionPuzzleActive] = useState(false);
  const [directionPuzzleComplete, setDirectionPuzzleComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const { updatePuzzleProgress, completePuzzle } = usePuzzle();

  // North direction tolerance (degrees)
  const NORTH_TOLERANCE = 10;
  const TARGET_TIME_IN_DIRECTION = 10000; // 10 seconds

  useEffect(() => {
    checkMagnetometerAvailability();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (isAvailable) {
      _subscribe();
    }
    return () => _unsubscribe();
  }, [isAvailable]);

  // Timer effect for direction puzzle
  useEffect(() => {
    if (isDirectionPuzzleActive && currentDirection === targetDirection) {
      const timer = setInterval(() => {
        setTimeInDirection(prev => {
          const newTime = prev + 100;
          if (newTime >= TARGET_TIME_IN_DIRECTION && !directionPuzzleComplete) {
            setDirectionPuzzleComplete(true);
            completePuzzle('compass_direction_hold');
          }
          return newTime;
        });
      }, 100);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      setTimeInDirection(0);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isDirectionPuzzleActive, currentDirection, targetDirection, directionPuzzleComplete]);

  const checkMagnetometerAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        setIsAvailable(false);
        setError('Magnetometer not available on web');
        return;
      }

      const isAvailable = await Magnetometer.isAvailableAsync();
      setIsAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('Magnetometer not available on this device');
      }
    } catch (err) {
      setIsAvailable(false);
      setError('Failed to check magnetometer availability');
    }
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    // Play sensor activation sound
    playSound('sensor_activate');

    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometerData(data);
        
        // Calculate heading from magnetometer data
        let heading = Math.atan2(data.y, data.x) * 180 / Math.PI;
        heading = (heading + 360) % 360;
        setHeading(heading);
        
        // Get current direction
        const direction = getDirection(heading);
        setCurrentDirection(direction);
        
        // Check if pointing north for original puzzle
        const isPointingNorth = heading <= NORTH_TOLERANCE || heading >= (360 - NORTH_TOLERANCE);
        if (isPointingNorth && !isUnlocked) {
          setIsUnlocked(true);
          completePuzzle('compass_orientation');
        }
      })
    );
  };

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  const getDirection = (heading: number): string => {
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

  const startDirectionPuzzle = (direction: string) => {
    setTargetDirection(direction);
    setIsDirectionPuzzleActive(true);
    setDirectionPuzzleComplete(false);
    setTimeInDirection(0);
  };

  const stopDirectionPuzzle = () => {
    setIsDirectionPuzzleActive(false);
    setDirectionPuzzleComplete(false);
    setTimeInDirection(0);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const direction = getDirection(heading);

  if (error) {
    return <CompassError error={error} onGoHome={onGoHome} />;
  }

  if (!isAvailable) {
    return <CompassUnavailable onGoHome={onGoHome} />;
  }

  return (
    <ScreenTemplate title="COMPASS" titleColor="blue" onGoHome={onGoHome}>
      <View className="flex-col w-full items-center justify-center">
        <CompassDisplay heading={heading} />
        <CompassData 
          direction={direction}
          heading={heading}
          magnetometerData={magnetometerData}
        />
        
        {/* Direction Timer Puzzle */}
        <View className="bg-gray-900 p-4 rounded-lg m-4 w-full">
          <Text className="text-gray-400 text-sm font-mono mb-2 text-center">DIRECTION TIMER PUZZLE</Text>
          
          {!isDirectionPuzzleActive ? (
            <View className="space-y-2">
              <Text className="text-blue-400 text-center font-mono">
                Hold device facing a direction for 5 seconds
              </Text>
              <View className="flex-row justify-center space-x-2">
                {['N', 'E', 'S', 'W'].map(dir => (
                  <TouchableOpacity
                    key={dir}
                    onPress={() => startDirectionPuzzle(dir)}
                    className="bg-blue-600 px-4 py-2 rounded-lg"
                  >
                    <Text className="text-white font-mono">{dir}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ) : (
            <View className="space-y-2">
              <Text className="text-yellow-400 text-center font-mono">
                Target: {targetDirection} | Current: {currentDirection}
              </Text>
              <Text className="text-blue-400 text-center font-mono">
                Time: {(timeInDirection / 1000).toFixed(1)}s / 5.0s
              </Text>
              {directionPuzzleComplete && (
                <Text className="text-green-400 text-center font-mono font-bold">
                  PUZZLE COMPLETE!
                </Text>
              )}
              <TouchableOpacity
                onPress={stopDirectionPuzzle}
                className="bg-red-600 px-4 py-2 rounded-lg mx-auto"
              >
                <Text className="text-white font-mono text-center">STOP</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScreenTemplate>
  );
} 
import { playSound } from '@/app/utils/soundManager';
import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { getModuleBackgroundImage } from '../../../utils/unlockSystem';
import AccelerometerPlot from '../../ui/LiveDataPlot';
import ScreenTemplate from '../../ui/ScreenTemplate';
import AccelerometerControls from './AccelerometerControls';
import AccelerometerData from './AccelerometerData';
import AccelerometerUnavailable from './AccelerometerUnavailable';

interface AccelerometerModuleProps {
  onGoHome: () => void;
}

type UnitType = 'g' | 'm/s²' | 'ft/s²';

export default function AccelerometerModule({ onGoHome }: AccelerometerModuleProps) {
  const [accelerometerData, setAccelerometerData] = useState({ x: 0, y: 0, z: 0 });
  const [currentAcceleration, setCurrentAcceleration] = useState(0);
  const [maxAcceleration, setMaxAcceleration] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movementEquivalent, setMovementEquivalent] = useState<string>('STATIONARY');
  const [highestMovementEquivalent, setHighestMovementEquivalent] = useState<string>('STATIONARY');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accelerationHistory, setAccelerationHistory] = useState<number[]>([]); // For sparkline
  const [unitType, setUnitType] = useState<UnitType>('m/s²'); // Changed default to m/s²
  const [normalized, setNormalized] = useState(false); // Normalized graph toggle
  const [puzzleComplete, setPuzzleComplete] = useState(false);
  
  const { updatePuzzleProgress, completePuzzle, getCompletedPuzzles } = usePuzzle();
  const completedPuzzles = getCompletedPuzzles();
  const backgroundImage = getModuleBackgroundImage('accelerometer', completedPuzzles);

  // Acceleration threshold to unlock puzzle (in m/s²)
  const UNLOCK_THRESHOLD = 50; // 50 m/s²
  // Sparkline settings
  const HISTORY_LENGTH = 50; // Reduced from 200 to prevent memory issues

  // Unit conversion functions
  const convertToUnit = (valueInG: number, targetUnit: UnitType): number => {
    switch (targetUnit) {
      case 'g':
        return valueInG;
      case 'm/s²':
        return valueInG * 9.81;
      case 'ft/s²':
        return valueInG * 32.17;
      default:
        return valueInG;
    }
  };

  const getUnitLabel = (unit: UnitType): string => {
    switch (unit) {
      case 'g':
        return 'g';
      case 'm/s²':
        return 'm/s²';
      case 'ft/s²':
        return 'ft/s²';
      default:
        return 'g';
    }
  };

  const getExpectedGravity = (unit: UnitType): number => {
    switch (unit) {
      case 'g':
        return 1.0;
      case 'm/s²':
        return 9.81;
      case 'ft/s²':
        return 32.17;
      default:
        return 1.0;
    }
  };

  const toggleUnit = () => {
    const units: UnitType[] = ['g', 'm/s²', 'ft/s²'];
    const currentIndex = units.indexOf(unitType);
    const nextIndex = (currentIndex + 1) % units.length;
    setUnitType(units[nextIndex]);
  };

  useEffect(() => {
    checkAccelerometerAvailability();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (completedPuzzles.includes('accelerometer_movement') && !puzzleComplete) {
      setPuzzleComplete(true);
    }
  }, [completedPuzzles, puzzleComplete]);

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

  const getMovementEquivalent = (acceleration: number): string => {
    // Convert to m/s² for consistent comparison
    const accelerationMS2 = convertToUnit(acceleration, 'm/s²');
    
    if (accelerationMS2 < 1.5) {
      return 'STATIONARY';
    } else if (accelerationMS2 < 3) {
      return 'CRAWLING';
    } else if (accelerationMS2 < 6) {
      return 'WALKING';
    } else if (accelerationMS2 < 12) {
      return 'JOGGING';
    } else if (accelerationMS2 < 20) {
      return 'RUNNING';
    } else if (accelerationMS2 < 30) {
      return 'SPRINTING';
    } else if (accelerationMS2 < 50) {
      return 'VEHICLE';
    } else if (accelerationMS2 < 80) {
      return 'HIGH SPEED';
    } else if (accelerationMS2 < 120) {
      return 'EXTREME SPEED';
    } else {
      return 'ROCKET LAUNCH';
    }
  };

  const getMovementRank = (movement: string): number => {
    const ranks = {
      'STATIONARY': 0,
      'CRAWLING': 1,
      'WALKING': 2,
      'JOGGING': 3,
      'RUNNING': 4,
      'SPRINTING': 5,
      'VEHICLE': 6,
      'HIGH SPEED': 7,
      'EXTREME SPEED': 8,
      'ROCKET LAUNCH': 9
    };
    return ranks[movement as keyof typeof ranks] || 0;
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    // Play sensor activation sound
    playSound('sensor_activate');

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
        
        // Update acceleration history for sparkline
        setAccelerationHistory(prev => {
          const next = [...prev, acceleration];
          return next.length > HISTORY_LENGTH ? next.slice(next.length - HISTORY_LENGTH) : next;
        });
        
        // Update max acceleration
        setMaxAcceleration(prevMax => {
          if (acceleration > prevMax) {
            // Check if we should unlock
            if (acceleration >= UNLOCK_THRESHOLD && !isUnlocked) {
              setIsUnlocked(true);
              completePuzzle('accelerometer_movement');
            }
            
            // Update puzzle progress based on acceleration
            const progress = Math.min((acceleration / UNLOCK_THRESHOLD) * 100, 100);
            updatePuzzleProgress('accelerometer_movement', progress, acceleration >= UNLOCK_THRESHOLD);
            
            return acceleration;
          }
          return prevMax;
        });

        // Use new movement equivalent function
        const newMovementEquivalent = getMovementEquivalent(acceleration);
        setMovementEquivalent(newMovementEquivalent);
        
        // Update highest movement equivalent
        setHighestMovementEquivalent(prevHighest => {
          const currentRank = getMovementRank(newMovementEquivalent);
          const highestRank = getMovementRank(prevHighest);
          return currentRank > highestRank ? newMovementEquivalent : prevHighest;
        });
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
    setHighestMovementEquivalent('STATIONARY');
    setIsUnlocked(false);
    setAccelerationHistory([]);
  };

  if (!isAvailable) {
    return <AccelerometerUnavailable error={error} onGoHome={onGoHome} />;
  }

  return (
    <ScreenTemplate 
      title="ACCELEROMETER" 
      titleColor="purple" 
      onGoHome={onGoHome}
      backgroundImage={backgroundImage}
    >
          <AccelerometerData
            currentAcceleration={convertToUnit(currentAcceleration, unitType)}
            maxAcceleration={convertToUnit(maxAcceleration, unitType)}
            movementEquivalent={movementEquivalent}
            highestMovementEquivalent={highestMovementEquivalent}
            accelerometerData={accelerometerData}
            unitType={unitType}
            expectedGravity={getExpectedGravity(unitType)}
          />

          <AccelerometerControls
            subscription={subscription}
            onToggleAccelerometer={toggleAccelerometer}
            onResetMaxAcceleration={resetMaxAcceleration}
            unitType={getUnitLabel(unitType)}
            onToggleUnit={toggleUnit}
          />

          {/* Speed Plot */}
          <View className="bg-gray-900 p-4 rounded-lg mt-4">
            <Text className="text-gray-400 text-sm font-mono mb-2">ACCELERATION HISTORY</Text>
            <AccelerometerPlot
              speedHistory={accelerationHistory.map(val => convertToUnit(val, unitType))}
              maxSpeed={convertToUnit(maxAcceleration, unitType)}
              historyLength={HISTORY_LENGTH}
              unitType={unitType}
              normalized={normalized}
              title="ACCELERATION PLOT"
              color="purple"
            />
          </View>
    </ScreenTemplate>
  );
} 
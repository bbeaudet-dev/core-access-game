import { Accelerometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../contexts/PuzzleContext';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
import AccelerometerControls from './AccelerometerControls';
import AccelerometerData from './AccelerometerData';
import AccelerometerUnavailable from './AccelerometerUnavailable';
import SpeedPlot from './SpeedPlot';

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
  const [movementType, setMovementType] = useState<string>('STATIONARY');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [accelerationHistory, setAccelerationHistory] = useState<number[]>([]); // For sparkline
  const [unitType, setUnitType] = useState<UnitType>('g'); // Unit toggle
  const [normalized, setNormalized] = useState(false); // Normalized graph toggle
  
  const { updatePuzzleProgress, completePuzzle } = usePuzzle();

  // Acceleration threshold to unlock puzzle (in g-force)
  const UNLOCK_THRESHOLD = 1.5; // ~15 m/s² in g-force units
  // Sparkline settings
  const HISTORY_LENGTH = 200; // 20 seconds at 10Hz

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
        
        // Update acceleration history for sparkline
        setAccelerationHistory(prev => {
          const next = [...prev, acceleration];
          // Keep only the last HISTORY_LENGTH samples
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

        // Determine movement type
        if (acceleration < 1.1) {
          setMovementType('STATIONARY');
        } else if (acceleration < 2.5) {
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
    setAccelerationHistory([]);
  };

  if (!isAvailable) {
    return <AccelerometerUnavailable error={error} onGoHome={onGoHome} />;
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="ACCELEROMETER" color="purple" />
          
          <View className="flex flex-row justify-between">
            {/* Unit Toggle Button */}
            <View className="bg-gray-900 p-3 rounded-lg mb-4">
              <Text className="text-gray-400 text-sm font-mono mb-2">UNITS</Text>
              <TouchableOpacity 
                onPress={toggleUnit}
                className="bg-purple-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-center font-mono">
                  {getUnitLabel(unitType)}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Graph Toggle Button */}
            <View className="bg-gray-900 p-3 rounded-lg mb-4">
              <Text className="text-gray-400 text-sm font-mono mb-2">GRAPH MODE</Text>
              <TouchableOpacity 
                onPress={() => setNormalized(!normalized)}
                className={`px-4 py-2 rounded-lg ${normalized ? 'bg-green-600' : 'bg-blue-600'}`}
              >
                <Text className="text-white text-center font-mono">
                  {normalized ? 'NORMALIZED' : 'FULL RANGE'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          
          <AccelerometerData 
            currentAcceleration={convertToUnit(currentAcceleration, unitType)}
            maxAcceleration={convertToUnit(maxAcceleration, unitType)}
            movementType={movementType}
            accelerometerData={accelerometerData}
            unitType={unitType}
            expectedGravity={getExpectedGravity(unitType)}
          />

          {/* Speed Plot Component */}
          <SpeedPlot 
            speedHistory={accelerationHistory.map(val => convertToUnit(val, unitType))}
            maxSpeed={convertToUnit(maxAcceleration, unitType)} 
            historyLength={HISTORY_LENGTH}
            unitType={unitType}
            normalized={normalized}
          />

          <AccelerometerControls 
            subscription={subscription}
            onToggleAccelerometer={toggleAccelerometer}
            onResetMaxAcceleration={resetMaxAcceleration}
          />
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
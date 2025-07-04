import { Text, View } from 'react-native';

type UnitType = 'g' | 'm/s²' | 'ft/s²';

interface AccelerometerDataProps {
  currentAcceleration: number;
  maxAcceleration: number;
  movementEquivalent: string;
  highestMovementEquivalent: string;
  accelerometerData: { x: number; y: number; z: number };
  unitType: UnitType;
  expectedGravity: number;
}

export default function AccelerometerData({ 
  currentAcceleration, 
  maxAcceleration, 
  movementEquivalent, 
  highestMovementEquivalent,
  accelerometerData,
  unitType,
  expectedGravity
}: AccelerometerDataProps) {
  // Calculate gravity ratio
  const gravityRatio = currentAcceleration / expectedGravity;
  
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
  
  return (
    <View className="space-y-4">
      {/* Current Acceleration */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">CURRENT ACCELERATION</Text>
        <Text className="text-purple-400 text-3xl font-mono">
          {currentAcceleration.toFixed(2)}{getUnitLabel(unitType)}
        </Text>
        <Text className="text-gray-500 text-xs font-mono mt-1">
          {gravityRatio.toFixed(2)}g (expected: 1.00g)
        </Text>
      </View>

      {/* Max Acceleration */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">MAX ACCELERATION</Text>
        <Text className="text-blue-400 text-3xl font-mono">
          {maxAcceleration.toFixed(2)}{getUnitLabel(unitType)}
        </Text>
        <Text className="text-gray-500 text-xs font-mono mt-1">
          ({highestMovementEquivalent})
        </Text>
      </View>

      {/* Movement Equivalent */}
      <View className="bg-gray-900 p-4 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">MOVEMENT EQUIVALENT</Text>
        <Text className="text-green-400 text-2xl font-mono">
          {movementEquivalent}
        </Text>
      </View>

      {/* Raw Data */}
      <View className="flex flex-row bg-gray-900 p-4 rounded-lg justify-between">
        <Text className="text-gray-400 text-sm font-mono mb-2">RAW DATA</Text>
        <Text className="text-gray-300 text-sm font-mono">X: {accelerometerData.x.toFixed(3)}</Text>
        <Text className="text-gray-300 text-sm font-mono">Y: {accelerometerData.y.toFixed(3)}</Text>
        <Text className="text-gray-300 text-sm font-mono">Z: {accelerometerData.z.toFixed(3)}</Text>
      </View>
    </View>
  );
} 
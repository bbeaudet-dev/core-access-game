import { Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

type UnitType = 'g' | 'm/s²' | 'ft/s²' | 'hPa' | 'deg/s';

interface SpeedPlotProps {
  speedHistory: number[];
  maxSpeed: number;
  historyLength: number;
  unitType: UnitType;
  normalized?: boolean;
  title?: string;
  color?: string;
}

export default function SpeedPlot({ 
  speedHistory, 
  maxSpeed, 
  historyLength, 
  unitType, 
  normalized = false,
  title = "SPEED PLOT",
  color = "green"
}: SpeedPlotProps) {
  const getUnitLabel = (unit: UnitType): string => {
    switch (unit) {
      case 'g':
        return 'g';
      case 'm/s²':
        return 'm/s²';
      case 'ft/s²':
        return 'ft/s²';
      case 'hPa':
        return 'hPa';
      case 'deg/s':
        return 'deg/s';
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
      case 'hPa':
        return 1013.25; // Standard atmospheric pressure
      case 'deg/s':
        return 0.0; // No baseline for angular velocity
      default:
        return 1.0;
    }
  };

  const getColorClass = (color: string): string => {
    switch (color) {
      case 'green':
        return 'text-green-400';
      case 'blue':
        return 'text-blue-400';
      case 'purple':
        return 'text-purple-400';
      case 'cyan':
        return 'text-cyan-400';
      case 'yellow':
        return 'text-yellow-400';
      case 'red':
        return 'text-red-400';
      default:
        return 'text-green-400';
    }
  };

  const getStrokeColor = (color: string): string => {
    switch (color) {
      case 'green':
        return '#4ade80';
      case 'blue':
        return '#60a5fa';
      case 'purple':
        return '#a78bfa';
      case 'cyan':
        return '#22d3ee';
      case 'yellow':
        return '#facc15';
      case 'red':
        return '#f87171';
      default:
        return '#4ade80';
    }
  };

  if (speedHistory.length < 2) {
    return (
      <View className="bg-gray-900 p-6 rounded-lg">
        <Text className="text-gray-400 text-sm font-mono mb-2">{title}</Text>
        <View className="h-20 bg-gray-800 rounded-lg flex items-center justify-center">
          <Text className="text-gray-500 text-xs font-mono">
            Insufficient data ({speedHistory.length} readings)
          </Text>
        </View>
      </View>
    );
  }

  const expectedGravity = getExpectedGravity(unitType);
  const baseline = normalized ? expectedGravity : 0;
  const maxValue = Math.max(maxSpeed, ...speedHistory);
  const minValue = Math.min(0, ...speedHistory);
  const range = maxValue - minValue;
  
  const width = 300;
  const height = 80;
  const padding = 10;

  const points = speedHistory.map((speed, index) => {
    const x = padding + (index / (speedHistory.length - 1)) * (width - 2 * padding);
    const normalizedSpeed = range > 0 ? (speed - minValue) / range : 0.5;
    const y = height - padding - normalizedSpeed * (height - 2 * padding);
    return `${x},${y}`;
  }).join(' ');

  return (
    <View className="bg-gray-900 p-6 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">{title}</Text>
      
      <View className="flex flex-row justify-between items-center mb-2">
        <Text className={`text-xs font-mono ${getColorClass(color)}`}>
          Max: {maxSpeed.toFixed(1)} {getUnitLabel(unitType)}
        </Text>
        <Text className="text-gray-500 text-xs font-mono">
          {speedHistory.length} readings
        </Text>
      </View>

      <View className="bg-gray-800 rounded-lg p-2">
        <Svg width={width} height={height}>
          <Polyline
            points={points}
            stroke={getStrokeColor(color)}
            strokeWidth="2"
            fill="none"
          />
        </Svg>
      </View>

      {normalized && (
        <Text className="text-gray-500 text-xs font-mono text-center mt-2">
          Normalized to {expectedGravity.toFixed(1)} {getUnitLabel(unitType)}
        </Text>
      )}
    </View>
  );
} 
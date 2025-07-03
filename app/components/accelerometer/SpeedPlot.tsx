import { Text, View } from 'react-native';
import Svg, { Polyline } from 'react-native-svg';

type UnitType = 'g' | 'm/s²' | 'ft/s²';

interface SpeedPlotProps {
  speedHistory: number[];
  maxSpeed: number;
  historyLength: number;
  unitType: UnitType;
  normalized?: boolean;
}

export default function SpeedPlot({ speedHistory, maxSpeed, historyLength, unitType, normalized = false }: SpeedPlotProps) {
  if (speedHistory.length < 2) return null;
  
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
  
  const expectedGravity = getExpectedGravity(unitType);
  const max = Math.max(maxSpeed, expectedGravity); // Use current max speed for y-axis
  const min = normalized ? expectedGravity * 0.8 : 0; // Start at 0.8g if normalized, 0 otherwise
  const width = 300;
  // Height grows with max speed: 30px at 0, 200px at 50+, capped at 200
  const minHeight = 30;
  const maxHeight = 200;
  const height = Math.min(minHeight + (max / 50) * (maxHeight - minHeight), maxHeight);
  // Reverse the speedHistory so newest is on the left
  const reversed = [...speedHistory].reverse();
  const points = reversed.map((s, i) => {
    const x = (i / (historyLength - 1)) * width;
    const y = height - ((s - min) / (max - min)) * height;
    return `${x},${y}`;
  }).join(' ');
  // Y-axis labels
  const labels = [min, min + (max - min) / 3, min + (2 * (max - min)) / 3, max];
  // Dynamic color
  let color = '#ef4444'; // red
  if (max >= 100) color = '#ec4899'; // pink
  else if (max >= 50) color = '#34d399'; // green
  else if (max >= 40) color = '#fde047'; // yellow
  else if (max >= 25) color = '#f59e42'; // orange
  // else red
  
  return (
    <View className="items-center my-2 flex-row flex-shrink">
      {/* Y-axis labels */}
      <View style={{ height, justifyContent: 'space-between', marginRight: 8 }}>
        {labels.slice().reverse().map((val, idx) => (
          <Text key={idx} className="text-gray-500 text-xs font-mono" style={{ height: height / 3, textAlign: 'right' }}>
            {val.toFixed(1)}{getUnitLabel(unitType)}
          </Text>
        ))}
      </View>
      <View style={{ backgroundColor: '#222', borderRadius: 8, padding: 4 }}>
        <Svg width={width} height={height}>
          <Polyline
            fill="none"
            stroke={color}
            strokeWidth="3"
            points={points}
          />
        </Svg>
      </View>
    </View>
  );
} 
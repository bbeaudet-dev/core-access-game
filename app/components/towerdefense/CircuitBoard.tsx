import { TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Path, Rect } from 'react-native-svg';
import { Bug, Tower } from './types';

interface CircuitBoardProps {
  bugs: Bug[];
  towers: Tower[];
  selectedTower: 'defender' | null;
  towerPositions: { x: number; y: number }[];
  towerRange: number;
  onPlaceTower: (x: number, y: number) => void;
}

export default function CircuitBoard({
  bugs,
  towers,
  selectedTower,
  towerPositions,
  towerRange,
  onPlaceTower
}: CircuitBoardProps) {
  // Circuit board path coordinates (simplified path)
  const circuitPath = [
    { x: 0, y: 100 },   // Start
    { x: 50, y: 100 },  // Right
    { x: 50, y: 50 },   // Up
    { x: 150, y: 50 },  // Right
    { x: 150, y: 150 }, // Down
    { x: 250, y: 150 }, // Right
    { x: 250, y: 100 }, // Up
    { x: 300, y: 100 }, // Right (end)
  ];

  return (
    <View className="flex-1 bg-gray-900 rounded-lg p-4 mb-4 relative">
      <Svg width="100%" height="100%" viewBox="0 0 320 200">
        {/* Circuit board background */}
        <Rect x="0" y="0" width="320" height="200" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
        
        {/* Circuit paths */}
        <Path
          d="M 0 100 L 50 100 L 50 50 L 150 50 L 150 150 L 250 150 L 250 100 L 320 100"
          stroke="#00ff00"
          strokeWidth="3"
          fill="none"
          strokeDasharray="5,5"
        />
        
        {/* Circuit nodes */}
        {circuitPath.map((point, index) => (
          <Circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="4"
            fill="#00ff00"
          />
        ))}
        
        {/* Tower placement spots */}
        {towerPositions.map((pos, index) => (
          <Rect
            key={index}
            x={pos.x - 15}
            y={pos.y - 15}
            width="30"
            height="30"
            fill={selectedTower ? "#444" : "#333"}
            stroke="#666"
            strokeWidth="1"
            rx="2"
          />
        ))}
        
        {/* Placed towers */}
        {towers.map(tower => (
          <Circle
            key={tower.id}
            cx={tower.x}
            cy={tower.y}
            r="12"
            fill="#ff6600"
            stroke="#ffaa00"
            strokeWidth="2"
          />
        ))}
        
        {/* Bugs */}
        {bugs.map(bug => (
          <Circle
            key={bug.id}
            cx={bug.x}
            cy={bug.y}
            r="6"
            fill="#ff0000"
            stroke="#ff6666"
            strokeWidth="1"
          />
        ))}
        
        {/* Tower range indicators */}
        {selectedTower && towerPositions.map((pos, index) => (
          <Circle
            key={`range-${index}`}
            cx={pos.x}
            cy={pos.y}
            r={towerRange}
            fill="rgba(255, 102, 0, 0.1)"
            stroke="rgba(255, 102, 0, 0.3)"
            strokeWidth="1"
          />
        ))}
      </Svg>
      
      {/* Click handlers for tower placement */}
      {towerPositions.map((pos, index) => (
        <TouchableOpacity
          key={`click-${index}`}
          className="absolute w-8 h-8"
          style={{ left: pos.x - 15, top: pos.y - 15 }}
          onPress={() => onPlaceTower(pos.x, pos.y)}
        />
      ))}
    </View>
  );
} 
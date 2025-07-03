import { TouchableOpacity, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { Bug, Tower } from './types';

interface CircuitBoardProps {
  bugs: Bug[];
  towers: Tower[];
  selectedTower: 'defender' | null;
  towerPositions: { x: number; y: number }[];
  towerRange: number;
  onPlaceTower: (x: number, y: number) => void;
  corePulse?: number; // 0-1 for animation
  lastPlaced?: { x: number; y: number } | null;
}

// Helper to get angle between two points
function getAngle(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;
}

// Pixel bug SVGs
function PixelBug1({ x, y, angle = 0, scale = 1.1 }: { x: number; y: number; angle?: number; scale?: number }) {
  return (
    <G x={x} y={y} rotation={angle + 90} scale={scale} originX={0} originY={0}>
      {/* Body */}
      <Rect x={-6} y={-8} width={12} height={16} fill="#a52a2a" />
      {/* Head */}
      <Rect x={-6} y={-12} width={12} height={6} fill="#a52a2a" />
      {/* Eyes */}
      <Rect x={-4} y={-11} width={2} height={2} fill="#fff" />
      <Rect x={2} y={-11} width={2} height={2} fill="#fff" />
      {/* Legs */}
      <Rect x={-10} y={-6} width={4} height={2} fill="#a52a2a" />
      <Rect x={6} y={-6} width={4} height={2} fill="#a52a2a" />
      <Rect x={-10} y={0} width={4} height={2} fill="#a52a2a" />
      <Rect x={6} y={0} width={4} height={2} fill="#a52a2a" />
      <Rect x={-10} y={6} width={4} height={2} fill="#a52a2a" />
      <Rect x={6} y={6} width={4} height={2} fill="#a52a2a" />
    </G>
  );
}
function PixelBug2({ x, y, angle = 0, scale = 1.2 }: { x: number; y: number; angle?: number; scale?: number }) {
  return (
    <G x={x} y={y} rotation={angle} scale={scale} originX={0} originY={0}>
      {/* Body */}
      <Ellipse cx={0} cy={0} rx={7} ry={12} fill="#222" />
      {/* Wings */}
      <Ellipse cx={-4} cy={2} rx={4} ry={8} fill="#bbb" opacity={0.7} />
      <Ellipse cx={4} cy={2} rx={4} ry={8} fill="#bbb" opacity={0.7} />
      {/* Head */}
      <Ellipse cx={0} cy={-10} rx={4} ry={4} fill="#222" />
      {/* Eyes */}
      <Ellipse cx={-2} cy={-12} rx={1.2} ry={1.2} fill="#fff" />
      <Ellipse cx={2} cy={-12} rx={1.2} ry={1.2} fill="#fff" />
    </G>
  );
}
function PixelBug3({ x, y, angle = 0, scale = 1.3 }: { x: number; y: number; angle?: number; scale?: number }) {
  return (
    <G x={x} y={y} rotation={angle} scale={scale} originX={0} originY={0}>
      {/* Body */}
      <Rect x={-3} y={-10} width={6} height={20} fill="#8B5E3C" />
      {/* Antennae */}
      <Rect x={-4} y={-13} width={2} height={4} fill="#8B5E3C" />
      <Rect x={2} y={-13} width={2} height={4} fill="#8B5E3C" />
    </G>
  );
}

export default function CircuitBoard({
  bugs,
  towers,
  selectedTower,
  towerPositions,
  towerRange,
  onPlaceTower,
  corePulse = 0,
  lastPlaced = null
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

  // For each bug, calculate its angle based on its path segment
  function getBugAngle(bug: Bug) {
    const idx = Math.floor(bug.pathIndex);
    const nextIdx = Math.min(idx + 1, circuitPath.length - 1);
    const p1 = circuitPath[idx];
    const p2 = circuitPath[nextIdx];
    return getAngle(p1.x, p1.y, p2.x, p2.y);
  }

  // Assign bug types for variety
  function renderBug(bug: Bug, i: number) {
    const angle = getBugAngle(bug);
    if (i % 3 === 0) return <PixelBug1 key={bug.id} x={bug.x} y={bug.y} angle={angle} scale={1.1} />;
    if (i % 3 === 1) return <PixelBug2 key={bug.id} x={bug.x} y={bug.y} angle={angle} scale={1.2} />;
    return <PixelBug3 key={bug.id} x={bug.x} y={bug.y} angle={angle} scale={1.3} />;
  }

  // Pulsating core animation
  const coreX = circuitPath[circuitPath.length - 1].x;
  const coreY = circuitPath[circuitPath.length - 1].y;
  const coreRadius = 18 + 6 * Math.abs(Math.sin(corePulse * Math.PI * 2));

  return (
    <View className="flex-1 bg-gray-900 rounded-lg p-4 mb-4 relative">
      <Svg width="100%" height="100%" viewBox="0 0 320 200">
        {/* Circuit board background */}
        <Rect x="0" y="0" width="320" height="200" fill="#1a1a1a" stroke="#333" strokeWidth="2"/>
        {/* More traces, pads, chips for realism */}
        <Rect x={40} y={40} width={30} height={12} fill="#222" stroke="#666" strokeWidth={1} rx={2} />
        <Rect x={220} y={60} width={40} height={18} fill="#222" stroke="#666" strokeWidth={1} rx={2} />
        <Rect x={120} y={140} width={24} height={10} fill="#333" stroke="#888" strokeWidth={1} rx={2} />
        <Circle cx={60} cy={180} r={4} fill="#ff0" />
        <Circle cx={260} cy={30} r={3} fill="#ff0" />
        <Path d="M 60 180 Q 100 120 160 100" stroke="#0ff" strokeWidth="2" fill="none" />
        <Path d="M 160 100 Q 220 120 290 170" stroke="#0ff" strokeWidth="2" fill="none" />
        <Path d="M 40 46 L 120 50" stroke="#0f0" strokeWidth="1" />
        <Path d="M 220 70 L 300 100" stroke="#0f0" strokeWidth="1" />
        {/* Main circuit path */}
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
          <G key={tower.id}>
            <Circle
              cx={tower.x}
              cy={tower.y}
              r="12"
              fill="#ff6600"
              stroke="#ffaa00"
              strokeWidth="2"
            />
            {/* Highlight if just placed */}
            {lastPlaced && tower.x === lastPlaced.x && tower.y === lastPlaced.y && (
              <Circle
                cx={tower.x}
                cy={tower.y}
                r="16"
                fill="none"
                stroke="#fff"
                strokeWidth="3"
                opacity={0.7}
              />
            )}
          </G>
        ))}
        {/* Bugs (pixel art, bigger, rotated) */}
        {bugs.map((bug, i) => renderBug(bug, i))}
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
        {/* Pulsating CORE at the end */}
        <G>
          <Circle cx={coreX} cy={coreY} r={coreRadius} fill="#fff" opacity={0.15 + 0.15 * Math.abs(Math.sin(corePulse * Math.PI * 2))} />
          <Circle cx={coreX} cy={coreY} r={14} fill="#00faff" stroke="#fff" strokeWidth={2} />
          <Circle cx={coreX} cy={coreY} r={7} fill="#00eaff" />
        </G>
      </Svg>
      {/* Click handlers for tower placement */}
      {selectedTower && towerPositions.map((pos, index) => (
        <TouchableOpacity
          key={`click-${index}`}
          className="absolute w-8 h-8 border-2 border-red-500"
          style={{ left: pos.x - 15, top: pos.y - 15, backgroundColor: 'rgba(255,0,0,0.2)', zIndex: 100, borderRadius: 8 }}
          activeOpacity={0.5}
          onPress={() => {
            console.log('Tower placement overlay clicked at', pos.x, pos.y);
            onPlaceTower(pos.x, pos.y);
          }}
        />
      ))}
    </View>
  );
} 
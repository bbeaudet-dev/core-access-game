import { TouchableOpacity, View } from 'react-native';
import { Ellipse, G, Rect } from 'react-native-svg';

interface Bug {
  id: number;
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  pathIndex: number;
  speed: number;
}

interface Tower {
  id: number;
  x: number;
  y: number;
  type: 'defender';
  damage: number;
  range: number;
  lastShot: number;
}

interface CircuitPathPoint {
  x: number;
  y: number;
}

interface CircuitBoardProps {
  bugs: Bug[];
  towers: Tower[];
  circuitPath: CircuitPathPoint[];
  coreX: number;
  coreY: number;
  corePulse: number;
  projectiles: { x: number; y: number; id: number }[];
  lastPlaced: { x: number; y: number } | null;
  onPlaceTower: (x: number, y: number) => void;
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
  circuitPath,
  coreX,
  coreY,
  corePulse,
  projectiles,
  lastPlaced,
  onPlaceTower
}: CircuitBoardProps) {
  // For each bug, calculate its angle based on its path segment
  function getBugAngle(bug: Bug) {
    const pathIndex = Math.floor(bug.pathIndex);
    if (pathIndex >= circuitPath.length - 1) return 0;
    
    const currentPoint = circuitPath[pathIndex];
    const nextPoint = circuitPath[pathIndex + 1];
    return Math.atan2(nextPoint.y - currentPoint.y, nextPoint.x - currentPoint.x) * 180 / Math.PI;
  }

  function renderBug(bug: Bug, index: number) {
    const angle = getBugAngle(bug);
    const healthPercent = bug.health / bug.maxHealth;
    
    return (
      <View
        key={bug.id}
        className="absolute w-4 h-4 items-center justify-center"
        style={{
          left: bug.x - 8,
          top: bug.y - 8,
          transform: [{ rotate: `${angle}deg` }],
        }}
      >
        <View 
          className="w-4 h-4 rounded-full items-center justify-center"
          style={{
            backgroundColor: `rgba(255, ${Math.floor(100 * healthPercent)}, 0, 0.8)`,
          }}
        >
          <View className="w-2 h-2 rounded-full bg-red-200" />
        </View>
      </View>
    );
  }

  // Pulsating core animation
  const coreRadius = 18 + 6 * Math.abs(Math.sin(corePulse * Math.PI * 2));

  return (
    <View className="flex-1 relative bg-gray-900">
      {/* Circuit board background */}
      <View className="absolute inset-0 bg-gray-800 opacity-20" />
      
      {/* Circuit path */}
      <View className="absolute inset-0">
        {circuitPath.map((point, index) => {
          if (index === 0) return null;
          const prevPoint = circuitPath[index - 1];
          const isHorizontal = Math.abs(point.x - prevPoint.x) > Math.abs(point.y - prevPoint.y);
          
          return (
            <View
              key={index}
              className="absolute bg-green-400"
              style={{
                left: isHorizontal ? Math.min(prevPoint.x, point.x) : point.x - 2,
                top: isHorizontal ? point.y - 2 : Math.min(prevPoint.y, point.y),
                width: isHorizontal ? Math.abs(point.x - prevPoint.x) : 4,
                height: isHorizontal ? 4 : Math.abs(point.y - prevPoint.y),
              }}
            />
          );
        })}
      </View>
      
      {/* Core */}
      <View 
        className="absolute w-8 h-8 rounded-full bg-red-500 items-center justify-center"
        style={{
          left: coreX - 16,
          top: coreY - 16,
          opacity: 0.7 + corePulse * 0.3,
        }}
      >
        <View className="w-4 h-4 rounded-full bg-red-300" />
      </View>
      
      {/* Bugs */}
      {bugs.map((bug, i) => renderBug(bug, i))}
      
      {/* Towers */}
      {towers.map(tower => (
        <View
          key={tower.id}
          className="absolute w-6 h-6 rounded-full bg-blue-500 items-center justify-center"
          style={{
            left: tower.x - 12,
            top: tower.y - 12,
          }}
        >
          <View className="w-3 h-3 rounded-full bg-blue-300" />
        </View>
      ))}
      
      {/* Projectiles */}
      {projectiles.map(projectile => (
        <View
          key={projectile.id}
          className="absolute w-2 h-2 rounded-full bg-yellow-400"
          style={{
            left: projectile.x - 4,
            top: projectile.y - 4,
          }}
        />
      ))}
      
      {/* Tower placement spots */}
      {[
        { x: 25, y: 75 },
        { x: 100, y: 25 },
        { x: 200, y: 75 },
        { x: 275, y: 125 },
      ].map((position, index) => {
        const isOccupied = towers.some(tower => tower.x === position.x && tower.y === position.y);
        const isLastPlaced = lastPlaced && lastPlaced.x === position.x && lastPlaced.y === position.y;
        
        return (
          <TouchableOpacity
            key={index}
            onPress={() => onPlaceTower(position.x, position.y)}
            className={`absolute w-8 h-8 rounded-full border-2 items-center justify-center ${
              isOccupied 
                ? 'bg-gray-600 border-gray-500' 
                : isLastPlaced
                  ? 'bg-green-500 border-green-400'
                  : 'bg-gray-700 border-gray-400'
            }`}
            style={{
              left: position.x - 16,
              top: position.y - 16,
            }}
          >
            {isOccupied && <View className="w-4 h-4 rounded-full bg-gray-400" />}
          </TouchableOpacity>
        );
      })}
    </View>
  );
} 
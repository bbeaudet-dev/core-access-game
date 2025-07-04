import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import CircuitBoard from './CircuitBoard';
import GameControls from './GameControls';
import GameHeader from './GameHeader';
import GameOverScreen from './GameOverScreen';
import TowerSelector from './TowerSelector';

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

interface GameState {
  level: number;
  lives: number;
  money: number;
  bugs: Bug[];
  towers: Tower[];
  wave: number;
  waveInProgress: boolean;
  gameOver: boolean;
}

interface CircuitPathPoint {
  x: number;
  y: number;
}

interface TowerDefenseGameProps {
  onEmergencyMode: () => void;
}

export default function TowerDefenseGame({ onEmergencyMode }: TowerDefenseGameProps) {
  const [gameState, setGameState] = useState<GameState>({
    level: 1,
    lives: 20,
    money: 100,
    bugs: [],
    towers: [],
    wave: 1,
    waveInProgress: false,
    gameOver: false
  });

  const [selectedTower, setSelectedTower] = useState<'defender' | null>(null);
  const [gameTime, setGameTime] = useState(0);
  const [corePulse, setCorePulse] = useState(0);
  const corePulseRef = useRef(0);
  const corePulseAnim = useRef<ReturnType<typeof setInterval> | null>(null);
  const [lastPlaced, setLastPlaced] = useState<{ x: number; y: number } | null>(null);

  // Tower placement positions
  const towerPositions = [
    { x: 25, y: 75 },
    { x: 100, y: 25 },
    { x: 200, y: 75 },
    { x: 275, y: 125 },
  ];

  const TOWER_COST = 50;
  const TOWER_DAMAGE = 25;
  const TOWER_RANGE = 60;

  // Circuit board path coordinates (simplified path)
  const circuitPath: CircuitPathPoint[] = [
    { x: 0, y: 100 },   // Start
    { x: 50, y: 100 },  // Right
    { x: 50, y: 50 },   // Up
    { x: 150, y: 50 },  // Right
    { x: 150, y: 150 }, // Down
    { x: 250, y: 150 }, // Right
    { x: 250, y: 100 }, // Up
    { x: 300, y: 100 }, // Right (end)
  ];
  const coreX = circuitPath[circuitPath.length - 1].x;
  const coreY = circuitPath[circuitPath.length - 1].y;

  // Animate core pulse
  useEffect(() => {
    corePulseAnim.current = setInterval(() => {
      corePulseRef.current += 0.025;
      setCorePulse(corePulseRef.current % 1);
    }, 30);
    return () => { if (corePulseAnim.current) clearInterval(corePulseAnim.current); };
  }, []);

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameTime(prev => prev + 1);
      updateGame();
    }, 100);
    return () => clearInterval(gameLoop);
  }, [gameState]);

  // Projectiles/flash effect state
  const [projectiles, setProjectiles] = useState<{x: number, y: number, id: number}[]>([]);

  const updateGame = () => {
    setGameState(prev => {
      let newState = { ...prev };

      // Update bug positions
      newState.bugs = prev.bugs.map(bug => {
        const newBug = { ...bug };
        newBug.pathIndex += bug.speed * 0.018; // SLOWER
        
        // Check if bug reached the core
        if (newBug.pathIndex >= circuitPath.length - 1) {
          // Emergency bootup
          setTimeout(() => onEmergencyMode(), 500);
          return null;
        }
        
        // Update position
        const currentPoint = circuitPath[Math.floor(newBug.pathIndex)];
        const nextPoint = circuitPath[Math.floor(newBug.pathIndex) + 1];
        const progress = newBug.pathIndex - Math.floor(newBug.pathIndex);
        
        newBug.x = currentPoint.x + (nextPoint.x - currentPoint.x) * progress;
        newBug.y = currentPoint.y + (nextPoint.y - currentPoint.y) * progress;
        
        return newBug;
      }).filter(Boolean) as Bug[];

      // Tower shooting
      newState.towers = prev.towers.map(tower => {
        const newTower = { ...tower };
        // Find bugs in range
        const bugsInRange = newState.bugs.filter(bug => {
          const distance = Math.sqrt(
            Math.pow(bug.x - tower.x, 2) + Math.pow(bug.y - tower.y, 2)
          );
          return distance <= TOWER_RANGE;
        });
        if (bugsInRange.length > 0 && gameTime - tower.lastShot > 10) {
          // Shoot at closest bug
          const target = bugsInRange[0];
          target.health -= TOWER_DAMAGE;
          newTower.lastShot = gameTime;
          // Add projectile/flash effect
          setProjectiles(prev => [...prev, { x: target.x, y: target.y, id: Date.now() + Math.random() }]);
          if (target.health <= 0) {
            newState.money += 10;
            newState.bugs = newState.bugs.filter(b => b.id !== target.id);
          }
        }
        return newTower;
      });

      // Check for game over (not used, handled by core breach)
      if (newState.lives <= 0) {
        newState.gameOver = true;
        if (newState.level === 1) {
          return {
            ...newState,
            level: 2,
            lives: 10,
            money: 150,
            bugs: [],
            towers: [],
            wave: 1,
            waveInProgress: false,
            gameOver: false
          };
        } else {
          setTimeout(() => onEmergencyMode(), 1000);
        }
      }

      // Spawn waves
      if (!newState.waveInProgress && newState.bugs.length === 0) {
        spawnWave(newState);
      }

      return newState;
    });
  };

  const spawnWave = (state: GameState) => {
    const waveSize = state.level === 1 ? 5 : 15;
    // Make bugs even faster
    const bugSpeed = state.level === 1 ? 2.5 : 5.0;
    const bugHealth = state.level === 1 ? 50 : 100;
    const newBugs: Bug[] = [];
    for (let i = 0; i < waveSize; i++) {
      newBugs.push({
        id: Date.now() + i,
        x: circuitPath[0].x,
        y: circuitPath[0].y,
        health: bugHealth,
        maxHealth: bugHealth,
        pathIndex: 0,
        speed: i === 0 ? bugSpeed * 2 : bugSpeed // First bug is even faster
      });
    }
    state.bugs = newBugs;
    state.waveInProgress = true;
    state.wave += 1;
  };

  const placeTower = (x: number, y: number) => {
    const spotTaken = gameState.towers.some(tower => tower.x === x && tower.y === y);
    if (selectedTower && gameState.money >= TOWER_COST && !spotTaken) {
      setGameState(prev => ({
        ...prev,
        towers: [...prev.towers, {
          id: Date.now(),
          x,
          y,
          type: selectedTower,
          damage: TOWER_DAMAGE,
          range: TOWER_RANGE,
          lastShot: 0
        }],
        money: prev.money - TOWER_COST
      }));
      setLastPlaced({ x, y });
      setTimeout(() => setLastPlaced(null), 400);
      setSelectedTower(null);
    }
  };

  const startWave = () => {
    if (!gameState.waveInProgress && gameState.bugs.length === 0) {
      spawnWave(gameState);
    }
  };

  const handleExit = () => {
    onEmergencyMode();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setProjectiles([]);
    }, 200);
    return () => clearTimeout(timer);
  }, [projectiles]);

  if (gameState.gameOver) {
    return (
      <GameOverScreen 
        level={gameState.level}
      />
    );
  }

  return (
    <View className="flex-1 bg-black">
      <GameHeader 
        level={gameState.level}
        lives={gameState.lives}
        money={gameState.money}
      />
      
      <View className="flex-1 relative">
        <CircuitBoard 
          bugs={gameState.bugs}
          towers={gameState.towers}
          circuitPath={circuitPath}
          coreX={coreX}
          coreY={coreY}
          corePulse={corePulse}
          projectiles={projectiles}
          lastPlaced={lastPlaced}
          onPlaceTower={placeTower}
        />
      </View>
      
      <View className="p-4 space-y-4">
        <TowerSelector 
          selectedTower={selectedTower}
          onSelectTower={setSelectedTower}
          towerCost={TOWER_COST}
        />
        
        <GameControls 
          wave={gameState.wave}
          bugsCount={gameState.bugs.length}
          waveInProgress={gameState.waveInProgress}
          level={gameState.level}
          onStartWave={startWave}
        />
      </View>
    </View>
  );
} 
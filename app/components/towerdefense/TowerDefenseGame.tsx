import { useEffect, useState } from 'react';
import { View } from 'react-native';
import CircuitBoard from './CircuitBoard';
import GameControls from './GameControls';
import GameHeader from './GameHeader';
import GameOverScreen from './GameOverScreen';
import TowerSelector from './TowerSelector';
import { Bug, GameState } from './types';

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

  useEffect(() => {
    const gameLoop = setInterval(() => {
      setGameTime(prev => prev + 1);
      updateGame();
    }, 100);

    return () => clearInterval(gameLoop);
  }, [gameState]);

  const updateGame = () => {
    setGameState(prev => {
      let newState = { ...prev };

      // Update bug positions
      newState.bugs = prev.bugs.map(bug => {
        const newBug = { ...bug };
        newBug.pathIndex += bug.speed * 0.01;
        
        if (newBug.pathIndex >= circuitPath.length - 1) {
          // Bug reached the end
          newState.lives -= 1;
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

        if (bugsInRange.length > 0 && gameTime - tower.lastShot > 20) {
          // Shoot at closest bug
          const target = bugsInRange[0];
          target.health -= TOWER_DAMAGE;
          newTower.lastShot = gameTime;
          
          if (target.health <= 0) {
            newState.money += 10;
            newState.bugs = newState.bugs.filter(b => b.id !== target.id);
          }
        }
        
        return newTower;
      });

      // Check for game over
      if (newState.lives <= 0) {
        newState.gameOver = true;
        if (newState.level === 1) {
          // Level 1 is easy, just restart
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
          // Level 2 is impossible, trigger emergency mode
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
    const bugSpeed = state.level === 1 ? 0.5 : 1.5;
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
        speed: bugSpeed
      });
    }

    state.bugs = newBugs;
    state.waveInProgress = true;
    state.wave += 1;
  };

  const placeTower = (x: number, y: number) => {
    if (selectedTower && gameState.money >= TOWER_COST) {
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
      setSelectedTower(null);
    }
  };

  const startWave = () => {
    if (!gameState.waveInProgress && gameState.bugs.length === 0) {
      spawnWave(gameState);
    }
  };

  if (gameState.gameOver) {
    return <GameOverScreen level={gameState.level} />;
  }

  return (
    <View className="flex-1 bg-black p-4">
      <GameHeader 
        lives={gameState.lives}
        money={gameState.money}
        level={gameState.level}
      />

      <CircuitBoard
        bugs={gameState.bugs}
        towers={gameState.towers}
        selectedTower={selectedTower}
        towerPositions={towerPositions}
        towerRange={TOWER_RANGE}
        onPlaceTower={placeTower}
      />

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
  );
} 
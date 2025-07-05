import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { useInfection } from '../contexts/InfectionContext';
import { usePuzzle } from '../contexts/PuzzleContext';
import notificationManager from '../utils/notificationManager';
import { PUZZLE_TO_MODULE, shouldModuleBeUnlocked } from '../utils/unlockSystem';
import InfectionProgressBar from './infection/InfectionProgressBar';
import AppIconWithHalo from './ui/AppIconWithHalo';
import ScreenTemplate from './ui/ScreenTemplate';

// Define app status types
type AppStatus = 'completed' | 'in-progress' | 'locked' | 'default';

interface AppModule {
  name: string;
  displayName: string;
  icon: string;
  color: string;
  route: string;
  status: AppStatus;
}

interface HomeScreenProps {
  onOpenModule: (moduleName: string) => void;
}

// Define all modules with their status
const ALL_MODULES: AppModule[] = [
  // Row 1: Tutorial, System, Battery
  { name: 'tutorial', displayName: 'TUTORIAL', icon: '❓', color: 'bg-red-600', route: 'tutorial', status: 'default' },
  { name: 'system', displayName: 'SYSTEM', icon: '⚙️', color: 'bg-red-600', route: 'system', status: 'locked' },
  { name: 'battery', displayName: 'BATTERY', icon: '🔋', color: 'bg-green-600', route: 'battery', status: 'locked' },
  
  // Row 2: Terminal, Clock, Music
  { name: 'terminal', displayName: 'TERMINAL', icon: '💻', color: 'bg-green-600', route: 'terminal', status: 'locked' },
  { name: 'clock', displayName: 'CLOCK', icon: '⏰', color: 'bg-cyan-600', route: 'clock', status: 'locked' },
  { name: 'music', displayName: 'MUSIC', icon: '🎵', color: 'bg-pink-600', route: 'music', status: 'locked' },
  
  // Row 3: Flashlight, Calculator, Compass
  { name: 'flashlight', displayName: 'FLASHLIGHT', icon: '🔦', color: 'bg-yellow-600', route: 'flashlight', status: 'locked' },
  { name: 'calculator', displayName: 'CALCULATOR', icon: '🧮', color: 'bg-orange-600', route: 'calculator', status: 'locked' },
  { name: 'compass', displayName: 'COMPASS', icon: '🧭', color: 'bg-blue-600', route: 'compass', status: 'locked' },
  
  // Row 4: Gyro, Camera, Microphone
  { name: 'gyro', displayName: 'GYRO', icon: '🔄', color: 'bg-green-600', route: 'gyro', status: 'locked' },
  { name: 'camera', displayName: 'CAMERA', icon: '📷', color: 'bg-purple-600', route: 'camera', status: 'locked' },
  { name: 'microphone', displayName: 'MICROPHONE', icon: '🎤', color: 'bg-green-600', route: 'microphone', status: 'locked' },
  
  // Row 5: Maps, Games, WiFi
  { name: 'maps', displayName: 'MAPS', icon: '🗺️', color: 'bg-purple-600', route: 'maps', status: 'locked' },
  { name: 'games', displayName: 'GAMES', icon: '🎮', color: 'bg-purple-600', route: 'games', status: 'locked' },
  { name: 'wifi', displayName: 'WIFI', icon: '📡', color: 'bg-blue-600', route: 'wifi', status: 'locked' },
  
  // Row 6: Weather, Final Boss, Accelerometer
  { name: 'weather', displayName: 'WEATHER', icon: '🌤️', color: 'bg-cyan-600', route: 'weather', status: 'locked' },
  { name: 'finalboss', displayName: 'CORE', icon: '👁️‍🗨️', color: 'bg-red-600', route: 'finalboss', status: 'locked' },
  { name: 'accelerometer', displayName: 'ACCELERATE', icon: '⏫', color: 'bg-purple-600', route: 'accelerometer', status: 'locked' },
];

// Bug type assignments for locked modules
const BUG_ASSIGNMENTS: Record<string, 'caterpillar' | 'beetle' | 'spider' | 'ant' | 'fly' | 'worm'> = {
  'system': 'spider',
  'camera': 'beetle',
  'maps': 'fly',
  'terminal': 'caterpillar',
  'accelerometer': 'worm',
  'compass': 'spider',
  'games': 'beetle',
  'wifi': 'ant',
  'tutorial': 'worm',
  'calculator': 'caterpillar',
  'clock': 'spider',
  'flashlight': 'beetle',
  'music': 'ant',
  'weather': 'fly',
  'finalboss': 'spider',
  'battery': 'fly',
  'gyro': 'worm',
  'microphone': 'ant',
};

export default function HomeScreen({ onOpenModule }: HomeScreenProps) {
  const { infectionProgress, infectionStatus } = useInfection();
  const { getCompletedPuzzles } = usePuzzle();
  const [unlockedModules, setUnlockedModules] = useState<string[]>(['tutorial']); 
  const [unlockAnimations, setUnlockAnimations] = useState<Record<string, boolean>>({});
  const [notifiedModules, setNotifiedModules] = useState<Set<string>>(new Set(['tutorial']));
  const lastCompletedPuzzlesRef = useRef<string[]>([]);

  // Check for new unlocks when completed puzzles change
  useEffect(() => {
    const completedPuzzles = getCompletedPuzzles();
    
    // Only update if completed puzzles actually changed
    const puzzlesChanged = JSON.stringify(completedPuzzles) !== JSON.stringify(lastCompletedPuzzlesRef.current);
    if (!puzzlesChanged) return;
    
    lastCompletedPuzzlesRef.current = completedPuzzles;
    
    const newUnlockedModules: string[] = [];
    
    // Check which modules should be unlocked
    ALL_MODULES.forEach(module => {
      if (shouldModuleBeUnlocked(module.name, completedPuzzles)) {
        newUnlockedModules.push(module.name);
      }
    });
    
    // Find newly unlocked modules
    const newlyUnlocked = newUnlockedModules.filter(module => !unlockedModules.includes(module));
    
    if (newlyUnlocked.length > 0) {
      // Set new unlocked modules
      setUnlockedModules(newUnlockedModules);
      
      // Send notifications for newly unlocked modules (only if not already notified)
      const modulesToNotify = newlyUnlocked.filter(module => !notifiedModules.has(module));
      modulesToNotify.forEach(moduleName => {
        const module = ALL_MODULES.find(m => m.name === moduleName);
        if (module) {
          notificationManager.sendModuleUnlockedNotification(module.displayName);
        }
      });
      
      // Update notified modules set
      setNotifiedModules(prev => new Set([...prev, ...modulesToNotify]));
      
      // Trigger unlock animations
      const newAnimations: Record<string, boolean> = {};
      newlyUnlocked.forEach(module => {
        newAnimations[module] = true;
      });
      setUnlockAnimations(newAnimations);
      
      // Clear animations after 1 second
      setTimeout(() => {
        setUnlockAnimations({});
      }, 1000);
    } else {
      // Update unlocked modules without sending notifications
      setUnlockedModules(newUnlockedModules);
    }
  }, [unlockedModules, notifiedModules]); // Fixed dependency array

  const handleAppPress = (moduleName: string) => {
    onOpenModule(moduleName);
  };

  const getModuleStatus = (moduleName: string): AppStatus => {
    if (unlockedModules.includes(moduleName)) {
      // Check if it has a completed puzzle
      const completedPuzzles = getCompletedPuzzles();
      const puzzleId = Object.keys(PUZZLE_TO_MODULE).find(puzzle => 
        PUZZLE_TO_MODULE[puzzle] === moduleName && completedPuzzles.includes(puzzle)
      );
      return puzzleId ? 'completed' : 'in-progress';
    }
    return 'locked';
  };

  const isFinalBossDefeated = () => {
    const completedPuzzles = getCompletedPuzzles();
    return completedPuzzles.length >= 13; // Total puzzles
  };

  const getModuleBadge = (moduleName: string): string | number | undefined => {
    if (unlockedModules.includes(moduleName)) {
      const completedPuzzles = getCompletedPuzzles();
      const puzzleId = Object.keys(PUZZLE_TO_MODULE).find(puzzle => 
        PUZZLE_TO_MODULE[puzzle] === moduleName && completedPuzzles.includes(puzzle)
      );
      return puzzleId ? undefined : '!';
    }
    return undefined;
  };

  return (
    <View className="flex-1">
      <ScreenTemplate 
        title="HOME" 
        titleColor="red" 
        showHomeButton={false}
        backgroundImage={require('../../assets/images/red frame.png')}
      >
        <View className="flex-row flex-wrap justify-center pb-24 px-1.5">
          {ALL_MODULES.map(module => (
            <View key={module.name} className="w-28 p-2">
              <AppIconWithHalo
                icon={module.icon}
                name={module.displayName}
                color={module.color}
                onPress={() => handleAppPress(module.name)}
                status={getModuleStatus(module.name)}
                badge={getModuleBadge(module.name)}
                bugType={BUG_ASSIGNMENTS[module.name]}
                showUnlockAnimation={unlockAnimations[module.name] || false}
                isFinalBossDefeated={isFinalBossDefeated()}
              />
            </View>
          ))}
        </View>
      </ScreenTemplate>
      
      <InfectionProgressBar 
        progress={infectionProgress} 
        status={infectionStatus} 
      />
    </View>
  );
} 
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export type ModuleName = 
  | 'terminal' 
  | 'system' 
  | 'clock' 
  | 'gyro' 
  | 'compass' 
  | 'microphone' 
  | 'camera' 
  | 'accelerometer'
  | 'wifi'
  | 'tutorial'
  | 'music'
  | 'flashlight'
  | 'battery'
  | 'maps'
  | 'calculator'
  | 'weather'
  | 'games'
  | 'finalboss'

export interface ModuleUnlock {
  name: ModuleName;
  displayName: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
  order: number;
}

interface ModuleUnlockContextType {
  unlockedModules: ModuleName[];
  allModules: ModuleUnlock[];
  unlockModule: (moduleName: ModuleName) => void;
  isModuleUnlocked: (moduleName: ModuleName) => boolean;
  getNextUnlockableModule: () => ModuleUnlock | null;
  resetProgress: () => void;
}

const ModuleUnlockContext = createContext<ModuleUnlockContextType | undefined>(undefined);

const DEFAULT_MODULES: ModuleUnlock[] = [
  {
    name: 'tutorial',
    displayName: 'TUTORIAL',
    icon: '❓',
    color: 'bg-red-600',
    unlocked: true, // Always unlocked
    order: 1
  },
  {
    name: 'terminal',
    displayName: 'TERMINAL',
    icon: '💻',
    color: 'bg-red-500',
    unlocked: true, // Always unlocked
    order: 2
  },
  {
    name: 'system',
    displayName: 'SYSTEM',
    icon: '⚙️',
    color: 'bg-red-500',
    unlocked: true, // Always unlocked
    order: 3
  },
  {
    name: 'clock',
    displayName: 'CLOCK',
    icon: '🕐',
    color: 'bg-yellow-500',
    unlocked: false,
    order: 4
  },
  {
    name: 'gyro',
    displayName: 'GYRO',
    icon: '⚡',
    color: 'bg-red-500',
    unlocked: false,
    order: 5
  },
  {
    name: 'compass',
    displayName: 'COMPASS',
    icon: '🧭',
    color: 'bg-red-500',
    unlocked: false,
    order: 6
  },
  {
    name: 'microphone',
    displayName: 'MICROPHONE',
    icon: '🎵',
    color: 'bg-red-500',
    unlocked: false,
    order: 7
  },
  {
    name: 'camera',
    displayName: 'PHONE CAMERA',
    icon: '📷',
    color: 'bg-red-500',
    unlocked: false,
    order: 8
  },
  {
    name: 'accelerometer',
    displayName: 'ACCELEROMETER',
    icon: '📊',
    color: 'bg-purple-500',
    unlocked: false,
    order: 9
  },
  {
    name: 'wifi',
    displayName: 'WIFI',
    icon: '📡',
    color: 'bg-blue-500',
    unlocked: false,
    order: 10
  },
  {
    name: 'music',
    displayName: 'MUSIC',
    icon: '🎶',
    color: 'bg-green-500',
    unlocked: false,
    order: 11
  },
  {
    name: 'flashlight',
    displayName: 'FLASHLIGHT',
    icon: '💡',
    color: 'bg-yellow-500',
    unlocked: false,
    order: 12
  },
  {
    name: 'battery',
    displayName: 'BATTERY',
    icon: '🔋',
    color: 'bg-purple-500',
    unlocked: false,
    order: 13
  },
  {
    name: 'maps',
    displayName: 'MAPS',
    icon: '🗺️',
    color: 'bg-blue-500',
    unlocked: false,
    order: 14
  },
  {
    name: 'calculator',
    displayName: 'CALCULATOR',
    icon: '📐',
    color: 'bg-green-500',
    unlocked: false,
    order: 15
  },
  {
    name: 'weather',
    displayName: 'WEATHER',
    icon: '🌤️',
    color: 'bg-yellow-500',
    unlocked: false,
    order: 16
  },
  {
    name: 'games',
    displayName: 'GAMES',
    icon: '🎮',
    color: 'bg-red-500',
    unlocked: false,
    order: 17
  },
  {
    name: 'finalboss',
    displayName: 'FINAL BOSS',
    icon: '👑',
    color: 'bg-purple-500',
    unlocked: false,
    order: 18
  }
];

export function ModuleUnlockProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModuleUnlock[]>(DEFAULT_MODULES);

  const unlockedModules = modules
    .filter(module => module.unlocked)
    .map(module => module.name);

  const unlockModule = (moduleName: ModuleName) => {
    setModules(prevModules => 
      prevModules.map(module => 
        module.name === moduleName && !module.unlocked
          ? { ...module, unlocked: true, unlockedAt: new Date() }
          : module
      )
    );
  };

  const isModuleUnlocked = (moduleName: ModuleName) => {
    return unlockedModules.includes(moduleName);
  };

  const getNextUnlockableModule = () => {
    return modules.find(module => !module.unlocked) || null;
  };

  const resetProgress = () => {
    setModules(DEFAULT_MODULES);
  };

  const loadModules = async () => {
    try {
      const savedModules = await AsyncStorage.getItem('unlocked_modules');
      if (savedModules) {
        const parsedModules = JSON.parse(savedModules);
        setModules(parsedModules);
      }
    } catch (error) {
      console.error('Failed to load unlocked modules:', error);
    }
  };

  const saveModules = async () => {
    try {
      await AsyncStorage.setItem('unlocked_modules', JSON.stringify(modules));
    } catch (error) {
      console.error('Failed to save unlocked modules:', error);
    }
  };

  useEffect(() => {
    loadModules();
  }, []);

  useEffect(() => {
    saveModules();
  }, [modules]);

  return (
    <ModuleUnlockContext.Provider value={{
      unlockedModules,
      allModules: modules,
      unlockModule,
      isModuleUnlocked,
      getNextUnlockableModule,
      resetProgress
    }}>
      {children}
    </ModuleUnlockContext.Provider>
  );
}

export function useModuleUnlock() {
  const context = useContext(ModuleUnlockContext);
  if (context === undefined) {
    throw new Error('useModuleUnlock must be used within a ModuleUnlockProvider');
  }
  return context;
}

// Add default export
export default ModuleUnlockProvider; 
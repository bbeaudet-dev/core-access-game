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
  | 'logs'
  | 'help'
  | 'music'

export interface ModuleUnlock {
  name: ModuleName;
  displayName: string;
  icon: string;
  color: string;
  unlocked: boolean;
  unlockedAt?: Date;
  requirement: string;
  order: number;
}

interface ModuleUnlockContextType {
  unlockedModules: ModuleName[];
  allModules: ModuleUnlock[];
  unlockModule: (moduleName: ModuleName) => void;
  isModuleUnlocked: (moduleName: ModuleName) => boolean;
  getNextUnlockableModule: () => ModuleUnlock | null;
  resetProgress: () => void;
  showBugScuttle: boolean;
  triggerBugScuttle: () => void;
}

const ModuleUnlockContext = createContext<ModuleUnlockContextType | undefined>(undefined);

// TEMPORARY: All modules unlocked for testing - EASILY REVERSIBLE
// To revert: change all "unlocked: true" back to "unlocked: false" except terminal, system, clock
const DEFAULT_MODULES: ModuleUnlock[] = [
  {
    name: 'terminal',
    displayName: 'TERMINAL',
    icon: '💻',
    color: 'bg-red-500',
    unlocked: true, // Always unlocked
    requirement: 'Available from start',
    order: 1
  },
  {
    name: 'system',
    displayName: 'SYSTEM',
    icon: '⚙️',
    color: 'bg-red-500',
    unlocked: true, // Always unlocked
    requirement: 'Available from start',
    order: 2
  },
  {
    name: 'clock',
    displayName: 'CLOCK',
    icon: '🕐',
    color: 'bg-yellow-500',
    unlocked: true, // Always unlocked
    requirement: 'Available from start',
    order: 3
  },
  {
    name: 'gyro',
    displayName: 'GYRO',
    icon: '⚡',
    color: 'bg-red-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Solve the clock puzzle (TBD)',
    order: 4
  },
  {
    name: 'compass',
    displayName: 'COMPASS',
    icon: '🧭',
    color: 'bg-red-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock gyroscope module',
    order: 5
  },
  {
    name: 'microphone',
    displayName: 'MICROPHONE',
    icon: '🎵',
    color: 'bg-red-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock compass module',
    order: 6
  },
  {
    name: 'camera',
    displayName: 'PHONE CAMERA',
    icon: '📷',
    color: 'bg-red-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock microphone module',
    order: 7
  },
  {
    name: 'accelerometer',
    displayName: 'ACCELEROMETER',
    icon: '📊',
    color: 'bg-purple-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock camera module',
    order: 8
  },
  {
    name: 'wifi',
    displayName: 'WIFI',
    icon: '📡',
    color: 'bg-blue-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock accelerometer module',
    order: 9
  },
  {
    name: 'logs',
    displayName: 'LOGS',
    icon: '📋',
    color: 'bg-red-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock wifi module',
    order: 10
  },
  {
    name: 'help',
    displayName: 'HELP',
    icon: '💡',
    color: 'bg-blue-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock logs module',
    order: 11
  },
  {
    name: 'music',
    displayName: 'MUSIC',
    icon: '🎶',
    color: 'bg-green-500',
    unlocked: true, // TEMPORARY: Unlocked for testing
    requirement: 'Unlock help module',
    order: 12
  }
];

export function ModuleUnlockProvider({ children }: { children: React.ReactNode }) {
  const [modules, setModules] = useState<ModuleUnlock[]>(DEFAULT_MODULES);
  const [showBugScuttle, setShowBugScuttle] = useState(false);

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
    // Trigger bug scuttle animation when unlocking a module
    triggerBugScuttle();
  };

  const triggerBugScuttle = () => {
    setShowBugScuttle(true);
    setTimeout(() => setShowBugScuttle(false), 3000);
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
      resetProgress,
      showBugScuttle,
      triggerBugScuttle
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
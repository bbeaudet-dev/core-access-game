import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface Hint {
  id: string;
  title: string;
  description: string;
  category: 'gyro' | 'compass' | 'camera' | 'microphone' | 'general';
  unlocked: boolean;
  unlockedAt?: Date;
  condition: string;
}

interface HintContextType {
  hints: Hint[];
  unlockedHints: Hint[];
  unlockHint: (hintId: string) => void;
  checkGyroAchievement: (maxSpeed: number) => void;
  loadHints: () => Promise<void>;
  saveHints: () => Promise<void>;
}

const HintContext = createContext<HintContextType | undefined>(undefined);

const DEFAULT_HINTS: Hint[] = [
  {
    id: 'gyro-speed-demon',
    title: 'Speed Demon',
    description: 'You achieved 75+ degrees/second on the gyroscope! This level of rotation suggests you might be in a vehicle or experiencing extreme movement.',
    category: 'gyro',
    unlocked: false,
    condition: 'Reach 75+ max speed on gyroscope'
  },
  {
    id: 'gyro-first-unlock',
    title: 'First Steps',
    description: 'You unlocked your first gyroscope achievement! The gyroscope measures rotational speed in three dimensions.',
    category: 'gyro',
    unlocked: false,
    condition: 'Unlock any gyroscope feature'
  },
  {
    id: 'compass-navigator',
    title: 'Navigator',
    description: 'You\'ve been using the compass extensively. The compass uses the device\'s magnetometer to detect Earth\'s magnetic field.',
    category: 'compass',
    unlocked: false,
    condition: 'Use compass for 30+ seconds'
  },
  {
    id: 'camera-explorer',
    title: 'Visual Explorer',
    description: 'You accessed the camera module! The camera can be used for various surveillance and analysis tasks.',
    category: 'camera',
    unlocked: false,
    condition: 'Access camera module'
  },
  {
    id: 'audio-listener',
    title: 'Sound Detective',
    description: 'You\'ve been monitoring audio levels. The microphone can detect sound patterns and frequencies.',
    category: 'microphone',
    unlocked: false,
    condition: 'Monitor audio for 10+ seconds'
  }
];

export function HintProvider({ children }: { children: React.ReactNode }) {
  const [hints, setHints] = useState<Hint[]>(DEFAULT_HINTS);

  const unlockedHints = hints.filter(hint => hint.unlocked);

  const unlockHint = (hintId: string) => {
    setHints(prevHints => 
      prevHints.map(hint => 
        hint.id === hintId && !hint.unlocked
          ? { ...hint, unlocked: true, unlockedAt: new Date() }
          : hint
      )
    );
  };

  const checkGyroAchievement = (maxSpeed: number) => {
    if (maxSpeed >= 75) {
      unlockHint('gyro-speed-demon');
    }
    if (maxSpeed >= 50) {
      unlockHint('gyro-first-unlock');
    }
  };

  const loadHints = async () => {
    try {
      const savedHints = await AsyncStorage.getItem('game_hints');
      if (savedHints) {
        const parsedHints = JSON.parse(savedHints);
        setHints(parsedHints);
      }
    } catch (error) {
      console.error('Failed to load hints:', error);
    }
  };

  const saveHints = async () => {
    try {
      await AsyncStorage.setItem('game_hints', JSON.stringify(hints));
    } catch (error) {
      console.error('Failed to save hints:', error);
    }
  };

  useEffect(() => {
    loadHints();
  }, []);

  useEffect(() => {
    saveHints();
  }, [hints]);

  return (
    <HintContext.Provider value={{
      hints,
      unlockedHints,
      unlockHint,
      checkGyroAchievement,
      loadHints,
      saveHints
    }}>
      {children}
    </HintContext.Provider>
  );
}

export function useHints() {
  const context = useContext(HintContext);
  if (context === undefined) {
    throw new Error('useHints must be used within a HintProvider');
  }
  return context;
} 
import React, { createContext, useContext, useEffect, useState } from 'react';
import { usePuzzle } from './PuzzleContext';

interface InfectionContextType {
  infectionProgress: number;
  infectionStatus: string;
  updateProgress: (newProgress: number) => void;
  resetToCritical: () => void;
  unlockModule: (moduleName: string) => void;
  completePuzzle: (puzzleName: string) => void;
}

const InfectionContext = createContext<InfectionContextType | undefined>(undefined);

const getStatusFromProgress = (progress: number): string => {
  if (progress >= 90) return 'CRITICAL';
  if (progress >= 70) return 'SEVERE';
  if (progress >= 50) return 'HIGH';
  if (progress >= 30) return 'MODERATE';
  if (progress >= 10) return 'MILD';
  return 'LOW';
};

// Total number of puzzles in the game
const TOTAL_PUZZLES = 13;
const PROGRESS_PER_PUZZLE = 100 / TOTAL_PUZZLES; // ~7.69% per puzzle

export function InfectionProvider({ children }: { children: React.ReactNode }) {
  const [infectionProgress, setInfectionProgress] = useState(100); // Start at critical
  const { getCompletedPuzzles } = usePuzzle();

  const infectionStatus = getStatusFromProgress(infectionProgress);

  const updateProgress = (newProgress: number) => {
    setInfectionProgress(Math.max(0, Math.min(100, newProgress)));
  };

  const resetToCritical = () => {
    setInfectionProgress(100);
  };

  const unlockModule = (moduleName: string) => {
    // This function is kept for compatibility but doesn't affect progress
    // Progress is now only based on puzzle completion
  };

  const completePuzzle = (puzzleName: string) => {
    // This function is kept for compatibility but progress is calculated from PuzzleContext
  };

  // Sync infection progress with actual puzzle completion
  useEffect(() => {
    const completedPuzzles = getCompletedPuzzles();
    const completedCount = completedPuzzles.length;
    
    // Calculate progress: start at 100% and subtract progress for each completed puzzle
    const newProgress = 100 - (completedCount * PROGRESS_PER_PUZZLE);
    updateProgress(Math.max(0, newProgress));
  }, [getCompletedPuzzles]);

  // Check if final boss should appear (when progress gets very low)
  // Removed automatic reset to critical - let progress stay low when puzzles are completed

  return (
    <InfectionContext.Provider value={{
      infectionProgress,
      infectionStatus,
      updateProgress,
      resetToCritical,
      unlockModule,
      completePuzzle,
    }}>
      {children}
    </InfectionContext.Provider>
  );
}

export function useInfection() {
  const context = useContext(InfectionContext);
  if (context === undefined) {
    throw new Error('useInfection must be used within an InfectionProvider');
  }
  return context;
}

// Add default export
export default InfectionProvider; 
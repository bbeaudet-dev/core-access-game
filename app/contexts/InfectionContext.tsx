import React, { createContext, useContext, useEffect, useState } from 'react';

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
  const [completedPuzzles, setCompletedPuzzles] = useState<Set<string>>(new Set());

  const infectionStatus = getStatusFromProgress(infectionProgress);

  const updateProgress = (newProgress: number) => {
    setInfectionProgress(Math.max(0, Math.min(100, newProgress)));
  };

  const resetToCritical = () => {
    setInfectionProgress(100);
    // Reset completed puzzles for final boss fight
    setCompletedPuzzles(new Set());
  };

  const unlockModule = (moduleName: string) => {
    // This function is kept for compatibility but doesn't affect progress
    // Progress is now only based on puzzle completion
  };

  const completePuzzle = (puzzleName: string) => {
    if (completedPuzzles.has(puzzleName)) return;
    
    setCompletedPuzzles(prev => new Set([...prev, puzzleName]));
    
    // Calculate new progress: start at 100% and subtract progress for each completed puzzle
    const newCompletedCount = completedPuzzles.size + 1;
    const newProgress = 100 - (newCompletedCount * PROGRESS_PER_PUZZLE);
    updateProgress(Math.max(0, newProgress));
  };

  // Check if final boss should appear (when progress gets very low)
  useEffect(() => {
    if (infectionProgress <= 5 && infectionProgress > 0) {
      // Trigger final boss appearance
      setTimeout(() => {
        resetToCritical();
      }, 2000);
    }
  }, [infectionProgress]);

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
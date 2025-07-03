import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_PUZZLES, PuzzleConfig, PuzzleState } from '../components/puzzles/types';

interface PuzzleContextType {
  puzzleState: PuzzleState;
  updatePuzzleProgress: (puzzleId: string, progress: number, isComplete?: boolean) => void;
  completePuzzle: (puzzleId: string) => void;
  getPuzzleConfig: (puzzleId: string) => PuzzleConfig | undefined;
  getCompletedPuzzles: () => string[];
  getTotalPuzzles: () => number;
  getCompletionPercentage: () => number;
}

const PuzzleContext = createContext<PuzzleContextType | undefined>(undefined);

export function PuzzleProvider({ children }: { children: React.ReactNode }) {
  const [puzzleState, setPuzzleState] = useState<PuzzleState>({});

  // Initialize puzzle state from default puzzles
  useEffect(() => {
    const initialState: PuzzleState = {};
    Object.keys(DEFAULT_PUZZLES).forEach(puzzleId => {
      initialState[puzzleId] = {
        isComplete: false,
        progress: 0,
        lastUpdated: new Date(),
      };
    });
    setPuzzleState(initialState);
  }, []);

  const updatePuzzleProgress = (puzzleId: string, progress: number, isComplete: boolean = false) => {
    setPuzzleState(prev => ({
      ...prev,
      [puzzleId]: {
        ...prev[puzzleId],
        progress: Math.max(0, Math.min(100, progress)),
        isComplete: isComplete || prev[puzzleId]?.isComplete || false,
        lastUpdated: new Date(),
      },
    }));
  };

  const completePuzzle = (puzzleId: string) => {
    setPuzzleState(prev => ({
      ...prev,
      [puzzleId]: {
        ...prev[puzzleId],
        isComplete: true,
        progress: 100,
        lastUpdated: new Date(),
      },
    }));
  };

  const getPuzzleConfig = (puzzleId: string): PuzzleConfig | undefined => {
    return DEFAULT_PUZZLES[puzzleId];
  };

  const getCompletedPuzzles = (): string[] => {
    return Object.entries(puzzleState)
      .filter(([_, state]) => state.isComplete)
      .map(([puzzleId, _]) => puzzleId);
  };

  const getTotalPuzzles = (): number => {
    return Object.keys(DEFAULT_PUZZLES).length;
  };

  const getCompletionPercentage = (): number => {
    const completed = getCompletedPuzzles().length;
    const total = getTotalPuzzles();
    return total > 0 ? (completed / total) * 100 : 0;
  };

  const value: PuzzleContextType = {
    puzzleState,
    updatePuzzleProgress,
    completePuzzle,
    getPuzzleConfig,
    getCompletedPuzzles,
    getTotalPuzzles,
    getCompletionPercentage,
  };

  return (
    <PuzzleContext.Provider value={value}>
      {children}
    </PuzzleContext.Provider>
  );
}

export function usePuzzle() {
  const context = useContext(PuzzleContext);
  if (context === undefined) {
    throw new Error('usePuzzle must be used within a PuzzleProvider');
  }
  return context;
} 
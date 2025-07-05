// Grid layout: 3 columns, 6 rows
// Row 1: System | Terminal | Tutorial
// Row 2: Battery | Clock | Music  
// Row 3: Flashlight | Calculator | Compass
// Row 4: Gyro | Camera | Microphone
// Row 5: Maps | Games | Wifi
// Row 6: Weather | FinalBoss | Accelerometer

export const GRID_LAYOUT = [
  ['system', 'terminal', 'tutorial'],
  ['battery', 'clock', 'music'],
  ['flashlight', 'calculator', 'compass'],
  ['gyro', 'camera', 'microphone'],
  ['maps', 'games', 'wifi'],
  ['weather', 'finalboss', 'accelerometer']
];

// Starting apps
export const STARTING_APPS = ['tutorial'];

// Puzzle to module mapping
export const PUZZLE_TO_MODULE: Record<string, string> = {
  'help_tutorial': 'tutorial',
  'tutorial': 'tutorial', // Alias for backward compatibility
  'system_security': 'system',
  'terminal_access': 'terminal',
  'battery_charge': 'battery',
  'clock_sync': 'clock',
  'music_play': 'music',
  'flashlight_morse': 'flashlight',
  'calculator_puzzle': 'calculator',
  'compass_orientation': 'compass',
  'compass_north': 'compass',
  'gyroscope_rotation': 'gyro',
  'gyroscope_spin_count': 'gyro',
  'camera_capture': 'camera',
  'microphone_level': 'microphone',
  'location_navigate': 'maps',
  'games_play': 'games',
  'wifi_connect': 'wifi',
  'weather_check': 'weather',
  'finalboss_defeat': 'finalboss',
  'accelerometer_movement': 'accelerometer'
};

// Get adjacent modules for a given module
export function getAdjacentModules(moduleName: string): string[] {
  const adjacent: string[] = [];
  
  // Find the module's position in the grid
  let moduleRow = -1;
  let moduleCol = -1;
  
  for (let row = 0; row < GRID_LAYOUT.length; row++) {
    for (let col = 0; col < GRID_LAYOUT[row].length; col++) {
      if (GRID_LAYOUT[row][col] === moduleName) {
        moduleRow = row;
        moduleCol = col;
        break;
      }
    }
    if (moduleRow !== -1) break;
  }
  
  if (moduleRow === -1) return adjacent;
  
  // Check all 4 adjacent positions
  const directions = [
    [-1, 0], // above
    [1, 0],  // below
    [0, -1], // left
    [0, 1]   // right
  ];
  
  for (const [dRow, dCol] of directions) {
    const newRow = moduleRow + dRow;
    const newCol = moduleCol + dCol;
    
    if (newRow >= 0 && newRow < GRID_LAYOUT.length && 
        newCol >= 0 && newCol < GRID_LAYOUT[newRow].length) {
      adjacent.push(GRID_LAYOUT[newRow][newCol]);
    }
  }
  
  return adjacent;
}

// Get modules that should be unlocked when a puzzle is completed
export function getModulesToUnlock(completedPuzzleId: string, currentlyUnlocked: string[]): string[] {
  const moduleName = PUZZLE_TO_MODULE[completedPuzzleId];
  if (!moduleName) return [];
  
  const adjacentModules = getAdjacentModules(moduleName);
  const newUnlocks = adjacentModules.filter(module => !currentlyUnlocked.includes(module));
  
  return newUnlocks;
}

// Check if a module should be unlocked based on completed puzzles
export function shouldModuleBeUnlocked(moduleName: string, completedPuzzles: string[]): boolean {
  // Starting apps are always unlocked
  if (STARTING_APPS.includes(moduleName)) return true;
  
  // Check if any adjacent module has a completed puzzle
  const adjacentModules = getAdjacentModules(moduleName);
  
  for (const adjacentModule of adjacentModules) {
    // Find the puzzle ID for this adjacent module
    const puzzleId = Object.keys(PUZZLE_TO_MODULE).find(key => PUZZLE_TO_MODULE[key] === adjacentModule);
    if (puzzleId && completedPuzzles.includes(puzzleId)) {
      return true;
    }
  }
  
  return false;
}

// Get background image based on puzzle completion status
export function getModuleBackgroundImage(
  moduleName: string, 
  completedPuzzles: string[], 
  isFirstVisit: boolean = false
): any {
  // Check if this module has a completed puzzle
  const hasCompletedPuzzle = completedPuzzles.some(puzzleId => 
    PUZZLE_TO_MODULE[puzzleId] === moduleName
  );
  
  // Check if final boss is defeated (all puzzles completed)
  const isFinalBossDefeated = completedPuzzles.length >= 13; // Total puzzles
  
  if (isFinalBossDefeated) {
    // Green frame when final boss is defeated
    return require('../../assets/images/glowing-green-neon-with-stars-29-09-2024-1727679307-hd-wallpaper.jpg');
  } else if (hasCompletedPuzzle) {
    // Blue frame when puzzle is complete but final boss not defeated
    return require('../../assets/images/blue frame.png');
  } else {
    // Red frame when puzzle is incomplete
    return require('../../assets/images/red frame.png');
  }
}

// Add default export
export default {
  GRID_LAYOUT,
  STARTING_APPS,
  PUZZLE_TO_MODULE,
  getAdjacentModules,
  getModulesToUnlock,
  shouldModuleBeUnlocked,
  getModuleBackgroundImage
}; 
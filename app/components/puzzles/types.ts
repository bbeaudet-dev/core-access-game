export interface PuzzleConfig {
  id: string;
  name: string;
  description: string;
  moduleId: string;
  targetValue?: number;
  targetRange?: [number, number];
  targetAction?: string;
  isComplete: boolean;
  progress?: number;
  progressMax?: number;
  color: string;
}

export interface PuzzleState {
  [puzzleId: string]: {
    isComplete: boolean;
    progress?: number;
    lastUpdated: Date;
  };
}

export const PUZZLE_TYPES = {
  BATTERY_CHARGE: 'battery_charge',
  FLASHLIGHT_MORSE: 'flashlight_morse',
  BAROMETER_BLOW: 'barometer_blow',
  LOCATION_NAVIGATE: 'location_navigate',
  ACCELEROMETER_MOVEMENT: 'accelerometer_movement',
  GYROSCOPE_ROTATION: 'gyroscope_rotation',
  MICROPHONE_LEVEL: 'microphone_level',
  COMPASS_ORIENTATION: 'compass_orientation',
  CALCULATOR_PUZZLE: 'calculator_puzzle',
} as const;

export type PuzzleType = typeof PUZZLE_TYPES[keyof typeof PUZZLE_TYPES];

export const DEFAULT_PUZZLES: Record<string, PuzzleConfig> = {
  [PUZZLE_TYPES.BATTERY_CHARGE]: {
    id: PUZZLE_TYPES.BATTERY_CHARGE,
    name: 'Power Restoration',
    description: 'Charge the device above 80% to restore power systems',
    moduleId: 'battery',
    targetValue: 0.8,
    isComplete: false,
    color: 'green',
  },
  [PUZZLE_TYPES.FLASHLIGHT_MORSE]: {
    id: PUZZLE_TYPES.FLASHLIGHT_MORSE,
    name: 'Signal Transmission',
    description: 'Transmit SOS in morse code using the flashlight',
    moduleId: 'flashlight',
    targetAction: 'transmit_morse',
    isComplete: false,
    color: 'yellow',
  },
  [PUZZLE_TYPES.BAROMETER_BLOW]: {
    id: PUZZLE_TYPES.BAROMETER_BLOW,
    name: 'Air Pressure Test',
    description: 'Blow into the device to test pressure sensors',
    moduleId: 'barometer',
    targetAction: 'detect_blow',
    isComplete: false,
    color: 'blue',
  },
  [PUZZLE_TYPES.LOCATION_NAVIGATE]: {
    id: PUZZLE_TYPES.LOCATION_NAVIGATE,
    name: 'Navigation System',
    description: 'Navigate to specified coordinates to restore GPS',
    moduleId: 'maps',
    targetRange: [40.7128, -74.0060], // NYC coordinates
    isComplete: false,
    color: 'purple',
  },
  [PUZZLE_TYPES.ACCELEROMETER_MOVEMENT]: {
    id: PUZZLE_TYPES.ACCELEROMETER_MOVEMENT,
    name: 'Motion Detection',
    description: 'Move the device to test accelerometer sensors',
    moduleId: 'accelerometer',
    targetAction: 'detect_movement',
    isComplete: false,
    color: 'red',
  },
  [PUZZLE_TYPES.GYROSCOPE_ROTATION]: {
    id: PUZZLE_TYPES.GYROSCOPE_ROTATION,
    name: 'Rotation Calibration',
    description: 'Rotate the device to calibrate gyroscope',
    moduleId: 'gyro',
    targetAction: 'detect_rotation',
    isComplete: false,
    color: 'orange',
  },
  [PUZZLE_TYPES.MICROPHONE_LEVEL]: {
    id: PUZZLE_TYPES.MICROPHONE_LEVEL,
    name: 'Audio System Test',
    description: 'Test microphone by reaching target audio level',
    moduleId: 'microphone',
    targetValue: 0.7,
    isComplete: false,
    color: 'pink',
  },
  [PUZZLE_TYPES.COMPASS_ORIENTATION]: {
    id: PUZZLE_TYPES.COMPASS_ORIENTATION,
    name: 'Directional Calibration',
    description: 'Point the device north to calibrate compass',
    moduleId: 'compass',
    targetRange: [0, 45], // North direction with tolerance
    isComplete: false,
    color: 'cyan',
  },
  [PUZZLE_TYPES.CALCULATOR_PUZZLE]: {
    id: PUZZLE_TYPES.CALCULATOR_PUZZLE,
    name: 'Mathematical Verification',
    description: 'Solve the calculation and input the result in terminal',
    moduleId: 'calculator',
    targetAction: 'solve_calculation',
    isComplete: false,
    color: 'orange',
  },
}; 
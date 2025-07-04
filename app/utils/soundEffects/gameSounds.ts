import { SoundEffect } from '../soundManager';

export const gameSounds: SoundEffect[] = [
  {
    id: 'puzzle_complete',
    name: 'Puzzle Complete',
    category: 'game',
    description: 'Puzzle solved successfully',
    file: require('../../../assets/sounds/ui/660871__silverillusionist__level-upmission-complete-1-cyberpunk.wav'),
  },
  {
    id: 'puzzle_fail',
    name: 'Puzzle Fail',
    category: 'game',
    description: 'Puzzle attempt failed',
    file: require('../../../assets/sounds/ui/769889__engie201__cyberpunk-style-death-sound.wav'),
  },
  {
    id: 'sensor_activate',
    name: 'Sensor Activate',
    category: 'game',
    description: 'Sensor module activation',
    file: require('../../../assets/sounds/ui/533592__diakunik__effect-fx-cyber.wav'),
  },
  {
    id: 'achievement',
    name: 'Achievement',
    category: 'game',
    description: 'Milestone reached',
    file: require('../../../assets/sounds/ui/660871__silverillusionist__level-upmission-complete-1-cyberpunk.wav'),
  },
]

// Add default export
export default gameSounds; 
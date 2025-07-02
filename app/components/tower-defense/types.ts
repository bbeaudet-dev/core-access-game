export interface Bug {
  id: number
  x: number
  y: number
  health: number
  maxHealth: number
  pathIndex: number
  speed: number
}

export interface Tower {
  id: number
  x: number
  y: number
  type: 'defender'
  damage: number
  range: number
  lastShot: number
}

export interface GameState {
  level: number
  lives: number
  money: number
  bugs: Bug[]
  towers: Tower[]
  wave: number
  waveInProgress: boolean
}

export interface CircuitPathPoint {
  x: number
  y: number
} 
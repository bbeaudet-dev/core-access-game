import { Audio } from 'expo-av'

export interface SoundEffect {
  id: string
  name: string
  category: 'ui' | 'game' | 'ambient' | 'music'
  description: string
  filePath: string
}

export class SoundManager {
  private static instance: SoundManager
  private sounds: Map<string, Audio.Sound> = new Map()
  private isMuted: boolean = false
  private volume: number = 0.7
  private backgroundMusic: Audio.Sound | null = null
  private currentMusicTrack: string | null = null

  private constructor() {}

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager()
    }
    return SoundManager.instance
  }

  async preloadSound(soundId: string, uri: string): Promise<void> {
    try {
      const { sound } = await Audio.Sound.createAsync({ uri })
      this.sounds.set(soundId, sound)
    } catch (error) {
      console.error(`Failed to preload sound ${soundId}:`, error)
    }
  }

  async playSound(soundId: string, volume?: number): Promise<void> {
    if (this.isMuted) return

    const sound = this.sounds.get(soundId)
    if (sound) {
      try {
        await sound.setVolumeAsync(volume ?? this.volume)
        await sound.replayAsync()
      } catch (error) {
        console.error(`Failed to play sound ${soundId}:`, error)
      }
    }
  }

  async playBackgroundMusic(trackId: string, uri: string, loop: boolean = true): Promise<void> {
    if (this.isMuted) return

    // Stop current background music
    if (this.backgroundMusic) {
      await this.backgroundMusic.stopAsync()
      await this.backgroundMusic.unloadAsync()
    }

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri },
        { shouldPlay: true, isLooping: loop }
      )
      await sound.setVolumeAsync(this.volume * 0.5) // Background music at half volume
      this.backgroundMusic = sound
      this.currentMusicTrack = trackId
    } catch (error) {
      console.error(`Failed to play background music ${trackId}:`, error)
    }
  }

  async stopBackgroundMusic(): Promise<void> {
    if (this.backgroundMusic) {
      await this.backgroundMusic.stopAsync()
      await this.backgroundMusic.unloadAsync()
      this.backgroundMusic = null
      this.currentMusicTrack = null
    }
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted
    if (muted && this.backgroundMusic) {
      this.stopBackgroundMusic()
    }
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume))
    if (this.backgroundMusic) {
      this.backgroundMusic.setVolumeAsync(this.volume * 0.5)
    }
  }

  getVolume(): number {
    return this.volume
  }

  isMutedState(): boolean {
    return this.isMuted
  }

  getCurrentMusicTrack(): string | null {
    return this.currentMusicTrack
  }

  async cleanup(): Promise<void> {
    // Stop and unload all sounds
    for (const sound of this.sounds.values()) {
      await sound.stopAsync()
      await sound.unloadAsync()
    }
    this.sounds.clear()

    // Stop background music
    await this.stopBackgroundMusic()
  }
}

// Predefined sound effects
export const SOUND_EFFECTS: SoundEffect[] = [
  // UI Sounds
  {
    id: 'ui_success',
    name: 'Success',
    category: 'ui',
    description: 'Positive action confirmation',
    filePath: '/sounds/ui/success.mp3'
  },
  {
    id: 'ui_error',
    name: 'Error',
    category: 'ui',
    description: 'Error or failure notification',
    filePath: '/sounds/ui/error.mp3'
  },
  {
    id: 'ui_back',
    name: 'Back',
    category: 'ui',
    description: 'Navigation back sound',
    filePath: '/sounds/ui/back.mp3'
  },
  {
    id: 'ui_forward',
    name: 'Forward',
    category: 'ui',
    description: 'Navigation forward sound',
    filePath: '/sounds/ui/forward.mp3'
  },
  {
    id: 'ui_home',
    name: 'Home',
    category: 'ui',
    description: 'Return to home sound',
    filePath: '/sounds/ui/home.mp3'
  },
  {
    id: 'ui_unlock',
    name: 'Unlock',
    category: 'ui',
    description: 'Module unlock sound',
    filePath: '/sounds/ui/unlock.mp3'
  },
  {
    id: 'ui_click',
    name: 'Click',
    category: 'ui',
    description: 'Button click sound',
    filePath: '/sounds/ui/click.mp3'
  },

  // Game Sounds
  {
    id: 'game_tower_place',
    name: 'Tower Place',
    category: 'game',
    description: 'Tower placement sound',
    filePath: '/sounds/game/tower_place.mp3'
  },
  {
    id: 'game_enemy_hit',
    name: 'Enemy Hit',
    category: 'game',
    description: 'Enemy taking damage',
    filePath: '/sounds/game/enemy_hit.mp3'
  },
  {
    id: 'game_victory',
    name: 'Victory',
    category: 'game',
    description: 'Level completion',
    filePath: '/sounds/game/victory.mp3'
  },
  {
    id: 'game_defeat',
    name: 'Defeat',
    category: 'game',
    description: 'Level failure',
    filePath: '/sounds/game/defeat.mp3'
  },

  // Ambient Sounds
  {
    id: 'ambient_whisper',
    name: 'Whisper',
    category: 'ambient',
    description: 'Eerie whisper sound',
    filePath: '/sounds/ambient/whisper.mp3'
  },
  {
    id: 'ambient_creak',
    name: 'Creak',
    category: 'ambient',
    description: 'Mysterious creaking',
    filePath: '/sounds/ambient/creak.mp3'
  },
  {
    id: 'ambient_wind',
    name: 'Wind',
    category: 'ambient',
    description: 'Distant wind sound',
    filePath: '/sounds/ambient/wind.mp3'
  },
  {
    id: 'ambient_glitch',
    name: 'Glitch',
    category: 'ambient',
    description: 'Digital glitch effect',
    filePath: '/sounds/ambient/glitch.mp3'
  },

  // Music Tracks
  {
    id: 'music_main_theme',
    name: 'Main Theme',
    category: 'music',
    description: 'Primary background music',
    filePath: '/sounds/music/main_theme.mp3'
  },
  {
    id: 'music_tension',
    name: 'Tension',
    category: 'music',
    description: 'High tension background',
    filePath: '/sounds/music/tension.mp3'
  },
  {
    id: 'music_mystery',
    name: 'Mystery',
    category: 'music',
    description: 'Mysterious ambient track',
    filePath: '/sounds/music/mystery.mp3'
  }
]

// Convenience functions
export const playSound = (soundId: string, volume?: number) => {
  SoundManager.getInstance().playSound(soundId, volume)
}

export const playBackgroundMusic = (trackId: string, uri: string, loop?: boolean) => {
  SoundManager.getInstance().playBackgroundMusic(trackId, uri, loop)
}

export const stopBackgroundMusic = () => {
  SoundManager.getInstance().stopBackgroundMusic()
}

export const setSoundMuted = (muted: boolean) => {
  SoundManager.getInstance().setMuted(muted)
}

export const setSoundVolume = (volume: number) => {
  SoundManager.getInstance().setVolume(volume)
} 
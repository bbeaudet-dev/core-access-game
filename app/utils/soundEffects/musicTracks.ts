import { SoundEffect } from '../soundManager';

export const musicTracks: SoundEffect[] = [
  {
    id: 'cyberpunk_bass_1',
    name: 'Main Menu Theme',
    category: 'music',
    description: '100 BPM cyberpunk bass made on Roland S1',
    artist: 'Sadiquecat',
    file: require('../../../assets/sounds/ui/784904__sadiquecat__100-bpm-cyberpunk-bass-1-roland-s1.mp3'),
  },
  {
    id: 'cyberpunk_ambient',
    name: 'NYC Cyberpunk Synth',
    category: 'music',
    description: 'Funky ambient drum & bass beat',
    artist: 'Szegvari',
    file: require('../../../assets/sounds/ui/611305__szegvari__new-york-cyberpunk-synth-analogue-drums-bass-dance-retro-atmo-ambience-pad-drone-cinematic-action-music-surround.mp3'),
  },
]

// Add default export
export default musicTracks; 
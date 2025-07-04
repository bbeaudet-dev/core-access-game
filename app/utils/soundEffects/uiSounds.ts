import { SoundEffect } from '../soundManager';

export const uiSounds: SoundEffect[] = [
  {
    id: 'ui_click',
    name: 'Digital Click',
    category: 'ui',
    description: 'Holographic button press',
    file: require('../../../assets/sounds/ui/322900__rhodesmas__tap-01.wav'),
  },
  {
    id: 'ui_success',
    name: 'Operation Success',
    category: 'ui',
    description: 'Positive action confirmation',
    file: require('../../../assets/sounds/ui/380290__rhodesmas__ui-05.wav'),
  },
  {
    id: 'ui_error',
    name: 'Access Denied',
    category: 'ui',
    description: 'Error or failure notification',
    file: require('../../../assets/sounds/ui/380291__rhodesmas__ui-04.wav'),
  },
  {
    id: 'ui_unlock',
    name: 'Module Unlock',
    category: 'ui',
    description: 'New module access granted',
    file: require('../../../assets/sounds/ui/660871__silverillusionist__level-upmission-complete-1-cyberpunk.wav'),
  },
  {
    id: 'ui_home',
    name: 'System Access',
    category: 'ui',
    description: 'Return to home interface',
    file: require('../../../assets/sounds/ui/Taketones_Pop2.wav'),
  },
  {
    id: 'ui_back',
    name: 'Navigation Back',
    category: 'ui',
    description: 'Reverse navigation',
    file: require('../../../assets/sounds/ui/380292__rhodesmas__ui-03.wav'),
  },
  {
    id: 'ui_forward',
    name: 'Navigation Forward',
    category: 'ui',
    description: 'Forward navigation',
    file: require('../../../assets/sounds/ui/380289__rhodesmas__ui-06.wav'),
  },
  {
    id: 'ui_app_launch',
    name: 'App Launch',
    category: 'ui',
    description: 'Module activation',
    file: require('../../../assets/sounds/ui/Taketones_Pop.wav'),
  },
  {
    id: 'ui_button_tap',
    name: 'Button Tap',
    category: 'ui',
    description: 'Module button press',
    file: require('../../../assets/sounds/ui/Taketones_Tap.wav'),
  },
  {
    id: 'ui_login_success',
    name: 'Login Success',
    category: 'ui',
    description: 'Successful login/signup/guest',
    file: require('../../../assets/sounds/ui/Taketones_Ding.wav'),
  },
  {
    id: 'ui_data_transfer',
    name: 'Data Transfer',
    category: 'ui',
    description: 'Information processing',
    file: require('../../../assets/sounds/ui/533592__diakunik__effect-fx-cyber.wav'),
  },
  {
    id: 'ui_scan',
    name: 'System Scan',
    category: 'ui',
    description: 'Scanning or detection',
    file: require('../../../assets/sounds/ui/411857__devilfish101__monotron-filter-scream.wav'),
  },
  {
    id: 'ui_alert',
    name: 'System Alert',
    category: 'ui',
    description: 'Important notification',
    file: require('../../../assets/sounds/ui/alert.mp3'), // Keep this one for now
  },
  {
    id: 'ui_encrypt',
    name: 'Encryption',
    category: 'ui',
    description: 'Security operation',
    file: require('../../../assets/sounds/ui/encrypt.mp3'), // Keep this one for now
  },
  {
    id: 'ui_beep',
    name: 'Short Beep',
    category: 'ui',
    description: 'Quick digital beep',
    file: require('../../../assets/sounds/ui/322900__rhodesmas__tap-01.wav'),
  },
  {
    id: 'ui_tap',
    name: 'Tap',
    category: 'ui',
    description: 'Soft tap sound',
    file: require('../../../assets/sounds/ui/322900__rhodesmas__tap-01.wav'),
  },
]

// Add default export
export default uiSounds; 
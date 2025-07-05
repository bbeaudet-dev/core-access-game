import { useState } from 'react';
import { Animated, View } from 'react-native';
import HomeScreen from './components/HomeScreen';
import InfectionSequence from './components/infection/InfectionSequence';
import LoginScreen from './components/login/LoginScreen';
import WelcomeGameScreen from './components/login/WelcomeGameScreen';
import AboutScreen from './components/Modules/about/AboutScreen';
import CoreVitalsScreen from './components/Modules/about/CoreVitalsScreen';
import SystemModule from './components/Modules/about/System/SystemModule';
import AccelerometerModule from './components/Modules/accelerometer/AccelerometerModule';
import BatteryModule from './components/Modules/battery/BatteryModule';
import CalculatorModule from './components/Modules/calculator/CalculatorModule';
import PhoneCameraModule from './components/Modules/camera/PhoneCameraModule';
import ClockModule from './components/Modules/clock/ClockModule';
import CompassModule from './components/Modules/compass/CompassModule';
import FinalBossModule from './components/Modules/finalboss/FinalBossModule';
import FlashlightModule from './components/Modules/flashlight/FlashlightModule';
import GamesModule from './components/Modules/games/GamesModule';
import GyroModule from './components/Modules/gyro/GyroModule';
import MapsModule from './components/Modules/maps/MapsModule';
import MicrophoneModule from './components/Modules/microphone/MicrophoneModule';
import MusicModule from './components/Modules/music/MusicModule';
import TerminalModule from './components/Modules/terminal/TerminalModule';
import TutorialModule from './components/Modules/tutorial/TutorialModule';
import WeatherModule from './components/Modules/weather/WeatherModule';
import WifiModule from './components/Modules/wifi/WifiModule';
import { useAuth } from './contexts/AuthContext';
import { InfectionProvider } from './contexts/InfectionContext';
import { PuzzleProvider } from './contexts/PuzzleContext';
import { startInfectionSequence } from './utils/infectionSequence';

// Define module names type
type ModuleName = 'terminal' | 'system' | 'clock' | 'gyro' | 'compass' | 'microphone' | 'camera' | 'accelerometer' | 'wifi' | 'tutorial' | 'music' | 'flashlight' | 'battery' | 'maps' | 'calculator' | 'weather' | 'games' | 'finalboss';

// Module mapping object - much cleaner than repetitive if statements
const MODULE_COMPONENTS = {
  terminal: TerminalModule,
  clock: ClockModule,
  gyro: GyroModule,
  compass: CompassModule,
  microphone: MicrophoneModule,
  camera: PhoneCameraModule,
  accelerometer: AccelerometerModule,
  wifi: WifiModule,
  tutorial: TutorialModule,
  music: MusicModule,
  flashlight: FlashlightModule,
  battery: BatteryModule,
  maps: MapsModule,
  calculator: CalculatorModule,
  weather: WeatherModule,
  games: GamesModule,
  finalboss: FinalBossModule,
} as const;

function AppContent() {
  const { isAuthenticated, user } = useAuth();
  const [gameState, setGameState] = useState('welcome');
  const [loginType, setLoginType] = useState<'signup' | 'signin' | 'guest'>('signin');
  const [guestUsername, setGuestUsername] = useState<string>('');
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={(type, username) => {
      setLoginType(type);
      setGuestUsername(username || '');
      setGameState('welcome');
    }} />
  }
  
  const handleDownload = () => {
    // Start infection sequence directly when download button is pressed
    setGameState('infected');
    
    startInfectionSequence(
      setGlitchLevel,
      setTerminalText,
      () => {
        setGameState('home');
        setGlitchLevel(0);
      }
    );
  };

  const navigate = (destination: string) => {
    if (destination === 'self-destruct') {
      // Reset all game state
      setGameState('welcome');
      setGlitchLevel(0);
      setTerminalText('');
    } else {
      setGameState(destination);
    }
  };

  const handleOpenModule = (moduleName: string) => {
    navigate(moduleName);
  };

  // Render different components based on game state
  if (gameState === 'welcome') {
    return (
      <View className="flex-1">
        <WelcomeGameScreen 
          type={loginType}
          guestUsername={guestUsername}
          onDownload={handleDownload}
        />        
      </View>
    );
  }

  if (gameState === 'infected') {
    return (
      <View className="flex-1">
        <InfectionSequence 
          glitchLevel={glitchLevel}
          terminalText={terminalText}
          fadeAnim={fadeAnim}
        />
      </View>
    );
  }

  if (gameState === 'home') {
    return (
      <View className="flex-1">
        <HomeScreen onOpenModule={handleOpenModule} />
      </View>
    );
  }

  // Handle special cases that need custom props
  if (gameState === 'system') {
    return (
      <View className="flex-1">
        <SystemModule 
          onGoHome={() => navigate('home')}
          onGoToAbout={() => navigate('about')}
          onGoToCoreVitals={() => navigate('core-vitals')}
          onSelfDestruct={() => navigate('self-destruct')}
        />         
      </View>
    );
  }

  if (gameState === 'about') {
    return (
      <View className="flex-1">
        <AboutScreen onGoBack={() => navigate('system')} />
      </View>
    );
  }

  if (gameState === 'core-vitals') {
    return (
      <View className="flex-1">
        <CoreVitalsScreen onGoBack={() => navigate('system')} />
      </View>
    );
  }

  // Handle all standard modules with a single pattern
  if (gameState in MODULE_COMPONENTS) {
    const ModuleComponent = MODULE_COMPONENTS[gameState as keyof typeof MODULE_COMPONENTS];
    return (
      <View className="flex-1">
        <ModuleComponent onGoHome={() => navigate('home')} />
      </View>
    );
  }

  return null;
}

export default function Index() {
  return (
    <InfectionProvider>
      <PuzzleProvider>
        <AppContent />
      </PuzzleProvider>
    </InfectionProvider>
  );
}

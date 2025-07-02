import { useState } from 'react';
import { Animated, View } from 'react-native';
import AboutScreen from './components/about/AboutScreen';
import SystemModule from './components/about/System/SystemModule';
import AccelerometerModule from './components/accelerometer/AccelerometerModule';
import AudioModule from './components/audio/AudioModule';
import PhoneCameraModule from './components/camera/PhoneCameraModule';
import ClockModule from './components/clock/ClockModule';
import CompassModule from './components/compass/CompassModule';
import CoreVitalsScreen from './components/CoreVitalsScreen';
import GyroModule from './components/gyro/GyroModule';
import HelpModule from './components/help/HelpModule';
import HomeScreen from './components/HomeScreen';
import InfectionSequence from './components/InfectionSequence';
import LoginScreen from './components/login/LoginScreen';
import LogsModule from './components/LogsModule';
import TerminalModule from './components/TerminalModule';
import FakeGameMenu from './components/towerdefense/FakeGameMenu';
import TowerDefenseGame from './components/towerdefense/TowerDefenseGame';
import BugScuttleAnimation from './components/ui/BugScuttleAnimation';
import WifiModule from './components/wifi/WifiModule';
import { useAuth } from './contexts/AuthContext';
import { HintProvider } from './contexts/HintContext';
import { ModuleName, ModuleUnlockProvider, useModuleUnlock } from './contexts/ModuleUnlockContext';
import { startInfectionSequence } from './utils/infectionSequence';

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();
  const { unlockModule, showBugScuttle } = useModuleUnlock();
  const [gameState, setGameState] = useState('menu'); // 'menu', 'infected', 'tower-defense', 'vault', 'logs', 'terminal', 'phonecamera', 'audio', 'system', 'compass', 'gyro', 'help', 'clock', 'about', 'core-vitals', 'accelerometer', 'wifi'
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [vaultProgress, setVaultProgress] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));

  // Add debugging for mobile loading
  console.log('Index component rendered, isAuthenticated:', isAuthenticated, 'gameState:', gameState);

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setGameState('menu')} />;
  }

  const startFakeGame = () => {
    // Go directly to tower defense after fake menu
    setGameState('tower-defense');
  };

  const handleTowerDefenseComplete = () => {
    // Start infection sequence when user clicks any tower square
    setGameState('infected');
    
    startInfectionSequence(
      setGlitchLevel,
      setTerminalText,
      () => {
        setGameState('vault');
        setGlitchLevel(0);
      }
    );
  };

  const navigate = (destination: string) => {
    if (destination === 'self-destruct') {
      // Reset all game state
      setGameState('menu');
      setVaultProgress(0);
      setGlitchLevel(0);
      setTerminalText('');
    } else {
      setGameState(destination);
    }
  };

  const handleOpenModule = (moduleName: ModuleName) => {
    // Handle module unlocking logic here
    if (moduleName === 'clock') {
      // TODO: Add clock puzzle logic
      // For now, unlock gyro when clock is accessed
      unlockModule('gyro');
    }
    
    navigate(moduleName);
  };

  // Render different components based on game state
  if (gameState === 'menu') {
    return (
      <View className="flex-1">
        <FakeGameMenu onStartGame={startFakeGame} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
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
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'tower-defense') {
    return (
      <View className="flex-1">
        <TowerDefenseGame onEmergencyMode={handleTowerDefenseComplete} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'vault') {
    return (
      <View className="flex-1">
        <HomeScreen 
          onOpenModule={handleOpenModule}
        />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'logs') {
    return (
      <View className="flex-1">
        <LogsModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'terminal') {
    return (
      <View className="flex-1">
        <TerminalModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'camera') {
    return (
      <View className="flex-1">
        <PhoneCameraModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'audio') {
    return (
      <View className="flex-1">
        <AudioModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'compass') {
    return (
      <View className="flex-1">
        <CompassModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'gyro') {
    return (
      <View className="flex-1">
        <GyroModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'help') {
    return (
      <View className="flex-1">
        <HelpModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'clock') {
    return (
      <View className="flex-1">
        <ClockModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'accelerometer') {
    return (
      <View className="flex-1">
        <AccelerometerModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'wifi') {
    return (
      <View className="flex-1">
        <WifiModule onGoHome={() => navigate('vault')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'system') {
    return (
      <View className="flex-1">
        <SystemModule 
          onGoHome={() => navigate('vault')}
          onGoToAbout={() => navigate('about')}
          onGoToCoreVitals={() => navigate('core-vitals')}
          onSelfDestruct={() => navigate('self-destruct')}
        />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'about') {
    return (
      <View className="flex-1">
        <AboutScreen onGoBack={() => navigate('system')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  if (gameState === 'core-vitals') {
    return (
      <View className="flex-1">
        <CoreVitalsScreen onGoBack={() => navigate('system')} />
        <BugScuttleAnimation visible={showBugScuttle} onComplete={() => {}} />
      </View>
    );
  }

  return null;
}

export default function Index() {
  return (
    <ModuleUnlockProvider>
      <HintProvider>
        <AppContent />
      </HintProvider>
    </ModuleUnlockProvider>
  );
}

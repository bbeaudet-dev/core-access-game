import { useState } from 'react';
import { Animated } from 'react-native';
import AboutScreen from './components/AboutScreen';
import AudioModule from './components/AudioModule';
import CameraModule from './components/CameraModule';
import CoreVitalsScreen from './components/CoreVitalsScreen';
import FakeGameMenu from './components/FakeGameMenu';
import InfectionSequence from './components/InfectionSequence';
import LoginScreen from './components/LoginScreen';
import LogsModule from './components/LogsModule';
import SystemModule from './components/SystemModule';
import TerminalModule from './components/TerminalModule';
import VaultRoom from './components/VaultRoom';
import { useAuth } from './contexts/AuthContext';
import { startInfectionSequence } from './utils/infectionSequence';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();
  const [gameState, setGameState] = useState('menu'); // 'menu', 'infected', 'vault', 'logs', 'terminal', 'camera', 'audio', 'system', 'about', 'core-vitals'
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [vaultProgress, setVaultProgress] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setGameState('menu')} />;
  }

  const startFakeGame = () => {
    // Simulate virus infection using utility function
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

  // Render different components based on game state
  if (gameState === 'menu') {
    return <FakeGameMenu onStartGame={startFakeGame} />;
  }

  if (gameState === 'infected') {
    return (
      <InfectionSequence 
        glitchLevel={glitchLevel}
        terminalText={terminalText}
        fadeAnim={fadeAnim}
      />
    );
  }

  if (gameState === 'vault') {
    return (
      <VaultRoom 
        onOpenModule={navigate}
      />
    );
  }

  if (gameState === 'logs') {
    return <LogsModule onGoHome={() => navigate('vault')} />;
  }

  if (gameState === 'terminal') {
    return <TerminalModule onGoHome={() => navigate('vault')} />;
  }

  if (gameState === 'camera') {
    return <CameraModule onGoHome={() => navigate('vault')} />;
  }

  if (gameState === 'audio') {
    return <AudioModule onGoHome={() => navigate('vault')} />;
  }

  if (gameState === 'system') {
    return (
      <SystemModule 
        onGoHome={() => navigate('vault')}
        onGoToAbout={() => navigate('about')}
        onGoToCoreVitals={() => navigate('core-vitals')}
        onSelfDestruct={() => navigate('self-destruct')}
      />
    );
  }

  if (gameState === 'about') {
    return <AboutScreen onGoBack={() => navigate('system')} />;
  }

  if (gameState === 'core-vitals') {
    return <CoreVitalsScreen onGoBack={() => navigate('system')} />;
  }

  return null;
}

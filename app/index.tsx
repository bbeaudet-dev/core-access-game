import React, { useState } from 'react';
import { Animated } from 'react-native';
import FakeGameMenu from './components/FakeGameMenu';
import InfectionSequence from './components/InfectionSequence';
import VaultRoom from './components/VaultRoom';
import { startInfectionSequence } from './utils/infectionSequence';

export default function Index() {
  const [gameState, setGameState] = useState('menu'); // 'menu', 'infected', 'vault'
  const [glitchLevel, setGlitchLevel] = useState(0);
  const [vaultProgress, setVaultProgress] = useState(0);
  const [terminalText, setTerminalText] = useState('');
  const [fadeAnim] = useState(new Animated.Value(1));

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

  const inspectVault = () => {
    setVaultProgress(vaultProgress + 1);
    if (vaultProgress >= 3) {
      // setShowGlitch(true);
      // setTimeout(() => setShowGlitch(false), 2000);
    }
  };

  const openModule = (moduleName: string) => {
    // Add alarm effect for premature access
    if (vaultProgress < 2) {
      // setShowGlitch(true);
      // setTimeout(() => setShowGlitch(false), 1000);
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
        vaultProgress={vaultProgress}
        onInspectVault={inspectVault}
        onOpenModule={openModule}
      />
    );
  }

  return null;
}

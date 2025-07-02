import { useState } from 'react'
import { Animated, View } from 'react-native'
import "../global.css"
import AboutScreen from './components/about/AboutScreen'
import CoreVitalsScreen from './components/about/CoreVitalsScreen'
import SystemModule from './components/about/System/SystemModule'
import AccelerometerModule from './components/accelerometer/AccelerometerModule'
import PhoneCameraModule from './components/camera/PhoneCameraModule'
import ClockModule from './components/clock/ClockModule'
import CompassModule from './components/compass/CompassModule'
import GyroModule from './components/gyro/GyroModule'
import HelpModule from './components/help/HelpModule'
import HomeScreen from './components/HomeScreen'
import InfectionSequence from './components/InfectionSequence'
import LoginScreen from './components/login/LoginScreen'
import LogsModule from './components/LogsModule'
import MicrophoneModule from './components/microphone/MicrophoneModule'
import MusicModule from './components/music/MusicModule'
import TerminalModule from './components/TerminalModule'
import FakeGameMenu from './components/tower-defense/FakeGameMenu'
import TowerDefenseGame from './components/tower-defense/TowerDefenseGame'
import WifiModule from './components/wifi/WifiModule'
import { useAuth } from './contexts/AuthContext'
import HintProvider from './contexts/HintContext'
import { ModuleName, ModuleUnlockProvider, useModuleUnlock } from './contexts/ModuleUnlockContext'
import { startInfectionSequence } from './utils/infectionSequence'

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth()
  const { unlockModule } = useModuleUnlock()
  const [gameState, setGameState] = useState('menu') // 'menu', 'infected', 'tower-defense', 'home', 'logs', 'terminal', 'phonecamera', 'microphone', 'system', 'compass', 'gyro', 'help', 'clock', 'about', 'core-vitals', 'accelerometer', 'wifi', 'music'
  const [glitchLevel, setGlitchLevel] = useState(0)
  const [terminalText, setTerminalText] = useState('')
  const [fadeAnim] = useState(new Animated.Value(1))

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginSuccess={() => setGameState('menu')} />
  }

  const handleTowerDefenseComplete = () => {
    // Start infection sequence when user clicks any tower square
    setGameState('infected')
    
    startInfectionSequence(
      setGlitchLevel,
      setTerminalText,
      () => {
        setGameState('home')
        setGlitchLevel(0)
      }
    )
  }

  const navigate = (destination: string) => {
    if (destination === 'self-destruct') {
      // Reset all game state
      setGameState('menu')
      setGlitchLevel(0)
      setTerminalText('')
    } else {
      setGameState(destination)
    }
  }

  const handleOpenModule = (moduleName: ModuleName) => {
    // Handle module unlocking logic here
    if (moduleName === 'clock') {
      // TODO: Add clock puzzle logic
      // For now, unlock gyro when clock is accessed
      unlockModule('gyro')
    }
    
    navigate(moduleName)
  }

  // Render different components based on game state
  if (gameState === 'menu') {
    return (
      <View className="flex-1">
        <FakeGameMenu onStartGame={() => setGameState('tower-defense')} />
      </View>
    )
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
    )
  }

  if (gameState === 'tower-defense') {
    return (
      <View className="flex-1">
        <TowerDefenseGame onEmergencyMode={handleTowerDefenseComplete} />
      </View>
    )
  }

  if (gameState === 'home') {
    return (
      <View className="flex-1">
        <HomeScreen onOpenModule={handleOpenModule} />
      </View>
    )
  }

  if (gameState === 'logs') {
    return (
      <View className="flex-1">
        <LogsModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'terminal') {
    return (
      <View className="flex-1">
        <TerminalModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'camera') {
    return (
      <View className="flex-1">
        <PhoneCameraModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'microphone') {
    return (
      <View className="flex-1">
        <MicrophoneModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'music') {
    return (
      <View className="flex-1">
        <MusicModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'compass') {
    return (
      <View className="flex-1">
        <CompassModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'gyro') {
    return (
      <View className="flex-1">
        <GyroModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'help') {
    return (
      <View className="flex-1">
        <HelpModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'clock') {
    return (
      <View className="flex-1">
        <ClockModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'accelerometer') {
    return (
      <View className="flex-1">
        <AccelerometerModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

  if (gameState === 'wifi') {
    return (
      <View className="flex-1">
        <WifiModule onGoHome={() => navigate('home')} />
      </View>
    )
  }

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
    )
  }

  if (gameState === 'about') {
    return (
      <View className="flex-1">
        <AboutScreen onGoBack={() => navigate('system')} />
      </View>
    )
  }

  if (gameState === 'core-vitals') {
    return (
      <View className="flex-1">
        <CoreVitalsScreen onGoBack={() => navigate('system')} />
      </View>
    )
  }

  return null
}

export default function Index() {
  return (
    <ModuleUnlockProvider>
      <HintProvider>
        <AppContent />
      </HintProvider>
    </ModuleUnlockProvider>
  )
}

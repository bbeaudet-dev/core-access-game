import { useEffect, useRef, useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { usePuzzle } from '../../../contexts/PuzzleContext';
import { playSound } from '../../../utils/soundManager';
import ScreenTemplate from '../../ui/ScreenTemplate';

interface TerminalModuleProps {
  onGoHome: () => void;
}

interface TerminalCommand {
  command: string;
  output: string;
  color?: string;
}

export default function TerminalModule({ onGoHome }: TerminalModuleProps) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<TerminalCommand[]>([
    { command: 'system status', output: 'System: COMPROMISED\nCore: LOCKED\nAccess: DENIED' },
    { command: 'help', output: 'Available commands: status, unlock, inspect, help, solve, clear' },
  ]);
  const [currentLine, setCurrentLine] = useState('$ ');
  const scrollViewRef = useRef<ScrollView>(null);
  const { puzzleState, completePuzzle, getPuzzleConfig } = usePuzzle();

  // Terminal codes that unlock puzzles
  const terminalCodes = {
    'SOS': { puzzleId: 'flashlight_morse', message: 'Morse code transmission verified. Flashlight module unlocked.' },
    '42': { puzzleId: 'calculator_puzzle', message: 'Mathematical calculation verified. Calculator module unlocked.' },
    'NORTH': { puzzleId: 'compass_orientation', message: 'Directional calibration verified. Compass module unlocked.' },
    'BLOW': { puzzleId: 'barometer_blow', message: 'Pressure test verified. Barometer module unlocked.' },
    'CHARGE': { puzzleId: 'battery_charge', message: 'Power restoration verified. Battery module unlocked.' },
    'MOVE': { puzzleId: 'accelerometer_movement', message: 'Motion detection verified. Accelerometer module unlocked.' },
    'ROTATE': { puzzleId: 'gyroscope_rotation', message: 'Rotation calibration verified. Gyroscope module unlocked.' },
    'SPEAK': { puzzleId: 'microphone_level', message: 'Audio test verified. Microphone module unlocked.' },
    'NAVIGATE': { puzzleId: 'location_navigate', message: 'Navigation verified. Maps module unlocked.' },
  };

  // Final puzzle code that reveals the secret message
  const finalPuzzleCode = 'RESTORE';
  const secretMessage = 'SYSTEM RESTORED - ALL MODULES ONLINE';

  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const addToHistory = (command: string, output: string, color: string = 'text-green-400') => {
    setHistory(prev => [...prev, { command, output, color }]);
  };

  const executeCommand = (cmd: string) => {
    playSound('ui_button_tap');
    const command = cmd.trim().toLowerCase();
    
    switch (command) {
      case 'help':
        addToHistory(cmd, 'Available commands:\n- status: Show system status\n- unlock: Attempt to unlock core\n- inspect: Inspect modules\n- solve [code]: Solve puzzle with code\n- clear: Clear terminal\n- help: Show this help');
        break;
        
      case 'status':
        const completedPuzzles = Object.values(puzzleState).filter(p => p.isComplete).length;
        const totalPuzzles = Object.keys(puzzleState).length;
        addToHistory(cmd, `System Status:\n- Core: ${completedPuzzles >= totalPuzzles ? 'UNLOCKED' : 'LOCKED'}\n- Modules: ${completedPuzzles}/${totalPuzzles} restored\n- Access: ${completedPuzzles >= totalPuzzles ? 'GRANTED' : 'DENIED'}`);
        break;
        
      case 'unlock':
        if (Object.values(puzzleState).every(p => p.isComplete)) {
          addToHistory(cmd, 'Core unlocked! All systems restored.', 'text-green-400');
        } else {
          addToHistory(cmd, 'ERROR: Complete all puzzles first', 'text-red-400');
        }
        break;
        
      case 'inspect':
        const moduleStatus = Object.entries(puzzleState).map(([id, state]) => {
          const config = getPuzzleConfig(id);
          return `- ${config?.name || id}: ${state.isComplete ? 'ONLINE' : 'OFFLINE'}`;
        }).join('\n');
        addToHistory(cmd, `Module Status:\n${moduleStatus}`);
        break;
        
      case 'clear':
        setHistory([]);
        break;
        
      default:
        if (command.startsWith('solve ')) {
          const code = cmd.substring(6).trim().toUpperCase();
          handlePuzzleCode(code);
        } else {
          addToHistory(cmd, `Command not found: ${command}`, 'text-red-400');
        }
        break;
    }
  };

  const handlePuzzleCode = (code: string) => {
    // Check if it's a terminal code
    if (terminalCodes[code as keyof typeof terminalCodes]) {
      const puzzleInfo = terminalCodes[code as keyof typeof terminalCodes];
      completePuzzle(puzzleInfo.puzzleId);
      addToHistory(`solve ${code}`, puzzleInfo.message, 'text-yellow-400');
    }
    // Check if it's the final puzzle code
    else if (code === finalPuzzleCode) {
      if (Object.values(puzzleState).every(p => p.isComplete)) {
        addToHistory(`solve ${code}`, `🎉 ${secretMessage} 🎉`, 'text-green-400');
        addToHistory('', 'Congratulations! You have successfully restored the system.', 'text-green-400');
      } else {
        addToHistory(`solve ${code}`, 'ERROR: Complete all puzzles first', 'text-red-400');
      }
    }
    // Check if it's a valid puzzle code but not completed
    else if (Object.keys(terminalCodes).includes(code)) {
      addToHistory(`solve ${code}`, 'ERROR: Puzzle not yet available', 'text-red-400');
    }
    else {
      addToHistory(`solve ${code}`, 'ERROR: Invalid code', 'text-red-400');
    }
  };

  const handleSubmit = () => {
    if (input.trim()) {
      executeCommand(input);
      setInput('');
    }
  };

  const getColorClass = (color?: string) => {
    switch (color) {
      case 'text-red-400':
        return 'text-red-400';
      case 'text-yellow-400':
        return 'text-yellow-400';
      case 'text-green-400':
        return 'text-green-400';
      default:
        return 'text-green-400';
    }
  };

  return (
    <ScreenTemplate title="TERMINAL" titleColor="green" onGoHome={onGoHome}>
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 bg-gray-900 rounded-lg p-4 mb-4 min-h-[400px]"
        showsVerticalScrollIndicator={false}
      >
        {history.map((item, index) => (
          <View key={index} className="mb-2">
            <Text className="text-green-400 text-sm font-mono">$ {item.command}</Text>
            <Text className={`text-sm font-mono ${getColorClass(item.color)}`}>
              {item.output}
            </Text>
          </View>
        ))}
        <Text className="text-green-400 text-sm font-mono">$ </Text>
      </ScrollView>

      {/* Input Section */}
      <View className="flex-row items-center bg-gray-900 rounded-lg p-2">
        <Text className="text-green-400 text-sm font-mono mr-2">$</Text>
        <TextInput
          value={input}
          onChangeText={setInput}
          onSubmitEditing={handleSubmit}
          className="flex-1 text-green-400 text-sm font-mono"
          placeholder="Enter command..."
          placeholderTextColor="#6b7280"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TouchableOpacity
          onPress={handleSubmit}
          className="bg-green-600 px-3 py-1 rounded"
        >
          <Text className="text-white text-sm font-mono">EXEC</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Commands */}
      <View className="mt-4">
        <Text className="text-gray-400 text-xs font-mono mb-2">QUICK COMMANDS:</Text>
        <View className="flex-row flex-wrap">
          {['help', 'status', 'inspect', 'clear'].map(cmd => (
            <TouchableOpacity
              key={cmd}
              onPress={() => executeCommand(cmd)}
              className="bg-gray-800 px-3 py-1 rounded mr-2 mb-2"
            >
              <Text className="text-green-400 text-xs font-mono">{cmd}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScreenTemplate>
  );
} 
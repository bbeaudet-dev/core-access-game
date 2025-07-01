import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface TerminalModuleProps {
  onGoHome: () => void;
}

export default function TerminalModule({ onGoHome }: TerminalModuleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>TERMINAL</Text>
      </View>
      
      <View style={styles.terminalContainer}>
        <Text style={styles.terminalText}>CORE_ACCESS:/vault$ _</Text>
        <Text style={styles.terminalText}>Type 'help' for available commands</Text>
        <Text style={styles.terminalText}>Type 'inspect' to examine vault</Text>
        <Text style={styles.terminalText}>Type 'status' for system status</Text>
        <Text style={styles.terminalText}>Type 'scan' to scan for vulnerabilities</Text>
        <Text style={styles.terminalText}>Type 'unlock' to attempt core access</Text>
        <Text style={styles.terminalText}>Type 'clear' to clear terminal</Text>
        <Text style={styles.terminalText}>Type 'exit' to return to vault</Text>
        <Text style={styles.terminalText}>HIDDEN: Try 'tilt' command</Text>
        <Text style={styles.terminalText}>HIDDEN: Try 'voice' command</Text>
      </View>
      
      <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
        <Text style={styles.homeButtonText}>⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
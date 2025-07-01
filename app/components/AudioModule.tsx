import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface AudioModuleProps {
  onGoHome: () => void;
}

export default function AudioModule({ onGoHome }: AudioModuleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>AUDIO</Text>
      </View>
      
      <View style={styles.audioContainer}>
        <Text style={styles.audioText}>Audio system: STANDBY</Text>
        <Text style={styles.audioText}>Voice recognition: DISABLED</Text>
        <Text style={styles.audioText}>HINT: The vault has secrets</Text>
        <Text style={styles.audioText}>HINT: Say "unlock core"</Text>
        <Text style={styles.audioText}>HINT: Say "access granted"</Text>
        <Text style={styles.audioText}>HINT: Say "emergency override"</Text>
        <Text style={styles.audioText}>HINT: Say "spartan virus"</Text>
        <Text style={styles.audioText}>HINT: Say "system compromised"</Text>
        <Text style={styles.audioText}>HINT: Say "quarantine breach"</Text>
        <Text style={styles.audioText}>HINT: Say "core detected"</Text>
      </View>
      
      <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
        <Text style={styles.homeButtonText}>⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
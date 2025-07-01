import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface LogsModuleProps {
  onGoHome: () => void;
}

export default function LogsModule({ onGoHome }: LogsModuleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SYSTEM LOGS</Text>
      </View>
      
      <ScrollView style={styles.logContainer}>
        <Text style={styles.logText}>[2024-01-15 14:23:01] Vault door sealed</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:05] Core containment active</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:07] WARNING: Unauthorized access detected</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:10] Security protocols activated</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:15] User authentication required</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:20] HIDDEN: Core location: center panel</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:25] ERROR: Terminal access denied</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:30] Camera module: OFFLINE</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:35] Audio system: STANDBY</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:40] HIDDEN: Inspection count: 0</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:45] Virus scan: IN PROGRESS</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:50] HIDDEN: Try tilting device</Text>
        <Text style={styles.logText}>[2024-01-15 14:23:55] System status: COMPROMISED</Text>
      </ScrollView>
      
      <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
        <Text style={styles.homeButtonText}>⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
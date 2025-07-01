import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface VaultRoomProps {
  onOpenModule: (moduleName: string) => void;
}

export default function VaultRoom({ 
  onOpenModule 
}: VaultRoomProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>EMERGENCY MODE</Text>
        <Text style={styles.subHeaderText}>System Status: INFECTED</Text>
      </View>
      
      <View style={styles.vaultRoom}>
        <Text style={styles.roomTitle}>QUARANTINE VAULT</Text>
        <Text style={styles.roomSubtitle}>Virus Containment Active</Text>
        
        <View style={styles.vaultGrid}>
          <TouchableOpacity 
            style={styles.vaultPanel} 
            onPress={() => onOpenModule('logs')}
          >
            <Text style={styles.panelText}>📋</Text>
            <Text style={styles.panelLabel}>LOGS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.vaultPanel} 
            onPress={() => onOpenModule('terminal')}
          >
            <Text style={styles.panelText}>💻</Text>
            <Text style={styles.panelLabel}>TERMINAL</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.vaultPanel} 
            onPress={() => onOpenModule('camera')}
          >
            <Text style={styles.panelText}>📷</Text>
            <Text style={styles.panelLabel}>CAMERA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.vaultPanel} 
            onPress={() => onOpenModule('audio')}
          >
            <Text style={styles.panelText}>🎵</Text>
            <Text style={styles.panelLabel}>AUDIO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.vaultPanel} 
            onPress={() => onOpenModule('system')}
          >
            <Text style={styles.panelText}>⚙️</Text>
            <Text style={styles.panelLabel}>SYSTEM</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.vaultPanel} 
            onPress={() => onOpenModule('compass')}
          >
            <Text style={styles.panelText}>🧭</Text>
            <Text style={styles.panelLabel}>COMPASS</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.centerPanel} 
        //   onPress={}
        >
          <Text style={styles.centerText}>?</Text>
          <Text style={styles.centerLabel}>INSPECT</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.homeButtonDisabled}>
        <Text style={styles.homeButtonText}>⌂</Text>
      </TouchableOpacity>
      
    </View>
  );
} 
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface SystemModuleProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
  onSelfDestruct: () => void;
}

export default function SystemModule({ 
  onGoHome, 
  onGoToAbout, 
  onGoToCoreVitals, 
  onSelfDestruct 
}: SystemModuleProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SYSTEM</Text>
      </View>
      
      <ScrollView style={styles.systemContainer}>
        {/* Device Info Section */}
        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>DEVICE</Text>
          
          <TouchableOpacity style={styles.systemRow} onPress={onGoToAbout}>
            <Text style={styles.systemRowText}>About</Text>
            <Text style={styles.systemRowDetail}>Core Defender v1.0.3</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.systemRow} onPress={onGoToCoreVitals}>
            <Text style={styles.systemRowText}>Core Vitals</Text>
            <Text style={styles.systemRowDetail}>⚠️ Unstable</Text>
          </TouchableOpacity>
        </View>

        {/* Security Section */}
        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>SECURITY</Text>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Quarantine Status</Text>
            <Text style={styles.systemRowDetail}>ACTIVE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Virus Scan</Text>
            <Text style={styles.systemRowDetail}>INFECTED</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Access Level</Text>
            <Text style={styles.systemRowDetail}>RESTRICTED</Text>
          </TouchableOpacity>
        </View>

        {/* Hardware Section */}
        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>HARDWARE</Text>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Gyroscope</Text>
            <Text style={styles.systemRowDetail}>ONLINE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Microphone</Text>
            <Text style={styles.systemRowDetail}>STANDBY</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Camera</Text>
            <Text style={styles.systemRowDetail}>OFFLINE</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>GPS</Text>
            <Text style={styles.systemRowDetail}>ACTIVE</Text>
          </TouchableOpacity>
        </View>

        {/* System Section */}
        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>SYSTEM</Text>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Emergency Mode</Text>
            <Text style={styles.systemRowDetail}>ENABLED</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.systemRow}>
            <Text style={styles.systemRowText}>Auto-Destruct</Text>
            <Text style={styles.systemRowDetail}>ARMED</Text>
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>DANGER ZONE</Text>
          
          <TouchableOpacity style={styles.systemRowDanger} onPress={onSelfDestruct}>
            <Text style={styles.systemRowTextDanger}>Self-Destruct</Text>
            <Text style={styles.systemRowDetailDanger}>TERMINATE DEVICE</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
        <Text style={styles.homeButtonText}>⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
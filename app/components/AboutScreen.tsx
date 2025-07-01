import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface AboutScreenProps {
  onGoBack: () => void;
}

export default function AboutScreen({ onGoBack }: AboutScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>About</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <ScrollView style={styles.systemContainer}>
        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>DEVICE INFO</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Model</Text>
            <Text style={styles.systemRowDetail}>Core Defender X1</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>OS Version</Text>
            <Text style={styles.systemRowDetail}>CoreOS v1.0.3</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Serial Number</Text>
            <Text style={styles.systemRowDetail}>CD-X1-2024-001</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Manufacturer</Text>
            <Text style={styles.systemRowDetail}>Spartan Systems</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>HARDWARE SPECS</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Processor</Text>
            <Text style={styles.systemRowDetail}>Quantum Core Q1</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Memory</Text>
            <Text style={styles.systemRowDetail}>16GB Neural RAM</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Storage</Text>
            <Text style={styles.systemRowDetail}>1TB Holographic</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Battery</Text>
            <Text style={styles.systemRowDetail}>Infinite Core</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>SENSORS & INPUTS</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Gyroscope</Text>
            <Text style={styles.systemRowDetail}>6-Axis Quantum</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Microphone</Text>
            <Text style={styles.systemRowDetail}>Neural Array</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Camera</Text>
            <Text style={styles.systemRowDetail}>Holographic Lens</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>GPS</Text>
            <Text style={styles.systemRowDetail}>Quantum Positioning</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Haptic Engine</Text>
            <Text style={styles.systemRowDetail}>Neural Feedback</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>SECURITY FEATURES</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Biometric</Text>
            <Text style={styles.systemRowDetail}>Neural Scan</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Encryption</Text>
            <Text style={styles.systemRowDetail}>Quantum Lock</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Firewall</Text>
            <Text style={styles.systemRowDetail}>Neural Barrier</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>SPECIAL FEATURES</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Voice Recognition</Text>
            <Text style={styles.systemRowDetail}>Neural AI</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Gesture Control</Text>
            <Text style={styles.systemRowDetail}>Motion Sense</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Time Awareness</Text>
            <Text style={styles.systemRowDetail}>Chronos Sync</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Location Triggers</Text>
            <Text style={styles.systemRowDetail}>Geo-Aware</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 
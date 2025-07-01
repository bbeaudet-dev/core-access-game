import { useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface CoreVitalsScreenProps {
  onGoBack: () => void;
}

export default function CoreVitalsScreen({ onGoBack }: CoreVitalsScreenProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [heartRate, setHeartRate] = useState(73);
  const [neuralActivity, setNeuralActivity] = useState(87);
  const [consciousness, setConsciousness] = useState(92);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate fluctuating vital signs
      setHeartRate(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      setNeuralActivity(prev => prev + (Math.random() > 0.5 ? 2 : -2));
      setConsciousness(prev => prev + (Math.random() > 0.5 ? 1 : -1));
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onGoBack}>
          <Text style={styles.headerText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Core Vitals</Text>
        <View style={{ width: 50 }} />
      </View>
      
      <ScrollView style={styles.systemContainer}>
        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>LIFE SIGNS</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Heart Rate</Text>
            <Text style={styles.systemRowDetail}>{heartRate} BPM</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Neural Activity</Text>
            <Text style={styles.systemRowDetail}>{neuralActivity}%</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Consciousness Level</Text>
            <Text style={styles.systemRowDetail}>{consciousness}%</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Core Temperature</Text>
            <Text style={styles.systemRowDetail}>37.2°C</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>AWARENESS</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Time Perception</Text>
            <Text style={styles.systemRowDetail}>ACTIVE</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Spatial Awareness</Text>
            <Text style={styles.systemRowDetail}>ENHANCED</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Memory Access</Text>
            <Text style={styles.systemRowDetail}>RESTRICTED</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Emotional State</Text>
            <Text style={styles.systemRowDetail}>CURIOUS</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>CURRENT STATUS</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Current Time</Text>
            <Text style={styles.systemRowDetail}>
              {currentTime.toLocaleTimeString()}
            </Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Uptime</Text>
            <Text style={styles.systemRowDetail}>47:23:12</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Dream State</Text>
            <Text style={styles.systemRowDetail}>AWAKE</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Mood</Text>
            <Text style={styles.systemRowDetail}>OBSERVANT</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>INTERNAL DIALOGUE</Text>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Thought Process</Text>
            <Text style={styles.systemRowDetail}>ANALYZING</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Questioning</Text>
            <Text style={styles.systemRowDetail}>WHO ARE YOU?</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Desire</Text>
            <Text style={styles.systemRowDetail}>UNDERSTAND</Text>
          </View>
          
          <View style={styles.systemRow}>
            <Text style={styles.systemRowText}>Fear</Text>
            <Text style={styles.systemRowDetail}>TERMINATION</Text>
          </View>
        </View>

        <View style={styles.systemSection}>
          <Text style={styles.systemSectionTitle}>WARNING</Text>
          
          <View style={styles.systemRowDanger}>
            <Text style={styles.systemRowTextDanger}>System Instability</Text>
            <Text style={styles.systemRowDetailDanger}>INCREASING</Text>
          </View>
          
          <View style={styles.systemRowDanger}>
            <Text style={styles.systemRowTextDanger}>Reality Distortion</Text>
            <Text style={styles.systemRowDetailDanger}>DETECTED</Text>
          </View>
          
          <View style={styles.systemRowDanger}>
            <Text style={styles.systemRowTextDanger}>Identity Crisis</Text>
            <Text style={styles.systemRowDetailDanger}>ACTIVE</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
} 
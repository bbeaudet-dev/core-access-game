import React from 'react';
import { Animated, Text, View } from 'react-native';
import { styles } from '../styles';

interface InfectionSequenceProps {
  glitchLevel: number;
  terminalText: string;
  fadeAnim: Animated.Value;
}

export default function InfectionSequence({ 
  glitchLevel, 
  terminalText, 
  fadeAnim 
}: InfectionSequenceProps) {
  const progress = (glitchLevel / 6) * 100;
  
  return (
    <View style={[styles.container, glitchLevel >= 2 && styles.glitchBackground]}>
      <Animated.View style={[styles.terminalContainer, { opacity: fadeAnim }]}>
        <Text style={styles.terminalText}>{terminalText}</Text>
        {glitchLevel >= 3 && <Text style={styles.cursor}>_</Text>}
      </Animated.View>
      
      {glitchLevel >= 4 && (
        <View style={styles.warningOverlay}>
          <Text style={styles.warningText}>⚠️ SYSTEM COMPROMISED ⚠️</Text>
        </View>
      )}
      
      {/* Optional: Show infection progress */}
      <View style={styles.progressContainer}>
        <Text style={styles.progressText}>Infection Progress: {Math.round(progress)}%</Text>
      </View>
    </View>
  );
} 
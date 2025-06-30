import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface FakeGameMenuProps {
  onStartGame: () => void;
}

export default function FakeGameMenu({ onStartGame }: FakeGameMenuProps) {
  return (
    <View style={styles.container}>
      <View style={styles.gameHeader}>
        <Text style={styles.gameTitle}>CORE DEFENDER</Text>
        <Text style={styles.gameSubtitle}>Defend the Digital Realm</Text>
      </View>
      
      <View style={styles.gameContent}>
        <Text style={styles.gameDescription}>
          Experience the ultimate tower defense game! 
          Build powerful defenses and protect your digital core from waves of malicious invaders.
        </Text>
        
        <TouchableOpacity 
          style={styles.downloadButton} 
          onPress={onStartGame}
        >
          <Text style={styles.downloadText}>DOWNLOAD NOW</Text>
          <Text style={styles.downloadSubtext}>Free • 4.8★ • 10M+ Downloads</Text>
        </TouchableOpacity>
        
        <View style={styles.gameFeatures}>
          <Text style={styles.featureText}>🎮 50+ Levels</Text>
          <Text style={styles.featureText}>⚡ Real-time Strategy</Text>
          <Text style={styles.featureText}>🏆 Global Leaderboards</Text>
          <Text style={styles.featureText}>🎨 Stunning Graphics</Text>
        </View>
      </View>
    </View>
  );
} 
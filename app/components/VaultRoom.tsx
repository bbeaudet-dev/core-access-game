import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface VaultRoomProps {
  vaultProgress: number;
  onInspectVault: () => void;
  onOpenModule: (moduleName: string) => void;
}

export default function VaultRoom({ 
  vaultProgress,
  onInspectVault, 
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
        </View>

        <TouchableOpacity 
          style={styles.centerPanel} 
          onPress={onInspectVault}
        >
          <Text style={styles.centerText}>?</Text>
          <Text style={styles.centerLabel}>INSPECT</Text>
        </TouchableOpacity>

        {/* {showGlitch && (
          <View style={styles.alarmOverlay}>
            <Text style={styles.alarmText}>🚨 UNAUTHORIZED ACCESS 🚨</Text>
            <Text style={styles.alarmText}>SECURITY PROTOCOLS ACTIVATED</Text>
          </View>
        )} */}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Virus Containment: {vaultProgress * 25}%</Text>
      </View>
    </View>
  );
} 
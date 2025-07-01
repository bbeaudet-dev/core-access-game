import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { styles } from '../styles';

interface CameraModuleProps {
  onGoHome: () => void;
}

export default function CameraModule({ onGoHome }: CameraModuleProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>CAMERA</Text>
        </View>
        <View style={styles.cameraContainer}>
          <Text style={styles.cameraText}>Requesting camera permission...</Text>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
          <Text style={styles.homeButtonText}>⌂</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerText}>CAMERA</Text>
        </View>
        <View style={styles.cameraContainer}>
          <Text style={styles.cameraText}>No access to camera</Text>
          <Text style={styles.cameraText}>Camera permission is required for this module</Text>
        </View>
        <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
          <Text style={styles.homeButtonText}>⌂</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>CAMERA</Text>
      </View>
      
      <View style={styles.cameraContainer}>
        <Text style={styles.cameraText}>📷 Camera access granted!</Text>
        <Text style={styles.cameraText}>Module ready for scanning</Text>
        <Text style={styles.cameraText}>HINT: Try tilting your device</Text>
        <Text style={styles.cameraText}>HINT: Point at different objects</Text>
        <Text style={styles.cameraText}>HINT: Check for hidden messages</Text>
      </View>

      <TouchableOpacity style={styles.homeButton} onPress={onGoHome}>
        <Text style={styles.homeButtonText}>⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
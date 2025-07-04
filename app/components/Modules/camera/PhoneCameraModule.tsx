import { Camera } from 'expo-camera';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import ScreenTemplate from '../../ui/ScreenTemplate';
import CameraPlaceholder from './CameraPlaceholder';
import CameraStatus from './CameraStatus';

interface PhoneCameraModuleProps {
  onGoHome: () => void;
}

export default function PhoneCameraModule({ onGoHome }: PhoneCameraModuleProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initCamera = async () => {
      try {
        if (Platform.OS === 'web') {
          setError('Camera not available on web');
          setHasPermission(false);
          return;
        }

        // Request camera permissions
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
        
        if (status !== 'granted') {
          setError('Camera permission denied');
        }
      } catch (err) {
        console.error('Camera initialization failed:', err);
        setError('Failed to initialize camera');
        setHasPermission(false);
      }
    };

    initCamera();
  }, []);

  const handlePhotoCapture = (uri: string) => {
    console.log('Photo captured:', uri);
    // You can add logic here to save the photo or process it
  };

  return (
    <ScreenTemplate title="CAMERA" titleColor="purple" onGoHome={onGoHome}>
      {Platform.OS === 'web' ? (
        <CameraStatus status="web" />
      ) : hasPermission === null ? (
        <CameraStatus status="loading" />
      ) : hasPermission === false || error ? (
        <CameraStatus status="error" error={error || undefined} />
      ) : (
        <View className="flex-col p-5">
          <Text className="text-green-400 text-center text-lg mb-4">📷 Camera Module: ACTIVE</Text>
          
          {/* Camera Component */}
          <View className="mb-6">
            <CameraPlaceholder />
          </View>
          
          <View className="space-y-3">
            <Text className="text-green-400 text-center text-sm">Camera: READY</Text>
            <Text className="text-purple-400 text-center text-xs">Live feed from device camera</Text>
            <Text className="text-gray-500 text-center text-xs">Tap to capture photos</Text>
          </View>
        </View>
      )}
    </ScreenTemplate>
  );
} 
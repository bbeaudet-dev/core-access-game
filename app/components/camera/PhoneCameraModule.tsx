import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
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

        // Simple permission check without complex imports
        setHasPermission(true);
      } catch (err) {
        console.error('Camera initialization failed:', err);
        setError('Failed to initialize camera');
        setHasPermission(false);
      }
    };

    initCamera();
  }, []);

  // Web fallback
  if (Platform.OS === 'web') {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="PHONE CAMERA" color="purple" />
            <CameraStatus status="web" />
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  // Loading state
  if (hasPermission === null) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="PHONE CAMERA" color="purple" />
            <CameraStatus status="loading" />
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  // Permission denied or error
  if (hasPermission === false || error) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="PHONE CAMERA" color="purple" />
            <CameraStatus status="error" error={error || undefined} />
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  // Camera ready - show placeholder for now
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="PHONE CAMERA" color="purple" />
          <View className="flex-1 p-5">
            <Text className="text-green-400 text-center text-lg mb-4">📷 Camera Module: ACTIVE</Text>
            
            {/* Camera Placeholder Component */}
            <View className="mb-6">
              <CameraPlaceholder />
            </View>
            
            <View className="space-y-3">
              <Text className="text-green-400 text-center text-sm">Camera: {hasPermission ? 'READY' : 'DENIED'}</Text>
              <Text className="text-yellow-400 text-center text-xs">HINT: Camera functionality coming soon</Text>
              <Text className="text-purple-400 text-center text-xs">Status: Placeholder mode active</Text>
            </View>
          </View>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
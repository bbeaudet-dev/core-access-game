import { Camera } from 'expo-camera';
import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

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
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-xl font-bold">CAMERA</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-base mb-2">Requesting camera permission...</Text>
        </View>
        <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10" onPress={onGoHome}>
          <Text className="text-white text-xl font-bold">⌂</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-xl font-bold">CAMERA</Text>
        </View>
        <View className="flex-1 justify-center items-center">
          <Text className="text-red-500 text-base mb-2">No access to camera</Text>
          <Text className="text-red-500 text-base mb-2">Camera permission is required for this module</Text>
        </View>
        <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10" onPress={onGoHome}>
          <Text className="text-white text-xl font-bold">⌂</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <Text className="text-red-500 text-xl font-bold">CAMERA</Text>
      </View>
      
      <View className="flex-1 justify-center items-center">
        <Text className="text-red-500 text-base mb-2">📷 Camera access granted!</Text>
        <Text className="text-red-500 text-base mb-2">Module ready for scanning</Text>
        <Text className="text-red-500 text-base mb-2">HINT: Try tilting your device</Text>
        <Text className="text-red-500 text-base mb-2">HINT: Point at different objects</Text>
        <Text className="text-red-500 text-base mb-2">HINT: Check for hidden messages</Text>
      </View>

      <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-red-500 justify-center items-center border-2 border-white z-10" onPress={onGoHome}>
        <Text className="text-white text-xl font-bold">⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
import { Text, TouchableOpacity, View } from 'react-native';

interface CameraPlaceholderProps {
  onPhotoCapture?: (uri: string) => void;
}

export default function CameraPlaceholder({ onPhotoCapture }: CameraPlaceholderProps) {
  const handlePhotoCapture = () => {
    if (onPhotoCapture) {
      onPhotoCapture('placeholder-photo-uri');
    }
  };

  return (
    <View className="bg-gray-800 rounded-lg p-4 mb-4">
      <View className="bg-gray-700 rounded-lg p-8 items-center justify-center">
        <Text className="text-gray-400 text-4xl mb-2">📷</Text>
        <Text className="text-gray-400 text-center text-sm">Camera View</Text>
        <Text className="text-gray-500 text-center text-xs mt-1">Placeholder</Text>
        
        {onPhotoCapture && (
          <TouchableOpacity
            onPress={handlePhotoCapture}
            className="mt-4 px-4 py-2 bg-purple-600 rounded-lg"
          >
            <Text className="text-white text-center font-mono text-sm">
              CAPTURE PHOTO
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
} 
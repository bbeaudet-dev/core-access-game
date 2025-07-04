import { Image, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { playSound } from '../../utils/soundManager';

// Preload the corruption image to prevent loading delay
const CORRUPTION_IMAGE = require('../../../assets/images/red_corruption_small.jpg');

interface AppIconWithHaloProps {
  icon: string;
  name: string;
  color: string;
  onPress: () => void;
  disabled?: boolean;
  style?: ViewStyle;
  badge?: string | number;
  status?: 'completed' | 'in-progress' | 'locked' | 'default';
}

// Function to generate corrupted names
const generateCorruptedName = (originalName: string): string => {
  const corruptionPatterns = [
    'ERR0R',
    'BR0K3N',
    'L0CK3D',
    'C0RRUPT3D',
    'F4IL3D',
    'D4M4G3D',
    'H4CK3D',
    'GL1TCH',
    'CR4SH3D',
    'DE4D',
    'V1RUS',
    'TR0J4N',
    'SP4M',
    'PH1SH',
    'R4NS0M',
    'SPYW4R3',
  ];
  
  // Use the original name length to pick a pattern, or random if longer
  const patternIndex = originalName.length % corruptionPatterns.length;
  return corruptionPatterns[patternIndex];
};

export default function AppIconWithHalo({ 
  icon, 
  name, 
  color, 
  onPress, 
  disabled = false,
  style,
  badge,
  status = 'default'
}: AppIconWithHaloProps) {
  const handlePress = () => {
    if (!disabled && status !== 'locked') {
      playSound('ui_app_launch');
      onPress();
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'in-progress':
        return 'bg-blue-600';
      case 'locked':
        return 'bg-gray-700'; // Will be overridden by Image
      default:
        return color;
    }
  };

  const getOpacity = () => {
    if (disabled) return 'opacity-50';
    if (status === 'locked') return 'opacity-70';
    return '';
  };

  // Get the appropriate icon and name based on status
  const getDisplayIcon = () => {
    return status === 'locked' ? '🔒' : icon;
  };

  const getDisplayName = () => {
    return status === 'locked' ? generateCorruptedName(name) : name;
  };

  // Get text color based on status
  const getTextColor = () => {
    return status === 'locked' ? 'text-red-800' : 'text-white';
  };

  const renderIcon = () => (
    <View className="items-center relative">
      <TouchableOpacity 
        className={`w-16 h-16 ${getBackgroundColor()} justify-center items-center rounded-lg relative ${getOpacity()}`}
        onPress={handlePress}
        disabled={disabled || status === 'locked'}
        style={style}
      >
        {/* Badge */}
        {badge && (
          <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 justify-center items-center">
            <Text className="text-xs text-white font-bold">
              {badge}
            </Text>
          </View>
        )}
        
        {/* Icon - 25% larger */}
        <Text className="text-2xl">{getDisplayIcon()}</Text>  
      </TouchableOpacity>
      
      {/* Name with flexible text size */}
      <Text 
        className={`text-xs font-bold text-center max-w-20 mt-1 ${getTextColor()}`}
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {getDisplayName()}
      </Text>
    </View>
  );

  // Use corrupted background for locked status
  if (status === 'locked') {
    return (
      <View className="items-center relative">
        <View className="w-16 h-16 rounded-lg overflow-hidden">
          <Image
            source={CORRUPTION_IMAGE}
            style={{
              width: '100%',
              height: '100%',
            }}
            resizeMode="cover"
          />
          <TouchableOpacity 
            className="absolute inset-0 justify-center items-center"
            onPress={handlePress}
            disabled={disabled || status === 'locked'}
            style={style}
          >
            {/* Badge */}
            {badge && (
              <View className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-5 h-5 justify-center items-center">
                <Text className="text-xs text-white font-bold">
                  {badge}
                </Text>
              </View>
            )}
            
            {/* Lock Icon - 25% larger and centered */}
            <Text className="text-2xl">{getDisplayIcon()}</Text>  
          </TouchableOpacity>
        </View>
        
        {/* Name with flexible text size */}
        <Text 
          className={`text-xs font-bold text-center max-w-20 mt-1 ${getTextColor()}`}
          numberOfLines={2}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
        >
          {getDisplayName()}
        </Text>
      </View>
    );
  }

  return renderIcon();
} 
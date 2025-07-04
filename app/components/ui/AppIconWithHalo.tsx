import { ImageBackground, Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { playSound } from '../../utils/soundManager';

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
        return 'bg-gray-700'; // Will be overridden by ImageBackground
      default:
        return color;
    }
  };

  const getOpacity = () => {
    if (disabled) return 'opacity-50';
    if (status === 'locked') return 'opacity-70';
    return '';
  };

  const renderIcon = () => (
    <View className="items-center relative">
      {/* Lock Icon - centered and 100% larger */}
      {status === 'locked' && (
        <View className="absolute top-2 left-2 z-10">
          <Text className="text-4xl">🔒</Text>
        </View>
      )}
      
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
        <Text className="text-2xl">{icon}</Text>  
      </TouchableOpacity>
      
      {/* Name with flexible text size */}
      <Text 
        className="text-xs font-bold text-white text-center max-w-20 mt-1"
        numberOfLines={2}
        adjustsFontSizeToFit
        minimumFontScale={0.8}
      >
        {name}
      </Text>
    </View>
  );

  // Use corrupted background for locked status
  if (status === 'locked') {
    return (
      <ImageBackground
        source={require('../../../assets/images/red_corruption.jpg')}
        className="rounded-lg"
        imageStyle={{ borderRadius: 8 }}
      >
        {renderIcon()}
      </ImageBackground>
    );
  }

  return renderIcon();
} 
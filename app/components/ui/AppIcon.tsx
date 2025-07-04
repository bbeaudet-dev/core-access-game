import { Text, TouchableOpacity, View, ViewStyle } from 'react-native';
import { playSound } from '../../utils/soundManager';

interface AppIconProps {
  icon: string;
  name: string;
  color: string;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  style?: ViewStyle;
  badge?: string | number;
}

export default function AppIcon({ 
  icon, 
  name, 
  color, 
  onPress, 
  size = 'md',
  disabled = false,
  style,
  badge
}: AppIconProps) {
  const handlePress = () => {
    if (!disabled) {
      playSound('ui_app_launch');
      onPress();
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'w-12 h-12';
      case 'md':
        return 'w-16 h-16';
      case 'lg':
        return 'w-20 h-20';
      default:
        return 'w-16 h-16';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm':
        return 'text-lg';
      case 'md':
        return 'text-xl';
      case 'lg':
        return 'text-2xl';
      default:
        return 'text-xl';
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-xs';
      case 'lg':
        return 'text-sm';
      default:
        return 'text-xs';
    }
  };

  const getBadgeSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs';
      case 'md':
        return 'text-xs';
      case 'lg':
        return 'text-sm';
      default:
        return 'text-xs';
    }
  };

  return (
    <View>
      <TouchableOpacity 
        className={`${getSizeClasses()} ${color} justify-center items-center m-1 rounded-lg relative ${disabled ? 'opacity-50' : ''}`}
        onPress={handlePress}
        disabled={disabled}
        style={style}
      >
        {/* Badge */}
        {badge && (
          <View className="absolute bg-red-500 rounded-full min-w-5 h-5 justify-center align-center items-center">
            <Text className={`${getBadgeSize()} text-white font-bold`}>
              {badge}
            </Text>
          </View>
        )}
        
        {/* Icon */}
        <Text className={`${getIconSize()} mb-1`}>{icon}</Text>  
      </TouchableOpacity>
      
      {/* Name */}
      <Text className={`${getTextSize()} font-bold text-white text-center justify-center`}>
        {name}
      </Text>
    </View>  
  );
} 
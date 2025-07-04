import React from 'react';
import { View } from 'react-native';
import BatteryIndicator from './BatteryIndicator';
import HomeButton from './HomeButton';
import ModuleHeader from './ModuleHeader';

interface ScreenTemplateProps {
  title: string;
  titleColor?: string;
  children: React.ReactNode;
  showHomeButton?: boolean;
  onGoHome?: () => void;
  className?: string;
}

export default function ScreenTemplate({
  title,
  titleColor = 'blue',
  children,
  showHomeButton = true,
  onGoHome,
  className = ''
}: ScreenTemplateProps) {
  return (
    <View className={`flex-1 bg-black ${className}`}>
      {/* Top area with notch margin */}
      <View className="pt-12 px-4">
        {/* Header with battery indicator */}
        <View className="flex-row justify-between items-center mb-6">
          <View className="flex-1">
            <ModuleHeader name={title} color={titleColor} />
          </View>
          <View className="ml-4">
            <BatteryIndicator />
          </View>
        </View>
      </View>
      
      <View className="flex-1 px-4">
        {children}
      </View>
      
      {showHomeButton && onGoHome && (
        <HomeButton active={true} onPress={onGoHome} />
      )}
    </View>
  );
} 
import React from 'react';
import { View } from 'react-native';
import HomeButton from './HomeButton';
import ModuleHeader from './ModuleHeader';
import PhoneFrame from './PhoneFrame';

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
    <PhoneFrame>
      <View className={`flex-1 bg-black ${className}`}>
        <ModuleHeader name={title} color={titleColor} />
        
        <View className="flex-1 p-4">
          {children}
        </View>
        
        {showHomeButton && onGoHome && (
          <HomeButton active={true} onPress={onGoHome} />
        )}
      </View>
    </PhoneFrame>
  );
} 
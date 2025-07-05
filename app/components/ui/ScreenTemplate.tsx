import React from 'react';
import { ImageBackground, View } from 'react-native';
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
  backgroundImage?: any;
}

export default function ScreenTemplate({
  title,
  titleColor = 'blue',
  children,
  showHomeButton = true,
  onGoHome,
  className = '',
  backgroundImage
}: ScreenTemplateProps) {
  const content = (
    <>
      {/* Top area with notch margin */}
      <View className="pt-6 px-4">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-3">
          <View className="flex-1 justify-center items-center">
            <ModuleHeader name={title} color={titleColor} />
          </View>
          <View className="flex-1 items-end">
            <BatteryIndicator />
          </View>
        </View>
      </View>
      
      <View className="flex-1 px-4 mx-2">
        {children}
      </View>
      
      {showHomeButton && onGoHome && (
        <HomeButton active={true} onPress={onGoHome} />
      )}
    </>
  );

  if (backgroundImage) {
    return (
      <ImageBackground 
        source={backgroundImage}
        className={`flex-1 ${className}`}
        resizeMode="cover"
      >
        {content}
      </ImageBackground>
    );
  }

  return (
    <View className={`flex-1 bg-black ${className}`}>
      {content}
    </View>
  );
} 
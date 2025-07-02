import React from 'react';
import { Text, View, ViewStyle } from 'react-native';

interface PhoneFrameProps {
  children: React.ReactNode;
  style?: ViewStyle;
  showNotch?: boolean;
  showHomeIndicator?: boolean;
}

export default function PhoneFrame({ 
  children, 
  style, 
  showNotch = true, 
  showHomeIndicator = true 
}: PhoneFrameProps) {
  return (
    <View className="flex-1 bg-gray-900 justify-center items-center p-4">
      {/* Phone Frame */}
      <View 
        className="bg-black rounded-[3rem] p-2 shadow-2xl"
        style={[
          {
            width: '100%',
            maxWidth: 375,
            height: '100%',
            maxHeight: 812,
          },
          style
        ]}
      >
        {/* Screen Content */}
        <View className="flex-1 bg-black rounded-[2.5rem] overflow-hidden relative">
          {/* Status Bar */}
          <View className="h-12 bg-black flex-row justify-between items-center px-6 pt-2">
            <Text className="text-white text-sm font-semibold">9:41</Text>
            <View className="flex-row items-center space-x-1">
              <View className="w-6 h-3 bg-white rounded-sm flex-row justify-end items-center px-0.5">
                <View className="w-4 h-1.5 bg-black rounded-sm"></View>
              </View>
              <Text className="text-white text-xs"></Text>
            </View>
          </View>

          {/* Notch */}
          {showNotch && (
            <View className="absolute top-0 left-1/2 -ml-12 w-24 h-6 bg-black rounded-b-3xl z-10"></View>
          )}

          {/* Main Content */}
          <View className="flex-1">
            {children}
          </View>
        </View>
      </View>
    </View>
  );
} 
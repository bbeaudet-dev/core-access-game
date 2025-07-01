import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';

interface VaultRoomProps {
  onOpenModule: (moduleName: string) => void;
}

export default function VaultRoom({ 
  onOpenModule 
}: VaultRoomProps) {
  return (
    <View className="flex-1 bg-black">
      <View className="p-5 pt-15 flex-row justify-between items-center">
        <Text className="text-red-500 text-xl font-bold">EMERGENCY MODE</Text>
        <Text className="text-red-500 text-xs">System Status: INFECTED</Text>
      </View>
      
      <View className="flex-1 p-5 justify-center">
        <Text className="text-red-500 text-2xl font-bold text-center mb-1">QUARANTINE VAULT</Text>
        <Text className="text-red-500 text-sm text-center mb-8">Virus Containment Active</Text>
        
        <View className="flex-row flex-wrap justify-around mb-8">
          <TouchableOpacity 
            className="w-20 h-20 bg-red-500 justify-center items-center m-1 rounded-lg" 
            onPress={() => onOpenModule('logs')}
          >
            <Text className="text-2xl mb-1">📋</Text>
            <Text className="text-xs font-bold text-white">LOGS</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-20 h-20 bg-red-500 justify-center items-center m-1 rounded-lg" 
            onPress={() => onOpenModule('terminal')}
          >
            <Text className="text-2xl mb-1">💻</Text>
            <Text className="text-xs font-bold text-white">TERMINAL</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-20 h-20 bg-red-500 justify-center items-center m-1 rounded-lg" 
            onPress={() => onOpenModule('camera')}
          >
            <Text className="text-2xl mb-1">📷</Text>
            <Text className="text-xs font-bold text-white">CAMERA</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-20 h-20 bg-red-500 justify-center items-center m-1 rounded-lg" 
            onPress={() => onOpenModule('audio')}
          >
            <Text className="text-2xl mb-1">🎵</Text>
            <Text className="text-xs font-bold text-white">AUDIO</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            className="w-20 h-20 bg-red-500 justify-center items-center m-1 rounded-lg" 
            onPress={() => onOpenModule('system')}
          >
            <Text className="text-2xl mb-1">⚙️</Text>
            <Text className="text-xs font-bold text-white">SYSTEM</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          className="w-30 h-30 bg-red-500 justify-center items-center self-center rounded-2xl border-3 border-yellow-400" 
        //   onPress={}
        >
          <Text className="text-4xl text-white mb-1">?</Text>
          <Text className="text-xs font-bold text-white">INSPECT</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity className="absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full bg-gray-600 justify-center items-center border-2 border-gray-500 z-10 opacity-50">
        <Text className="text-white text-xl font-bold">⌂</Text>
      </TouchableOpacity>
      
    </View>
  );
} 
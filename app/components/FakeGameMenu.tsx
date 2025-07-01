import { Text, TouchableOpacity, View } from 'react-native';

interface FakeGameMenuProps {
  onStartGame: () => void;
}

export default function FakeGameMenu({ onStartGame }: FakeGameMenuProps) {
  return (
    <View className="flex-1 bg-black justify-center items-center px-6">
      <View className="items-center mb-8">
        <Text className="text-4xl font-bold text-green-400 mb-2">CORE DEFENDER</Text>
        <Text className="text-lg text-gray-400">Defend the Digital Realm</Text>
      </View>
      
      <View className="items-center mb-8">
        <Text className="text-center text-gray-300 mb-6 leading-6">
          Experience the ultimate tower defense game! 
          Build powerful defenses and protect your digital core from waves of malicious invaders.
        </Text>
        
        <TouchableOpacity 
          className="bg-green-600 px-8 py-4 rounded-lg mb-6" 
          onPress={onStartGame}
        >
          <Text className="text-white font-bold text-lg text-center">DOWNLOAD NOW</Text>
          <Text className="text-green-200 text-sm text-center mt-1">Free • 4.8★ • 10M+ Downloads</Text>
        </TouchableOpacity>
        
        <View className="items-center">
          <Text className="text-gray-400 mb-2">🎮 50+ Levels</Text>
          <Text className="text-gray-400 mb-2">⚡ Real-time Strategy</Text>
          <Text className="text-gray-400 mb-2">🏆 Global Leaderboards</Text>
          <Text className="text-gray-400 mb-2">🎨 Stunning Graphics</Text>
        </View>
      </View>
      
      <TouchableOpacity className="absolute bottom-8 w-16 h-16 bg-gray-600 rounded-full items-center justify-center opacity-50">
        <Text className="text-white text-2xl">⌂</Text>
      </TouchableOpacity>
    </View>
  );
} 
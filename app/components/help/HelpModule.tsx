import { ScrollView, Text, View } from 'react-native';
import { useHints } from '../../contexts/HintContext';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';

interface HelpModuleProps {
  onGoHome: () => void;
}

export default function HelpModule({ onGoHome }: HelpModuleProps) {
  const { hints, unlockedHints } = useHints();

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'gyro': return 'text-green-400';
      case 'compass': return 'text-blue-400';
      case 'camera': return 'text-purple-400';
      case 'audio': return 'text-yellow-400';
      default: return 'text-gray-400';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'gyro': return '🔄';
      case 'compass': return '🧭';
      case 'camera': return '📷';
      case 'audio': return '🎤';
      default: return '💡';
    }
  };

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="HELP" color="blue" />
          
          <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
            <View className="space-y-4">
              {/* Stats */}
              <View className="bg-gray-900 p-4 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">ACHIEVEMENTS</Text>
                <Text className="text-blue-400 text-2xl font-mono">
                  {unlockedHints.length} / {hints.length}
                </Text>
                <Text className="text-gray-500 text-sm font-mono mt-1">
                  Hints unlocked
                </Text>
              </View>

              {/* Unlocked Hints */}
              {unlockedHints.length > 0 ? (
                <View className="space-y-3">
                  <Text className="text-gray-400 text-sm font-mono">UNLOCKED HINTS</Text>
                  {unlockedHints.map((hint) => (
                    <View key={hint.id} className="bg-gray-900 p-4 rounded-lg">
                      <View className="flex-row items-center mb-2">
                        <Text className="text-2xl mr-2">{getCategoryIcon(hint.category)}</Text>
                        <Text className={`text-lg font-mono ${getCategoryColor(hint.category)}`}>
                          {hint.title}
                        </Text>
                      </View>
                      <Text className="text-gray-300 text-sm mb-2">{hint.description}</Text>
                      <Text className="text-gray-500 text-xs font-mono">
                        Unlocked: {hint.unlockedAt?.toLocaleDateString()}
                      </Text>
                    </View>
                  ))}
                </View>
              ) : (
                <View className="bg-gray-900 p-4 rounded-lg">
                  <Text className="text-gray-400 text-center text-sm font-mono mb-2">
                    No hints unlocked yet
                  </Text>
                  <Text className="text-gray-500 text-center text-xs">
                    Complete achievements in other modules to unlock hints
                  </Text>
                </View>
              )}

              {/* Available Hints (Locked) */}
              <View className="space-y-3">
                <Text className="text-gray-400 text-sm font-mono">AVAILABLE HINTS</Text>
                {hints
                  .filter(hint => !hint.unlocked)
                  .map((hint) => (
                    <View key={hint.id} className="bg-gray-800 p-4 rounded-lg opacity-60">
                      <View className="flex-row items-center mb-2">
                        <Text className="text-2xl mr-2">{getCategoryIcon(hint.category)}</Text>
                        <Text className="text-gray-500 text-lg font-mono">
                          {hint.title}
                        </Text>
                      </View>
                      <Text className="text-gray-600 text-xs font-mono">
                        {hint.condition}
                      </Text>
                    </View>
                  ))}
              </View>

              {/* Help Text */}
              <View className="bg-gray-900 p-4 rounded-lg">
                <Text className="text-gray-400 text-sm font-mono mb-2">HOW TO UNLOCK</Text>
                <Text className="text-gray-300 text-sm mb-2">
                  • Use the gyroscope to reach high speeds
                </Text>
                <Text className="text-gray-300 text-sm mb-2">
                  • Explore the compass and camera modules
                </Text>
                <Text className="text-gray-300 text-sm mb-2">
                  • Monitor audio levels in the audio module
                </Text>
                <Text className="text-gray-300 text-sm">
                  • Complete various achievements across all modules
                </Text>
              </View>
            </View>
          </ScrollView>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
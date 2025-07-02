import { Text, TouchableOpacity, View } from 'react-native';
import { ModuleName, useModuleUnlock } from '../contexts/ModuleUnlockContext';
import AppIcon from './ui/AppIcon';
import PhoneFrame from './ui/PhoneFrame';

interface HomeScreenProps {
  onOpenModule: (moduleName: ModuleName) => void;
}

export default function HomeScreen({ 
  onOpenModule 
}: HomeScreenProps) {
  const { allModules, getNextUnlockableModule } = useModuleUnlock();
  const nextModule = getNextUnlockableModule();

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-5 pt-15 flex-row justify-between items-center">
          <Text className="text-red-500 text-2xl font-bold">EMERGENCY MODE</Text>
        </View>
        
        <View className="flex-1 p-5 justify-center">
          <View className="flex-row flex-wrap justify-center mb-8">
            {allModules
              .filter(module => module.unlocked)
              .map(module => (
                <AppIcon
                  key={module.name}
                  icon={module.icon}
                  name={module.displayName}
                  color={module.color}
                  onPress={() => onOpenModule(module.name)}
                />
              ))}
          </View>

          {/* Next Module Hint */}
          {nextModule && (
            <View className="bg-gray-900 p-4 rounded-lg mb-6">
              <Text className="text-gray-400 text-sm font-mono mb-2">NEXT MODULE</Text>
              <Text className="text-yellow-400 text-lg font-mono mb-1">
                {nextModule.icon} {nextModule.displayName}
              </Text>
              <Text className="text-gray-500 text-xs font-mono">
                {nextModule.requirement}
              </Text>
            </View>
          )}

          <TouchableOpacity 
            className="w-30 h-30 bg-red-500 justify-center items-center self-center rounded-2xl border-3 border-yellow-400" 
          //   onPress={}
          >
            <Text className="text-4xl text-white mb-1">?</Text>
            <Text className="text-xs font-bold text-white">INSPECT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </PhoneFrame>
  );
} 
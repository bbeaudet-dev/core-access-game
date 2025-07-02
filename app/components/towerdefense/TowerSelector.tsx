import { Text, TouchableOpacity, View } from 'react-native';

interface TowerSelectorProps {
  selectedTower: 'defender' | null;
  onSelectTower: (tower: 'defender' | null) => void;
  towerCost: number;
}

export default function TowerSelector({ selectedTower, onSelectTower, towerCost }: TowerSelectorProps) {
  return (
    <View className="bg-gray-900 p-4 rounded-lg mb-4">
      <Text className="text-gray-400 text-sm font-mono mb-2">TOWERS</Text>
      <View className="flex-row space-x-4">
        <TouchableOpacity
          className={`p-3 rounded-lg ${selectedTower === 'defender' ? 'bg-orange-600' : 'bg-gray-700'}`}
          onPress={() => onSelectTower('defender')}
        >
          <Text className="text-white text-center font-mono text-sm">🛡️ Defender</Text>
          <Text className="text-gray-400 text-center font-mono text-xs">${towerCost}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
} 
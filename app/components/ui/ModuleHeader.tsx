// ModuleHeader: A reusable header for module screens.
// Props:
//   - name: string (the module name)
//   - color: string (color keyword: 'green', 'red', etc)

import { Text, View } from 'react-native';

const colorMap: Record<string, string> = {
  green: 'text-green-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  purple: 'text-purple-400',
  gray: 'text-gray-400',
};

export default function ModuleHeader({ name, color }: { name: string, color: string }) {
  return (
    <View className="flex-row justify-between items-center mb-6">
      <Text className={`${colorMap[color] || 'text-white'} text-2xl font-mono`}>{name}</Text>
    </View>
  );
} 
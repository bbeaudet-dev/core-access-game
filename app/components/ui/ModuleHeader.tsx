import { Text } from 'react-native';

const colorMap: Record<string, string> = {
  green: 'text-green-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
  yellow: 'text-yellow-400',
  purple: 'text-purple-400',
  gray: 'text-gray-400',
  cyan: 'text-cyan-400',
  orange: 'text-orange-400',
};

export default function ModuleHeader({ name, color }: { name: string, color: string }) {
  return (
    <Text className={`${colorMap[color] || 'text-white'} text-2xl font-mono`}>{name}</Text>
  );
} 
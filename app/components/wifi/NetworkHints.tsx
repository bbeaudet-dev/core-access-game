import { Text, View } from 'react-native';

export default function NetworkHints() {
  return (
    <View className="bg-gray-900 p-4 rounded-lg">
      <Text className="text-gray-400 text-sm font-mono mb-2">HINTS</Text>
      <Text className="text-yellow-400 text-xs font-mono mb-1">• Look for networks with high signal strength</Text>
      <Text className="text-yellow-400 text-xs font-mono mb-1">• WPA3 networks are more secure</Text>
      <Text className="text-yellow-400 text-xs font-mono mb-1">• 5GHz networks are faster but shorter range</Text>
      <Text className="text-yellow-400 text-xs font-mono">• Some networks may be hidden from normal scans</Text>
    </View>
  );
} 
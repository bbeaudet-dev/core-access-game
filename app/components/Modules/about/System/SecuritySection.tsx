import { Text, TouchableOpacity, View } from 'react-native';

export default function SecuritySection() {
  return (
    <View className="mb-6">
      <Text className="text-red-500 text-lg font-bold mb-3">SECURITY</Text>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Quarantine Status</Text>
        <Text className="text-gray-400 text-sm">ACTIVE</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Virus Scan</Text>
        <Text className="text-gray-400 text-sm">INFECTED</Text>
      </TouchableOpacity>
      
      <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-700">
        <Text className="text-white text-base">Access Level</Text>
        <Text className="text-gray-400 text-sm">RESTRICTED</Text>
      </TouchableOpacity>
    </View>
  );
} 
// HomeButton: A reusable home button for module screens.
// Props:
//   - active: boolean (red and clickable if true, gray and disabled if false)
//   - onPress: function (called when active and pressed)

import { Text, TouchableOpacity } from 'react-native';

export default function HomeButton({ active, onPress }: { active: boolean, onPress?: () => void }) {
  return (
    <TouchableOpacity
      disabled={!active}
      onPress={active ? onPress : undefined}
      className={`absolute bottom-10 left-1/2 -ml-8 w-16 h-16 rounded-full ${active ? 'bg-red-500' : 'bg-gray-500'} justify-center items-center border-2 border-white z-10`}
      style={{ opacity: active ? 1 : 0.5 }}
    >
      <Text className="text-white text-2xl font-bold">⌂</Text>
    </TouchableOpacity>
  );
} 
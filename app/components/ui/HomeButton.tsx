import { Text, TouchableOpacity } from 'react-native'

interface HomeButtonProps {
  active: boolean
  onPress?: () => void
}

export default function HomeButton({ active, onPress }: HomeButtonProps) {
  return (
    <TouchableOpacity
      disabled={!active}
      onPress={active ? onPress : undefined}
      className={`
        absolute bottom-8 left-1/2 -ml-10 w-20 h-20 rounded-2xl
        ${active ? 'bg-red-500' : 'bg-gray-500'} 
        justify-center items-center border-2 border-white z-10
      `}
      style={{ opacity: active ? 1 : 0.5 }}
    >
      <Text className="text-white text-2xl font-bold">⌂</Text>
    </TouchableOpacity>
  )
} 
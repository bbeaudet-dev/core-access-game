import { Text, View } from 'react-native'

interface CameraStatusProps {
  status: 'loading' | 'error' | 'ready' | 'web'
  error?: string
}

export default function CameraStatus({ status, error }: CameraStatusProps) {
  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return {
          title: '📷 Camera Module',
          subtitle: 'Initializing camera...',
          color: 'text-gray-400'
        }
      case 'error':
        return {
          title: '📷 Camera Module',
          subtitle: error || 'Camera access denied',
          hint: 'Please grant camera permissions in settings',
          color: 'text-red-400'
        }
      case 'web':
        return {
          title: '📷 Camera Module',
          subtitle: 'Camera not available on web',
          hint: 'Try on a mobile device',
          color: 'text-gray-400'
        }
      case 'ready':
        return {
          title: '📷 Camera Module',
          subtitle: 'Camera Ready',
          hint: 'Camera functionality coming soon',
          color: 'text-gray-400'
        }
    }
  }

  const content = getStatusContent()

  return (
    <View className="flex-1 p-5 justify-center items-center">
      <Text className="text-green-400 text-center text-lg mb-4">{content.title}</Text>
      <Text className={`text-center text-base mb-2 ${content.color}`}>
        {content.subtitle}
      </Text>
      {content.hint && (
        <Text className="text-gray-500 text-center text-sm">
          {content.hint}
        </Text>
      )}
    </View>
  )
} 
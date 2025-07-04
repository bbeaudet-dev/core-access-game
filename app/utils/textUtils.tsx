import React from 'react'
import { Text, View } from 'react-native'

interface MusicTrackTextProps {
  name: string
  description: string
  artist?: string
  style?: any
  className?: string
}

/**
 * Renders music track information with the specified format:
 * Line 1: {name in italics} by {artist in normal text}
 * Line 2: {description in slightly smaller text}
 */
export const MusicTrackText: React.FC<MusicTrackTextProps> = ({ 
  name,
  description, 
  artist,
  style, 
  className 
}) => {
  return (
    <View>
      <Text style={style} className={className}>
        <Text style={{ fontStyle: 'italic' }}>{name}</Text>
        {artist && <Text>{` by ${artist}`}</Text>}
      </Text>
      <Text style={[style, { fontSize: (style?.fontSize || 12) * 0.85 }]} className={className}>
        {description}
      </Text>
    </View>
  )
} 
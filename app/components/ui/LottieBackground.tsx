import LottieView from 'lottie-react-native';
import { Platform, StyleSheet, View } from 'react-native';

interface LottieBackgroundProps {
  source: any;
  style?: any;
  autoPlay?: boolean;
  loop?: boolean;
  speed?: number;
  opacity?: number;
}

export default function LottieBackground({
  source,
  style,
  autoPlay = true,
  loop = true,
  speed = 1,
  opacity = 0.3
}: LottieBackgroundProps) {
  // Don't render Lottie on web
  if (Platform.OS === 'web') {
    return null;
  }

  return (
    <View style={[styles.container, { opacity }, style]}>
      <LottieView
        source={source}
        autoPlay={autoPlay}
        loop={loop}
        speed={speed}
        style={styles.animation}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 0,
  },
  animation: {
    width: '100%',
    height: '100%',
  },
}); 
import { Canvas, FontStyle, Group, Mask, Rect, Skia, Text } from '@shopify/react-native-skia';
import { useCallback, useEffect, useState } from 'react';
import { View } from 'react-native';
import { SharedValue, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

interface GlitchTextProps {
  text?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  animationSpeed?: number;
  animationInterval?: number;
  primaryColor?: string;
  secondaryColor?: string;
  baseColor?: string;
  opacity?: number;
  style?: any;
}

const DEFAULT_WORDS = [
  'ACCESS',
  'DEFENDER', 
  'SECURE',
  'SYSTEM',
  'FIREWALL',
  'TERMINAL',
  'VAULT',
  'BREACHED',
  'LOCKDOWN',
  'QUARANTINED'
];

export default function GlitchText({
  text = 'CORE_ACCESS',
  fontSize = 32,
  width: propWidth,
  height: propHeight,
  animationSpeed = 100,
  animationInterval = 1800,
  primaryColor = '#E5484D',
  secondaryColor = '#12A594',
  baseColor = 'white',
  opacity = 0.9,
  style
}: GlitchTextProps) {
  const [currentText, setCurrentText] = useState(text);
  const [wordIndex, setWordIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use provided dimensions or default to screen dimensions
  const canvasWidth = propWidth || 400;
  const canvasHeight = propHeight || 200;

  const fontMgr = Skia.FontMgr.System();

  // Try common font families that are more likely to exist
  let typeface = fontMgr.matchFamilyStyle('Times New Roman', FontStyle.Normal);
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Times', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Arial', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Helvetica', FontStyle.Normal);
  }
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('System', FontStyle.Normal);
  }
  if (!typeface) {
    // Fallback to default
    typeface = fontMgr.matchFamilyStyle('', FontStyle.Normal);
  }

  const font = Skia.Font(typeface, fontSize);
  const lineHeightDifference = 2;

  const textHeight = font.measureText(currentText).height;
  const textWidth = font.measureText(currentText).width;

  const textX = canvasWidth / 2 - textWidth / 2;
  const textY = canvasHeight / 2 + textHeight - lineHeightDifference;
  
  const rectX = textX;
  const rectWidth = textWidth;
  const fullRectHeight = textHeight;

  const proportion = 1 / 3;
  const rectHeight = fullRectHeight * proportion;

  const topRectY = canvasHeight / 2;
  const middleRectY = canvasHeight / 2 + rectHeight;
  const bottomRectY = canvasHeight / 2 + rectHeight * 2;
  
  const renderMask = (rectXSv: SharedValue<number>, rectY: number, maskHeight: number) => (
    <Group>
      <Rect color="white" height={maskHeight} width={rectWidth} x={rectXSv} y={rectY} />
    </Group>
  );

  const renderText = (
    rectXSv: SharedValue<number>,
    rectY: number,
    maskHeight: number = rectHeight,
  ) => (
    <Mask mode="luminance" mask={renderMask(rectXSv, rectY, maskHeight)}>
      <Text color={baseColor} font={font} text={currentText} x={rectXSv} y={textY} opacity={opacity} />
    </Mask>
  );

  const topHalfX = useSharedValue(rectX);
  const middleHalfX = useSharedValue(rectX);
  const bottomHalfX = useSharedValue(rectX);
  const redTextX = useSharedValue(rectX);
  const greenTextX = useSharedValue(rectX);

  const withAnimation = (offsets: number[]) => {
    const animations = offsets.map((offset) => withTiming(rectX + offset, { duration: animationSpeed }));
    animations.push(withTiming(rectX, { duration: animationSpeed }));
    return withSequence(...animations);
  };

  const triggerAnimation = useCallback(() => {
    setIsAnimating(true);
    
    // Start the glitch animation
    topHalfX.value = withAnimation([-8, -6, -4, 5]);
    middleHalfX.value = withAnimation([-6, -4, 5, -2]);
    bottomHalfX.value = withAnimation([-4, 5, -2, 2]);

    redTextX.value = withAnimation([-2, 5, -4, -6]);
    greenTextX.value = withAnimation([2, -2, 5, -4]);

    // Change text in the middle of the animation
    setTimeout(() => {
      if (text.startsWith('CORE_')) {
        // If it's a CORE_ prefixed text, cycle through words
        const nextWord = DEFAULT_WORDS[wordIndex % DEFAULT_WORDS.length];
        setCurrentText(`CORE_${nextWord}`);
        setWordIndex(prev => prev + 1);
      } else {
        // If it's a custom text, just cycle back to original
        setCurrentText(text);
      }
    }, animationSpeed * 2); // Change text halfway through the animation

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, animationSpeed * 4);
  }, [text, wordIndex, animationSpeed, rectX]);

  useEffect(() => {
    const interval = setInterval(() => {
      triggerAnimation();
    }, animationInterval);
    return () => clearInterval(interval);
  }, [triggerAnimation, animationInterval]);

  if (!typeface || textHeight === 0 || textWidth === 0) {
    console.log('Using fallback text rendering');
    const fallbackTypeface = fontMgr.matchFamilyStyle('', FontStyle.Normal);
    const fallbackFont = Skia.Font(fallbackTypeface, fontSize);
    
    return (
      <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
        <Text
          x={textX}
          y={textY}
          text={currentText}
          color={baseColor}
          font={fallbackFont}
        />
      </Canvas>
    );
  }

  return (
    <View style={[{ width: '100%', overflow: 'hidden' }, style]}>
      <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
        <Text color={primaryColor} font={font} text={currentText} x={redTextX} y={textY} opacity={0.6} />
        <Text color={secondaryColor} font={font} text={currentText} x={greenTextX} y={textY} opacity={0.6} />
        {renderText(topHalfX, topRectY)}
        {renderText(middleHalfX, middleRectY)}
        {renderText(bottomHalfX, bottomRectY, fullRectHeight)}
      </Canvas>
    </View>
  );
} 
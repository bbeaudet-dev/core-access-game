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
  fontFamily?: string;
  style?: any;
  textAlign?: 'left' | 'center' | 'right';
}

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
  fontFamily,
  style,
  textAlign
}: GlitchTextProps) {
  const [currentText, setCurrentText] = useState(text);
  const [isAnimating, setIsAnimating] = useState(false);

  // Use provided dimensions or default to screen dimensions
  const canvasWidth = propWidth || 400;
  const canvasHeight = propHeight || 200;

  const fontMgr = Skia.FontMgr.System();

  // Try to use the specified font family first, then fall back to system fonts
  let typeface = null;
  if (fontFamily) {
    typeface = fontMgr.matchFamilyStyle(fontFamily, FontStyle.Normal);
  }
  
  // Fallback to common font families if specified font not found
  if (!typeface) {
    typeface = fontMgr.matchFamilyStyle('Times New Roman', FontStyle.Normal);
  }
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

  // Calculate text position based on alignment
  let textX: number;
  if (textAlign === 'center') {
    textX = canvasWidth / 2 - textWidth / 2;
  } else if (textAlign === 'right') {
    textX = canvasWidth - textWidth;
  } else {
    // Default to left alignment
    textX = 0;
  }
  
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

    // Reset animation state
    setTimeout(() => {
      setIsAnimating(false);
    }, animationSpeed * 4);
  }, [animationSpeed, rectX]);

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
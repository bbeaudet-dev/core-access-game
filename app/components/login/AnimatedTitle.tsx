import { Canvas, FontStyle, Group, Mask, Rect, Skia, Text } from '@shopify/react-native-skia';
import { useEffect } from 'react';
import { Dimensions, View } from 'react-native';
import { SharedValue, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height / 4;

console.log('Width:', width);
console.log('Height:', height);

const GAME_WORDS = [
  { word: 'ACCESS', color: '#10B981' }, // green
  { word: 'BREACHED', color: '#EF4444' }, // red
  { word: 'DEFENSE', color: '#8B5CF6' }, // purple
  { word: 'FIREWALL', color: '#F59E0B' }, // amber
  { word: 'HACKED', color: '#EF4444' }, // red
  { word: 'INFECTED', color: '#EF4444' }, // red
  { word: 'LOCKDOWN', color: '#F59E0B' }, // amber
  { word: 'QUARANTINED', color: '#06B6D4' }, // cyan
  { word: 'SECURE', color: '#10B981' }, // green
  { word: 'SYSTEM', color: '#8B5CF6' }, // purple
  { word: 'TERMINAL', color: '#8B5CF6' }, // purple
  { word: 'VIRUS', color: '#EF4444' }, // red
  { word: 'VAULT', color: '#8B5CF6' }, // purple
  { word: 'ZEROED', color: '#06B6D4' }, // cyan
  { word: 'NEUTRALIZED', color: '#06B6D4' }, // cyan
  { word: 'CONTAINED', color: '#06B6D4' }, // cyan
  { word: 'DEACTIVATED', color: '#F59E0B' }, // amber
  { word: 'DELETED', color: '#EF4444' }, // red
  { word: 'DISABLED', color: '#F59E0B' }, // amber
];

const DURATION = 100;

export default function AnimatedTitle() {
    useEffect(() => {
      const interval = setInterval(() => {
        triggerAnimation();
      }, 1800);
      return () => clearInterval(interval);
    }, []);
    
    const fontMgr = Skia.FontMgr.System();

    let typeface = fontMgr.matchFamilyStyle('Arial', FontStyle.Normal);
    if (!typeface) {
        typeface = fontMgr.matchFamilyStyle('serif', FontStyle.Normal);
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

    console.log('Font loading debug:', { 
        typeface: typeface ? 'Loaded' : 'Failed',
        fontFamily: typeface ? 'Available' : 'Not available'
    });

    const text = 'CORE_ACCESS';
    const font = Skia.Font(typeface, 32);
    const lineHeightDifference = 2;

    const textHeight = font.measureText(text).height;
    const textWidth = font.measureText(text).width;

    const textX = width / 2 - textWidth / 2;
    const textY = height / 2 + textHeight - lineHeightDifference;
    
    const rectX = textX;
    const rectWidth = textWidth;
    const fullRectHeight = textHeight;

    const proportion = 1 / 3;
    const rectHeight = fullRectHeight * proportion;

    const topRectY = height / 2
    const middleRectY = height / 2 + rectHeight;
    const bottomRectY = height / 2 + rectHeight * 2;
    
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
        <Text color={'white'} font={font} text={text} x={rectXSv} y={textY} opacity={0.9} />
      </Mask>
    );

    const topHalfX = useSharedValue(rectX);
    const middleHalfX = useSharedValue(rectX);
    const bottomHalfX = useSharedValue(rectX);
    const redTextX = useSharedValue(rectX);
    const greenTextX = useSharedValue(rectX);

    const withAnimation = (offsets: number[]) => {
      const animations = offsets.map((offset) => withTiming(rectX + offset, { duration: DURATION }));
      animations.push(withTiming(rectX, { duration: DURATION }));
      return withSequence(...animations);
    };

    const triggerAnimation = () => {
      topHalfX.value = withAnimation([-8, -6, -4, 5]);
      middleHalfX.value = withAnimation([-6, -4, 5, -2]);
      bottomHalfX.value = withAnimation([-4, 5, -2, 2]);

      redTextX.value = withAnimation([-2, 5, -4, -6]);
      greenTextX.value = withAnimation([2, -2, 5, -4]);
    };

    if (!typeface || textHeight === 0 || textWidth === 0) {
        console.log('Using fallback text rendering');
        const fallbackTypeface = fontMgr.matchFamilyStyle('', FontStyle.Normal);
        const fallbackFont = Skia.Font(fallbackTypeface, 32);
        
        return (
          <Canvas style={{ width: width, height: height }}>
            <Text
              x={textX}
              y={textY}
              text={text}
              color="white"
              font={fallbackFont}
            />
          </Canvas>
        );
      }

    return (
        <View style={{ height: 200, width: '100%', overflow: 'hidden' }}>
            <Canvas style={{ width: width, height: height }}>
                <Text color="#E5484D" font={font} text={text} x={redTextX} y={textY} opacity={0.6} />
                <Text color="#12A594" font={font} text={text} x={greenTextX} y={textY} opacity={0.6} />
                {renderText(topHalfX, topRectY)}
                {renderText(middleHalfX, middleRectY)}
                {renderText(bottomHalfX, bottomRectY, fullRectHeight)}
            </Canvas>
        </View>
    );
  };
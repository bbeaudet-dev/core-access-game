import { Magnetometer } from 'expo-sensors';
import { useEffect, useState } from 'react';
import { Platform, Text, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';

interface CompassModuleProps {
  onGoHome: () => void;
}

export default function CompassModule({ onGoHome }: CompassModuleProps) {
  const [magnetometerData, setMagnetometerData] = useState({ x: 0, y: 0, z: 0 });
  const [heading, setHeading] = useState(0);
  const [subscription, setSubscription] = useState<any>(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkMagnetometerAvailability();
    return () => _unsubscribe();
  }, []);

  useEffect(() => {
    if (isAvailable) {
      _subscribe();
    }
    return () => _unsubscribe();
  }, [isAvailable]);

  const checkMagnetometerAvailability = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web doesn't have magnetometer
        setIsAvailable(false);
        setError('Magnetometer not available on web');
        return;
      }

      const isAvailable = await Magnetometer.isAvailableAsync();
      setIsAvailable(isAvailable);
      
      if (!isAvailable) {
        setError('Magnetometer not available on this device');
      }
    } catch (err) {
      setIsAvailable(false);
      setError('Failed to check magnetometer availability');
    }
  };

  const _subscribe = () => {
    if (!isAvailable) return;

    setSubscription(
      Magnetometer.addListener((data) => {
        setMagnetometerData(data);
        
        // Calculate heading from magnetometer data
        let heading = Math.atan2(data.y, data.x) * 180 / Math.PI;
        
        // Normalize to 0-360
        heading = (heading + 360) % 360;
        
        setHeading(heading);
      })
    );
  };

  const _unsubscribe = () => {
    if (subscription) {
      subscription.remove();
      setSubscription(null);
    }
  };

  // Calculate compass direction from heading
  const getDirection = (heading: number): string => {
    // Normalize heading to 0-360
    const normalizedHeading = ((heading % 360) + 360) % 360;
    
    if (normalizedHeading >= 337.5 || normalizedHeading < 22.5) return 'N';
    if (normalizedHeading >= 22.5 && normalizedHeading < 67.5) return 'NE';
    if (normalizedHeading >= 67.5 && normalizedHeading < 112.5) return 'E';
    if (normalizedHeading >= 112.5 && normalizedHeading < 157.5) return 'SE';
    if (normalizedHeading >= 157.5 && normalizedHeading < 202.5) return 'S';
    if (normalizedHeading >= 202.5 && normalizedHeading < 247.5) return 'SW';
    if (normalizedHeading >= 247.5 && normalizedHeading < 292.5) return 'W';
    if (normalizedHeading >= 292.5 && normalizedHeading < 337.5) return 'NW';
    
    return 'N';
  };

  const direction = getDirection(heading);

  // Render circular compass
  const renderCompass = () => {
    const size = 200;
    const center = size / 2;
    const radius = 80;
    const needleLength = 60;
    
    // Cardinal directions
    const directions = [
      { text: 'N', angle: 0 },
      { text: 'NE', angle: 45 },
      { text: 'E', angle: 90 },
      { text: 'SE', angle: 135 },
      { text: 'S', angle: 180 },
      { text: 'SW', angle: 225 },
      { text: 'W', angle: 270 },
      { text: 'NW', angle: 315 }
    ];

    return (
      <View className="items-center mb-6">
        <Svg width={size} height={size}>
          {/* Outer circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke="#333"
            strokeWidth="2"
            fill="none"
          />
          
          {/* Inner circle */}
          <Circle
            cx={center}
            cy={center}
            r={radius - 10}
            stroke="#444"
            strokeWidth="1"
            fill="none"
          />
          
          {/* Cardinal direction markers */}
          {directions.map((dir, index) => {
            const angle = (dir.angle - heading) * Math.PI / 180;
            const x1 = center + (radius - 15) * Math.sin(angle);
            const y1 = center - (radius - 15) * Math.cos(angle);
            const x2 = center + radius * Math.sin(angle);
            const y2 = center - radius * Math.cos(angle);
            const textX = center + (radius + 15) * Math.sin(angle);
            const textY = center - (radius + 15) * Math.cos(angle);
            
            return (
              <View key={index}>
                <Line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke={dir.text === 'N' ? '#ef4444' : '#666'}
                  strokeWidth={dir.text === 'N' ? '3' : '1'}
                />
                <SvgText
                  x={textX}
                  y={textY}
                  fontSize="12"
                  fill={dir.text === 'N' ? '#ef4444' : '#999'}
                  textAnchor="middle"
                  alignmentBaseline="middle"
                >
                  {dir.text}
                </SvgText>
              </View>
            );
          })}
          
          {/* Center dot */}
          <Circle
            cx={center}
            cy={center}
            r="3"
            fill="#ef4444"
          />
          
          {/* North needle */}
          <Line
            x1={center}
            y1={center}
            x2={center}
            y2={center - needleLength}
            stroke="#ef4444"
            strokeWidth="3"
            strokeLinecap="round"
          />
        </Svg>
      </View>
    );
  };

  if (error) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="COMPASS" color="blue" />
            <View className="flex-1 justify-center items-center p-5">
              <Text className="text-red-500 text-lg text-center mb-4">Error: {error}</Text>
              <Text className="text-gray-400 text-sm text-center">Try on a mobile device or enable device orientation</Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  if (!isAvailable) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="COMPASS" color="blue" />
            <View className="flex-1 justify-center items-center p-5">
              <Text className="text-red-500 text-lg text-center mb-4">Magnetometer not available</Text>
              <Text className="text-gray-400 text-sm text-center">This device doesn't support magnetometer sensors</Text>
            </View>
          </View>
          <HomeButton active={true} onPress={onGoHome} />
        </View>
      </PhoneFrame>
    );
  }

  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="COMPASS" color="blue" />
          
          <View className="flex-1 p-5">
            {/* Circular Compass */}
            {renderCompass()}
            
            <View className="items-center mb-6">
              <Text className="text-green-400 text-6xl font-bold font-mono mb-2">{direction}</Text>
              <Text className="text-red-500 text-base font-bold uppercase">DIRECTION</Text>
            </View>
            
            <View className="bg-gray-800 p-5 rounded-lg mb-4 items-center">
              <Text className="text-green-400 text-3xl font-mono mb-1">Heading: {heading.toFixed(1)}°</Text>
              <Text className="text-green-400 text-base font-mono mb-1">X: {magnetometerData.x.toFixed(2)}</Text>
              <Text className="text-green-400 text-base font-mono mb-1">Y: {magnetometerData.y.toFixed(2)}</Text>
              <Text className="text-green-400 text-base font-mono mb-1">Z: {magnetometerData.z.toFixed(2)}</Text>
            </View>
          </View>
        </View>
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
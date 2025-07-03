import { Dimensions, View } from 'react-native';
import Svg, { Circle, Line, Text as SvgText } from 'react-native-svg';

interface CompassDisplayProps {
  heading: number;
}

export default function CompassDisplay({ heading }: CompassDisplayProps) {
  const screenWidth = Dimensions.get('window').width;
  const size = Math.min(400, Math.floor(screenWidth * 0.95));
  const center = size / 2;
  const radius = size / 2 - 20;
  const needleLength = radius - 20;
  
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
    <View className="items-center justify-center" style={{ minHeight: size + 20 }}>
      <Svg width={size} height={size}>
        {/* Outer circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#333"
          strokeWidth="3"
          fill="#18181b"
        />
        
        {/* Inner circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius - 10}
          stroke="#444"
          strokeWidth="1"
          fill="#232323"
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
            <>
              <Line
                key={`line-${index}`}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={dir.text === 'N' ? '#ef4444' : '#666'}
                strokeWidth={dir.text === 'N' ? '3' : '1'}
              />
              <SvgText
                key={`text-${index}`}
                x={textX}
                y={textY}
                fontSize="18"
                fontWeight="bold"
                fill={dir.text === 'N' ? '#ef4444' : '#bbb'}
                textAnchor="middle"
                alignmentBaseline="middle"
              >
                {dir.text}
              </SvgText>
            </>
          );
        })}
        
        {/* Center dot */}
        <Circle
          cx={center}
          cy={center}
          r="6"
          fill="#ef4444"
        />
        
        {/* North needle */}
        <Line
          x1={center}
          y1={center}
          x2={center}
          y2={center - needleLength}
          stroke="#ef4444"
          strokeWidth="6"
          strokeLinecap="round"
        />
      </Svg>
    </View>
  );
} 
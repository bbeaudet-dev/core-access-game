import React from 'react';
import Svg, { Circle, G, Path, Rect } from 'react-native-svg';

interface BugIconProps {
  size?: number;
  color?: string;
  type?: 'caterpillar' | 'beetle' | 'spider' | 'ant' | 'fly' | 'worm';
}

export const CaterpillarBug: React.FC<BugIconProps> = ({ 
  size = 16, 
  color = '#ff0000' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <G>
      {/* Body segments */}
      <Circle cx="4" cy="8" r="2" fill={color} />
      <Circle cx="7" cy="8" r="2" fill={color} />
      <Circle cx="10" cy="8" r="2" fill={color} />
      <Circle cx="13" cy="8" r="2" fill={color} />
      
      {/* Head */}
      <Circle cx="2" cy="8" r="1.5" fill={color} />
      
      {/* Eyes */}
      <Circle cx="1.5" cy="7" r="0.3" fill="#000" />
      <Circle cx="2.5" cy="7" r="0.3" fill="#000" />
      
      {/* Legs */}
      <Rect x="3" y="6" width="1" height="1" fill={color} />
      <Rect x="6" y="6" width="1" height="1" fill={color} />
      <Rect x="9" y="6" width="1" height="1" fill={color} />
      <Rect x="12" y="6" width="1" height="1" fill={color} />
      
      <Rect x="3" y="10" width="1" height="1" fill={color} />
      <Rect x="6" y="10" width="1" height="1" fill={color} />
      <Rect x="9" y="10" width="1" height="1" fill={color} />
      <Rect x="12" y="10" width="1" height="1" fill={color} />
    </G>
  </Svg>
);

export const BeetleBug: React.FC<BugIconProps> = ({ 
  size = 16, 
  color = '#ff0000' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <G>
      {/* Body */}
      <Path 
        d="M3 6 L13 6 L13 10 L3 10 Z" 
        fill={color} 
      />
      
      {/* Head */}
      <Circle cx="8" cy="5" r="2" fill={color} />
      
      {/* Eyes */}
      <Circle cx="7" cy="4" r="0.4" fill="#000" />
      <Circle cx="9" cy="4" r="0.4" fill="#000" />
      
      {/* Antennae */}
      <Rect x="6" y="3" width="1" height="1" fill={color} />
      <Rect x="9" y="3" width="1" height="1" fill={color} />
      
      {/* Legs */}
      <Rect x="4" y="7" width="1" height="2" fill={color} />
      <Rect x="6" y="7" width="1" height="2" fill={color} />
      <Rect x="9" y="7" width="1" height="2" fill={color} />
      <Rect x="11" y="7" width="1" height="2" fill={color} />
      
      {/* Wing details */}
      <Rect x="4" y="7" width="2" height="1" fill="#000" />
      <Rect x="10" y="7" width="2" height="1" fill="#000" />
    </G>
  </Svg>
);

export const SpiderBug: React.FC<BugIconProps> = ({ 
  size = 16, 
  color = '#ff0000' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <G>
      {/* Body */}
      <Circle cx="8" cy="8" r="2" fill={color} />
      
      {/* Head */}
      <Circle cx="8" cy="6" r="1" fill={color} />
      
      {/* Eyes */}
      <Circle cx="7" cy="5.5" r="0.3" fill="#000" />
      <Circle cx="9" cy="5.5" r="0.3" fill="#000" />
      
      {/* Legs - 8 legs total */}
      <Rect x="5" y="6" width="1" height="3" fill={color} />
      <Rect x="10" y="6" width="1" height="3" fill={color} />
      
      <Rect x="4" y="7" width="1" height="2" fill={color} />
      <Rect x="11" y="7" width="1" height="2" fill={color} />
      
      <Rect x="3" y="8" width="1" height="2" fill={color} />
      <Rect x="12" y="8" width="1" height="2" fill={color} />
      
      <Rect x="4" y="9" width="1" height="2" fill={color} />
      <Rect x="11" y="9" width="1" height="2" fill={color} />
      
      {/* Web details */}
      <Rect x="7" y="4" width="2" height="1" fill="#000" />
    </G>
  </Svg>
);

export const AntBug: React.FC<BugIconProps> = ({ 
  size = 16, 
  color = '#ff0000' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <G>
      {/* Body segments */}
      <Circle cx="6" cy="8" r="1.5" fill={color} />
      <Circle cx="9" cy="8" r="1.5" fill={color} />
      <Circle cx="12" cy="8" r="1.5" fill={color} />
      
      {/* Head */}
      <Circle cx="3" cy="8" r="1" fill={color} />
      
      {/* Eyes */}
      <Circle cx="2.5" cy="7.5" r="0.2" fill="#000" />
      <Circle cx="3.5" cy="7.5" r="0.2" fill="#000" />
      
      {/* Antennae */}
      <Rect x="2" y="7" width="1" height="1" fill={color} />
      <Rect x="3" y="7" width="1" height="1" fill={color} />
      
      {/* Legs */}
      <Rect x="4" y="7" width="1" height="2" fill={color} />
      <Rect x="7" y="7" width="1" height="2" fill={color} />
      <Rect x="10" y="7" width="1" height="2" fill={color} />
      
      <Rect x="4" y="10" width="1" height="2" fill={color} />
      <Rect x="7" y="10" width="1" height="2" fill={color} />
      <Rect x="10" y="10" width="1" height="2" fill={color} />
    </G>
  </Svg>
);

export const FlyBug: React.FC<BugIconProps> = ({ 
  size = 16, 
  color = '#ff0000' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <G>
      {/* Body */}
      <Rect x="7" y="6" width="2" height="4" fill={color} />
      
      {/* Head */}
      <Circle cx="8" cy="5" r="1" fill={color} />
      
      {/* Eyes */}
      <Circle cx="7.5" cy="4.5" r="0.3" fill="#000" />
      <Circle cx="8.5" cy="4.5" r="0.3" fill="#000" />
      
      {/* Wings */}
      <Rect x="5" y="6" width="2" height="2" fill="#000" />
      <Rect x="9" y="6" width="2" height="2" fill="#000" />
      
      {/* Legs */}
      <Rect x="6" y="8" width="1" height="2" fill={color} />
      <Rect x="9" y="8" width="1" height="2" fill={color} />
      
      {/* Antennae */}
      <Rect x="7" y="4" width="1" height="1" fill={color} />
      <Rect x="8" y="4" width="1" height="1" fill={color} />
    </G>
  </Svg>
);

export const WormBug: React.FC<BugIconProps> = ({ 
  size = 16, 
  color = '#ff0000' 
}) => (
  <Svg width={size} height={size} viewBox="0 0 16 16">
    <G>
      {/* Body segments */}
      <Circle cx="4" cy="8" r="1.5" fill={color} />
      <Circle cx="6" cy="8" r="1.5" fill={color} />
      <Circle cx="8" cy="8" r="1.5" fill={color} />
      <Circle cx="10" cy="8" r="1.5" fill={color} />
      <Circle cx="12" cy="8" r="1.5" fill={color} />
      
      {/* Head */}
      <Circle cx="2" cy="8" r="1" fill={color} />
      
      {/* Eyes */}
      <Circle cx="1.5" cy="7.5" r="0.2" fill="#000" />
      <Circle cx="2.5" cy="7.5" r="0.2" fill="#000" />
      
      {/* Tail */}
      <Circle cx="14" cy="8" r="0.8" fill={color} />
    </G>
  </Svg>
);

// Main component that renders different bug types
export const BugIcon: React.FC<BugIconProps> = ({ 
  type = 'caterpillar', 
  size = 16, 
  color = '#ff0000' 
}) => {
  // Get bug-specific color if no custom color provided
  const getBugColor = (bugType: string) => {
    if (color !== '#ff0000') return color; // Use custom color if provided
    
    const bugColors = {
      'caterpillar': '#ff4444',
      'beetle': '#cc0000',
      'spider': '#990000',
      'ant': '#ff6666',
      'fly': '#ff3333',
      'worm': '#ff5555'
    };
    return bugColors[bugType as keyof typeof bugColors] || '#ff0000';
  };

  const bugColor = getBugColor(type);

  switch (type) {
    case 'caterpillar':
      return <CaterpillarBug size={size} color={bugColor} />;
    case 'beetle':
      return <BeetleBug size={size} color={bugColor} />;
    case 'spider':
      return <SpiderBug size={size} color={bugColor} />;
    case 'ant':
      return <AntBug size={size} color={bugColor} />;
    case 'fly':
      return <FlyBug size={size} color={bugColor} />;
    case 'worm':
      return <WormBug size={size} color={bugColor} />;
    default:
      return <CaterpillarBug size={size} color={bugColor} />;
  }
};

export default BugIcon; 
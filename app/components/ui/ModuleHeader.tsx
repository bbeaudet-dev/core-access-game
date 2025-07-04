import GlitchText from './GlitchText';

const colorMap: Record<string, string> = {
  green: '#10B981',
  red: '#EF4444',
  blue: '#3B82F6',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  gray: '#9CA3AF',
  cyan: '#06B6D4',
  orange: '#F97316',
};

export default function ModuleHeader({ name, color }: { name: string, color: string }) {
  return (
    <GlitchText 
      text={name}
      fontSize={24}
      width={300}
      height={40}
      animationSpeed={200}
      animationInterval={3000}
      primaryColor={colorMap[color] || '#FFFFFF'}
      secondaryColor={colorMap[color] || '#FFFFFF'}
      baseColor={colorMap[color] || '#FFFFFF'}
      opacity={1}
    />
  );
} 
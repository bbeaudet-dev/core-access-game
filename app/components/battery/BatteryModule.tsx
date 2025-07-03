import * as Battery from 'expo-battery';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';
import HomeButton from '../ui/HomeButton';
import ModuleHeader from '../ui/ModuleHeader';
import PhoneFrame from '../ui/PhoneFrame';
import PuzzleStatus from '../ui/PuzzleStatus';

interface BatteryModuleProps {
  onGoHome: () => void;
}

export default function BatteryModule({ onGoHome }: BatteryModuleProps) {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean | null>(null);
  const [isLowPowerMode, setIsLowPowerMode] = useState<boolean | null>(null);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    const checkBatteryAvailability = async () => {
      try {
        const isAvailable = await Battery.isAvailableAsync();
        setIsAvailable(isAvailable);
        
        if (isAvailable) {
          // Get initial battery info
          const batteryLevel = await Battery.getBatteryLevelAsync();
          const batteryState = await Battery.getBatteryStateAsync();
          const isLowPowerMode = await Battery.isLowPowerModeEnabledAsync();
          
          setBatteryLevel(batteryLevel);
          setIsCharging(batteryState === Battery.BatteryState.CHARGING);
          setIsLowPowerMode(isLowPowerMode);
          
          // Set up battery monitoring
          const batteryLevelSubscription = Battery.addBatteryLevelListener(({ batteryLevel }) => {
            setBatteryLevel(batteryLevel);
          });
          
          const batteryStateSubscription = Battery.addBatteryStateListener(({ batteryState }) => {
            setIsCharging(batteryState === Battery.BatteryState.CHARGING);
          });
          
          const lowPowerSubscription = Battery.addLowPowerModeListener(({ lowPowerMode }) => {
            setIsLowPowerMode(lowPowerMode);
          });
          
          return () => {
            batteryLevelSubscription?.remove();
            batteryStateSubscription?.remove();
            lowPowerSubscription?.remove();
          };
        }
      } catch (error) {
        console.error('Failed to check battery availability:', error);
        setIsAvailable(false);
      }
    };

    checkBatteryAvailability();
  }, []);

  const getBatteryColor = (level: number) => {
    if (level <= 0.2) return 'text-red-400';
    if (level <= 0.5) return 'text-yellow-400';
    return 'text-green-400';
  };

  const getBatteryIcon = (level: number) => {
    if (level <= 0.1) return '🔋';
    if (level <= 0.25) return '🪫';
    if (level <= 0.5) return '🔋';
    if (level <= 0.75) return '🔋';
    return '🔋';
  };

  if (!isAvailable) {
    return (
      <PhoneFrame>
        <View className="flex-1 bg-black">
          <View className="p-4">
            <ModuleHeader name="BATTERY" color="green" />
            <View className="flex-1 p-5 justify-center">
              <Text className="text-green-400 text-center text-base mb-2">Battery monitoring not available</Text>
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
          <ModuleHeader name="BATTERY" color="green" />
          
          <View className="flex flex-col space-y-4">
            {/* Battery Level */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">BATTERY LEVEL</Text>
              <View className="flex flex-row items-center justify-center">
                <Text className="text-4xl mr-4">{getBatteryIcon(batteryLevel || 0)}</Text>
                <Text className={`text-4xl font-mono ${getBatteryColor(batteryLevel || 0)}`}>
                  {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : '--'}
                </Text>
              </View>
            </View>

            {/* Battery Status */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">BATTERY STATUS</Text>
              <View className="space-y-2">
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-300 font-mono">Charging:</Text>
                  <Text className={`font-mono ${isCharging ? 'text-green-400' : 'text-gray-600'}`}>
                    {isCharging ? '⚡ YES' : '❌ NO'}
                  </Text>
                </View>
                <View className="flex flex-row justify-between">
                  <Text className="text-gray-300 font-mono">Low Power Mode:</Text>
                  <Text className={`font-mono ${isLowPowerMode ? 'text-yellow-400' : 'text-gray-600'}`}>
                    {isLowPowerMode ? '⚠️ ENABLED' : '✅ DISABLED'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Battery Health */}
            <View className="bg-gray-900 p-6 rounded-lg">
              <Text className="text-gray-400 text-sm font-mono mb-2">BATTERY HEALTH</Text>
              <View className="w-full bg-gray-800 rounded-full h-4 mb-2">
                <View 
                  className={`h-4 rounded-full ${getBatteryColor(batteryLevel || 0).replace('text-', 'bg-')}`}
                  style={{ width: `${(batteryLevel || 0) * 100}%` }}
                />
              </View>
              <Text className="text-gray-300 text-xs font-mono text-center">
                {batteryLevel !== null ? `${Math.round(batteryLevel * 100)}%` : '--'} remaining
              </Text>
            </View>

            {/* Puzzle Status */}
            <PuzzleStatus
              title="PUZZLE STATUS"
              description="Target: Charge above 80%"
              isComplete={(batteryLevel || 0) >= 0.8}
              color="green"
              showProgress={true}
              progress={(batteryLevel || 0) * 100}
              progressMax={100}
            />
          </View>
        </View>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
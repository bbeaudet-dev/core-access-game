import * as Battery from 'expo-battery';
import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

export default function BatteryIndicator() {
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    const getBatteryInfo = async () => {
      try {
        const level = await Battery.getBatteryLevelAsync();
        const state = await Battery.getBatteryStateAsync();
        setBatteryLevel(level);
        setIsCharging(state === Battery.BatteryState.CHARGING);
      } catch (error) {
        console.error('Failed to get battery info:', error);
      }
    };

    getBatteryInfo();

    // Set up listeners for battery changes
    const batteryLevelListener = Battery.addBatteryLevelListener(({ batteryLevel }) => {
      setBatteryLevel(batteryLevel);
    });

    const chargingListener = Battery.addBatteryStateListener(({ batteryState }) => {
      setIsCharging(batteryState === Battery.BatteryState.CHARGING);
    });

    return () => {
      batteryLevelListener?.remove();
      chargingListener?.remove();
    };
  }, []);

  if (batteryLevel === null) {
    return null; // Don't show anything if we can't get battery info
  }

  const getBatteryColor = () => {
    if (batteryLevel > 0.5) return 'bg-green-400';
    if (batteryLevel > 0.2) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getBatterySegments = () => {
    const segments = Math.floor(batteryLevel * 5); // 5 segments = 20% each
    return Math.min(segments, 5);
  };

  const renderBatteryBar = () => {
    const segments = getBatterySegments();
    const barSegments = [];
    
    for (let i = 0; i < 5; i++) {
      barSegments.push(
        <View
          key={i}
          className={`h-2 w-1 mx-0.5 rounded-sm ${i < segments ? getBatteryColor() : 'bg-gray-600'}`}
        />
      );
    }
    
    return barSegments;
  };

  return (
    <View className="flex-row items-center space-x-2 m-10">
      <Text className="text-xs text-gray-400 font-mono"></Text>
      {isCharging && <Text className="text-sm">⚡</Text>}
      <View className="flex-row items-center">
        <View className="flex-row items-center bg-gray-800 p-1 rounded">
          {renderBatteryBar()}
        </View>
        <Text className={`text-xs font-mono ml-2 ${getBatteryColor().replace('bg-', 'text-')}`}>
          {Math.round(batteryLevel * 100)}%
        </Text>
      </View>
    </View>
  );
} 
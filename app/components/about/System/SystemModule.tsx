import { ScrollView, View } from 'react-native';
import HomeButton from '../../ui/HomeButton';
import ModuleHeader from '../../ui/ModuleHeader';
import PhoneFrame from '../../ui/PhoneFrame';
import DangerZoneSection from './DangerZoneSection';
import DeviceSection from './DeviceSection';
import HardwareSection from './HardwareSection';
import SecuritySection from './SecuritySection';
import SystemSection from './SystemSection';

interface SystemModuleProps {
  onGoHome: () => void;
  onGoToAbout: () => void;
  onGoToCoreVitals: () => void;
  onSelfDestruct: () => void;
}

export default function SystemModule({ 
  onGoHome, 
  onGoToAbout, 
  onGoToCoreVitals, 
  onSelfDestruct 
}: SystemModuleProps) {
  return (
    <PhoneFrame>
      <View className="flex-1 bg-black">
        <View className="p-4">
          <ModuleHeader name="SYSTEM" color="red" />
        </View>
        
        <ScrollView className="flex-1 p-5">
          <DeviceSection onGoToAbout={onGoToAbout} onGoToCoreVitals={onGoToCoreVitals} />
          <SecuritySection />
          <HardwareSection />
          <SystemSection />
          <DangerZoneSection onSelfDestruct={onSelfDestruct} />
        </ScrollView>
        
        <HomeButton active={true} onPress={onGoHome} />
      </View>
    </PhoneFrame>
  );
} 
import { ScrollView } from 'react-native';
import ScreenTemplate from '../../../ui/ScreenTemplate';
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
    <ScreenTemplate title="SYSTEM" titleColor="red" onGoHome={onGoHome}>
      <ScrollView className="flex-1 p-5">
        <DeviceSection onGoToAbout={onGoToAbout} onGoToCoreVitals={onGoToCoreVitals} />
        <SecuritySection />
        <HardwareSection />
        <SystemSection />
        <DangerZoneSection onSelfDestruct={onSelfDestruct} />
      </ScrollView>
    </ScreenTemplate>
  );
} 
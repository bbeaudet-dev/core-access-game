import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { playSound } from '../../utils/soundManager';

interface PuzzleInstructionsPopupProps {
  visible: boolean;
  onClose: () => void;
  moduleName: string;
  instructions: string;
  hints: string[];
}

const PUZZLE_INSTRUCTIONS: Record<string, { instructions: string; hints: string[] }> = {
  system: {
    instructions: "SYSTEM SECURITY BYPASS\n\nYou need to bypass the security system by finding the correct sequence of actions.",
    hints: [
      "Check the security section for vulnerabilities",
      "Look for patterns in the system logs",
      "Try different combinations of security settings"
    ]
  },
  terminal: {
    instructions: "TERMINAL ACCESS PUZZLE\n\nGain access to the terminal by solving the authentication challenge.",
    hints: [
      "Enter the correct command sequence",
      "Check for hidden commands",
      "Look for patterns in the terminal output"
    ]
  },
  help: {
    instructions: "TUTORIAL COMPLETION\n\nComplete the tutorial to unlock advanced features.",
    hints: [
      "Read through all tutorial sections",
      "Complete the interactive exercises",
      "Don't skip any steps"
    ]
  },
  battery: {
    instructions: "BATTERY CHARGE PUZZLE\n\nCharge the battery to the required level to unlock the system.",
    hints: [
      "Connect the device to a power source",
      "Monitor the charging progress",
      "Wait for the battery to reach 100%"
    ]
  },
  calculator: {
    instructions: "CALCULATOR MATH PUZZLE\n\nSolve the mathematical equations to unlock the calculator module.",
    hints: [
      "Use the correct order of operations",
      "Double-check your calculations",
      "Look for patterns in the equations"
    ]
  },
  compass: {
    instructions: "COMPASS ORIENTATION PUZZLE\n\nPoint the device north to unlock the compass module.",
    hints: [
      "Use a real compass or map app to find north",
      "Hold the device steady while pointing north",
      "Make sure you're pointing true north, not magnetic north"
    ]
  },
  gyro: {
    instructions: "GYROSCOPE ROTATION PUZZLE\n\nRotate the device to unlock the gyroscope module.",
    hints: [
      "Spin the device around its axis",
      "Try different rotation speeds",
      "Make sure the gyroscope sensor is active"
    ]
  },
  camera: {
    instructions: "CAMERA CAPTURE PUZZLE\n\nTake a photo to unlock the camera module.",
    hints: [
      "Grant camera permissions when prompted",
      "Point the camera at a subject",
      "Press the capture button to take a photo"
    ]
  },
  microphone: {
    instructions: "MICROPHONE AUDIO PUZZLE\n\nGenerate sufficient audio levels to unlock the microphone module.",
    hints: [
      "Speak loudly or make noise near the microphone",
      "Grant microphone permissions when prompted",
      "Check that the audio levels are registering"
    ]
  },
  maps: {
    instructions: "MAPS NAVIGATION PUZZLE\n\nNavigate to a specific location to unlock the maps module.",
    hints: [
      "Grant location permissions when prompted",
      "Use GPS to navigate to the target location",
      "Make sure you're within the required radius"
    ]
  },
  games: {
    instructions: "GAMES COMPLETION PUZZLE\n\nComplete one of the mini-games to unlock the games module.",
    hints: [
      "Try the number guessing game",
      "Complete the memory sequence game",
      "Achieve a good score in the reaction test"
    ]
  },
  wifi: {
    instructions: "WIFI CONNECTION PUZZLE\n\nConnect to a WiFi network to unlock the WiFi module.",
    hints: [
      "Scan for available networks",
      "Connect to a network with good signal strength",
      "Make sure the connection is stable"
    ]
  },
  weather: {
    instructions: "WEATHER CHECK PUZZLE\n\nCheck the current weather to unlock the weather module.",
    hints: [
      "Allow location access for weather data",
      "Refresh the weather information",
      "Make sure the weather data loads correctly"
    ]
  },
  accelerometer: {
    instructions: "ACCELEROMETER MOVEMENT PUZZLE\n\nMove the device to unlock the accelerometer module.",
    hints: [
      "Shake or move the device vigorously",
      "Try different movement patterns",
      "Make sure the accelerometer sensor is active"
    ]
  },
  finalboss: {
    instructions: "FINAL BOSS CHALLENGE\n\nDefeat the final boss to complete the game.",
    hints: [
      "Use all your skills and sensor data",
      "React quickly to boss attacks",
      "Manage your energy and health carefully"
    ]
  }
};

export default function PuzzleInstructionsPopup({
  visible,
  onClose,
  moduleName,
  instructions,
  hints
}: PuzzleInstructionsPopupProps) {
  const handleClose = () => {
    playSound('ui_button_tap');
    onClose();
  };

  const moduleData = PUZZLE_INSTRUCTIONS[moduleName.toLowerCase()] || {
    instructions: instructions || "Complete the puzzle to unlock this module.",
    hints: hints || ["Explore the module", "Try different interactions", "Look for patterns"]
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/80 justify-center items-center p-4">
        <View className="bg-gray-900 border-2 border-red-500 rounded-lg p-6 max-w-sm w-full">
          {/* Header */}
          <View className="mb-4">
            <Text className="text-red-400 text-lg font-mono text-center mb-2">
              🚨 FIRST TIME ACCESS 🚨
            </Text>
            <Text className="text-gray-300 text-sm font-mono text-center">
              {moduleName.toUpperCase()} MODULE
            </Text>
          </View>

          {/* Instructions */}
          <ScrollView className="max-h-64 mb-4">
            <View className="bg-gray-800 p-4 rounded-lg mb-4">
              <Text className="text-yellow-400 text-sm font-mono mb-2">
                PUZZLE OBJECTIVE:
              </Text>
              <Text className="text-gray-300 text-sm font-mono leading-5">
                {moduleData.instructions}
              </Text>
            </View>

            {/* Hints */}
            <View className="bg-gray-800 p-4 rounded-lg">
              <Text className="text-green-400 text-sm font-mono mb-2">
                HINTS:
              </Text>
              {moduleData.hints.map((hint, index) => (
                <View key={index} className="flex-row items-start mb-2">
                  <Text className="text-green-400 text-xs font-mono mr-2 mt-1">
                    {index + 1}.
                  </Text>
                  <Text className="text-gray-300 text-xs font-mono flex-1 leading-4">
                    {hint}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* Close Button */}
          <TouchableOpacity
            onPress={handleClose}
            className="bg-red-600 py-3 px-6 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-mono text-center font-bold">
              UNDERSTOOD
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
} 
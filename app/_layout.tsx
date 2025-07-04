import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "../global.css";
import { AuthProvider } from "./contexts/AuthContext";
import { HintProvider } from "./contexts/HintContext";
import { PuzzleProvider } from "./contexts/PuzzleContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <HintProvider>
        <PuzzleProvider>
        <StatusBar style="light" hidden={true} />
        <Stack screenOptions={{ headerShown: false }} />
        </PuzzleProvider>
      </HintProvider>
    </AuthProvider>
  );
}

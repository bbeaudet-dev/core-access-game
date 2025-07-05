import { Stack } from "expo-router";
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import "../global.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ModuleUnlockProvider } from "./contexts/ModuleUnlockContext";
import { PuzzleProvider } from "./contexts/PuzzleContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // Hide the splash screen after the app is ready
    SplashScreen.hideAsync();
  }, []);

  return (
    <AuthProvider>
      <ModuleUnlockProvider>
        <PuzzleProvider>
          <StatusBar style="light" hidden={true} />
          <Stack screenOptions={{ headerShown: false }} />
        </PuzzleProvider>
      </ModuleUnlockProvider>
    </AuthProvider>
  );
}

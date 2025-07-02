import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "../global.css"
import AuthProvider from "./contexts/AuthContext"
import HintProvider from "./contexts/HintContext"
import ModuleUnlockProvider from "./contexts/ModuleUnlockContext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <ModuleUnlockProvider>
        <HintProvider>
          <StatusBar style="light" hidden={true} />
          <Stack screenOptions={{ headerShown: false }} />
        </HintProvider>
      </ModuleUnlockProvider>
    </AuthProvider>
  )
}

import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "../global.css"
import { AuthProvider } from "./contexts/AuthContext"
import { HintProvider } from "./contexts/HintContext"

export default function RootLayout() {
  return (
    <AuthProvider>
      <HintProvider>
        <StatusBar style="light" hidden={true} />
        <Stack screenOptions={{ headerShown: false }} />
      </HintProvider>
    </AuthProvider>
  )
}

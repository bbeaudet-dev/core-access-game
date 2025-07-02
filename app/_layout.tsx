import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import "../global.css"
import AuthProvider from "./contexts/AuthContext"

export default function RootLayout() {
  return (
    <AuthProvider>          
      <StatusBar style="light" hidden={true} />
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  )
}

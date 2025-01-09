import '../global.css'
import { useReactQueryDevTools } from '@dev-plugins/react-query'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useFonts } from 'expo-font'
import { router, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect, useState } from 'react'

void SplashScreen.preventAutoHideAsync()

type User = {
  name: string
}

const queryClient = new QueryClient()

export default function RootLayout() {
  useReactQueryDevTools(queryClient)
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf') as string,
  })
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    if (loaded) {
      void SplashScreen.hideAsync()
      setUser({ name: 'John Doe' })
    }
  }, [loaded])

  useEffect(() => {
    if (user) {
      router.replace('/books')
    }
  }, [user])

  if (!loaded) {
    return null
  }

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false }}></Stack>
    </QueryClientProvider>
  )
}

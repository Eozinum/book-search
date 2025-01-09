import { Tabs } from 'expo-router'

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="books" options={{ title: 'Books', headerShown: false }} />
      <Tabs.Screen name="authors" options={{ title: 'Authors', headerShown: false }} />
    </Tabs>
  )
}

import { Tabs } from 'expo-router'

export default function Layout() {
  return (
    <Tabs screenOptions={{ headerShown: true }}>
      <Tabs.Screen name="index/index" options={{ title: 'Books' }} />
      <Tabs.Screen name="authors/index" options={{ title: 'Authors' }} />
    </Tabs>
  )
}

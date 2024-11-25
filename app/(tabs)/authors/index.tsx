import { FlashList } from '@shopify/flash-list'
import { View, Text } from 'react-native'

const authors = Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `Author ${String(index + 1)}`,
}))

const AuthorsList = () => (
  <View className="flex-1">
    <FlashList
      data={authors}
      renderItem={({ item }) => <Text className="bg-green-500">{item.name}</Text>}
      estimatedItemSize={100}
    />
  </View>
)

export default function Authors() {
  return <AuthorsList />
}

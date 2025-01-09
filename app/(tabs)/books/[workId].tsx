import { MaterialIcons } from '@expo/vector-icons'
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import { Text, View, TouchableOpacity } from 'react-native'

// const Cover = ({ coverKey }: { coverKey: string | undefined }) => {
//   const uri = coverKey
//     ? `https://covers.openlibrary.org/b/olid/${coverKey}-M.jpg`
//     : (require('@/assets/images/cover.png') as string)

//   return (
//     <Image
//       style={{ height: 90, width: 60, borderRadius: 4 }}
//       source={uri}
//       contentFit="cover"
//       placeholder={require('@/assets/images/cover.png') as string}
//       transition={500}
//     />
//   )
// }

export default function Work() {
  const { workId } = useLocalSearchParams()
  const { back, canGoBack } = useRouter()
  return (
    <View className="flex-1 px-2">
      <Stack.Screen
        options={{
          headerShown: true,
          header: () => (
            <View className="pt-14 pb-4">
              <TouchableOpacity className="px-2" onPress={back} disabled={!canGoBack()}>
                <MaterialIcons name="arrow-back-ios" size={22} />
              </TouchableOpacity>
            </View>
          ),
        }}
      />
      <Text>Work: {workId}</Text>
    </View>
  )
}

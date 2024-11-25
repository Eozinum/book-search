import { AntDesign } from '@expo/vector-icons'
import { FlashList } from '@shopify/flash-list'
import { useFocusEffect } from 'expo-router'
import { useState, useRef, useCallback } from 'react'
import { View, Text, TextInput, Keyboard, ActivityIndicator, TouchableOpacity } from 'react-native'
import { useBookSearch } from '@/src/hooks/useBookSearch'
import type { Book } from '@/src/hooks/useBookSearch'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

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

export default function Books() {
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const [isScrolled, setIsScrolled] = useState(false)

  const listRef = useRef<FlashList<Book>>(null)
  const inputRef = useRef<TextInput>(null)

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.y
    setIsScrolled(scrollPosition > 200)
  }

  const { books, fetchNextPage, hasNextPage, isFetching, totalBooks } = useBookSearch(submittedSearch)

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({ offset: 0, animated: true })
  }

  const handleSubmit = useCallback(() => {
    setSubmittedSearch(search.trim().toLowerCase())
    Keyboard.dismiss()
    scrollToTop()
  }, [search])

  useFocusEffect(
    useCallback(() => {
      inputRef.current?.focus()
    }, []),
  )

  return (
    <View className="flex-1 gap-2 pt-2">
      <View className="flex-row items-center justify-between px-2">
        <TextInput
          ref={inputRef}
          value={search}
          onChangeText={setSearch}
          placeholder="Search for a book"
          onSubmitEditing={handleSubmit}
          clearButtonMode="always"
          submitBehavior="blurAndSubmit"
          returnKeyType="search"
          selectTextOnFocus
          selectionColor="#9ca3af"
          className="h-10 bg-gray-100 p-2 border border-gray-200 rounded-md flex-1 drop-shadow-xl"
        />
      </View>

      <FlashList
        data={books}
        ref={listRef}
        onEndReachedThreshold={5}
        onScroll={handleScroll}
        ListFooterComponent={() => isFetching && <ActivityIndicator size="small" color="#000" />}
        ListHeaderComponent={() => (
          <Text className="text-sm text-gray-500 px-2 text-center">Total results: {totalBooks}</Text>
        )}
        ItemSeparatorComponent={() => <View className="my-2" />}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center gap-4 px-4">
            <View className="flex-1">
              <Text className="text-lg font-bold">
                {index + 1}. {item.title}
              </Text>
              <Text className="text-sm text-gray-500">{item.author_name && item.author_name.join(', ')}</Text>
              {Boolean(item.first_publish_year) && (
                <View className="flex-row gap-1">
                  <Text className="text-sm text-gray-500">{item.first_publish_year}</Text>
                  {item.language && item.language.length > 0 && (
                    <Text className="text-sm text-gray-500 capitalize">- {item.language[0]}</Text>
                  )}
                </View>
              )}
            </View>
          </View>
        )}
        estimatedItemSize={100}
        onEndReached={() => {
          if (hasNextPage && !isFetching) {
            void fetchNextPage()
          }
        }}
      />

      {isScrolled && (
        <TouchableOpacity
          className="absolute bottom-4 right-4 p-2 rounded-full bg-gray-400 opacity-45"
          onPress={scrollToTop}
        >
          <AntDesign name="arrowup" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  )
}

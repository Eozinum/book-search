import { FlashList } from '@shopify/flash-list'
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetch } from 'expo/fetch'
import { Image } from 'expo-image'
import { useFocusEffect } from 'expo-router'
import { useState, useRef, useCallback } from 'react'
import { View, Text, TextInput, Keyboard } from 'react-native'
import { EXPO_PUBLIC_BOOK_SEARCH_URL } from '@/src/env'

const LIMIT = 20

type Book = {
  title: string
  author_name?: string[]
  cover_edition_key?: string
  first_publish_year: number

  language?: string[]
}

type Response = {
  docs: Book[]
  numFound: number
  offset: number
  start: number
}

// const getBooks = async (title: string, offset: number, limit: number) => {
//   const url = new URL(EXPO_PUBLIC_BOOK_SEARCH_URL)
//   url.searchParams.set('title', title)
//   url.searchParams.set('offset', offset.toString())
//   url.searchParams.set('limit', limit.toString())

//   const response = await fetch(url.toString())
//   const data = (await response.json()) as Response

//   return data
// }

const getBooks = async ({ search, pageParam = 0 }: { search: string; pageParam: number }) => {
  const url = new URL(EXPO_PUBLIC_BOOK_SEARCH_URL)
  url.searchParams.set('title', search)
  url.searchParams.set('offset', pageParam.toString())
  url.searchParams.set('limit', LIMIT.toString())

  const response = await fetch(url.toString())
  const data = (await response.json()) as Response

  return data
}

const useBookSearch = (search: string) => {
  const { data, fetchNextPage, hasNextPage, isFetching } = useInfiniteQuery({
    queryKey: ['books', search],
    queryFn: ({ pageParam }) => getBooks({ search, pageParam }),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _, lastPageParam) => {
      const nextOffset = lastPageParam + LIMIT
      return nextOffset < lastPage.numFound ? nextOffset : undefined
    },
    enabled: Boolean(search.trim()),
  })

  const books = data?.pages.flatMap((page) => page.docs) ?? []

  return {
    books,
    fetchNextPage,
    hasNextPage,
    isFetching,
    totalBooks: data?.pages[0].numFound ?? 0,
  }
}

const Cover = ({ coverKey }: { coverKey: string | undefined }) => {
  const uri = coverKey
    ? `https://covers.openlibrary.org/b/olid/${coverKey}-M.jpg?default=false`
    : (require('@/assets/images/cover.png') as string)

  return (
    <Image
      style={{ height: 90, width: 60, borderRadius: 4 }}
      source={uri}
      contentFit="cover"
      placeholder={require('@/assets/images/cover.png') as string}
    />
  )
}

export default function Books() {
  const [search, setSearch] = useState('')
  const [submittedSearch, setSubmittedSearch] = useState('')
  const listRef = useRef<FlashList<Book>>(null)
  const inputRef = useRef<TextInput>(null)

  const { books, fetchNextPage, hasNextPage, isFetching, totalBooks } = useBookSearch(submittedSearch)

  const handleSubmit = useCallback(() => {
    setSubmittedSearch(search.trim())
    Keyboard.dismiss()
    listRef.current?.scrollToOffset({ offset: 0, animated: true })
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
      <Text className="text-sm text-gray-500 px-2 text-center">Total results: {totalBooks}</Text>
      <FlashList
        data={books}
        ref={listRef}
        onEndReachedThreshold={5}
        ItemSeparatorComponent={() => <View className="my-2" />}
        renderItem={({ item, index }) => (
          <View className="flex-row items-center gap-4 px-4">
            <Cover coverKey={item.cover_edition_key} />
            <View className="flex-1">
              <Text className="text-lg font-bold">
                {index + 1}. {item.title}
              </Text>
              <Text className="text-sm text-gray-500">{item.author_name && item.author_name.join(', ')}</Text>
              {Boolean(item.first_publish_year) && (
                <View className="flex-row gap-1">
                  <Text className="text-sm text-gray-500">{item.first_publish_year}</Text>
                  {Boolean(item.language && item.language.length > 0) && (
                    <Text className="text-sm text-gray-500 capitalize">- {item.language?.[0]}</Text>
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
        // onEndReached={() => {
        //   if (offset + LIMIT < totalBooks) {
        //     setOffset(offset + LIMIT)
        //   }
        // }}
      />
    </View>
  )
}

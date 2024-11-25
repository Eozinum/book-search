
import { useInfiniteQuery } from '@tanstack/react-query'
import { fetch } from 'expo/fetch'
import { EXPO_PUBLIC_BOOK_SEARCH_URL } from '@/src/env'

export type Book = {
  title: string
  author_name?: string[]
  cover_edition_key: string
  first_publish_year: number
  language?: string[]
}

type Response = {
  docs: Book[]
  numFound: number
  offset: number
  start: number
}

const LIMIT = 20

const getBooks = async ({ search, pageParam = 0 }: { search: string; pageParam: number }) => {
  const url = new URL(EXPO_PUBLIC_BOOK_SEARCH_URL)
  url.searchParams.set('title', search)
  url.searchParams.set('offset', pageParam.toString())
  url.searchParams.set('limit', LIMIT.toString())

  const response = await fetch(url.toString())
  const data = (await response.json()) as Response

  return data
}

export const useBookSearch = (search: string) => {
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

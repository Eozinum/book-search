const valueOrThrow = (name: string) => {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

export const EXPO_PUBLIC_BOOK_SEARCH_URL = valueOrThrow('EXPO_PUBLIC_BOOK_SEARCH_URL')
export const EXPO_PUBLIC_OPEN_LIBRARY = valueOrThrow('EXPO_PUBLIC_OPEN_LIBRARY')

// utils/debugStorage.ts
export const debugStorage = (label: string) => {
  console.group(`🔍 ${label}`)

  // localStorage
  console.log('📦 localStorage:', {
    keys: Object.keys(localStorage),
    data: Object.fromEntries(
      Object.entries(localStorage).map(([k, v]) => {
        try {
          return [k, JSON.parse(v)]
        } catch {
          return [k, v]
        }
      }),
    ),
  })

  // sessionStorage
  console.log('📦 sessionStorage:', {
    keys: Object.keys(sessionStorage),
    data: Object.fromEntries(
      Object.entries(sessionStorage).map(([k, v]) => {
        try {
          return [k, JSON.parse(v)]
        } catch {
          return [k, v]
        }
      }),
    ),
  })

  // Cookies (простой парсинг)
  console.log(
    '🍪 cookies:',
    document.cookie.split('; ').reduce(
      (acc, c) => {
        const [k, v] = c.split('=')
        acc[k] = v
        return acc
      },
      {} as Record<string, string>,
    ),
  )

  // Redux state (если есть доступ к store)
  // console.log('🧠 Redux state:', store.getState());

  console.groupEnd()
}

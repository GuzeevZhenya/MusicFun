// import type { RootState } from '@/app/model/store'
// import { playlistsApi } from '@/features/playlists/api/playlistsApi'
// import { useSelector } from 'react-redux'

// export const useGlobalLoading = () => {
//   return useSelector((state: RootState) => {
//     // Получаем все активные запросы из RTK Query API
//     const queries = Object.values(state.baseApi.queries || {})
//     const mutations = Object.values(state.baseApi.mutations || {})

//     // Проверяем, есть ли активные запросы (статус 'pending')
//     const hasActiveQueries = queries.some((query) => {
//       if (query?.status !== 'pending') return

//       if (query.endpointName === playlistsApi.endpoints.fetchPlaylists.name) {
//         const completedQueries = queries.filter((q) => q?.status === 'fulfilled')
//         return completedQueries.length > 0
//       }
//       // return query.endpointName !== playlistsApi.endpoints.fetchPlaylists.name
//     })
//     const hasActiveMutations = mutations.some((mutation) => mutation?.status === 'pending')

//     return hasActiveQueries || hasActiveMutations
//   })
// }

// Список эндпоинтов для исключения из глобального индикатора

import type { RootState } from '@/app/model/store'
import { playlistsApi } from '@/features/playlists/api/playlistsApi'
import { tracksApi } from '@/features/tracks/api/tracksApi'
import { useSelector } from 'react-redux'

const excludedEndpoints = [playlistsApi.endpoints.fetchPlaylists.name, tracksApi.endpoints.fetchTracks.name]

export const useGlobalLoading = () => {
  return useSelector((state: RootState) => {
    const queries = Object.values(state.baseApi.queries || {})
    const mutations = Object.values(state.baseApi.mutations || {})

    // Проверяем все активные запросы
    const hasActiveQuery = queries.some((query) => {
      if (!query || query.status !== 'pending') return false

      const endpointName = query.endpointName
      const isExcluded = excludedEndpoints.includes(endpointName)

      // Если endpoint исключен, проверяем есть ли уже загруженные данные
      if (isExcluded) {
        const hasLoadedData = queries.some((q) => q?.endpointName === endpointName && q?.status === 'fulfilled')
        // Показываем только если это первый запрос (нет загруженных данных)
        return !hasLoadedData
      }

      // Для не исключенных endpoints всегда показываем спиннер
      return true
    })

    const hasActiveMutation = mutations.some((mutation) => mutation?.status === 'pending')

    return hasActiveQuery || hasActiveMutation
  })
}

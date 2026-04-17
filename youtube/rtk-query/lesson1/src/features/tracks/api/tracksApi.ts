import { baseApi } from '@/app/api/baseApi'
import type { FetchTracksResponse } from './tracksApi.types'
import { fetchTracksResponseSchema } from '../model/tracks.schemas'
import { withZodCatch } from '@/common/utils'

export const tracksApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    // fetchTrack: build.query<FetchTracksResponse, void>({
    //   query: () => ({
    //     url: `playlists/tracks`,
    //   }),
    // }),
    //1. Что возвращается,2 аргументы которые приходят, инициализация параметра
    fetchTracks: build.infiniteQuery<FetchTracksResponse, void, string | null>({
      infiniteQueryOptions: {
        initialPageParam: null,
        getNextPageParam(lastPage) {
          return lastPage.meta.nextCursor || null
        },
      },
      ...withZodCatch(fetchTracksResponseSchema),

      query: ({ pageParam }) => ({
        url: `playlists/tracks`,
        params: { cursor: pageParam, paginationType: 'cursor', pageSize: 5 },
      }),
    }),
  }),
})
export const { useFetchTracksInfiniteQuery } = tracksApi

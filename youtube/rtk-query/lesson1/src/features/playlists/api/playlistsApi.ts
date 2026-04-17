import { baseApi } from '@/app/api/baseApi.ts'
import type { Images } from '@/common/types'
import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistData,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlistsApi.types.ts'
import { playlistCreateResponseSchema, playlistsResponseSchema } from '../model/playlists.schemas'
import { withZodCatch } from '@/common/utils'
import { imagesSchema } from '@/common/schemas'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query({
      query: (params: FetchPlaylistsArgs) => ({ url: 'playlists', params }),
      ...withZodCatch(playlistsResponseSchema),
      providesTags: ['Playlist'],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => {
        return {
          method: 'post',
          url: 'playlists',
          body,
        }
      },
      ...withZodCatch(playlistCreateResponseSchema),

      invalidatesTags: ['Playlist'],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ method: 'delete', url: `playlists/${playlistId}` }),
      invalidatesTags: ['Playlist'],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => {
        return { url: `playlists/${playlistId}`, method: 'put', body }
      },
      onQueryStarted: async ({ body, playlistId }, { dispatch, queryFulfilled, getState }) => {
        const cachedArgs = playlistsApi.util.selectCachedArgsForQuery(getState(), 'fetchPlaylists')

        const patchResults: any[] = []

        cachedArgs.forEach((arg) => {
          const patchResult = dispatch(
            playlistsApi.util.updateQueryData(
              'fetchPlaylists',
              { pageNumber: arg.pageNumber, pageSize: arg.pageSize, search: arg.search },
              (state) => {
                const playlists = state.data
                if (!playlists || !Array.isArray(playlists)) return

                const index = playlists.findIndex((playlist) => playlist.id === playlistId)
                if (index !== -1) {
                  // ✅ Правильно: обновляем attributes из body.data.attributes
                  const newAttributes = body.data?.attributes
                  if (newAttributes) {
                    state.data[index].attributes = {
                      ...state.data[index].attributes,
                      ...newAttributes,
                    }
                  }
                }
              },
            ),
          )
          patchResults.push(patchResult)
        })

        try {
          await queryFulfilled
        } catch (error) {
          patchResults.forEach((patchResult) => patchResult.undo())
        }
      },
      invalidatesTags: ['Playlist'],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return {
          method: 'post',
          url: `playlists/${playlistId}/images/main`,
          body: formData,
        }
      },
      ...withZodCatch(imagesSchema),

      invalidatesTags: ['Playlist'],
    }),
    deletePlaylistCover: build.mutation<void, { playlistId: string }>({
      query: ({ playlistId }) => ({ url: `playlists/${playlistId}/images/main`, method: 'delete' }),
      invalidatesTags: ['Playlist'],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi

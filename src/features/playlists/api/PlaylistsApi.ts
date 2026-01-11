import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { CreatePlaylistArgs, PlaylistData, PlaylistsResponse } from './playlistsApi.types';

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      'API-KEY': import.meta.env.VITE_API_KEY,
    },
    prepareHeaders: headers => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
      return headers
    },
  }),
  endpoints: (builder) => ({
    fetchPlaylists: builder.query<PlaylistsResponse, void>({
      query: (arg) => ({
        url: 'playlists',
        method: 'GET',
      }),
    }),
    createPlaylists: builder.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({
        url: 'playlists',
        method: 'POST',
        body
      }),
    }),
    deletePlaylist: builder.mutation<void, string>({
      query: (id) => ({
        url: `playlists/${id}`,
        method: "DELETE"
      })
    })
  }),
});

export const { useFetchPlaylistsQuery, useCreatePlaylistsMutation, useDeletePlaylistMutation } = playlistsApi;
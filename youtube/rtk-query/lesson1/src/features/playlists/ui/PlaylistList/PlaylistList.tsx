import { useState } from 'react'
import s from './PlaylistList.module.css'
import type { PlaylistData } from '../../api/playlistsApi.types'
import { useDeletePlaylistMutation } from '../../api/playlistsApi'
import { useForm } from 'react-hook-form'
import { EditPlaylistForm } from '../EditPlaylistForm/EditPlaylistForm'
import { PlaylistItem } from '../PlaylistItem/PlaylistItem'
import { useGetMeQuery } from '@/features/auth/api/authApi'

// Упрощенный тип для формы (должен совпадать с EditPlaylistFormData)
type EditPlaylistFormData = {
  title: string
  description: string
  tagIds: string[]
}

type Props = {
  playlists: PlaylistData[]
  isPlaylistsLoading: boolean
}

export const PlaylistList = ({ isPlaylistsLoading, playlists }: Props) => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<EditPlaylistFormData>()
  const [deletePlaylist] = useDeletePlaylistMutation()

  const { data: meData } = useGetMeQuery()
  const currentUserId = meData?.userId




  const deletePlaylistHandler = async (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      try {
        await deletePlaylist(playlistId).unwrap()
      } catch (error) {
        console.error('Failed to delete playlist:', error)
      }
    }
  }

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((tag) => tag.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  const isPlaylistOwner = (playlist: PlaylistData) => {
    if (!currentUserId || !playlist.attributes.user) return false
    return currentUserId === playlist.attributes.user.id
  }


  return (
    <div className={s.items}>
      {!playlists.length && !isPlaylistsLoading && <h2>Playlists not found</h2>}
      {playlists.map((playlist) => {
        const isEditing = playlist.id === playlistId
        const isOwner = isPlaylistOwner(playlist)

        return (
          <div className={s.item} key={playlist.id}>
            {isEditing && isOwner ? (
              <EditPlaylistForm
                key={`edit-${playlist.id}`}
                playlistId={playlistId}
                setPlaylistId={setPlaylistId}
                editPlaylist={editPlaylistHandler}
                register={register}
                handleSubmit={handleSubmit}
              />
            ) : (
              <PlaylistItem
                key={`view-${playlist.id}`}
                playlist={playlist}
                deletePlaylistHandler={deletePlaylistHandler}
                editPlaylistHandler={editPlaylistHandler}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
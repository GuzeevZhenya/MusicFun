import { useUpdatePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import type { SubmitHandler, UseFormHandleSubmit, UseFormRegister } from 'react-hook-form'
import s from './EditPlaylistForm.module.css'

// Упрощенный тип для формы
type EditPlaylistFormData = {
  title: string
  description: string
  tagIds: string[]
}

type Props = {
  playlistId: string | null
  setPlaylistId: (playlistId: string | null) => void
  editPlaylist: (playlist: PlaylistData | null) => void
  register: UseFormRegister<EditPlaylistFormData>
  handleSubmit: UseFormHandleSubmit<EditPlaylistFormData>
}

export const EditPlaylistForm = ({
  playlistId,
  setPlaylistId,
  editPlaylist,
  handleSubmit,
  register
}: Props) => {
  const [updatePlaylist] = useUpdatePlaylistMutation()

  if (!playlistId) return null

  const onSubmit: SubmitHandler<EditPlaylistFormData> = (formData) => {
    if (!playlistId) return

    const apiBody: UpdatePlaylistArgs = {
      data: {
        type: 'playlists',
        attributes: {
          title: formData.title,
          description: formData.description,
          tagIds: formData.tagIds || []
        }
      }
    }

    updatePlaylist({ playlistId, body: apiBody })
    setPlaylistId(null)
  }

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={s.title}>Edit Playlist</h2>

      <div className={s.inputGroup}>
        <input
          className={s.input}
          {...register('title')}
          placeholder="Playlist title"
        />
      </div>

      <div className={s.inputGroup}>
        <input
          className={s.input}
          {...register('description')}
          placeholder="Description (optional)"
        />
      </div>

      <div className={s.buttonGroup}>
        <button
          className={`${s.button} ${s.saveButton}`}
          type="submit"
        >
          Save Changes
        </button>

        <button
          className={`${s.button} ${s.cancelButton}`}
          type="button"
          onClick={() => editPlaylist(null)}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
// import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types.ts'
// import { PlaylistCover } from '../PlaylistCover/PlaylistCover'
// import { PlaylistDescription } from '../PlaylistDescription/PlaylistDescription'

// type Props = {
//   playlist: PlaylistData
//   deletePlaylistHandler: (playlistId: string) => void
//   editPlaylistHandler: (playlist: PlaylistData) => void
// }

// export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {
//   console.log(playlist.attributes);


//   return (
//     <div>
//       <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
//       <PlaylistDescription attributes={playlist.attributes} />
//       <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
//       <button onClick={() => editPlaylistHandler(playlist)}>update</button>
//     </div>
//   )
// }

import type { PlaylistData } from '@/features/playlists/api/playlistsApi.types.ts'
import { PlaylistCover } from '../PlaylistCover/PlaylistCover'
import { PlaylistDescription } from '../PlaylistDescription/PlaylistDescription'
import s from './PlaylistItem.module.css'

type Props = {
  playlist: PlaylistData
  deletePlaylistHandler: (playlistId: string) => void
  editPlaylistHandler: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylistHandler, deletePlaylistHandler }: Props) => {
  // Получаем первую букву имени пользователя для аватарки
  const userInitial = playlist.attributes.user.name.charAt(0).toUpperCase()

  return (
    <div className={s.container}>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription attributes={playlist.attributes} />

      <div className={s.user}>
        <div className={s.userAvatar}>{userInitial}</div>
        <span>{playlist.attributes.user.name}</span>
      </div>

      <div className={s.actions}>
        <button
          className={`${s.button} ${s.editButton}`}
          onClick={() => editPlaylistHandler(playlist)}
        >
          Edit
        </button>
        <button
          className={`${s.button} ${s.deleteButton}`}
          onClick={() => deletePlaylistHandler(playlist.id)}
        >
          Delete
        </button>
      </div>
    </div>
  )
}
// import type { PlaylistAttributes } from "../../api/playlistsApi.types"

// type Props = {
//   attributes: PlaylistAttributes
// }

// export const PlaylistDescription = ({ attributes }: Props) => {
//   console.log(attributes);

//   return (
//     <>
//       <div>title: {attributes.title}</div>
//       {/* <div>description: {attributes.description}</div> */}
//       <div>userName: {attributes.user.name}</div>
//     </>
//   )
// }
import type { PlaylistAttributes } from "../../api/playlistsApi.types"
import s from '../PlaylistItem/PlaylistItem.module.css' // Используем те же стили

type Props = {
  attributes: PlaylistAttributes
}

export const PlaylistDescription = ({ attributes }: Props) => {
  return (
    <>
      <div className={s.title}>{attributes.title}</div>
      {attributes.description && (
        <div style={{
          fontSize: '14px',
          color: '#666',
          marginTop: '4px',
          lineHeight: '1.4'
        }}>
          {attributes.description}
        </div>
      )}
    </>
  )
}
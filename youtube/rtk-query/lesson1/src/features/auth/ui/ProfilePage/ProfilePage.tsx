import { PlaylistList } from "@/features/playlists/ui/PlaylistList/PlaylistList";
import { useGetMeQuery } from "../../api/authApi"
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi'
import s from './ProfilePage.module.css'
import { Navigate } from 'react-router'
import { CreatePlaylistForm } from "@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm";
import { Path } from "@/common/routing";

export const ProfilePage = () => {
  const { data: meResponse, isLoading: isMeLoading } = useGetMeQuery()
  const { data: playlistsResponse, isLoading } = useFetchPlaylistsQuery(
    {
      userId: meResponse?.userId,
    },
    { skip: !meResponse?.userId }
  )

  if (isMeLoading || isLoading) return <h2>Skeleton loader ...</h2>
  if (!isMeLoading && !meResponse) return <Navigate to={Path.Playlists} />


  return (
    <>
      <h1>{meResponse?.login} page</h1>
      <div className={s.container}>
        <CreatePlaylistForm />
        <PlaylistList playlists={playlistsResponse?.data || []} isPlaylistsLoading={isLoading || isMeLoading} />
      </div>
    </>
  )
}

import { useFetchTracksInfiniteQuery } from '../api/tracksApi'
import { useInfiniteScroll } from '@/common/hooks'
import { TrackList } from './TrackList/TrackList'
import { LoadingTrigger } from './LoadingTrigger/LoadingTrigger'
import { PlaylistSkeleton } from '@/common/components/Skeletons/PlaylistSkeleton/PlaylistSkeleton'

export const TracksPage = () => {
  const {
    data,
    isFetching,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading  // Добавляем isLoading для первоначальной загрузки
  } = useFetchTracksInfiniteQuery()

  const { observerRef } = useInfiniteScroll({ hasNextPage, isFetching, fetchNextPage })

  const pages = data?.pages.flatMap(page => page.data) || []

  if (isLoading) {
    return (
      <PlaylistSkeleton />
    )
  }

  if (!isLoading && pages.length === 0) {
    return (
      <div>
        <h1>Tracks page</h1>
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          color: '#666'
        }}>
          <p>No tracks found</p>
          <p style={{ fontSize: '14px', marginTop: '8px' }}>
            There are no tracks available at the moment.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1>Tracks page</h1>
      <TrackList tracks={pages} />

      {hasNextPage && (
        <LoadingTrigger isFetchingNextPage={isFetchingNextPage} observerRef={observerRef} />
      )}

      {!hasNextPage && pages.length > 0 && (
        <div style={{
          textAlign: 'center',
          padding: '20px',
          color: '#666',
          fontSize: '14px'
        }}>
          <p>All tracks loaded</p>
        </div>
      )}
    </div>
  )
}
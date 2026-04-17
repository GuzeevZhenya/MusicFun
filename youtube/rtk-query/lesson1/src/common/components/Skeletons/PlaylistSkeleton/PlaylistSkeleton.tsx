import s from './PlaylistSkeleton.module.css'

type PlaylistSkeletonProps = {
  count?: number
}

export const PlaylistSkeleton = ({ count = 6 }: PlaylistSkeletonProps) => {
  return (
    <div className={s.skeletonGrid}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className={s.skeletonItem}>
          <div className={s.skeletonCover}></div>
          <div className={s.skeletonInfo}>
            <div className={s.skeletonTitle}></div>
            <div className={s.skeletonDescription}></div>
            <div className={s.skeletonMeta}>
              <div className={s.skeletonTracks}></div>
              <div className={s.skeletonDate}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
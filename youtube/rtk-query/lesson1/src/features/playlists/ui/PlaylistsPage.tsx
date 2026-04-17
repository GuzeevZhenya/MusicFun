// import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
// import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
// import { useEffect, useState, type ChangeEvent } from 'react'
// import s from './PlaylistsPage.module.css'
// import { useDebounceValue } from '@/common/hooks/useDebaunceValue'
// import { Pagination } from '@/common/components'
// import { PlaylistList } from './PlaylistList/PlaylistList'
// import { PlaylistSkeleton } from '@/common/components/Skeletons/PlaylistSkeleton/PlaylistSkeleton'

// const STORAGE_KEYS = {
//   PAGE_SIZE: 'playlists_page_size'
// }

// export const PlaylistsPage = () => {
//   const [search, setSearch] = useState('');
//   const [currentPage, setCurrentPage] = useState(1);
//   const [pageSize, setPageSize] = useState(() => {
//     const saved = localStorage.getItem(STORAGE_KEYS.PAGE_SIZE)
//     return saved ? Number(saved) : 6
//   })
//   const debounceSearch = useDebounceValue(search);

//   const { data, isLoading, isError, error } = useFetchPlaylistsQuery({
//     search: debounceSearch,
//     pageSize,
//     pageNumber: currentPage,
//   });

//   useEffect(() => {
//     localStorage.setItem(STORAGE_KEYS.PAGE_SIZE, pageSize.toString())
//   }, [pageSize])


//   const changePageSizeHandler = (size: number) => {
//     setCurrentPage(1)
//     setPageSize(size)
//   }

//   const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
//     setSearch(e.currentTarget.value)
//     setCurrentPage(1)
//   }

//   return (
//     <div className={s.container}>
//       <h1>Playlists page</h1>
//       <input
//         type='search'
//         placeholder='Search playlist by title'
//         onChange={searchPlaylistHandler}
//         className={s.searchInput}
//       />
//       <CreatePlaylistForm />

//       {isLoading ? (
//         <PlaylistSkeleton count={pageSize} />
//       ) : (
//         <>
//           <PlaylistList isPlaylistsLoading={isLoading} playlists={data?.data || []} />
//           {data?.data && data.data.length > 0 && (
//             <Pagination
//               currentPage={currentPage}
//               setCurrentPage={setCurrentPage}
//               pagesCount={data?.meta.pagesCount || 1}
//               pageSize={pageSize}
//               changePageSize={changePageSizeHandler}
//             />
//           )}
//         </>
//       )}
//     </div>
//   )
// }



import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import { CreatePlaylistForm } from '@/features/playlists/ui/CreatePlaylistForm/CreatePlaylistForm.tsx'
import { useEffect, useState, type ChangeEvent } from 'react'
import s from './PlaylistsPage.module.css'
import { useDebounceValue } from '@/common/hooks/useDebaunceValue'
import { Pagination } from '@/common/components'
import { PlaylistList } from './PlaylistList/PlaylistList'
import { PlaylistSkeleton } from '@/common/components/Skeletons/PlaylistSkeleton/PlaylistSkeleton'

const STORAGE_KEYS = {
  PAGE_SIZE: 'playlists_page_size'
}

export const PlaylistsPage = () => {
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAGE_SIZE)
    return saved ? Number(saved) : 6
  })
  const debounceSearch = useDebounceValue(search);

  // ✅ Получаем данные и загружаем кэш
  const { data, isLoading, isError, error } = useFetchPlaylistsQuery({
    search: debounceSearch,
    pageSize,
    pageNumber: currentPage,
  });

  // ✅ Логируем, когда данные загружены (для проверки)
  useEffect(() => {
    if (data) {
      console.log('✅ Данные загружены, кэш создан')
      console.log('📦 Количество плейлистов в кэше:', data.data?.length)
    }
  }, [data])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAGE_SIZE, pageSize.toString())
  }, [pageSize])

  const changePageSizeHandler = (size: number) => {
    setCurrentPage(1)
    setPageSize(size)
  }

  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <input
        type='search'
        placeholder='Search playlist by title'
        onChange={searchPlaylistHandler}
        className={s.searchInput}
      />


      {isLoading ? (
        <PlaylistSkeleton count={pageSize} />
      ) : (
        <>
          <PlaylistList isPlaylistsLoading={isLoading} playlists={data?.data || []} />
          {data?.data && data.data.length > 0 && (
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              pagesCount={data?.meta.pagesCount || 1}
              pageSize={pageSize}
              changePageSize={changePageSizeHandler}
            />
          )}
        </>
      )}
    </div>
  )
}
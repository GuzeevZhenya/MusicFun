import { Header, LoadingSpinner } from '@/common/components'
import { Routing } from '@/common/routing'
import s from './App.module.css'
import { ToastContainer } from 'react-toastify'
import { useGlobalLoading } from '@/common/hooks/useGlobalLoading'

export const App = () => {
  const isGlobalLoading = useGlobalLoading()

  return (
    <>
      <Header />
      <div className={s.layout}>
        <Routing />
      </div>
      <ToastContainer />
      {isGlobalLoading && (
        <LoadingSpinner
          fullScreen={true}
          size="large"
          overlay={false}
        />
      )}    </>
  )
}
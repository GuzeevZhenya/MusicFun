import { Header } from "@/common/components"
import { Routing } from "@/common/routing"
import s from './App.module.css'

export const App = () => {
  return (
    <div className={s.app}>
      <Header />
      <main className={s.main}>
        <div className={s.container}>
          <Routing />
        </div>
      </main>
    </div>
  )
}
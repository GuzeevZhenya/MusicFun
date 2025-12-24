import { Path } from '@/common/routing'
import s from './Header.module.css'
import { NavLink } from 'react-router'

export const Header = () => {
  const navItems = [
    { to: Path.Main, label: 'Главная' },
    { to: Path.Tracks, label: 'Треки' },
    { to: Path.Profile, label: 'Профиль' },
    { to: Path.Playlists, label: 'Плейлисты' },
  ]

  const getLinkClass = ({ isActive }) =>
    `${s.navLink} ${isActive ? s.navLinkActive : ''}`

  return (
    <header className={s.header}>
      <div className={s.headerContainer}>
        <nav className={s.nav}>
          <ul className={s.navList}>
            {navItems.map(({ to, label }) => (
              <li key={to} className={s.navItem}>
                <NavLink
                  to={to}
                  className={getLinkClass}
                  end={to === Path.Main}
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className={s.headerActions}>
          {/* Здесь можно добавить кнопки пользователя, поиск и т.д. */}
        </div>
      </div>
    </header>
  )
}
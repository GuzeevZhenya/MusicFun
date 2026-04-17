import React from 'react'
import s from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  inline?: boolean
  fullScreen?: boolean // Добавлен пропс для полноэкранного режима
}

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large'
  text?: string
  inline?: boolean
  fullScreen?: boolean
  overlay?: boolean // Новый пропс для затемнения
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  text = 'Loading...',
  inline = false,
  fullScreen = false,
  overlay = true // По умолчанию с затемнением для обратной совместимости
}) => {
  const sizeClass = {
    small: s.small,
    medium: s.medium,
    large: s.large
  }[size]

  let containerClass = inline ? s.inlineContainer : s.container

  if (fullScreen) {
    containerClass = `${containerClass} ${s.fullScreen}`
    // Если fullScreen есть, но overlay=false, убираем фон
    if (!overlay) {
      containerClass = `${containerClass} ${s.noOverlay}`
    }
  }

  return (
    <div className={containerClass}>
      <div className={`${s.spinner} ${sizeClass}`}></div>
      {text && <p className={s.text}>{text}</p>}
    </div>
  )
}
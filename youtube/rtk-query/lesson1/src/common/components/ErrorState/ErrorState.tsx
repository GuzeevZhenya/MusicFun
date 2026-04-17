import React from 'react'
import s from './ErrorState.module.css'

interface ErrorStateProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Error loading content',
  message = 'Please try again later',
  onRetry
}) => {
  return (
    <div className={s.container}>
      <h2 className={s.title}>{title}</h2>
      <p className={s.message}>{message}</p>
      {onRetry && (
        <button onClick={onRetry} className={s.retryButton}>
          Retry
        </button>
      )}
    </div>
  )
}
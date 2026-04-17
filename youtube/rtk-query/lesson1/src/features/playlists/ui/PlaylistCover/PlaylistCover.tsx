import { type ChangeEvent, useState, useRef } from 'react'
import { useDeletePlaylistCoverMutation, useUploadPlaylistCoverMutation } from '../../api/playlistsApi'
import defaultCover from '@/assets/images/default-playlist-cover.png'
import type { Images } from '@/common/types'

import s from './PlaylistCover.module.css'
import { toast } from 'react-toastify'
import { FiUpload, FiTrash2, FiImage } from 'react-icons/fi'
import { IoMdCheckmarkCircleOutline } from 'react-icons/io'
import { errorToast } from '@/common/utils'

type Props = {
  playlistId: string
  images: Images
  editable?: boolean
}

export const PlaylistCover = ({ playlistId, images, editable = true }: Props) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const originalCover = images.main?.find(img => img.type === 'original')
  const src = originalCover ? originalCover.url : defaultCover
  const hasCustomCover = !!originalCover

  const [uploadPlaylistCover] = useUploadPlaylistCoverMutation()
  const [deleteCover] = useDeletePlaylistCoverMutation()

  const uploadCoverHandler = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Валидация файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024 // 5MB

    if (!allowedTypes.includes(file.type)) {
      errorToast('Only JPEG, PNG, GIF or WebP images are allowed')
      return
    }

    if (file.size > maxSize) {
      errorToast(`File is too large (max ${Math.round(maxSize / 1024 / 1024)}MB)`)
      return
    }

    setIsUploading(true)
    try {
      await uploadPlaylistCover({ playlistId, file }).unwrap()
      toast.success('Cover uploaded successfully!')
    } catch (error) {
      errorToast('Failed to upload co ver')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const deleteCoverHandler = async () => {
    if (!window.confirm('Are you sure you want to delete this cover?')) return

    try {
      await deleteCover({ playlistId }).unwrap()
      toast.success('Cover deleted successfully!')
    } catch (error) {
      errorToast('Failed to delete cover')
    }
  }

  const handleCoverClick = () => {
    if (editable && !isUploading) {
      fileInputRef.current?.click()
    }
  }

  return (
    <div className={s.container}>
      <div
        className={s.coverWrapper}
        onMouseEnter={() => editable && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleCoverClick}
        role={editable ? 'button' : 'presentation'}
        tabIndex={editable ? 0 : -1}
        onKeyDown={(e) => {
          if (editable && !isUploading && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault()
            fileInputRef.current?.click()
          }
        }}
      >
        <img
          src={src}
          alt="Playlist cover"
          className={`${s.cover} ${isUploading ? s.uploading : ''}`}
        />

        {/* Состояние загрузки */}
        {isUploading && (
          <div className={s.uploadingOverlay}>
            <div className={s.spinner}></div>
            <span>Uploading...</span>
          </div>
        )}

        {/* Overlay при наведении */}
        {editable && isHovered && !isUploading && (
          <div className={s.hoverOverlay} onClick={(e) => e.stopPropagation()}>
            <div className={s.overlayContent}>
              <button
                className={s.actionButton}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCoverClick()
                }}
                title="Upload cover"
              >
                <FiUpload size={20} />
                <span>Change</span>
              </button>

              {hasCustomCover && (
                <button
                  className={`${s.actionButton} ${s.deleteButton}`}
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteCoverHandler()
                  }}
                  title="Delete cover"
                >
                  <FiTrash2 size={20} />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Индикатор кастомной обложки */}
        {hasCustomCover && (
          <div className={s.customBadge} title="Custom cover">
            <IoMdCheckmarkCircleOutline size={16} />
          </div>
        )}
      </div>

      {/* Скрытый input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/gif,image/webp"
        onChange={uploadCoverHandler}
        className={s.fileInput}
        disabled={isUploading || !editable}
      />

      {/* Подсказки */}
      {editable && (
        <div className={s.instructions}>
          <p className={s.hint}>
            <FiImage className={s.icon} />
            Click on the cover to upload a new image
          </p>
          <p className={s.requirements}>
            Supports: JPEG, PNG, GIF, WebP • Max: 5MB
          </p>
        </div>
      )}
    </div>
  )
}
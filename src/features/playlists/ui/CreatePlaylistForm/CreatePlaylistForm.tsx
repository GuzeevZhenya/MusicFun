import { useForm, type SubmitHandler } from "react-hook-form";
import type { CreatePlaylistArgs } from "../../api/playlistsApi.types";
import { useState, useEffect, useRef } from "react";
import s from "./PlaylistsPage.module.css";
import { useCreatePlaylistsMutation, useFetchPlaylistsQuery } from "../../api/PlaylistsApi";

// Интерфейс для плейлиста
interface Playlist {
  id: string;
  attributes: {
    title: string;
    description?: string;
    trackCount?: number;
    duration?: string;
    createdAt?: string;
    coverUrl?: string;
  };
}

// Модальное окно для создания плейлиста
interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlaylistArgs) => void;
}

export const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }: CreatePlaylistModalProps) => {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<CreatePlaylistArgs>();
  const modalRef = useRef<HTMLDivElement>(null);

  const [createPlaylist] = useCreatePlaylistsMutation()

  const handleFormSubmit: SubmitHandler<CreatePlaylistArgs> = async (data) => {
    await createPlaylist(data);
    reset();
    onClose();
  };

  const handleClose = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay} onClick={handleClose}>
      <div className={s.modalContent} ref={modalRef}>
        <div className={s.modalHeader}>
          <h2 className={s.modalTitle}>Create New Playlist</h2>
          <button className={s.modalClose} onClick={onClose} aria-label="Close">
            <svg className={s.closeIcon} viewBox="0 0 24 24">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className={s.playlistForm}>
          <div className={s.formGroup}>
            <label htmlFor="title" className={s.formLabel}>
              Playlist Title
            </label>
            <input
              id="title"
              {...register('title', {
                required: 'Title is required',
                minLength: { value: 3, message: 'Minimum 3 characters' },
                maxLength: { value: 100, message: 'Maximum 100 characters' }
              })}
              placeholder="Enter playlist title..."
              className={`${s.formInput} ${errors.title ? s.inputError : ''}`}
              aria-invalid={errors.title ? "true" : "false"}
            />
            {errors.title && (
              <span className={s.errorMessage} role="alert">
                {errors.title.message}
              </span>
            )}
          </div>

          <div className={s.formGroup}>
            <label htmlFor="description" className={s.formLabel}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              {...register('description', {
                maxLength: { value: 300, message: 'Maximum 300 characters' }
              })}
              placeholder="What's this playlist about?"
              className={s.formTextarea}
              rows={4}
              aria-invalid={errors.description ? "true" : "false"}
            />
            {errors.description && (
              <span className={s.errorMessage} role="alert">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className={s.formGroup}>
            <label className={s.formLabel}>Playlist Cover</label>
            <div className={s.coverUpload}>
              <div className={s.coverPreview}>
                <div className={s.coverPlaceholder}>
                  <svg className={s.uploadIcon} viewBox="0 0 24 24">
                    <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
                  </svg>
                  <span className={s.uploadText}>Add Cover Image</span>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className={s.fileInput}
                onChange={(e) => console.log('File selected:', e.target.files?.[0])}
              />
            </div>
          </div>

          <div className={s.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={s.cancelButton}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={s.submitButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className={s.spinnerSmall}></span>
                  Creating...
                </>
              ) : (
                'Create Playlist'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Вспомогательные функции
const getInitials = (title: string) => {
  return title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
};

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

export const PlaylistsPage = () => {
  const { data, isLoading, error, refetch } = useFetchPlaylistsQuery();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (data?.data && data.data.length > 0) {
      setPlaylists(data.data);
    }
  }, [data]);

  const handleCreatePlaylist: SubmitHandler<CreatePlaylistArgs> = async (data) => {
    try {
      console.log('Creating playlist:', data);
      // Здесь будет API запрос
      await new Promise(resolve => setTimeout(resolve, 1000)); // Имитация загрузки
      refetch(); // Обновляем список
    } catch (err) {
      console.error('Error creating playlist:', err);
    }
  };

  if (isLoading) {
    return (
      <div className={s.loadingContainer}>
        <div className={s.spinner}></div>
        <h2 className={s.loadingText}>Loading your playlists...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.errorContainer}>
        <div className={s.errorIcon}>⚠️</div>
        <h2 className={s.errorTitle}>Something went wrong</h2>
        <p className={s.errorMessage}>Please try again later</p>
        <button className={s.retryButton} onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const totalTracks = playlists.reduce((sum, playlist) => sum + (playlist.attributes.trackCount || 0), 0);
  const totalDuration = playlists.reduce((sum, playlist) => {
    if (playlist.attributes.duration) {
      const match = playlist.attributes.duration.match(/(\d+)h\s*(\d+)m/);
      if (match) {
        return sum + parseInt(match[1]) * 3600 + parseInt(match[2]) * 60;
      }
    }
    return sum + 3600;
  }, 0);

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log("Playing playlist:", playlist.attributes.title);
  };

  return (
    <div className={s.container}>
      {/* Модальное окно создания плейлиста */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreatePlaylist}
      />

      {/* Header с кнопкой создания */}
      <header className={s.header}>
        <div className={s.headerTop}>
          <div className={s.headerContent}>
            <h1 className={s.title}>
              <span className={s.titleIcon}>🎵</span>
              Your Playlists
            </h1>
            <p className={s.subtitle}>
              Discover and enjoy your curated music collections
            </p>
          </div>

          <button
            className={s.createButton}
            onClick={() => setShowCreateModal(true)}
            aria-label="Create new playlist"
          >
            <svg className={s.plusIcon} viewBox="0 0 24 24">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
            Create Playlist
          </button>
        </div>

        <div className={s.stats}>
          <div className={s.statCard}>
            <div className={s.statNumber}>{playlists.length}</div>
            <div className={s.statLabel}>Playlists</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>{totalTracks}</div>
            <div className={s.statLabel}>Total Tracks</div>
          </div>
          <div className={s.statCard}>
            <div className={s.statNumber}>{formatDuration(totalDuration)}</div>
            <div className={s.statLabel}>Total Duration</div>
          </div>
        </div>
      </header>

      {/* Основной контент */}
      <main className={s.main}>
        {playlists.length === 0 ? (
          <div className={s.emptyState}>
            <div className={s.emptyIllustration}>
              <svg className={s.emptyIcon} viewBox="0 0 48 48">
                <path d="M24 4C12.95 4 4 12.95 4 24s8.95 20 20 20 20-8.95 20-20S35.05 4 24 4zm-2 35.86C14.11 37.88 8 31.89 8 24c0-1.23.15-2.43.41-3.58L18 30v2c0 2.21 1.79 4 4 4v3.86zm13.79-5.07C35.28 33.17 32.93 32 30 32h-2v-6c0-1.1-.9-2-2-2h-6v-4h4c1.1 0 2-.9 2-2v-4h4c2.21 0 4-1.79 4-4v-.83c5.86 2.37 10 8.11 10 14.83 0 4.16-1.6 7.94-4.21 10.79z" />
              </svg>
            </div>
            <h2 className={s.emptyTitle}>No Playlists Yet</h2>
            <p className={s.emptyText}>
              Create your first playlist to organize your favorite tracks
            </p>
            <button
              className={s.emptyButton}
              onClick={() => setShowCreateModal(true)}
            >
              Create Your First Playlist
            </button>
          </div>
        ) : (
          <div className={s.grid}>
            {playlists.map((playlist, index) => (
              <div
                key={playlist.id}
                className={s.playlistCard}
                onClick={() => handlePlaylistClick(playlist)}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className={s.albumArt}>
                  {playlist.attributes.coverUrl ? (
                    <img
                      src={playlist.attributes.coverUrl}
                      alt={playlist.attributes.title}
                      className={s.albumImage}
                      loading="lazy"
                    />
                  ) : (
                    <div className={s.albumFallback}>
                      {getInitials(playlist.attributes.title)}
                    </div>
                  )}
                  <div className={s.playOverlay}>
                    <div className={s.playButton}>
                      <svg className={s.playIcon} viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className={s.playlistInfo}>
                  <h3 className={s.playlistTitle}>{playlist.attributes.title}</h3>
                  <p className={s.playlistDescription}>
                    {playlist.attributes.description || "No description available"}
                  </p>
                  <div className={s.metaInfo}>
                    <div className={s.metaItem}>
                      <svg className={s.metaIcon} viewBox="0 0 24 24">
                        <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
                      </svg>
                      <span>{playlist.attributes.trackCount || 0} tracks</span>
                    </div>
                    <div className={s.metaItem}>
                      <svg className={s.metaIcon} viewBox="0 0 24 24">
                        <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                      </svg>
                      <span>{playlist.attributes.duration || "1h 30m"}</span>
                    </div>
                  </div>
                </div>

                <button
                  className={s.menuButton}
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Menu clicked for:', playlist.attributes.title);
                  }}
                  aria-label="Playlist options"
                >
                  <svg className={s.menuIcon} viewBox="0 0 24 24">
                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className={s.footer}>
        <p className={s.footerText}>
          🎧 Keep the music playing • {new Date().getFullYear()} Music App
        </p>
      </footer>
    </div>
  );
};
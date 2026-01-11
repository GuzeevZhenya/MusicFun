import { useState, useEffect, useRef } from "react";
import s from "./PlaylistsPage.module.css";
import { CreatePlaylistModal } from "./CreatePlaylistForm/CreatePlaylistForm";
import { useFetchPlaylistsQuery, useCreatePlaylistsMutation, useDeletePlaylistMutation } from "../api/PlaylistsApi";
import type { CreatePlaylistArgs } from "../api/playlistsApi.types";

// ===== ТИПЫ =====
interface Playlist {
  id: string;
  attributes: {
    title: string;
    description?: string;
    trackCount?: number;
    duration?: string;
    createdAt?: string;
    coverUrl?: string;
    user?: {
      name?: string;
      avatar?: string;
    };
  };
}

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
const getInitials = (title: string) =>
  title
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
};

// ===== КОМПОНЕНТ ВЫПАДАЮЩЕГО МЕНЮ =====
const PlaylistDropdownMenu = ({
  playlistId,
  playlistTitle,
  isOpen,
  buttonRef,
  onClose,
  onEdit,
  onDelete,
}: {
  playlistId: string;
  playlistTitle: string;
  isOpen: boolean;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuWidth = 180;
      // Позиционируем слева от кнопки, если справа нет места
      const x = rect.right + menuWidth > window.innerWidth ? rect.left - menuWidth : rect.right - menuWidth;
      setPosition({
        x: Math.max(0, x),
        y: rect.bottom + window.scrollY,
      });
    }
  }, [isOpen, buttonRef]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, buttonRef]);

  if (!isOpen) return null;

  return (
    <>
      <div className={s.dropdownBackdrop} onClick={onClose} />
      <div
        ref={menuRef}
        className={s.dropdownMenu}
        style={{ top: `${position.y}px`, left: `${position.x}px` }}
      >
        <button className={s.menuItem} onClick={() => {
          onEdit();
          onClose();
        }}>
          <svg className={s.menuIconSmall} viewBox="0 0 24 24">
            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
          </svg>
          <span>Редактировать</span>
        </button>
        <button
          className={`${s.menuItem} ${s.deleteItem}`}
          onClick={() => {
            if (window.confirm(`Вы уверены, что хотите удалить плейлист "${playlistTitle}"?`)) {
              onDelete();
            }
            onClose();
          }}
        >
          <svg className={s.menuIconSmall} viewBox="0 0 24 24">
            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
          </svg>
          <span>Удалить</span>
        </button>
      </div>
    </>
  );
};

// ===== КОМПОНЕНТ КАРТОЧКИ ПЛЕЙЛИСТА =====
const PlaylistCard = ({
  playlist,
  index,
  buttonRef,
  onMenuClick,
  onClick
}: {
  playlist: Playlist;
  index: number;
  buttonRef: React.RefObject<HTMLButtonElement>;
  onMenuClick: (e: React.MouseEvent, playlistId: string, playlistTitle: string) => void;
  onClick: (playlist: Playlist) => void;
}) => {
  return (
    <div
      className={s.playlistCard}
      onClick={() => onClick(playlist)}
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
          <div className={s.albumFallback}>{getInitials(playlist.attributes.title)}</div>
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
        <p className={s.playlistDescription}>
          {playlist.attributes.user?.name || "No user name"}
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
        ref={buttonRef}
        className={s.menuButton}
        onClick={(e) => onMenuClick(e, playlist.id, playlist.attributes.title)}
        aria-label="Playlist options"
      >
        <svg className={s.menuIcon} viewBox="0 0 24 24">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>
    </div>
  );
};

// ===== ОСНОВНОЙ КОМПОНЕНТ =====
export const PlaylistsPage = () => {
  const { data, isLoading, error, refetch } = useFetchPlaylistsQuery();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [createPlaylist] = useCreatePlaylistsMutation();
  const [deletePlaylist] = useDeletePlaylistMutation()

  const [menuState, setMenuState] = useState<{
    isOpen: boolean;
    playlistId: string | null;
    playlistTitle: string;
  }>({
    isOpen: false,
    playlistId: null,
    playlistTitle: "",
  });

  // Храним ref'ы для каждой кнопки меню
  const menuButtonRefs = useRef<Map<string, React.RefObject<HTMLButtonElement>>>(new Map());

  // Создаем ref'ы для кнопок меню
  const getButtonRef = (playlistId: string) => {
    if (!menuButtonRefs.current.has(playlistId)) {
      menuButtonRefs.current.set(playlistId, { current: null });
    }
    return menuButtonRefs.current.get(playlistId)!;
  };

  useEffect(() => {
    if (data?.data) setPlaylists(data.data);
  }, [data]);

  const closeMenu = () => {
    setMenuState({
      isOpen: false,
      playlistId: null,
      playlistTitle: "",
    });
  };

  const handleMenuClick = (e: React.MouseEvent, playlistId: string, playlistTitle: string) => {
    e.stopPropagation();
    const buttonRef = getButtonRef(playlistId);
    setMenuState({
      isOpen: true,
      playlistId,
      playlistTitle,
    });
  };

  const handleEditPlaylist = (id: string) => {
    console.log("Edit playlist:", id);
    // TODO: реализовать редактирование
  };

  const handleDeletePlaylist = async (id: string) => {
    await deletePlaylist(id)
    refetch() 
  };

  const handleCreateSubmit = async (data: CreatePlaylistArgs) => {
    try {
      await createPlaylist(data).unwrap();
      await refetch();
      setShowCreateModal(false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
    }
  };

  const handlePlaylistClick = (playlist: Playlist) => {
    console.log("Playing playlist:", playlist.attributes.title);
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

  const totalTracks = playlists.reduce((sum, p) => sum + (p.attributes.trackCount || 0), 0);
  const totalDuration = playlists.reduce((sum, p) => {
    if (p.attributes.duration) {
      const match = p.attributes.duration.match(/(\d+)h\s*(\d+)m/);
      if (match) {
        return sum + parseInt(match[1]) * 3600 + parseInt(match[2]) * 60;
      }
    }
    return sum + 3600;
  }, 0);

  return (
    <div className={s.container}>
      {/* Модальное окно создания */}
      <CreatePlaylistModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateSubmit}
      />

      {/* Выпадающее меню */}
      {menuState.isOpen && menuState.playlistId && (
        <PlaylistDropdownMenu
          playlistId={menuState.playlistId}
          playlistTitle={menuState.playlistTitle}
          isOpen={menuState.isOpen}
          buttonRef={getButtonRef(menuState.playlistId)}
          onClose={closeMenu}
          onEdit={() => handleEditPlaylist(menuState.playlistId!)}
          onDelete={() => handleDeletePlaylist(menuState.playlistId!)}
        />
      )}

      {/* Header */}
      <header className={s.header}>
        <div className={s.headerTop}>
          <div className={s.headerContent}>
            <h1 className={s.title}>
              <span className={s.titleIcon}>🎵</span>
              Your Playlists
            </h1>
            <p className={s.subtitle}>Discover and enjoy your curated music collections</p>
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
            <p className={s.emptyText}>Create your first playlist to organize your favorite tracks</p>
            <button className={s.emptyButton} onClick={() => setShowCreateModal(true)}>
              Create Your First Playlist
            </button>
          </div>
        ) : (
          <div className={s.grid}>
            {playlists.map((playlist, index) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                index={index}
                buttonRef={getButtonRef(playlist.id)}
                onMenuClick={handleMenuClick}
                onClick={handlePlaylistClick}
              />
            ))}
          </div>
        )}
      </main>

      <footer className={s.footer}>
        <p className={s.footerText}>
          🎧 Keep the music playing • {new Date().getFullYear()} Music App
        </p>
      </footer>
    </div>
  );
};
import { useCreatePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'
import type { CreatePlaylistArgs } from '@/features/playlists/api/playlistsApi.types.ts'
import { type SubmitHandler, useForm } from 'react-hook-form'
import s from './CreatePlaylistForm.module.css'

// Тип для формы (без обертки JSON:API)
type PlaylistFormData = {
  title: string;
  description: string;
};

export const CreatePlaylistForm = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<PlaylistFormData>()

  const [createPlaylist] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<PlaylistFormData> = (formData) => {
    // Создаем правильную структуру JSON:API
    const apiData: CreatePlaylistArgs = {
      data: {
        type: 'playlists', // обязательное поле!
        attributes: {
          title: formData.title,
          description: formData.description
        }
      }
    };

    createPlaylist(apiData)
      .unwrap()
      .then(() => {
        reset();
        console.log('Плейлист успешно создан!');
      })
      .catch((error) => {
        console.error('Ошибка создания плейлиста:', error);
      });

    console.log('Отправляемые данные:', apiData);
  }

  return (
    <form className={s.form} onSubmit={handleSubmit(onSubmit)}>
      <h2 className={s.title}>Create New Playlist</h2>

      <div className={s.inputGroup}>
        <input
          className={`${s.input} ${errors.title ? s.inputError : ''}`}
          {...register('title', {
            required: 'Title is required',
            minLength: {
              value: 2,
              message: 'Title must be at least 2 characters'
            },
            maxLength: {
              value: 50,
              message: 'Title cannot exceed 50 characters'
            }
          })}
          placeholder="Playlist title"
          disabled={isSubmitting}
        />
        {errors.title && (
          <span className={s.errorMessage}>{errors.title.message}</span>
        )}
      </div>

      <div className={s.inputGroup}>
        <input
          className={`${s.input} ${errors.description ? s.inputError : ''}`}
          {...register('description', {
            maxLength: {
              value: 200,
              message: 'Description cannot exceed 200 characters'
            }
          })}
          placeholder="Description (optional)"
          disabled={isSubmitting}
        />
        {errors.description && (
          <span className={s.errorMessage}>{errors.description.message}</span>
        )}
      </div>

      <button
        className={s.submitButton}
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Creating...' : 'Create Playlist'}
      </button>
    </form>
  )
}
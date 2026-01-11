import { useForm, type SubmitHandler } from "react-hook-form";
import type { CreatePlaylistArgs } from "../../api/playlistsApi.types";
import { useRef } from "react";
import s from "./CreatePlaylistForm.module.css";

interface CreatePlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePlaylistArgs) => void;
}

export const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }: CreatePlaylistModalProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreatePlaylistArgs>();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleFormSubmit: SubmitHandler<CreatePlaylistArgs> = async (data) => {
    await onSubmit(data);
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
            <label htmlFor="title" className={s.formLabel}>Playlist Title</label>
            <input
              id="title"
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Minimum 3 characters" },
                maxLength: { value: 100, message: "Maximum 100 characters" },
              })}
              placeholder="Enter playlist title..."
              className={`${s.formInput} ${errors.title ? s.inputError : ""}`}
            />
            {errors.title && <span className={s.errorMessage}>{errors.title.message}</span>}
          </div>

          <div className={s.formGroup}>
            <label htmlFor="description" className={s.formLabel}>Description (Optional)</label>
            <textarea
              id="description"
              {...register("description", { maxLength: { value: 300, message: "Maximum 300 characters" } })}
              placeholder="What's this playlist about?"
              className={s.formTextarea}
              rows={4}
            />
            {errors.description && <span className={s.errorMessage}>{errors.description.message}</span>}
          </div>

          <div className={s.formActions}>
            <button type="button" onClick={onClose} className={s.cancelButton} disabled={isSubmitting}>
              Cancel
            </button>
            <button type="submit" className={s.submitButton} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className={s.spinnerSmall}></span> Creating...
                </>
              ) : (
                "Create Playlist"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
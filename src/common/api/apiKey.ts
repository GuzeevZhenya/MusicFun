// Файл для работы с API-ключом
// Никогда не коммить сюда реальный ключ, используй переменные окружения.
// Vite читает переменные, начинающиеся с VITE_

export const API_KEY =
  import.meta.env.VITE_MUSICFUN_API_KEY ||
  import.meta.env.VITE_API_KEY ||
  '';

export const getApiHeaders = () => {
  if (!API_KEY) return {};

  return {
    'API-KEY': API_KEY,
  };
};



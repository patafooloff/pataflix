import axios from 'axios';

// TMDB API key from user
const TMDB_API_KEY = 'f3d757824f08ea2cff45eb8f47ca3a1e';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const PLAYER_API_BASE_URL = 'https://colossal-latrina-movixfrembedapi-acb05587.koyeb.app/api/imdb';

// Create an axios instance for TMDB API
export const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: 'en-US',
  },
});

// Create an axios instance for the player API
export const playerApi = axios.create({
  baseURL: PLAYER_API_BASE_URL,
});

// Utility function to get full image URL
export const getImageUrl = (path: string | null, size: string = 'w500'): string => {
  if (!path) {
    return 'https://via.placeholder.com/500x750?text=No+Image';
  }
  return `https://image.tmdb.org/t/p/${size}${path}`;
};

// Add response interceptor for error handling
tmdbApi.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);

playerApi.interceptors.response.use(
  response => response,
  error => {
    console.error('Player API Error:', error);
    return Promise.reject(error);
  }
);

import { Movie, TVShow, Genre } from '@/types';

const API_KEY = 'f3d757824f08ea2cff45eb8f47ca3a1e';
const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export const getImageUrl = (path: string) => {
  if (!path) return '/placeholder.svg';
  return `${IMAGE_BASE_URL}${path}`;
};

export const getBackdropUrl = (path: string) => {
  if (!path) return '/placeholder.svg';
  return `https://image.tmdb.org/t/p/original${path}`;
};

export const tmdbApi = {
  // Films populaires
  getPopularMovies: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  // Films tendance
  getTrendingMovies: async (): Promise<Movie[]> => {
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&language=fr-FR`
    );
    const data = await response.json();
    return data.results;
  },

  // Séries populaires
  getPopularTVShows: async (): Promise<TVShow[]> => {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=1`
    );
    const data = await response.json();
    return data.results;
  },

  // Séries tendance
  getTrendingTVShows: async (): Promise<TVShow[]> => {
    const response = await fetch(
      `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&language=fr-FR`
    );
    const data = await response.json();
    return data.results;
  },

  // Détails d'un film
  getMovieDetails: async (id: number): Promise<Movie> => {
    const response = await fetch(
      `${BASE_URL}/movie/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=external_ids`
    );
    return response.json();
  },

  // Détails d'une série
  getTVShowDetails: async (id: number): Promise<TVShow> => {
    const response = await fetch(
      `${BASE_URL}/tv/${id}?api_key=${API_KEY}&language=fr-FR&append_to_response=external_ids`
    );
    return response.json();
  },

  // Recherche films
  searchMovies: async (query: string): Promise<Movie[]> => {
    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
  },

  // Recherche séries
  searchTVShows: async (query: string): Promise<TVShow[]> => {
    const response = await fetch(
      `${BASE_URL}/search/tv?api_key=${API_KEY}&language=fr-FR&query=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    return data.results;
  },

  // Genres films
  getMovieGenres: async (): Promise<Genre[]> => {
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`
    );
    const data = await response.json();
    return data.genres;
  },

  // Genres séries
  getTVGenres: async (): Promise<Genre[]> => {
    const response = await fetch(
      `${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=fr-FR`
    );
    const data = await response.json();
    return data.genres;
  },

  // Films par page
  getMovies: async (page: number = 1): Promise<Movie[]> => {
    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    const data = await response.json();
    return data.results;
  },

  // Séries par page
  getTVShows: async (page: number = 1): Promise<TVShow[]> => {
    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&language=fr-FR&page=${page}`
    );
    const data = await response.json();
    return data.results;
  }
};

import axios from 'axios';
import type { Movie, MovieDetails } from '../types/movie';

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const tmdbService = {
  // Get popular movies
  getPopularMovies: async (page: number = 1) => {
    const response = await tmdbApi.get('/movie/popular', {
      params: { page },
    });
    return response.data;
  },

  // Search movies
  searchMovies: async (query: string, page: number = 1) => {
    const response = await tmdbApi.get('/search/movie', {
      params: { query, page },
    });
    return response.data;
  },

  // Get movie details (simplified)
  getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
    const response = await tmdbApi.get(`/movie/${movieId}`);
    return response.data;
  },

  // Get movie credits (cast and crew)
  getMovieCredits: async (movieId: number) => {
    const response = await tmdbApi.get(`/movie/${movieId}/credits`);
    return response.data;
  },

  // Get movie recommendations (usually better than similar)
  getMovieRecommendations: async (movieId: number) => {
    const response = await tmdbApi.get(`/movie/${movieId}/recommendations`);
    return response.data;
  },

  // Get similar movies
  getSimilarMovies: async (movieId: number) => {
    const response = await tmdbApi.get(`/movie/${movieId}/similar`);
    return response.data;
  },

  // Get popular movies by genre (for better recommendations)
  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const response = await tmdbApi.get('/discover/movie', {
      params: {
        with_genres: genreId,
        sort_by: 'popularity.desc',
        'vote_average.gte': 6.0,
        'vote_count.gte': 100,
        page
      }
    });
    return response.data;
  },

  // Get image URL
  getImageUrl: (path: string, size: string = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },

  // Get backdrop URL (larger images for movie details)
  getBackdropUrl: (path: string, size: string = 'w1280') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
  },
};
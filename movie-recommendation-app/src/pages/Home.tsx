import { useState, useEffect } from 'react';
import type { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb';
import MovieGrid from '../components/movie/MovieGrid';
import styles from './Home.module.css';

const Home = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await tmdbService.getPopularMovies();
        setMovies(response.results);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Failed to load movies. Please check your API key.');
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    <div>
      <div className={styles.header}>
        <h1 className={styles.title}>Popular Movies</h1>
        <p className={styles.subtitle}>Discover what's trending now</p>
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p className={styles.errorText}>{error}</p>
          <p className={styles.errorHint}>
            Make sure you have added your TMDb API key to the .env file
          </p>
        </div>
      )}

      <MovieGrid movies={movies} loading={loading} />
    </div>
  );
};

export default Home;
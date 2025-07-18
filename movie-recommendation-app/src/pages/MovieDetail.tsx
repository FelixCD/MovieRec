import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import type { MovieDetails } from '../types/movie';
import { tmdbService } from '../services/tmdb';
import styles from './MovieDetail.module.css';

const MovieDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      if (!id) return;

      try {
        setLoading(true);
        setError(null);
        
        // Fetch movie details first
        const movieData = await tmdbService.getMovieDetails(parseInt(id));
        setMovie(movieData);
        
        // Try to get better recommendations
        let recommendedMovies: any[] = [];
        
        try {
          // First, try the recommendations endpoint (usually better)
          const recommendationsData = await tmdbService.getMovieRecommendations(parseInt(id));
          recommendedMovies = recommendationsData.results || [];
          
          // Filter for quality (minimum rating and vote count)
          recommendedMovies = recommendedMovies.filter(movie => 
            movie.vote_average >= 6.0 && 
            movie.vote_count >= 100 &&
            movie.poster_path // Must have poster
          );
          
          // If we don't have enough good recommendations, mix with genre-based
          if (recommendedMovies.length < 4 && movieData.genres && movieData.genres.length > 0) {
            const genreMovies = await tmdbService.getMoviesByGenre(movieData.genres[0].id);
            const filteredGenreMovies = (genreMovies.results || [])
              .filter((movie: any) => 
                movie.id !== movieData.id && // Don't recommend the same movie
                movie.vote_average >= 6.5 &&
                movie.vote_count >= 200 &&
                movie.poster_path
              );
            
            // Mix recommendations with genre movies
            recommendedMovies = [
              ...recommendedMovies,
              ...filteredGenreMovies.slice(0, 6 - recommendedMovies.length)
            ];
          }
          
        } catch (err) {
          console.log('Recommendations failed, trying similar movies...');
          // Fallback to similar movies with quality filtering
          const similarData = await tmdbService.getSimilarMovies(parseInt(id));
          recommendedMovies = (similarData.results || []).filter((movie: any) => 
            movie.vote_average >= 5.5 && 
            movie.vote_count >= 50 &&
            movie.poster_path
          );
        }
        
        setSimilarMovies(recommendedMovies);
        
        console.log('Movie data:', movieData);
        console.log('Filtered recommendations:', recommendedMovies);
      } catch (err) {
        console.error('Error fetching movie details:', err);
        setError('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.loadingContent}>
          <div className={styles.loadingBackdrop}></div>
          <div className={styles.loadingDetails}>
            <div className={styles.loadingPoster}></div>
            <div className={styles.loadingInfo}>
              <div className={styles.loadingTitle}></div>
              <div className={styles.loadingText}></div>
              <div className={styles.loadingText}></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !movie) {
    return (
      <div className={styles.error}>
        <h1>Movie Not Found</h1>
        <p>{error || 'The movie you are looking for does not exist.'}</p>
        <Link to="/" className={styles.backButton}>
          ← Back to Home
        </Link>
      </div>
    );
  }

  const backdropUrl = movie.backdrop_path 
    ? tmdbService.getBackdropUrl(movie.backdrop_path)
    : null;
  
  const posterUrl = movie.poster_path 
    ? tmdbService.getImageUrl(movie.poster_path, 'w500')
    : null;

  const director = movie.credits?.crew.find(person => person.job === 'Director');
  const mainCast = movie.credits?.cast.slice(0, 5) || [];

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'Unknown';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.movieDetail}>
      {/* Backdrop Section */}
      {backdropUrl && (
        <div className={styles.backdrop}>
          <img src={backdropUrl} alt={movie.title} className={styles.backdropImage} />
          <div className={styles.backdropOverlay}></div>
        </div>
      )}

      {/* Overlay Content - Bottom Aligned */}
      <div className={styles.content}>
        <div className={styles.movieInfo}>
          {/* Poster */}
          {posterUrl && (
            <div className={styles.posterContainer}>
              <img src={posterUrl} alt={movie.title} className={styles.poster} />
            </div>
          )}

          {/* Movie Details */}
          <div className={styles.details}>
            <h1 className={styles.title}>{movie.title}</h1>
            
            {movie.tagline && (
              <p className={styles.tagline}>"{movie.tagline}"</p>
            )}

            <div className={styles.metadata}>
              <span className={styles.rating}>
                ⭐ {movie.vote_average.toFixed(1)}/10
              </span>
              <span className={styles.year}>
                {new Date(movie.release_date).getFullYear()}
              </span>
              <span className={styles.runtime}>
                {formatRuntime(movie.runtime)}
              </span>
            </div>

            {movie.genres.length > 0 && (
              <div className={styles.genres}>
                {movie.genres.map(genre => (
                  <span key={genre.id} className={styles.genre}>
                    {genre.name}
                  </span>
                ))}
              </div>
            )}

            <div className={styles.overview}>
              <h3>Overview</h3>
              <p>{movie.overview}</p>
            </div>

            {director && (
              <div className={styles.director}>
                <strong>Director:</strong> {director.name}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Below Backdrop Content */}
      <div className={styles.belowContent}>
        {/* Cast Section */}
        {mainCast.length > 0 && (
          <div className={styles.cast}>
            <h3>Main Cast</h3>
            <div className={styles.castList}>
              {mainCast.map(actor => (
                <div key={actor.id} className={styles.castMember}>
                  {actor.profile_path && (
                    <img 
                      src={tmdbService.getImageUrl(actor.profile_path, 'w185')} 
                      alt={actor.name}
                      className={styles.castPhoto}
                    />
                  )}
                  <div className={styles.castInfo}>
                    <div className={styles.castName}>{actor.name}</div>
                    <div className={styles.castCharacter}>{actor.character}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className={styles.additionalInfo}>
          {movie.budget > 0 && (
            <div className={styles.infoItem}>
              <strong>Budget:</strong> {formatCurrency(movie.budget)}
            </div>
          )}
          {movie.revenue > 0 && (
            <div className={styles.infoItem}>
              <strong>Box Office:</strong> {formatCurrency(movie.revenue)}
            </div>
          )}
          <div className={styles.infoItem}>
            <strong>Status:</strong> {movie.status}
          </div>
          <div className={styles.infoItem}>
            <strong>Original Language:</strong> {movie.original_language.toUpperCase()}
          </div>
        </div>

        {/* Recommended Movies */}
        {similarMovies.length > 0 && (
          <div className={styles.similarMovies}>
            <h3>Recommended Movies</h3>
            <div className={styles.similarGrid}>
              {similarMovies.slice(0, 6).map(similarMovie => (
                <Link 
                  key={similarMovie.id} 
                  to={`/movie/${similarMovie.id}`}
                  className={styles.similarMovie}
                >
                  {similarMovie.poster_path && (
                    <img 
                      src={tmdbService.getImageUrl(similarMovie.poster_path, 'w300')} 
                      alt={similarMovie.title}
                      className={styles.similarPoster}
                    />
                  )}
                  <div className={styles.similarTitle}>{similarMovie.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Back Button */}
      <Link to="/" className={styles.backButton}>
        ← Back to Home
      </Link>
    </div>
  );
};

export default MovieDetail;
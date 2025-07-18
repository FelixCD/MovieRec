import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import type { Movie } from '../types/movie';
import { tmdbService } from '../services/tmdb';
import MovieGrid from '../components/movie/MovieGrid';
import styles from './Search.module.css';

const Search = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';

    const [movies, setMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [totalResults, setTotalResults] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);

    useEffect(() => {
        if (query.trim()) {
            searchMovies(query,1);
        } else{
            setMovies([]);
            setTotalResults(0);
            setCurrentPage(1);
            setHasMore(false);
        }
    },[query]);

    const searchMovies = async (searchQuery : string, page: number = 1) => {
        try {
            setLoading(true);
            setError(null);

            const response = await tmdbService.searchMovies(searchQuery,page);
            
            if (page === 1) {
                setMovies(response.results || []);
            } else {
                setMovies(prev => [...prev, ...(response.results || [])]);
            }

            setTotalResults(response.total_results || 0);
            setCurrentPage(page);
            setHasMore(page < (response.total_pages || 0));
        } catch (err) {
            console.error('Error searching movies:', err);
            setError('Failed to search movies. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const loadMore = () => {
        if (!loading && hasMore) {
            searchMovies(query, currentPage+1);
        }
    };

    return (
    <div className={styles.searchPage}>
      <div className={styles.header}>
        {query ? (
          <>
            <h1 className={styles.title}>
              Search Results for "{query}"
            </h1>
            {totalResults > 0 && (
              <p className={styles.resultCount}>
                {totalResults.toLocaleString()} movies found
              </p>
            )}
          </>
        ) : (
          <>
            <h1 className={styles.title}>Search Movies</h1>
            <p className={styles.subtitle}>
              Use the search bar above to find your favorite movies
            </p>
          </>
        )}
      </div>

      {error && (
        <div className={styles.errorMessage}>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {query && totalResults === 0 && !loading && (
        <div className={styles.noResults}>
          <h2>No movies found</h2>
          <p>Try searching for something else or check your spelling.</p>
          <div className={styles.suggestions}>
            <p>Popular searches:</p>
            <div className={styles.suggestionTags}>
              <span onClick={() => searchMovies('avengers', 1)}>Avengers</span>
              <span onClick={() => searchMovies('star wars', 1)}>Star Wars</span>
              <span onClick={() => searchMovies('harry potter', 1)}>Harry Potter</span>
              <span onClick={() => searchMovies('marvel', 1)}>Marvel</span>
            </div>
          </div>
        </div>
      )}

      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} loading={loading && currentPage === 1} />
          
          {hasMore && (
            <div className={styles.loadMoreContainer}>
              <button
                onClick={loadMore}
                disabled={loading}
                className={styles.loadMoreButton}
              >
                {loading ? 'Loading...' : 'Load More Movies'}
              </button>
            </div>
          )}
        </>
      )}

      {loading && currentPage === 1 && (
        <MovieGrid movies={[]} loading={true} />
      )}
    </div>
  );
};

export default Search;
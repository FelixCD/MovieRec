import type { Movie } from "../../types/movie";
import MovieCard from "../layout/MovieCard";
import styles from './MovieGrid.module.css'

interface MovieGridProps {
    movies: Movie[];
    loading?: boolean;
}

const MovieGrid = ({ movies, loading = false}: MovieGridProps) => {
    if (loading) {
        return (
            <div className={styles.loadingGrid}>
                {Array.from({length: 10}).map((_,index) => (
                    <div key={index} className ={styles.loadingCard}>
                        <div className={styles.loadingPoster}></div>
                        <div className = {styles.loadingContent}>
                            <div className = {styles.loadingTitle}></div>
                            <div className = {styles.loadingMeta}></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (movies.length == 0) {
        return (
            <div className = {styles.emptyState}>
                <p className={styles.emptyMessage}>No movies found</p>
            </div>
        );
    }

    return (
        <div className={styles.movieGrid}>
            {movies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
            ))}
        </div>
    );

};

export default MovieGrid;
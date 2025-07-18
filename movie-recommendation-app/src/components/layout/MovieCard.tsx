import { Link } from 'react-router-dom';
import type { Movie } from '../../types/movie';
import { tmdbService } from '../../services/tmdb';
import styles from '../movie/MovieCard.module.css';

interface MovieCardProps {
    movie: Movie;
} 

const MovieCard = ({movie}: MovieCardProps) => {
    const posterUrl = movie.poster_path
    ? tmdbService.getImageUrl(movie.poster_path) :
    '/placeholder-movie.jpg';

    return (
        <Link
        to={`/movie/${movie.id}`}
        className = {styles.movieCard}
    >  
    <div className={styles.posterContainer}>
        <img
        src={posterUrl}
        alt = {movie.title}
        className = {styles.poster}
        onError={(e) => {
            e.currentTarget.src = 'https://via.placeholder.com/300x450/374151/9CA3AF?text=No+Image';
        }}
        />
    </div>

    <div className={styles.content}>
        <h3 className = {styles.title}>
            {movie.title}
        </h3>

        <div className = {styles.metadata}>
            <span className={styles.year}>
                {new Date(movie.release_date).getFullYear() || 'TBD'}
            </span>

        <div className={styles.rating}>
            <span className = {styles.star}>⭐</span>
            <span className = {styles.ratingValue}>
                {movie.vote_average.toFixed(1)}
            </span>
        </div>
        </div>

    {movie.overview && (
        <p className= {styles.overview}>
            {movie.overview}
        </p>
    )}

    </div>

    </Link>

    );
};


export default MovieCard;
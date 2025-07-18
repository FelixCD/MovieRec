import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from './Navbar.module.css';

const Navbar = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`); 
        }
    };

    const handleSearchChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
    };

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.content}>
          <Link to="/" className={styles.logo}>
            MovieRec
          </Link>

          <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
            <div className={styles.searchContainer}>
                <input 
                type="text"
                placeholder="Search Movies...."
                value={searchQuery}
                onChange={handleSearchChange}
                className={styles.searchInput}
                />
            <button type="submit" className = {styles.searchButton}>
                🔍
            </button>
            </div>
          </form>


          <div className={styles.navigation}>
            <Link to="/" className={styles.navLink}>
              Home
            </Link>
            <Link to="/profile" className={styles.navLink}>
              Profile
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
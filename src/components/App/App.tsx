import { useState } from 'react';
import { fetchMovies } from '../../services/movieService.ts';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';
import { type Movie } from '../../types/movie.ts';
import toast, { Toaster } from 'react-hot-toast';
import './App.module.css';
// import '../../index.css';


export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(false);
    try {
      const results = await fetchMovies(query);
      if (results.length === 0) {
        toast.error('No movies found for your request.');
      }

      setMovies(results);
    } catch {
      setError(true);
      toast.error('An error occurred while fetching movies.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
  };
  
    return (
      <div className="App">
        <SearchBar onSubmit={handleSearch} />
        <Toaster />
        {loading && <Loader />}
        {error && <ErrorMessage />}
        {!loading && !error && (
            <>
                <MovieGrid onSelect={handleSelectMovie} movies={movies} />
                {selectedMovie && (
                    <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
                )}
            </>
        )}
      </div>
    );
}

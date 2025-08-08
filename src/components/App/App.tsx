import { useState } from 'react';
import { fetchMovies } from '../../services/movieService.ts';
import SearchBar from '../../components/SearchBar/SearchBar.tsx';
import MovieGrid from '../MovieGrid/MovieGrid.tsx';
import Loader from '../Loader/Loader.tsx';
import ErrorMessage from '../ErrorMessage/ErrorMessage.tsx';
import MovieModal from '../MovieModal/MovieModal.tsx';
import { type Movie } from '../../types/movie.ts';
import toast, { Toaster } from 'react-hot-toast';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import css from './App.module.css';


export default function App() {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages || 0;

  const handleSearch = async (query: string): Promise<void> => {
    setQuery(query);
    setPage(1); 
    if (isError) {
      toast.error('An error occurred while fetching movies.');
    }
    if (data && data.results.length === 0) {
      toast.error('No movies found for your request.');
    }
  };

  const handleSelectMovie = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
  };
  
    return (
      <div className={css.app}>
        <SearchBar onSubmit={handleSearch} />
        <Toaster />
        {isLoading && <Loader />}
        {isError && <ErrorMessage />}
        {isSuccess && totalPages > 1 && (
          <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
        )}
        {!isLoading && !isError && data && data.results.length > 0 && (
          <>         
            <MovieGrid onSelect={handleSelectMovie} movies={data.results} />
              {selectedMovie && (
                  <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
              )}
          </>
        )}
      </div>
    );
}

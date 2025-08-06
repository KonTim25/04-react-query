import axios from 'axios';
import { type Movie } from '../types/movie.ts';

const API_URL = 'https://api.themoviedb.org/3/search/movie';

interface resultsMovie {
    results: Movie[];
}

export const fetchMovies = async (query: string): Promise<Movie[]> => {
    const { data } = await axios.get<resultsMovie>(API_URL, {
        params: {
            query,
        },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
    });
    return data.results;
};
import axios from 'axios';
import { type Movie } from '../types/movie.ts';

const API_URL = 'https://api.themoviedb.org/3/search/movie';

interface ResultsMovie {
    results: Movie[];
    page: number;
    total_results: number; 
    total_pages: number;
}

export const fetchMovies = async (query: string, currentPage: number): Promise<ResultsMovie> => {
    const { data } = await axios.get<ResultsMovie>(API_URL, {
        params: {
            query,
            page: currentPage,
        },
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
    });
    return data;
};
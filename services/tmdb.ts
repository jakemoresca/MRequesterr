import useSWR from 'swr';
import { IMedia } from '../models/media';
import { ITmdbMovie, ITmdbMovieResult } from '../models/tmdbMovie';
import { ITmdbSearch, ITmdbSearchResult } from '../models/tmdbSearch';

const apiKey = "31140dcf74785b0d8b68a678b8057587";

export function getPopularMovies(page?: number) {
    const pageNumber = page ?? 1;

    // const result = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`);

    // if (result.ok) {
    //     return result.json();
    // }

    // throw new Error("Error retrieving Popular Movies");

    const getPopularMovieUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;

    const fetcher = (url: string): Promise<ITmdbMovie> => fetch(url).then(r => r.json())
    const { data, error } = useSWR(() => getPopularMovieUrl, fetcher)

    return {
        movies: data,
        isMoviesLoading: !error && !data,
        isError: error
    }
}

export function usePopularMovies(page?: number) {
  var { movies, isMoviesLoading, isError } = getPopularMovies(page);

  return {
      movies: movies,
      isMoviesLoading: isMoviesLoading,
      isError: isError
  }
}

export function getPopularSeries(page?: number) {
    const pageNumber = page ?? 1;

    // const result = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`);

    // if (result.ok) {
    //     return result.json();
    // }

    // throw new Error("Error retrieving Popular Series");

    const getPopularSeriesUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`;

    const fetcher = (url: string): Promise<ITmdbMovie> => fetch(url).then(r => r.json())
    const { data, error } = useSWR(() => getPopularSeriesUrl, fetcher)

    return {
        series: data,
        isSeriesLoading: !error && !data,
        isError: error
    }
}

export function usePopularSeries(page?: number) {
  var { series, isSeriesLoading, isError } = getPopularSeries(page);

  return {
    series: series,
    isSeriesLoading: isSeriesLoading,
      isError: isError
  }
}

export async function getMovie(tmdbId: string): Promise<ITmdbMovieResult> {
    const result = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`);

    if (result.ok) {
        return result.json();
    }

    throw new Error("Error retrieving Series");
}

export function useTmdbMovie(tmdbId: string) {
  const getMovieUrl = `https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`;

  const fetcher = (url: string): Promise<ITmdbMovieResult> => fetch(url).then(r => r.json())
  const { data, error } = useSWR(() => getMovieUrl, fetcher)

  return {
      tmdbMovie: data,
      isTmdbMovieLoading: !error && !data,
      isError: error
  }
}

export async function getSeries(title: string): Promise<ITmdbMovieResult> {
    const result = await fetch(`https://api.themoviedb.org/3/search/tv?query=${title}&api_key=${apiKey}&language=en-US`);

    if (result.ok) {
        const results: Promise<ITmdbMovie> = result.json();

        return (await results).results[0];
    }

    throw new Error("Error retrieving Series");
}

export async function searchTmdb(query: string): Promise<ITmdbSearchResult[]> {
    const result = await fetch(`https://api.themoviedb.org/3/search/multi?query=${query}&api_key=${apiKey}&language=en-US`);

    if (result.ok) {
        const searchResult: Promise<ITmdbSearch> = result.json();

        return (await searchResult).results;
    }

    throw new Error("Error Searching");
}

export function getImage(file: string) {
    return `https://www.themoviedb.org/t/p/w500/${file}`
}

export function convertToMedia(tmdbMovie: ITmdbMovieResult): IMedia
{
  const title = tmdbMovie.title || tmdbMovie.name || "NO TITLE";

  return {
    ...tmdbMovie,
    id: tmdbMovie.id.toString(),
    tmdbId: tmdbMovie.id.toString(),
    imdbId: "",
    cleanTitle: title,
    sortTitle: title,
    title,
    titleSlug: "",
    status: "",
    monitored: false,
    minimumAvailability: "",
    runtime: 0,
    images: [{ coverType: "poster", url: getImage(tmdbMovie.poster_path ?? "")}],
    path: "",
    year: tmdbMovie.release_date ? new Date(tmdbMovie.release_date).getFullYear() : new Date(tmdbMovie?.first_air_date ?? "").getFullYear(),
    genres: [],
    isAvailable: false,
    hasFile: false,
    statistics: {
      percentOfEpisodes: 0
    }
  }
}

export function convertSearchResultToMedia(tmdbSearchResult: ITmdbSearchResult): IMedia
{
  const title = tmdbSearchResult.title || tmdbSearchResult.name || "NO TITLE";

  return {
    ...tmdbSearchResult,
    id: tmdbSearchResult.id.toString(),
    tmdbId: tmdbSearchResult.id.toString(),
    overview: tmdbSearchResult?.overview ?? "",
    imdbId: "",
    cleanTitle: title,
    sortTitle: title,
    title,
    titleSlug: "",
    status: "",
    monitored: false,
    minimumAvailability: "",
    runtime: 0,
    images: [{ coverType: "poster", url: getImage(tmdbSearchResult.poster_path ?? "")}],
    path: "",
    year: tmdbSearchResult.release_date ? new Date(tmdbSearchResult.release_date).getFullYear() : new Date(tmdbSearchResult?.first_air_date ?? "").getFullYear(),
    genres: [],
    isAvailable: false,
    hasFile: false,
    statistics: {
      percentOfEpisodes: 0
    }
  }
}

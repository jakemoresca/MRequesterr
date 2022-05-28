// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiResponse } from 'next'
import { IMedia } from '../../models/media';
import { ITmdbMovie, ITmdbMovieResult } from '../../models/tmdbMovie';
import { ITmdbSearch, ITmdbSearchResult } from '../../models/tmdbSearch';

const apiKey = "31140dcf74785b0d8b68a678b8057587";

export default async function handler(
    res: NextApiResponse<ITmdbMovie>
) {
    const popularMovies = await getPopularMovies(1);
    res.status(200).json(popularMovies)
}

export async function getPopularMovies(page?: number): Promise<ITmdbMovie> {
    const pageNumber = page ?? 1;

    const result = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`);

    if (result.ok) {
        return result.json();
    }

    throw new Error("Error retrieving Popular Movies");
}

export async function getPopularSeries(page?: number): Promise<ITmdbMovie> {
    const pageNumber = page ?? 1;

    const result = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`);

    if (result.ok) {
        return result.json();
    }

    throw new Error("Error retrieving Popular Series");
}

export async function getMovie(tmdbId: string): Promise<ITmdbMovieResult> {
    const result = await fetch(`https://api.themoviedb.org/3/movie/${tmdbId}?api_key=${apiKey}&language=en-US`);

    if (result.ok) {
        return result.json();
    }

    throw new Error("Error retrieving Movie");
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

// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ITmdbMovie } from '../../models/tmdbMovie';

const apiKey = "31140dcf74785b0d8b68a678b8057587";

export default async function handler(
    req: NextApiRequest,
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

    throw "Error retrieving Popular Movies"
}

export async function getPopularSeries(page?: number): Promise<ITmdbMovie> {
    const pageNumber = page ?? 1;

    const result = await fetch(`https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`);

    if (result.ok) {
        return result.json();
    }

    throw "Error retrieving Popular Movies"
}

export function getImage(file: string) {
    return `https://www.themoviedb.org/t/p/w500/${file}`
}
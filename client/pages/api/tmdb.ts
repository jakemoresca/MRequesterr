// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { ITmdbMovie } from '../../models/tmdbMovie';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ITmdbMovie>
) {
    const popularMovies = await getPopular();
    res.status(200).json(popularMovies)
}

export async function getPopular(page?: number): Promise<ITmdbMovie> {
    const pageNumber = page ?? 1;

    const apiKey = process.env.TMDB_API_KEY ?? ""
    const result = await fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&language=en-US&page=${pageNumber}`);

    if (result.ok) {
        return result.json();
    }

    throw "Error retrieving Popular Movies"
}

export function getImage(file: string) {
    return `https://www.themoviedb.org/t/p/w500/${file}`
}
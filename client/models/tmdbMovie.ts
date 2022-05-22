export interface ITmdbMovie {
    page: number;
    total_results: number;
    total_pages: number;
    results: ITmdbMovieResult[]
}

export interface ITmdbMovieResult {
    poster_path?: string;
    overview: string;
    release_date: string;
    id: number;
    original_title: string;
    title: string;
}
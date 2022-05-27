export interface ITmdbSearch {
    page:          number;
    results:       ITmdbSearchResult[];
    total_results: number;
    total_pages:   number;
}

export interface ITmdbSearchResult {
    poster_path?:       null | string;
    popularity:         number;
    id:                 number;
    overview?:          string;
    backdrop_path?:     null | string;
    vote_average?:      number;
    media_type:         MediaType;
    first_air_date?:    string;
    origin_country?:    string[];
    genre_ids?:         number[];
    original_language?: OriginalLanguage;
    vote_count?:        number;
    name?:              string;
    original_name?:     string;
    adult?:             boolean;
    release_date?:      Date;
    original_title?:    string;
    title?:             string;
    video?:             boolean;
    profile_path?:      null | string;
    known_for?:         ITmdbSearchResult[];
}

export enum MediaType {
    Movie = "movie",
    Person = "person",
    Tv = "tv",
}

export enum OriginalLanguage {
    En = "en",
    It = "it",
}

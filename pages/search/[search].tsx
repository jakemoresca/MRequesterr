import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { ChangeEventHandler, KeyboardEventHandler, useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { ISettings } from '../../models/settings';
import { searchResultState } from '../../states/search';
import { ITmdbSearchResult, MediaType } from '../../models/tmdbSearch';
import { IMedia } from '../../models/media';
import Link from 'next/link';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';
import { getMovies } from '../../services/movies';
import { getSeries } from '../../services/series';
import { getSettings } from '../../services/settings';
import { convertSearchResultToMedia, searchTmdb } from '../../services/tmdb';
import { Box, Container, Grid, Input, Link as MUILink, TextField } from '@mui/material';

export interface ITVProps {
    settings: ISettings;
    series: IMedia[];
    movies: IMedia[];
}

const TV: NextPage<ITVProps> = (props) => {
    const router = useRouter();
    const { search } = router.query;
    const [searchResults, setSearchResult] = useRecoilState(searchResultState);
    const [searchText, setSearchText] = useState<string>(search as string);

    useEffect(() => {
        setSearchText(search as string);
        fetchData(search as string, setSearchResult, props.settings);
    }, [search])

    const handleSearch: KeyboardEventHandler<HTMLInputElement> = (event) => {
        if (event.code === 'Enter') {
            fetchData(searchText, setSearchResult, props.settings);
        }
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setSearchText(event.currentTarget.value);
    }

    return (<Box>
        <Head>
            <title>Search</title>
        </Head>
        <Authenticate settings={props.settings}>
        <Grid container sx={{flexDirection: "row"}} spacing={2}>
            <Grid item xs={12}>
                <TextField type="search" placeholder="Search" onKeyUp={handleSearch} onChange={handleChange} value={searchText} fullWidth />
            </Grid>

            {searchResults?.map((searchResult, index) => {
                const isMovie = searchResult.media_type == MediaType.Movie;
                const isSeries = searchResult.media_type == MediaType.Tv;

                if (isSeries) {
                    const sonarrSeriesMedia = props.series.find(x => x.title == searchResult.name);
                    const media: IMedia = { ...convertSearchResultToMedia(searchResult), isAvailable: !!sonarrSeriesMedia }
                    const linkHref = `/tv/${searchResult.name}`;

                    return (<Grid item xs={12} key={`link${index}`}><Link href={linkHref}><MUILink sx={{textDecoration: "none"}}><MediaCard key={index} media={media} /></MUILink></Link></Grid>)
                }
                else if (isMovie) {
                    const radarrMovieMedia = props.movies.find(x => x.tmdbId == searchResult.id.toString());
                    const media: IMedia = { ...convertSearchResultToMedia(searchResult), isAvailable: radarrMovieMedia?.hasFile ?? false }
                    const linkHref = `/movies/${searchResult.id ?? ""}`;

                    return (<Grid item xs={12} key={`link${index}`}><Link href={linkHref}><MUILink sx={{textDecoration: "none"}}><MediaCard key={index} media={media} /></MUILink></Link></Grid>)
                }
            })
            }

            {searchResults?.length == 0 &&
                <h5 className='align-center'>It&apos;s easy to add a new request, just start typing the name of the movie / series you want to add</h5>
            }
            </Grid>
        </Authenticate>
    </Box>);
}

async function fetchData(query: string, setSearchResult: SetterOrUpdater<ITmdbSearchResult[]>, settings: ISettings) {

    if (query.trim().length > 0) {
        const searchResult = searchTmdb(query);
        const medias = (await searchResult).filter(x => x.media_type != MediaType.Person);

        setSearchResult(medias);
    }
    else {
        setSearchResult([]);
    }
}

export async function getServerSideProps() {
    const settings = await getSettings();
    const series = await getSeries();
    const movies = await getMovies();

    return { props: { settings, series, movies } }
}

export default TV;
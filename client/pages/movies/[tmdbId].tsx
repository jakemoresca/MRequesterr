import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType } from '../../states/movie';
import { convertToMedia, getMovie } from '../api/tmdb';
import { getMovies as getRadarrMovies } from '../api/movies';
import { ISettings } from '../../models/settings';
import { getSettings } from '../api/settings';

export interface IMovieProps {
    settings: ISettings;
}

const Movie: NextPage<IMovieProps> = (props) => {
    const [media, setMediaState] = useRecoilState(mediaState);

    const router = useRouter();
    const { tmdbId } = router.query;

    useEffect(() => {
        fetchData(tmdbId as string, setMediaState, props.settings);
    }, [])

    return (<MediaCard media={media} />);
}

async function fetchData(tmdbId: string, setMediaState: SetterOrUpdater<MediaStateType>, settings: ISettings) {
    const movie = await getMovie(tmdbId);
    const radarrMovies = await getRadarrMovies(settings);

    const movieMedia = convertToMedia(movie);

    if (radarrMovies.find(x => x.tmdbId == movie.id.toString())) {
        setMediaState({ ...movieMedia, isAvailable: true });
    }
    else {
        setMediaState(movieMedia);
    }
}

export async function getServerSideProps() {
    const settings = await getSettings();
    return { props: { settings } }
}


export default Movie;
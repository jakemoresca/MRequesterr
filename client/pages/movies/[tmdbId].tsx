import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType } from '../../states/movie';
import { convertToMedia, getMovie } from '../api/tmdb';

const Movie: NextPage = () => {
    const [media, setMediaState] = useRecoilState(mediaState);
    const router = useRouter();
    const { tmdbId } = router.query;
  
    useEffect(() => {
        fetchData(tmdbId as string, setMediaState);
    }, [])

    return (<MediaCard media={media} />);
}

async function fetchData(tmdbId: string, setMediaState: SetterOrUpdater<MediaStateType>) {
    const movie = await getMovie(tmdbId);
    const movieMedia = convertToMedia(movie);
  
    setMediaState(movieMedia);
  }
  

export default Movie;
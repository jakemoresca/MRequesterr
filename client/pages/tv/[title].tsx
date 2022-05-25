import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType } from '../../states/movie';
import { convertToMedia, getSeries } from '../api/tmdb';

const TV: NextPage = () => {
    const [media, setMediaState] = useRecoilState(mediaState);
    const router = useRouter();
    const { title } = router.query;

    useEffect(() => {
        fetchData(title as string, setMediaState);
    }, [])

    return (<MediaCard media={media} />);
}

async function fetchData(title: string, setMediaState: SetterOrUpdater<MediaStateType>) {
    const series = await getSeries(title);
    const movieMedia = convertToMedia(series);

    setMediaState(movieMedia);
}


export default TV;
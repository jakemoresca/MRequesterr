import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType } from '../../states/movie';
import { convertToMedia, getSeries } from '../api/tmdb';
import { getSeries as getSonarrSeries } from '../api/series';
import { ISettings } from '../../models/settings';
import { getSettings } from '../api/settings';

export interface ITVProps {
    settings: ISettings;
}

const TV: NextPage<ITVProps> = (props) => {
    const [media, setMediaState] = useRecoilState(mediaState);
    const router = useRouter();
    const { title } = router.query;

    useEffect(() => {
        fetchData(title as string, setMediaState, props.settings);
    }, [])

    return (<MediaCard media={media} />);
}

async function fetchData(title: string, setMediaState: SetterOrUpdater<MediaStateType>, settings: ISettings) {
    const series = await getSeries(title);
    const sonarrSeries = await getSonarrSeries(settings);

    const movieMedia = convertToMedia(series);

    if (sonarrSeries.find(x => x.title == series.name)) {
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


export default TV;
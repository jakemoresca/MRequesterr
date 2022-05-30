import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType, movieRequestState } from '../../states/media';
import { convertToMedia, getMovie } from '../api/tmdb';
import { getMovieLookup, getMovies as getRadarrMovies, getQueue, requestMovie } from '../api/movies';
import { ISettings } from '../../models/settings';
import { getSettings } from '../api/settings';
import { Container, Card, CardBody, CardTitle, Progress, Table } from 'reactstrap';
import { IRadarrMovie, RadarrQueueRecord } from '../../models/radarrMovies';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';

export interface IMovieProps {
    settings: ISettings;
}

const Movie: NextPage<IMovieProps> = (props) => {
    const [media, setMediaState] = useRecoilState(mediaState);
    const [movieRequest, setMovieRequestState] = useRecoilState(movieRequestState);

    const router = useRouter();
    const { tmdbId } = router.query;

    const radarrQueueRecord = media?.additionalInfo as RadarrQueueRecord;
    const progressValue = (radarrQueueRecord?.sizeleft - radarrQueueRecord?.size) == 0 ? 0 :
        (radarrQueueRecord?.sizeleft - radarrQueueRecord?.size) / radarrQueueRecord?.size;

    const inQueue = progressValue.toString() != 'NaN'
    const progress = inQueue ? (
        <>
            <Progress className="col-md-9 bg-primary" value={progressValue} />
            {`${progressValue} / 100`}
        </>
    ) : <>Movie is not in download queue</>

    useEffect(() => {
        fetchData(tmdbId as string, setMediaState, setMovieRequestState, props.settings);
    }, [tmdbId])

    const handleRequest = async () => {
        const movieResult = await requestMovie(movieRequest, props.settings);
        setMovieRequestState(movieResult);
    }

    return (<Container fluid className="py-3">
        <Head>
            <title>View Movie</title>
        </Head>
        <Authenticate>
            <MediaCard media={media} handleRequest={handleRequest} />
            <br />
            <Container fluid className='d-flex flex-row'>
                {media?.isAvailable && !media.hasFile &&
                    <Card color="secondary col-md-4 col-sm-6 mx-1">
                        <CardBody>
                            <CardTitle tag="h5">
                                Request Progress
                            </CardTitle>
                            {progress}
                        </CardBody>
                    </Card>
                }
                {media?.hasFile &&
                    <Card color="secondary col-md-4 col-sm-6 mx-1">
                        <CardBody>
                            <CardTitle tag="h5">
                                Downloaded Movie Information
                            </CardTitle>
                            <Table responsive>
                                <thead>
                                    <tr>
                                        <th>Video Codec</th>
                                        <th>Audio</th>
                                        <th>Quality</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{media.movieFile?.mediaInfo.videoCodec}</td>
                                        <td>{media.movieFile?.mediaInfo.audioCodec}</td>
                                        <td>{media.movieFile?.quality.quality.name}</td>
                                    </tr>
                                </tbody>
                            </Table>
                        </CardBody>
                    </Card>
                }
            </Container>
        </Authenticate>
    </Container>);
}

async function fetchData(tmdbId: string, setMediaState: SetterOrUpdater<MediaStateType>, setMovieRequestState: SetterOrUpdater<IRadarrMovie>, settings: ISettings) {
    const movie = await getMovie(tmdbId);
    const radarrMovies = await getRadarrMovies(settings);
    const radarrQueue = await getQueue(settings);
    const radarrLookup = await getMovieLookup(settings, parseInt(tmdbId));

    const movieMedia = convertToMedia(movie);
    const radarrMovieMedia = radarrMovies.find(x => x.tmdbId == movie.id.toString());

    if (radarrMovieMedia) {
        const radarrQueueRecord = radarrQueue.records.find(x => x.movieId.toString() == radarrMovieMedia.id);

        setMediaState({ ...radarrMovieMedia, ...movieMedia, isAvailable: true, 
            hasFile: radarrMovieMedia.hasFile, additionalInfo: radarrQueueRecord, titleSlug: radarrMovieMedia.titleSlug });
    }
    else {
        setMediaState(movieMedia);
    }

    setMovieRequestState(radarrLookup);
}

export async function getServerSideProps() {
    const settings = await getSettings();
    return { props: { settings } }
}


export default Movie;
import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType, movieRequestState } from '../../states/media';
import { ISettings } from '../../models/settings';
import { Container, Card, CardBody, CardTitle, Progress, Table } from 'reactstrap';
import { IRadarrMovie, RadarrQueueRecord } from '../../models/radarrMovies';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';
import { requestMovie, getQueue, getMovieLookup, getMovies as getRadarrMovies, useMovies, useRadarrQueue, useMovieLookup, } from '../../services/movies';
import { getSettings } from '../../services/settings';
import { getMovie, convertToMedia, useTmdbMovie } from '../../services/tmdb';

export interface IMovieProps {
    settings: ISettings;
}

function Movie(props: IMovieProps) {
    const [media, setMediaState] = useRecoilState(mediaState);
    const [movieRequest, setMovieRequestState] = useRecoilState(movieRequestState);

    const router = useRouter();
    const { tmdbId } = router.query;

    const { tmdbMovie } = useTmdbMovie(tmdbId as string);
    const { movies } = useMovies(props.settings);
    const { radarrQueue } = useRadarrQueue(props.settings);
    const { movieLookup } = useMovieLookup(props.settings, parseInt(tmdbId as string))

    if (tmdbMovie != undefined && movies != undefined) {
        const movieMedia = convertToMedia(tmdbMovie);
        const radarrMovieMedia = movies.find(x => x.tmdbId == tmdbMovie.id.toString());
        let media: MediaStateType;

        if (radarrMovieMedia) {
            if (radarrQueue != undefined) {
                const radarrQueueRecord = radarrQueue.records.find(x => x.movieId.toString() == radarrMovieMedia.id);

                media = ({
                    ...radarrMovieMedia, ...movieMedia, isAvailable: true,
                    hasFile: radarrMovieMedia.hasFile, additionalInfo: radarrQueueRecord, titleSlug: radarrMovieMedia.titleSlug
                });
            }
        }
        else {
            media = movieMedia;
        }

        const radarrQueueRecord = media?.additionalInfo as RadarrQueueRecord;
        const progressValue = (radarrQueueRecord?.sizeleft - radarrQueueRecord?.size) == 0 ? 0 :
            Math.abs((radarrQueueRecord?.sizeleft - radarrQueueRecord?.size) / radarrQueueRecord?.size) * 100;

        const inQueue = progressValue.toString() != 'NaN';
        const progress = inQueue ? (
            <>
                <Progress className="col-md-9 bg-primary" value={progressValue} />
                {`${progressValue} / 100`}
            </>
        ) : <>Movie is not in download queue</>;

        const handleRequest = async () => {
            if (movieLookup != undefined) {
                await requestMovie(movieRequest, props.settings);
                //setMovieRequestState(movieResult);
            }
        };

        return (<Container fluid className="py-3">
            <Head>
                <title>View Movie</title>
            </Head>
            <Authenticate settings={props.settings}>
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
                        </Card>}
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
                        </Card>}
                </Container>
            </Authenticate>
        </Container>);
    }
    else {
        return (
            <div>Loading...</div>
        )
    }
}

export async function getServerSideProps() {
    const settings = await getSettings();
    return { props: { settings } }
}


export default Movie;
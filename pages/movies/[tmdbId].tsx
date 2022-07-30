import { useRouter } from 'next/router'
import MediaCard from '../../components/mediacard';
import { MediaStateType } from '../../states/media';
import { ISettings } from '../../models/settings';
//import { Container, Card, CardBody, CardTitle, Progress, Table } from 'reactstrap';
import { RadarrQueueRecord } from '../../models/radarrMovies';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';
import { requestMovie, useMovies, useRadarrQueue, useMovieLookup, } from '../../services/movies';
import { getSettings } from '../../services/settings';
import { convertToMedia, useTmdbMovie } from '../../services/tmdb';
import { Box, Card, CardContent, Grid, LinearProgress, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';

export interface IMovieProps {
    settings: ISettings;
}

function Movie(props: IMovieProps) {
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
                <LinearProgress value={progressValue} />
                {`${progressValue} / 100`}
            </>
        ) : <>Movie is not in download queue</>;

        const handleRequest = async () => {
            if (movieLookup != undefined) {
                await requestMovie(movieLookup, props.settings);
            }
        };

        return (<Box>
            <Head>
                <title>View Movie</title>
            </Head>
            <Authenticate settings={props.settings}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MediaCard media={media} handleRequest={handleRequest} />
                    </Grid>

                    {media?.isAvailable && !media.hasFile &&
                        <Grid item md={2} xs={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Request Progress
                                    </Typography>
                                    {progress}
                                </CardContent>
                            </Card>
                        </Grid>
                    }

                    {media?.hasFile &&
                        <Grid item md={2} xs={6}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Downloaded Movie Information
                                    </Typography>
                                    <TableContainer>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Video Codec</TableCell>
                                                <TableCell>Audio</TableCell>
                                                <TableCell>Quality</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell>{media.movieFile?.mediaInfo.videoCodec}</TableCell>
                                                <TableCell>{media.movieFile?.mediaInfo.audioCodec}</TableCell>
                                                <TableCell>{media.movieFile?.quality.quality.name}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </TableContainer>
                                </CardContent>
                            </Card>
                        </Grid>
                    }
                </Grid>
            </Authenticate>
        </Box>);
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
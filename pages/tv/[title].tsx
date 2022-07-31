import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { ChangeEvent, useEffect, useState } from 'react';
import MediaCard from '../../components/mediacard';
import { MediaStateType } from '../../states/media';
import { ISettings } from '../../models/settings';
import { Season } from '../../models/sonarrSeries';
import { IMedia } from '../../models/media';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';
import { updateRequestSeries, requestSeries, useSeries, useSeriesLookup, useSeriesEpisodes } from '../../services/series';
import { getSettings } from '../../services/settings';
import { convertToMedia, useTmdbSeries } from '../../services/tmdb';
import { Label } from '@mui/icons-material';
import { Box, Grid, Card, CardContent, Typography, Input, Checkbox, LinearProgress, FormLabel } from '@mui/material';
import { sendDiscordRequestMessage } from '../../services/discord';
import EpisodeList from '../../components/episodeList';

export interface ITVProps {
    settings: ISettings;
}

const TV: NextPage<ITVProps> = (props) => {
    const router = useRouter();
    const { title } = router.query;

    const { tmdbSeries } = useTmdbSeries(title as string);
    const { series } = useSeries(props.settings);
    const { seriesLookup } = useSeriesLookup(props.settings, title as string);

    const [seasons, setSeasons] = useState<Season[]>([]);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    useEffect(() => {
        if (seriesLookup) {
            setSeasons(seriesLookup.seasons)
        }
    }, [seriesLookup]);

    if (tmdbSeries != undefined && series != undefined && seriesLookup != undefined) {
        const seriesMedia = convertToMedia(tmdbSeries);
        const sonarrSeriesMedia = containsYear(title as string) ? series.find(x => findWithYear(x, title as string)) : series.find(x => x.title == tmdbSeries.name);

        let media: MediaStateType;

        const progress = Math.ceil(sonarrSeriesMedia?.statistics?.percentOfEpisodes ?? 0);

        if (sonarrSeriesMedia) {
            media = { ...seriesMedia, isAvailable: true, hasFile: progress >= 100, additionalInfo: seriesLookup, statistics: sonarrSeriesMedia.statistics }
        }
        else {
            media = { ...seriesMedia, additionalInfo: seriesLookup };
        }

        const handleCheck = (event: ChangeEvent<HTMLInputElement>, seasonNumber: number) => {
            const newSeasonState = [...seasons.map(season => {
                if (season.seasonNumber == seasonNumber) {
                    return { ...season, monitored: event.currentTarget.checked };
                }

                return { ...season }
            })];

            setSeasons(newSeasonState);
            setIsDirty(true);
        }

        const handleRequest = async () => {
            if (!seriesLookup)
                return;

            const newSeriesState = { ...seriesLookup, seasons: [...seasons] }

            if (media?.isAvailable) {
                await updateRequestSeries(newSeriesState, props.settings)
            }
            else {
                await requestSeries(newSeriesState, props.settings);

                if(seriesMedia) {
                    await sendDiscordRequestMessage(seriesMedia, props.settings);
                }
            }

            setIsDirty(false);
        }

        const seasonMap = seasons ? seasons.map(x => x.seasonNumber) : [];

        return (<Box>
            <Head><title>View TV</title></Head>
            <Authenticate settings={props.settings}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <MediaCard media={media} handleRequest={handleRequest} isDirty={isDirty} />
                    </Grid>

                    <Grid item md={2} xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Season Information
                                </Typography>
                                <Typography gutterBottom variant="h6" component="div">
                                    Please select the season to monitor and download:
                                </Typography>
                                {
                                    seasons && seasons.map((season, x) => {
                                        const currentValue = seriesLookup?.seasons.find(y => y.seasonNumber == season.seasonNumber);

                                        return (
                                            <div key={x}>
                                                <Checkbox checked={season.monitored}
                                                    onChange={(event) => handleCheck(event, season.seasonNumber)}
                                                    disabled={currentValue?.monitored && media?.isAvailable} />
                                                <FormLabel>
                                                    {season.seasonNumber == 0 ? ' Specials' : ` Season ${season.seasonNumber}`}
                                                </FormLabel>
                                            </div>
                                        );
                                    })
                                }
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={2} xs={6}>
                        <Card variant="outlined">
                            <CardContent>
                                <Typography gutterBottom variant="h5" component="div">
                                    Request Progress
                                </Typography>
                                <LinearProgress variant="determinate" value={progress} />
                                {`${progress} / 100`}
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid item md={4} xs={12}>
                        <EpisodeList settings={props.settings} seriesId={seriesLookup.id.toString()} seasonMap={seasonMap}></EpisodeList>
                    </Grid>
                </Grid>
            </Authenticate>
        </Box>);
    }

    return (
        <div>Loading...</div>
    )
}

function containsYear(title: string) {
    var yearRegex = /(\(\d{4}\))/
    return yearRegex.test(title);
}

function findWithYear(media: IMedia, title: string): IMedia | undefined {
    var { newTitle, year } = extractYearAndTitle(title);

    if (media.firstAired) {
        if (media.title.trim() == newTitle.trim() && new Date(media.firstAired).getFullYear() == Number(year)) {
            return media;
        }
        else if (media.title == title) {
            return media;
        }
    }
}

function extractYearAndTitle(title: string) {
    const yearRegex = /(\(\d{4}\))/

    const years = title.match(yearRegex);
    const year = years != null ? years[0].replace("(", "").replace(")", "") : "0";

    const newTitle = title.replace(yearRegex, "");

    return { newTitle, year };
}

export async function getServerSideProps() {
    const settings = await getSettings();
    return { props: { settings } }
}


export default TV;
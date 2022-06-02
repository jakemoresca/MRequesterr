import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { ChangeEvent, useEffect, useState } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType, seriesRequestState } from '../../states/media';
import { convertToMedia, getSeries } from '../api/tmdb';
import { getSeries as getSonarrSeries, getSeriesLookup, requestSeries, updateRequestSeries } from '../api/series';
import { ISettings } from '../../models/settings';
import { getSettings } from '../api/settings';
import { Card, CardBody, CardSubtitle, CardTitle, Container, Input, Label, Progress } from 'reactstrap';
import { ISonarrSeries, Season } from '../../models/sonarrSeries';
import { IMedia } from '../../models/media';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';

export interface ITVProps {
    settings: ISettings;
}

const TV: NextPage<ITVProps> = (props) => {
    const [media, setMediaState] = useRecoilState(mediaState);
    const [seriesRequest, setSeriesRequestState] = useRecoilState(seriesRequestState);
    const [seasons, setSeasons] = useState<Season[]>([]);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    const router = useRouter();
    const { title } = router.query;

    useEffect(() => {
        fetchData(title as string, setMediaState, setSeriesRequestState, props.settings);
    }, [title])

    useEffect(() => {
        if (seriesRequest) {
            setSeasons(seriesRequest.seasons);
        }
    }, [seriesRequest])

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
        const newSeriesState = {...seriesRequest, seasons: [...seasons]}
        const seriesResult = media?.isAvailable ? await updateRequestSeries(newSeriesState, props.settings) : 
            await requestSeries(newSeriesState, props.settings);

        setSeriesRequestState(seriesResult);
        setIsDirty(false);
    }

    const progress = Math.ceil(media?.statistics.percentOfEpisodes ?? 0);

    return (<Container fluid>
        <Head><title>View TV</title></Head>
        <Authenticate settings={props.settings}>
            <MediaCard media={media} handleRequest={handleRequest} isDirty={isDirty} />
            <br />
            <Container fluid className='d-flex flex-row'>
                <Card color="secondary col-md-4 col-sm-6 mx-1">
                    <CardBody>
                        <CardTitle tag="h5">
                            Season Information
                        </CardTitle>
                        <CardSubtitle>
                            Please select the season to monitor and download:
                        </CardSubtitle>
                        {
                            seasons && seasons.map((season, x) => {
                                const currentValue = seriesRequest.seasons.find(y => y.seasonNumber == season.seasonNumber);

                                return (
                                    <div key={x}>
                                        <Input type="checkbox" checked={season.monitored}
                                            onChange={(event) => handleCheck(event, season.seasonNumber)}
                                            disabled={currentValue?.monitored} />
                                        <Label check>
                                            {season.seasonNumber == 0 ? ' Specials' : ` Season ${season.seasonNumber}`}
                                        </Label>
                                    </div>
                                );
                            })
                        }
                    </CardBody>
                </Card>
                <Card color="secondary col-md-4 col-sm-6 mx-1">
                    <CardBody>
                        <CardTitle tag="h5">
                            Request Progress
                        </CardTitle>
                        <Progress className="col-md-9 bg-dark" value={progress} />
                        {`${progress} / 100`}
                    </CardBody>
                </Card>
            </Container>
        </Authenticate>
    </Container>);
}

async function fetchData(title: string, setMediaState: SetterOrUpdater<MediaStateType>, setSeriesRequestState: SetterOrUpdater<ISonarrSeries>, settings: ISettings) {
    const series = await getSeries(title);
    const sonarrSeries = await getSonarrSeries(settings);
    const sonarrLookup = await getSeriesLookup(settings, title);

    const seriesMedia = convertToMedia(series);
    const sonarrSeriesMedia = containsYear(title) ? sonarrSeries.find(x => findWithYear(x, title)) : sonarrSeries.find(x => x.title == series.name);

    if (sonarrSeriesMedia) {
        setMediaState({ ...seriesMedia, isAvailable: true, additionalInfo: sonarrLookup, statistics: sonarrSeriesMedia.statistics });
    }
    else {
        setMediaState({ ...seriesMedia, additionalInfo: sonarrLookup });
    }

    setSeriesRequestState(sonarrLookup);
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
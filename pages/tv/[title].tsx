import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { ChangeEvent, useState } from 'react';
import MediaCard from '../../components/mediacard';
import { MediaStateType } from '../../states/media';
import { ISettings } from '../../models/settings';
import { Card, CardBody, CardSubtitle, CardTitle, Container, Input, Label, Progress } from 'reactstrap';
import { Season } from '../../models/sonarrSeries';
import { IMedia } from '../../models/media';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';
import { updateRequestSeries, requestSeries, useSeries, useSeriesLookup } from '../../services/series';
import { getSettings } from '../../services/settings';
import { convertToMedia, useTmdbSeries } from '../../services/tmdb';

export interface ITVProps {
    settings: ISettings;
}

const TV: NextPage<ITVProps> = (props) => {
    const router = useRouter();
    const { title } = router.query;

    const { tmdbSeries } = useTmdbSeries(title as string);
    const { series } = useSeries(props.settings);
    const { seriesLookup } = useSeriesLookup(props.settings, title as string)

    const [seasons, setSeasons] = useState<Season[]>([]);
    const [isDirty, setIsDirty] = useState<boolean>(false);

    if (tmdbSeries != undefined && series != undefined && seriesLookup != undefined) {
        const seriesMedia = convertToMedia(tmdbSeries);
        const sonarrSeriesMedia = containsYear(title as string) ? series.find(x => findWithYear(x, title as string)) : series.find(x => x.title == tmdbSeries.name);

        let media: MediaStateType;

        if (sonarrSeriesMedia) {
            media = { ...seriesMedia, isAvailable: true, additionalInfo: seriesLookup, statistics: sonarrSeriesMedia.statistics }
        }
        else {
            media = { ...seriesMedia, additionalInfo: seriesLookup };
        }

        if(seriesLookup) {
            setSeasons(seriesLookup.seasons)
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
            if(!seriesLookup)
                return;

            const newSeriesState = {...seriesLookup, seasons: [...seasons]}
            
            if(media?.isAvailable) {
                await updateRequestSeries(newSeriesState, props.settings)
            }
            else {
                await requestSeries(newSeriesState, props.settings);
            }

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
                                    const currentValue = seriesLookup?.seasons.find(y => y.seasonNumber == season.seasonNumber);
    
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
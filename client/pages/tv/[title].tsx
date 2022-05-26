import { useRouter } from 'next/router'
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import { SetterOrUpdater, useRecoilState } from 'recoil';
import MediaCard from '../../components/mediacard';
import { mediaState, MediaStateType } from '../../states/movie';
import { convertToMedia, getSeries } from '../api/tmdb';
import { getSeries as getSonarrSeries, getSeriesLookup } from '../api/series';
import { ISettings } from '../../models/settings';
import { getSettings } from '../api/settings';
import { Button, Card, CardBody, CardSubtitle, CardText, CardTitle, Container, Form, FormGroup, Input, Label, Progress, Row } from 'reactstrap';

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

    const handleCheck = () => {

    }

    return (<Container fluid>
        <MediaCard media={media} />
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
                        media?.additionalInfo && media.additionalInfo.seasons.map((season, x) => {
                            return (
                                <div key={x}>
                                    <Input type="checkbox" checked={season.monitored} onChange={handleCheck} />
                                    <Label check>
                                        {
                                            season.seasonNumber == 0 ? ' Specials' : ` Season ${season.seasonNumber}`
                                        }
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
                    <Progress className="col-md-9 bg-primary" value={media?.statistics.percentOfEpisodes} />
                    {`${media?.statistics.percentOfEpisodes} / 100`}
                </CardBody>
            </Card>
        </Container>
    </Container>);
}

async function fetchData(title: string, setMediaState: SetterOrUpdater<MediaStateType>, settings: ISettings) {
    const series = await getSeries(title);
    const sonarrSeries = await getSonarrSeries(settings);
    const sonarrLookup = await getSeriesLookup(settings, title);

    const seriesMedia = convertToMedia(series);
    const sonarrSeriesMedia = sonarrSeries.find(x => x.title == series.name);

    if (sonarrSeriesMedia) {
        setMediaState({ ...seriesMedia, isAvailable: true, additionalInfo: sonarrLookup, statistics: sonarrSeriesMedia.statistics });
    }
    else {
        setMediaState({ ...seriesMedia, additionalInfo: sonarrLookup });
    }
}

export async function getServerSideProps() {
    const settings = await getSettings();
    return { props: { settings } }
}


export default TV;
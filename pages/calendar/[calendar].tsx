import { useRouter } from 'next/router'
import { GetStaticPaths, NextPage } from 'next/types';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';
import { ISettings } from '../../models/settings';
import { getSettings } from '../../services/settings';
import { getServiceUrl as getRadarrServiceUrl } from '../../services/movies';
import { getServiceUrl as getSonarrServiceUrl } from '../../services/series';
import { Box } from '@mui/material';

export interface ICalendarProps {
    sonarrCalendarUrl: string;
    radarrCalendarUrl: string;
    settings: ISettings;
}

const Calendar: NextPage<ICalendarProps> = (props) => {
    const router = useRouter();
    const { calendar } = router.query;
    const icsBaseUrl = "https://stefanhoelzl.github.io/ics-viewer/?title=Release&ics=";

    const calendarComponent = calendar == "movie" ?
        (<iframe className='w-100' style={{ height: "80vh" }} src={`${icsBaseUrl}${props.radarrCalendarUrl}`} title="Movie Calendar"></iframe>) :
        (<iframe className='w-100' style={{ height: "80vh" }} src={`${icsBaseUrl}${props.sonarrCalendarUrl}`} title="Series Calendar"></iframe>);

    return (<Box>
        <Head>
            <title>View Release Calendar</title>
        </Head>
        <Authenticate settings={props.settings}>
            {calendarComponent}
        </Authenticate>
    </Box>);
}

export const getStaticPaths: GetStaticPaths<{ calendar: string }> = async () => {

    return {
        paths: ['/calendar/movie', '/calendar/tv'],
        fallback: 'blocking' //indicates the type of fallback
    }
}

export async function getStaticProps() {
    const settings = await getSettings();

    const sonarrCalendarUrl = getSonarrServiceUrl(settings.integrationSettings.series, "/feed/v3/calendar/Sonarr.ics");
    const radarrCalendarUrl = getRadarrServiceUrl(settings.integrationSettings.movies, "/feed/v3/calendar/Radarr.ics");

    return { props: { sonarrCalendarUrl, radarrCalendarUrl, settings } }
}

export default Calendar;
import { useRouter } from 'next/router'
import { GetStaticPaths, NextPage } from 'next/types';
import { Container } from 'reactstrap';
import Authenticate from '../../components/authenticate';
import Head from 'next/head';
import { getSettings } from '../api/settings';
import { getServiceUrl as getSonarrServiceUrl } from '../api/series';
import { getServiceUrl as getRadarrServiceUrl } from '../api/movies';

export interface ICalendarProps {
    sonarrCalendarUrl: string;
    radarrCalendarUrl: string;
}

const Calendar: NextPage<ICalendarProps> = (props) => {
    const router = useRouter();
    const { calendar } = router.query;
    const icsBaseUrl = "https://stefanhoelzl.github.io/ics-viewer/?title=Release&ics=";

    const calendarComponent = calendar == "movie" ?
        (<iframe className='w-100' style={{ height: "80vh" }} src={`${icsBaseUrl}${props.radarrCalendarUrl}`} title="Movie Calendar"></iframe>) :
        (<iframe className='w-100' style={{ height: "80vh" }} src={`${icsBaseUrl}${props.sonarrCalendarUrl}`} title="Series Calendar"></iframe>);

    return (<Container fluid className="py-3">
        <Head>
            <title>View Release Calendar</title>
        </Head>
        <Authenticate>
            {calendarComponent}
        </Authenticate>
    </Container>);
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

    return { props: { sonarrCalendarUrl, radarrCalendarUrl } }
}

export default Calendar;
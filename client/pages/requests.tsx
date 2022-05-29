import type { NextPage } from 'next'
import Head from 'next/head'
import { IMedia } from '../models/media'
import { ISettings } from '../models/settings'
import { getItemTypeAndUrl, getMovies } from './api/movies'
import { getSeries } from './api/series'
import { getSettings } from './api/settings'
import LazyCarousel from '../components/carousel'
import Authenticate from '../components/authenticate'

export interface IRequestsProps {
  settings: ISettings;
  movies: IMedia[];
  series: IMedia[];
}

const Requests: NextPage<IRequestsProps> = (props) => {
  const movieSettings = props.settings.integrationSettings.movies;
  const seriesSettings = props.settings.integrationSettings.series;

  var radarrPort = movieSettings.port;
  var radarrHost = movieSettings.host;
  var radarrUseSsl = movieSettings.useSsl;
  var radarrBaseUrl = movieSettings.baseUrl;
  var radarrProtocol = radarrUseSsl ? "https://" : "http://";

  var sonarrPort = seriesSettings.port;
  var sonarrHost = seriesSettings.host;
  var sonarrUseSsl = seriesSettings.useSsl;
  var sonarrBaseUrl = seriesSettings.baseUrl;
  var sonarrProtocol = sonarrUseSsl ? "https://" : "http://";

  const movieImageBaseUrl = `${radarrProtocol}${radarrHost}:${radarrPort}/radarr/api/v3/`;
  const seriesImageBaseUrl = `${sonarrProtocol}${sonarrHost}:${sonarrPort}/sonarr/api/v3/`;

  const getRadarrItemTypeAndUrlAction = (media: IMedia) => {
    return getItemTypeAndUrl(media, radarrBaseUrl, movieImageBaseUrl, movieSettings.apiKey);
  }

  const getSonarrItemTypeAndUrlAction = (media: IMedia) => {
    return getItemTypeAndUrl(media, sonarrBaseUrl, seriesImageBaseUrl, seriesSettings.apiKey);
  }

  return (
    <div>
      <Head>
        <title>Requests</title>
      </Head>
      <div className="container-fluid">
        <Authenticate>
          <LazyCarousel items={props.movies} getItemTypeAndUrl={getRadarrItemTypeAndUrlAction} showProgress={true} title="Movies" />
          <hr />
          <LazyCarousel items={props.series} getItemTypeAndUrl={getSonarrItemTypeAndUrlAction} showProgress={true} title="Series" />
        </Authenticate>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  const settings = await getSettings();
  const movies = await getMovies();
  const series = await getSeries();

  const inProgressMovies = movies.filter(x => !x.hasFile);
  const inProgressSeries = series.filter(x => x.statistics.percentOfEpisodes < 100);

  return { props: { movies: inProgressMovies, series: inProgressSeries, settings } }
}

export default Requests

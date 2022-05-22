import type { NextPage } from 'next'
import Head from 'next/head'
import { IMedia } from '../models/media'
import { ISettings } from '../models/settings'
import styles from '../styles/Home.module.css'
import { getMovies } from './api/movies'
import { getSeries } from './api/series'
import { getSettings } from './api/settings'
import LazyCarousel from '../components/carousel'

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

  return (
    <div>
      <Head>
        <title>Requests</title>
      </Head>
        <div className="container-fluid">
          <h1>Requests</h1>

          { props.movies.length > 0 && <h3>Movies</h3> }
          <LazyCarousel items={props.movies} imageBaseUrl={movieImageBaseUrl} baseUrl={radarrBaseUrl} apiKey={movieSettings.apiKey} />

          <hr />

          { props.series.length > 0 && <h3>Series</h3> }
          <LazyCarousel items={props.series} imageBaseUrl={seriesImageBaseUrl} baseUrl={sonarrBaseUrl} apiKey={seriesSettings.apiKey} />
        </div>
    </div>
  )
}

export async function getServerSideProps() {
  const settings = await getSettings();
  const movies = await getMovies();
  const series = await getSeries();

  const inProgressMovies = movies.filter(x => x.isAvailable == false);
  const inProgressSeries = series.filter(x => x.statistics.percentOfEpisodes < 100);

  return { props: { movies: inProgressMovies, series: inProgressSeries, settings } }
}

export default Requests

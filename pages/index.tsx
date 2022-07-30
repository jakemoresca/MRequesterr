import Head from 'next/head'
import { IMedia } from '../models/media'
import { ISettings } from '../models/settings'
import LazyCarousel from '../components/carousel'
import Authenticate from '../components/authenticate'
import { useAvailableMovies, getItemTypeAndUrl } from '../services/movies'
import { useAvailableSeries } from '../services/series'
import { getSettings } from '../services/settings'
import { Box } from '@mui/material'

export interface IHomeProps {
  settings: ISettings;
}

function Home(props: IHomeProps) {
  const movieSettings = props.settings.integrationSettings.movies
  const seriesSettings = props.settings.integrationSettings.series

  const { movies, isMoviesLoading } = useAvailableMovies(props.settings as ISettings);
  const { series, isSeriesLoading } = useAvailableSeries(props.settings as ISettings)
  
  var radarrPort = movieSettings.port
  var radarrHost = movieSettings.host
  var radarrUseSsl = movieSettings.useSsl
  var radarrBaseUrl = movieSettings.baseUrl
  var radarrProtocol = radarrUseSsl ? "https://" : "http://"

  var sonarrPort = seriesSettings.port
  var sonarrHost = seriesSettings.host
  var sonarrUseSsl = seriesSettings.useSsl
  var sonarrBaseUrl = seriesSettings.baseUrl
  var sonarrProtocol = sonarrUseSsl ? "https://" : "http://"

  const movieImageBaseUrl = `${radarrProtocol}${radarrHost}:${radarrPort}/radarr/api/v3/`
  const seriesImageBaseUrl = `${sonarrProtocol}${sonarrHost}:${sonarrPort}/sonarr/api/v3/`

  const getRadarrItemTypeAndUrlAction = (media: IMedia) => {
    return getItemTypeAndUrl(media, radarrBaseUrl, movieImageBaseUrl, movieSettings.apiKey)
  }

  const getSonarrItemTypeAndUrlAction = (media: IMedia) => {
    return getItemTypeAndUrl(media, sonarrBaseUrl, seriesImageBaseUrl, seriesSettings.apiKey)
  }

  return (
    <div>
      <Head>
        <title>Now Playing</title>
      </Head>
      <Authenticate settings={props.settings}>
        <Box>
          <LazyCarousel items={movies} getItemTypeAndUrl={getRadarrItemTypeAndUrlAction} title="Movies" isLoading={isMoviesLoading} />
          <hr />
          <LazyCarousel items={series} getItemTypeAndUrl={getSonarrItemTypeAndUrlAction} title="Series" isLoading={isSeriesLoading} />
        </Box>
      </Authenticate>
    </div>
  )
}

export async function getServerSideProps() {
  const settings = await getSettings();

  return { props: { settings } }
}

export default Home

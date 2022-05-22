import type { NextPage } from 'next'
import Head from 'next/head'
import { IMedia } from '../models/media'
import { ISettings } from '../models/settings'
import styles from '../styles/Home.module.css'
import { getMovies } from './api/movies'
import { getSeries } from './api/series'
import { getSettings } from './api/settings'
import LazyCarousel from '../components/carousel'
import { getImage, getPopular } from './api/tmdb'
import { ITmdbMovieResult } from '../models/tmdbMovie'
import { faGaugeSimpleMed } from '@fortawesome/free-solid-svg-icons'

export interface IRequestsProps {
  currentMoviePage: number;
  currentSeriesPage: number;
  movies: IMedia[];
  series: IMedia[];
}

const Discover: NextPage<IRequestsProps> = (props) => {
  const getItemTypeAndUrl = (media: IMedia) => {
    const url = media.images[0].url;
    const itemType = "movie";

    return { url, itemType };
  }

  return (
    <div>
      <Head>
        <title>Discover</title>
      </Head>
        <div className="container-fluid">
          <h1>Discover</h1>

          { props.movies.length > 0 && <h3>Movies</h3> }
          <LazyCarousel items={props.movies} getItemTypeAndUrl={getItemTypeAndUrl} />

          <hr />

          { props.series.length > 0 && <h3>Series</h3> }
          <LazyCarousel items={props.series} getItemTypeAndUrl={getItemTypeAndUrl} />
        </div>
    </div>
  )
}

export async function getServerSideProps() {
  const popularMovies = await getPopular();

  const movies = popularMovies.results.map(convertToMedia)

  return { props: { movies, series: [] } }
}

function convertToMedia(tmdbMovie: ITmdbMovieResult): IMedia
{
  return {
    ...tmdbMovie,
    id: tmdbMovie.id.toString(),
    tmdbId: tmdbMovie.id.toString(),
    imdbId: "",
    cleanTitle: tmdbMovie.title,
    sortTitle: tmdbMovie.title,
    status: "",
    monitored: false,
    minimumAvailability: "",
    runtime: 0,
    images: [{ coverType: "poster", url: getImage(tmdbMovie.poster_path ?? "")}],
    path: "",
    year: 0,
    genres: [],
    isAvailable: false,
    statistics: {
      percentOfEpisodes: 0
    }
  }
}

export default Discover;

import type { NextPage } from 'next'
import Head from 'next/head'
import { IMedia } from '../models/media'
import { ISettings } from '../models/settings'
import styles from '../styles/Home.module.css'
import { getMovies } from './api/movies'
import { getSeries } from './api/series'
import { getSettings } from './api/settings'
import LazyCarousel from '../components/carousel'
import { convertToMedia, getImage, getPopularMovies, getPopularSeries } from './api/tmdb'
import { ITmdbMovieResult } from '../models/tmdbMovie'
import { faGaugeSimpleMed } from '@fortawesome/free-solid-svg-icons'
import { SetterOrUpdater, useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { IPopularMoviesState, IPopularSeriesState, popularMoviesState, popularSeriesState } from '../states/discover'
import { useEffect } from 'react'


const Discover: NextPage = () => {
  const [moviesState, setMovieState] = useRecoilState(popularMoviesState);
  const [seriesState, setSeriesState] = useRecoilState(popularSeriesState);

  useEffect(() => {
    fetchData(setMovieState, setSeriesState);
  }, [])

  const getItemTypeAndUrlSeries = (media: IMedia) => {
    const url = media.images[0].url;
    const itemType = "series";

    return { url, itemType };
  }

  const getItemTypeAndUrlMovie = (media: IMedia) => {
    const url = media.images[0].url;
    const itemType = "movie";

    return { url, itemType };
  }

  const itemsPerPage = 20;
  const itemsDisplayedPerPage = 6;
  const loadedPage = (itemsPerPage * moviesState.currentPage);

  const handleNextMovie = async (page: number) => {
    const needLoad = (loadedPage - (page * itemsDisplayedPerPage) - itemsDisplayedPerPage) < 0

    if(needLoad)
    {
      const nextPage = moviesState.currentPage + 1;
      const popularMovies = await getPopularMovies(nextPage);
      const movies = popularMovies.results.map(convertToMedia);

      const newMovies = moviesState.movies.concat(movies);

      setMovieState({ movies: newMovies, currentPage: nextPage});
    }
  }

  const handleNextSeries = async (page: number) => {
    const needLoad = (loadedPage - (page * itemsDisplayedPerPage) - itemsDisplayedPerPage) < 0

    if(needLoad)
    {
      const nextPage = seriesState.currentPage + 1;
      const popularMovies = await getPopularSeries(nextPage);
      const series = popularMovies.results.map(convertToMedia);

      const newSeries = seriesState.series.concat(series);

      setSeriesState({ series: newSeries, currentPage: nextPage});
    }
  }

  return (
    <div>
      <Head>
        <title>Discover</title>
      </Head>
        <div className="container-fluid">
          <h1>Discover</h1>
          { moviesState.movies.length > 0 && <h3>Movies</h3> }
          <LazyCarousel items={moviesState.movies} handleNext={handleNextMovie} getItemTypeAndUrl={getItemTypeAndUrlMovie} />

          <hr />

          { seriesState.series.length > 0 && <h3>Series</h3> }
          <LazyCarousel items={seriesState.series} handleNext={handleNextSeries} getItemTypeAndUrl={getItemTypeAndUrlSeries} />
        </div>
    </div>
  )
}

async function fetchData(setMovieState: SetterOrUpdater<IPopularMoviesState>, setSeriesState: SetterOrUpdater<IPopularSeriesState>) {
  const popularMovies = await getPopularMovies(1);
  const popularSeries = await getPopularSeries(1);

  const movies = popularMovies.results.map(convertToMedia);
  const series = popularSeries.results.map(convertToMedia);

  setSeriesState({ series, currentPage: popularSeries.page });
  setMovieState({ movies, currentPage: popularMovies.page });
}

export default Discover;
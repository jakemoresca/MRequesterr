import type { NextPage } from 'next'
import Head from 'next/head'
import { IMedia } from '../../models/media'
import LazyCarousel from '../../components/carousel'
import Authenticate from '../../components/authenticate'
import { ISettings } from '../../models/settings'
import { getSettings } from '../../services/settings'
import { convertToMedia, usePopularMovies } from '../../services/tmdb'
import { useRouter } from 'next/router'

export interface IHomeProps {
  settings: ISettings;
}

const DiscoverMovies: NextPage<IHomeProps> = (props) => {
  const router = useRouter();
  const { page } = router.query;

  // const [moviesState, setMovieState] = useRecoilState(popularMoviesState);
  // const [seriesState, setSeriesState] = useRecoilState(popularSeriesState);

  const { movies, isMoviesLoading } = usePopularMovies(parseInt(page as string));
  //const { series, isSeriesLoading } = usePopularSeries(1);

  // useEffect(() => {
  //   fetchData(setMovieState, setSeriesState);
  // })

  // const getItemTypeAndUrlSeries = (media: IMedia) => {
  //   const url = media.images[0].url;
  //   const itemType = "series";

  //   return { url, itemType };
  // }

  const getItemTypeAndUrlMovie = (media: IMedia) => {
    const url = media.images[0].url;
    const itemType = "movie";

    return { url, itemType };
  }

  // const itemsPerPage = 20;
  // const itemsDisplayedPerPage = 6;
  // const loadedPage = (itemsPerPage * moviesState.currentPage);

  const handleNextMovie = async (page: number) => {
    router.push(`/discoverMovie/${page}`);
    // const needLoad = (loadedPage - (page * itemsDisplayedPerPage) - itemsDisplayedPerPage) < 0

    // if (needLoad) {
    //   const nextPage = moviesState.currentPage + 1;
    //   const popularMovies = await getPopularMovies(nextPage);
    //   const movies = popularMovies.results.map(convertToMedia);

    //   const newMovies = moviesState.movies.concat(movies);

    //   setMovieState({ movies: newMovies, currentPage: nextPage });
    // }
  }

  // const handleNextSeries = async (page: number) => {
  //   const needLoad = (loadedPage - (page * itemsDisplayedPerPage) - itemsDisplayedPerPage) < 0

  //   if (needLoad) {
  //     const nextPage = seriesState.currentPage + 1;
  //     const popularMovies = await getPopularSeries(nextPage);
  //     const series = popularMovies.results.map(convertToMedia);

  //     const newSeries = seriesState.series.concat(series);

  //     setSeriesState({ series: newSeries, currentPage: nextPage });
  //   }
  // }

  if(!isMoviesLoading)
  {
    return <></>
  }

  const convertedMovies = movies?.results.map(convertToMedia) ?? [];

  return (
    <div>
      <Head>
        <title>Discover Movies</title>
      </Head>
      <div className="container-fluid">
        <Authenticate settings={props.settings}>
          <LazyCarousel items={convertedMovies} handleNext={handleNextMovie} getItemTypeAndUrl={getItemTypeAndUrlMovie} title="Movies" />
          {/* <hr />
          <LazyCarousel items={seriesState.series} handleNext={handleNextSeries} getItemTypeAndUrl={getItemTypeAndUrlSeries} title="Series" /> */}
        </Authenticate>
      </div>
    </div>
  )
}

// async function fetchData(setMovieState: SetterOrUpdater<IPopularMoviesState>, setSeriesState: SetterOrUpdater<IPopularSeriesState>) {
//   const popularMovies = await getPopularMovies(1);
//   const popularSeries = await getPopularSeries(1);

//   const movies = popularMovies.results.map(convertToMedia);
//   const series = popularSeries.results.map(convertToMedia);

//   setSeriesState({ series, currentPage: popularSeries.page });
//   setMovieState({ movies, currentPage: popularMovies.page });
// }

export async function getServerSideProps() {
  const settings = await getSettings();

  return { props: { settings } }
}

export default DiscoverMovies;
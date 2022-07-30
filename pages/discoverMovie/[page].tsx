import type { NextPage } from 'next'
import Head from 'next/head'
import { IMedia } from '../../models/media'
import LazyCarousel from '../../components/carousel'
import Authenticate from '../../components/authenticate'
import { ISettings } from '../../models/settings'
import { getSettings } from '../../services/settings'
import { convertToMedia, usePopularMovies } from '../../services/tmdb'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'

export interface IHomeProps {
  settings: ISettings;
}

const DiscoverMovies: NextPage<IHomeProps> = (props) => {
  const router = useRouter();
  const { page } = router.query;

  const { movies, isMoviesLoading } = usePopularMovies(parseInt(page as string));

  const getItemTypeAndUrlMovie = (media: IMedia) => {
    const url = media.images[0].url;
    const itemType = "movie";

    return { url, itemType };
  }

  const handleNextMovie = async (page: number) => {
    router.push(`/discoverMovie/${page + 1}`);
  }

  const handlePrevMovie = async (page: number) => {
    router.push(`/discoverMovie/${page + 1}`);
  }

  if(isMoviesLoading)
  {
    return <></>
  }

  const convertedMovies = movies?.results.map(convertToMedia) ?? [];

  return (
    <div>
      <Head>
        <title>Discover Movies</title>
      </Head>
      <Box>
        <Authenticate settings={props.settings}>
          <LazyCarousel items={convertedMovies} handleNext={handleNextMovie} handlePrev={handlePrevMovie} 
            getItemTypeAndUrl={getItemTypeAndUrlMovie} title="Discover Popular Movies" maxPage={10} 
            currentPage={parseInt(page as string) - 1} serverSide={true} />
        </Authenticate>
      </Box>
    </div>
  )
}

export async function getServerSideProps() {
  const settings = await getSettings();

  return { props: { settings } }
}

export default DiscoverMovies;
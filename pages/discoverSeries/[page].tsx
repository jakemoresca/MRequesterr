import type { NextPage } from 'next'
import Head from 'next/head'
import { IMedia } from '../../models/media'
import LazyCarousel from '../../components/carousel'
import Authenticate from '../../components/authenticate'
import { ISettings } from '../../models/settings'
import { getSettings } from '../../services/settings'
import { convertToMedia, usePopularSeries } from '../../services/tmdb'
import { useRouter } from 'next/router'
import { Box } from '@mui/material'

export interface IHomeProps {
  settings: ISettings;
}

const DiscoverSeries: NextPage<IHomeProps> = (props) => {
  const router = useRouter();
  const { page } = router.query;
  const { series, isSeriesLoading } = usePopularSeries(parseInt(page as string));

  const getItemTypeAndUrlSeries = (media: IMedia) => {
    const url = media.images[0].url;
    const itemType = "series";

    return { url, itemType };
  }

  const handleNextSeries = async (page: number) => {
    router.push(`/discoverSeries/${page + 1}`);
  }

  const handlePrevSeries = async (page: number) => {
    router.push(`/discoverSeries/${page + 1}`);
  }

  if(isSeriesLoading)
  {
    return <></>
  }

  const convertedSeries = series?.results.map(convertToMedia) ?? [];

  return (
    <div>
      <Head>
        <title>Discover Movies</title>
      </Head>
      <Box>
        <Authenticate settings={props.settings}>
          <LazyCarousel items={convertedSeries} handleNext={handleNextSeries} handlePrev={handlePrevSeries}
            getItemTypeAndUrl={getItemTypeAndUrlSeries} title="Discover Popular Series" maxPage={10} 
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

export default DiscoverSeries;
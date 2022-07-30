import type { AppProps } from 'next/app'
import { RecoilRoot } from 'recoil';
import { NextPage } from 'next/types';
import { ReactElement, ReactNode } from 'react';
import Layout from '../components/layout';

type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <Layout>{page}</Layout>)

  return (
    <RecoilRoot>
      {getLayout(<Component {...pageProps} />)}
    </RecoilRoot>
  );
}
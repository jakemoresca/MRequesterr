import '../styles/globals.css'
//import 'bootstrap/dist/css/bootstrap.css';
import "bootswatch/dist/darkly/bootstrap.min.css";
import type { AppProps } from 'next/app'
import DefaultLayout from '../components/layout';
import Head from 'next/head';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import { RecoilRoot } from 'recoil';
import { NextPage } from 'next/types';
import { ReactElement, ReactNode } from 'react';
import Layout from '../components/layout';

config.autoAddCss = true

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
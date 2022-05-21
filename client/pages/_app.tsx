import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.css';
import type { AppProps } from 'next/app'
import Layout from './components/layout';
import Head from 'next/head';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'

config.autoAddCss = true

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Layout>
      <Head>
        <title>MRequesterr</title>
      </Head>
      <Component {...pageProps} />
    </Layout>
  );
}
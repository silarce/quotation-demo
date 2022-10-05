import Head from 'next/head'


import type { AppProps } from 'next/app'

import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'


// conponents
import Layer from "components/Layer/Layer"

// css
import '../styles/globals.scss'
import 'antd/dist/antd.css';

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}




function MyApp({ Component, pageProps }: AppPropsWithLayout) {


  const getLayout = Component.getLayout ?? ((page) => page)


  return (

    <>
      <Head>
        <title >三久ERP</title>
      </Head>
      <Layer>
        {getLayout(
          <Component {...pageProps} />
        )}
      </Layer>
    </>
  )
}

export default MyApp




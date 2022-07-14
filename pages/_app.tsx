import Head from 'next/head'


import type { AppProps } from 'next/app'

// conponents
import Layer from "components/Layer/Layer"

// css
import '../styles/globals.css'
import 'antd/dist/antd.css';



function MyApp({ Component, pageProps }: AppProps) {

  return (
    <>
      <Head>
        <title>三久ERP</title>
      </Head>
      <Layer>
        <Component {...pageProps} />
      </Layer>
    </>
  )
}

export default MyApp

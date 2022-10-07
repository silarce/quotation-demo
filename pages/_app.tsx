import { useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'

import Head from 'next/head'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

// api
import { apiLogin, apiLogout } from 'js/api/auth'


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

  // 巢狀layout用的
  const getLayout = Component.getLayout ?? ((page) => page)

  useEffect(() => {
    // 登入
    apiLogin({
      // account: "",
      // password: ""
      account: "admin",
      password: "1qaz#EDC5tgb"
    })
  }, [])



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




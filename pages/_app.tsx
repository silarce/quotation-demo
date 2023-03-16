import { useState, useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'

import Head from 'next/head'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

// conponents
import Layer from "components/Layer/Layer"
import Login from '../components/page/login'

// global gear
import RootLoadingCover from 'components/global/gear/loadingCover/rootLoadingCover'

// api
import { apiLogout, apiAuthMe } from 'js/api/api_auth'

// css
import '../styles/globals.scss'
import 'antd/dist/antd.css';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals'
import "react-big-calendar/lib/css/react-big-calendar.css" // 行事曆 UI用的

// 全域moment語系轉換
import 'moment/locale/zh-tw';





export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}


function MyApp({ Component, pageProps, ...appProps }: AppPropsWithLayout) {
  const [ready, setReady] = useState(false)
  const [isLoged, setIsLoged] = useState(false)
  const router = appProps.router
  // const firstPathname = router.pathname.split("/")[1]

  // 巢狀layout用的
  const getLayout = Component.getLayout ?? ((page) => page)

  useEffect(() => {
    (async () => {
      // 檢查是否已登入
      try {
        await apiAuthMe()
        setIsLoged(true)
      }
      catch { }
      finally {
        setTimeout(() => {
          setReady(true)
        }, 10);
      }
    })()
  }, [])

  // useEffect(() => {
  //   if (isLoged && firstPathname === "login") router.push("/home")
  //   if (!isLoged && ready) router.push("/login")
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isLoged, router.pathname])



  // -----------------------------------------------------------------------
  const reqLogout = async () => {
    try {
      await apiLogout()
      setIsLoged(false)
    }
    catch { myAlert.err({ title: "登出失敗" }) }
  }
  // -----------------------------------------------------------------------
  if (!ready) return null
  // -----------------------------------------------------------------------
  // const noLayoutList = ["login"]
  // if (noLayoutList.includes(firstPathname)) {
  //   return (
  //     <>
  //       <Head>
  //         <title >三久ERP</title>
  //       </Head>
  //       {getLayout(
  //         <Component {...pageProps} setIsLoged={setIsLoged} />
  //       )}
  //     </>
  //   )
  // }
  // ------------------------------------------------------------------
  if (!isLoged)
    return (
      <>
        <Head>
          <title >三久ERP</title>
        </Head>
        <Login setIsLoged={setIsLoged} />
      </>
    )
  // ------------------------------------------------------------------
  return (
    <>
      <Head>
        <title>三久ERP</title>
      </Head>
      <Layer reqLogout={reqLogout}>
        {getLayout(
          <Component {...pageProps} />
        )}
      </Layer>
      {/* 全域loading cover */}
      {/* 只能在這邊呼叫這"一次"，不可以在其他地方使用 */}
      <RootLoadingCover />
    </>
  )
}

export default MyApp


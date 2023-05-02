import { useState, useEffect } from 'react'
import type { ReactElement, ReactNode } from 'react'

import Head from 'next/head'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

// antd
import { ConfigProvider } from 'antd';

// conponents
import Layer from "components/Layer/Layer"
import Login from '../components/page/login'

// global gear
import RootLoadingCover from 'components/global/gear/loadingCover/rootLoadingCover'

// api
import { apiLogout, useApiAuthMe, apiLogin } from 'js/api/api_auth'
import { useApiErpFeaturesMe } from 'js/api/api_erpFeature'

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

  // const router = appProps.router
  // ----------------------------------------------------------------------------
  // 巢狀layout用的
  const getLayout = Component.getLayout ?? ((page) => page)
  // ----------------------------------------------------------------------------
  const { userInfo, setUserInfo, updateUserInfo } = useApiAuthMe()
  const { erpFeature: userErpFeature, updateErpFeature: updateUserErpFeature, } = useApiErpFeaturesMe()

  useEffect(() => {
    (async () => {
      // 檢查是否已登入
      try {
        await updateUserInfo()
        await updateUserErpFeature()
      }
      catch { }
      finally {
        setReady(true)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ----------------------------------------------------------------------------

  const onLogin = async (
    { account, password, }:
      {
        account: string
        password: string
      }
  ) => {
    try {
      await apiLogin({ account, password })
      await updateUserInfo()
      await updateUserErpFeature()
      // setIsLoged(true)
    }
    catch { myAlert.err({ title: "帳號或密碼錯誤" }) }
  }

  // -----------------------------------------------------------------------
  const reqLogout = async () => {
    try {
      await apiLogout()
      setUserInfo(undefined)
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
  if (!userInfo || !userErpFeature)
    return (
      <>
        <Head>
          <title >三久ERP</title>
        </Head>
        <Login onLogin={onLogin} />
      </>
    )
  // ------------------------------------------------------------------
  return (
    <ConfigProvider autoInsertSpaceInButton={false}>
      <Head>
        <title>三久ERP</title>
      </Head>
      <Layer reqLogout={reqLogout} userInfo={userInfo} userErpFeature={userErpFeature}>
        {getLayout(
          <Component {...pageProps}
            userErpFeature={userErpFeature}
          />
        )}
      </Layer>
      {/* 全域loading cover */}
      {/* 只能在這邊呼叫這"一次"，不可以在其他地方使用 */}
      <RootLoadingCover />
    </ConfigProvider>
  )
}

export default MyApp


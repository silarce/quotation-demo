import { useState, useEffect, createContext } from 'react'
import type { ReactElement, ReactNode } from 'react'

import Head from 'next/head'
import type { AppProps } from 'next/app'
import type { NextPage } from 'next'

import { useMediaQuery } from 'react-responsive'

// antd
import { ConfigProvider as AntdConfigProvider } from 'antd';

// conponents
import Layer from "components/Layer/Layer"

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


// =============================================================================
type TappContext = {
  rwd1023: boolean
}

export const AppContext = createContext<TappContext>(null!)


// =============================================================================
function MyApp({ Component, pageProps, ...appProps }: AppPropsWithLayout) {
  const [ready, setReady] = useState(false)

  const rwd1023 = useMediaQuery({ query: '(max-width: 1023px)' })

  const router = appProps.router

  // ----------------------------------------------------------------------------
  const { userInfo, setUserInfo, updateUserInfo } = useApiAuthMe()
  const { erpFeature: userErpFeature, setErpFeature, updateErpFeature: updateUserErpFeature, } = useApiErpFeaturesMe()

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
      setErpFeature(undefined)
    }
    catch { myAlert.err({ title: "登出失敗" }) }
  }
  // -----------------------------------------------------------------------
  const appContextValue = {
    rwd1023
  }
  // -----------------------------------------------------------------------
  if (!ready) return null
  if ((!userInfo || !userErpFeature) && router.route !== "/login") {
    router.push("/login")
    return null
  }
  if ((userInfo && userErpFeature) && router.route === "/login") router.push("/home")
  // ------------------------------------------------------------------

  let getLayout = Component.getLayout

  if (!getLayout) {
    if (!userInfo || !userErpFeature) getLayout = (page) => page
    else {
      getLayout = (page) => {
        return (
          <Layer reqLogout={reqLogout} userInfo={userInfo} userErpFeature={userErpFeature}>
            {page}
          </Layer>
        )
      }
    }
  }

  // ------------------------------------------------------------------
  return (
    <AntdConfigProvider autoInsertSpaceInButton={false}>
      <Head>
        <title>三久ERP</title>
      </Head>
      <AppContext.Provider value={appContextValue}>
        {getLayout(
          <Component {...pageProps}
            userInfo={userInfo}
            userErpFeature={userErpFeature}
            rwd1023={rwd1023}
            onLogin={onLogin}
          />
        )}
      </AppContext.Provider>
      {/* 全域loading cover */}
      {/* 只能在這邊呼叫這"一次"，不可以在其他地方使用 */}
      <RootLoadingCover />
    </AntdConfigProvider>
  )
}

export default MyApp


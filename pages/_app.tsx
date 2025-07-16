import { useState, useEffect, createContext, useCallback } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import _ from 'lodash';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';

import { useMediaQuery } from 'react-responsive';

// antd
import { ConfigProvider as AntdConfigProvider, unstableSetRender } from 'antd';
import locale from 'antd/locale/zh_TW';

// conponents
import Layer from 'components/Layer/Layer';

// global gear
import RootLoadingCover from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { TuserDto, apiLogout, useApiAuthMe, apiLogin } from 'js/api/api_auth';
import { useApiErpFeaturesMe, TerpFeatureDto } from 'js/api/api_erpFeature';

// global state
import { useGlobal_review } from 'hooks/globalState/useGlobal_review';
import { useGlobal_OptionalConfig } from 'hooks/globalState/useGlobal_OptionalConfig';

import { useGlobalErrorCatcher } from 'hooks/useGlobalErrorCatcher';
import { useClearBackup } from 'hooks/useBackup';
import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';
import { useGlobal_environment } from 'hooks/globalState/useGlobal_enviroment';

import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';
import 'dayjs/locale/zh-tw';

// -----------------------------------------------------------------------------------

import ErrorBoundary from 'components/Layer/errorBoundary/errorBoundary01';

// import ErrorBoundary from 'antd/lib/alert/ErrorBoundary';

// -----------------------------------------------------------------------------------
// 全域 css
import '../styles/globals.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // 行事曆 UI用的
import 'slick-carousel/slick/slick.css'; // react-slick
import 'slick-carousel/slick/slick-theme.css'; // react-slick
import 'antd/dist/reset.css';
// -----------------------------------------------------------------------------------
// i18n
import 'hooks/i18n';

// -----------------------------------------------------------------------------------

// React 19 兼容
// https://ant.design/docs/react/v5-for-19-cn

// @ant-design/v5-patch-for-react-19不能用
// 編譯時發生錯誤 (0 , _antd.unstableSetRender) is not a function
// 所以採用在入口執行unstableSetRender的方案
// @ant-design/v5-patch-for-react-19 v1.0.3其實是在做同樣的事
unstableSetRender((node, container) => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  container._reactRoot ||= createRoot(container);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const root = container._reactRoot;
  root.render(node);

  return async () => {
    await new Promise((resolve) => setTimeout(resolve, 0));
    root.unmount();
  };
});

// -----------------------------------------------------------------------------------

dayjs.extend(isBetween);
dayjs.extend(duration);
dayjs.extend(utc);
dayjs.locale('zh-tw');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
locale.DatePicker.lang.yearFormat = (
  date: Dayjs // yearFormat的型別是string，但實際上也可以是callback函式
) => {
  const year = date.subtract(1911, 'year').year();

  return `${year}年`;
};

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
locale.DatePicker.lang.cellYearFormat = (
  date: Dayjs // yearFormat的型別是string，但實際上也可以是callback函式
) => {
  const year = date.subtract(1911, 'year').year();

  return `${year}年`;
};

// -----------------------------------------------------------------------------------

const AppContext = createContext<TappContext>(null!);

// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

type TappContext = {
  rwd1023: boolean;
  rwd1439: boolean;
  userInfo: TuserDto | undefined;
  userGrade: number;
  erpFeature: TerpFeatureDto[] | undefined;
};

type TmyPageProps = {
  isAdmin: boolean;
  userInfo: TuserDto | undefined;
  userGrade: number;
  userErpFeature: TerpFeatureDto[] | undefined;
  rwd1023: boolean;
  rwd1439: boolean;
  onLogin: ({ account, password }: { account: string; password: string }) => Promise<void>;
};

// =============================================================================
function MyApp({ Component, pageProps, ...appProps }: AppPropsWithLayout) {
  const router = appProps.router;

  const rwd1023 = useMediaQuery({ query: '(max-width: 1023px)' });
  const rwd1439 = useMediaQuery({ query: '(max-width: 1439px)' });

  useGlobalErrorCatcher();
  useClearBackup();

  // ----------------------------------------------------------------------------

  const globalState_review = useGlobal_review();
  const optionalConfig = useGlobal_OptionalConfig();

  // ----------------------------------------------------------------------------
  const [ready, setReady] = useState(false);
  const { userInfo, setUserInfo, updateUserInfo } = useApiAuthMe();
  const { erpFeature: userErpFeature, setErpFeature, updateErpFeature: updateUserErpFeature } = useApiErpFeaturesMe();
  const {
    //
    setUserInfo: setUserInfo_global,
    setErpFeature: setErpFeature_global,
  } = useGlobal_userInfo();

  const { isInIframe } = useGlobal_environment();

  // ----------------------------------------------------------------------------

  let userGrade = 0;

  if (userInfo && !userInfo.employee) {
    userGrade = 16; // 代表admin // 實際上grade只到15
  } else if (userInfo && userInfo.employee) {
    userGrade = _.sortBy(userInfo?.employee?.jobs, 'grade')?.reverse()[0]?.grade;
  }

  // ----------------------------------------------------------------------------

  const onLogin = async ({ account, password }: { account: string; password: string }) => {
    try {
      await apiLogin({ account, password });
      await updateUserInfo();
      await updateUserErpFeature();
    } catch {
      myAlert.err({ title: '帳號或密碼錯誤' });
    }
  };

  const reqLogout = async () => {
    try {
      await apiLogout();
      setUserInfo(undefined);
      setErpFeature(undefined);
      setUserInfo_global(undefined);
      setErpFeature_global(undefined);
    } catch {
      myAlert.err({ title: '登出失敗' });
    }
  };

  // -----------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      // 檢查是否已登入
      try {
        await updateUserInfo();
        await updateUserErpFeature();
      } catch {
      } finally {
        setReady(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userInfo) {
      globalState_review.editUserId(userInfo?.employee?.id);
      // globalState_review.update();
      globalState_review.update_2();
    }
  }, [userInfo]);

  useEffect(() => {
    setUserInfo_global(userInfo);
    setErpFeature_global(userErpFeature);
  }, [userInfo, userErpFeature]);

  useEffect(() => {
    optionalConfig.init();
  }, []);

  // -----------------------------------------------------------------------
  const appContextValue = {
    rwd1023,
    rwd1439,
    userInfo,
    userGrade,
    erpFeature: userErpFeature,
  };

  // -----------------------------------------------------------------------
  if (!ready) {
    return null;
  }

  if ((!userInfo || !userErpFeature) && router.route !== '/login' && router.route !== '/errorProcess/429') {
    router.push('/login');

    return null;
  }

  if (userInfo && userErpFeature && router.route === '/login') {
    router.push('/home');
  }
  // ------------------------------------------------------------------

  let getLayout = Component.getLayout;

  if (isInIframe) {
    getLayout = (page) => page;
  } else if (!getLayout) {
    if (!userInfo || !userErpFeature) {
      getLayout = (page) => page;
    } else {
      getLayout = (page) => {
        return (
          <Layer reqLogout={reqLogout} userInfo={userInfo} userErpFeature={userErpFeature}>
            {page}
          </Layer>
        );
      };
    }
  }

  /**
  關於AntdConfigProvider的作用
  根据 Ant Design 设计规范要求，我们会在按钮内(文本按钮和链接按钮除外)只有两个汉字时自动添加空格，如果你不需要这个特性，可以设置 ConfigProvider 的 autoInsertSpaceInButton 为 false。
   */
  // ------------------------------------------------------------------

  const myPageProps: TmyPageProps = {
    isAdmin: userInfo?.account === 'admin3',
    userInfo: userInfo,
    userGrade: userGrade,
    userErpFeature: userErpFeature,
    rwd1023: rwd1023,
    rwd1439: rwd1439,
    onLogin: onLogin,
  };

  // ------------------------------------------------------------------
  return (
    <AntdConfigProvider button={{ autoInsertSpace: false }} locale={locale}>
      <Head>
        <title>三久ERP</title>
      </Head>

      <ErrorBoundary>
        <AppContext.Provider value={appContextValue}>
          {getLayout(
            <ErrorBoundary pathname={router.pathname}>
              <Component
                {...pageProps}
                {...myPageProps}
                // isAdmin={userInfo?.account === 'admin3'}
                // userInfo={userInfo}
                // userGrade={userGrade}
                // userErpFeature={userErpFeature}
                // rwd1023={rwd1023}
                // rwd1439={rwd1439}
                // onLogin={onLogin}
              />
            </ErrorBoundary>
          )}
        </AppContext.Provider>
      </ErrorBoundary>
      {/* 全域loading cover */}
      {/* 只能在這邊呼叫這"一次"，不可以在其他地方使用 */}
      <RootLoadingCover />
    </AntdConfigProvider>
  );
}

// =======================================================================

declare global {
  interface ObjectConstructor {
    clearAndAssign<T extends Record<string, any>>(target: T, source: T): void;
  }
}

// 清空target物件並將source物件的內容填入，target與source的型別必須相同
// 不會改變 target 物件的參考
// 注意，填入不是深拷貝
Object.clearAndAssign = function <T extends Record<string, any>>(target: T, source: T): void {
  // 清空 target 物件的屬性
  Object.keys(target).forEach((key) => delete target[key]);
  // 將 source 的屬性複製到 target 物件
  Object.assign(target, source);
};

// =======================================================================

export default MyApp;

export type { NextPageWithLayout, TappContext, TmyPageProps };
export { AppContext };

import { useState, useEffect, createContext } from 'react';
import type { ReactElement, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';

// antd
import { ConfigProvider as AntdConfigProvider, unstableSetRender } from 'antd';
import locale from 'antd/locale/zh_TW';

// conponents
import Layer from 'components/Layer/Layer';
import ErrorBoundary from 'components/Layer/errorBoundary/errorBoundary01';

// global gear
import RootLoadingCover from 'components/global/gear/loadingCover/rootLoadingCover';

// api
import { TuserDto } from 'js/api/api_auth';
import { TerpFeatureDto } from 'js/api/api_erpFeature';

// global state
import { useGlobal_review } from 'hooks/globalState/useGlobal_review';
import { useGlobal_OptionalConfig } from 'hooks/globalState/useGlobal_OptionalConfig';
// import { useGlobalErrorCatcher } from 'hooks/useGlobalErrorCatcher';
import { useClearBackup } from 'hooks/useBackup';
import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';
import { useWindow } from 'hooks/globalState/useWindow';

//
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import duration from 'dayjs/plugin/duration';
import utc from 'dayjs/plugin/utc';

// -----------------------------------------------------------------------------------

import 'dayjs/locale/zh-tw';
import 'hooks/i18n';

// -----------------------------------------------------------------------------------
// 全域 css
import '../styles/globals.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // 行事曆 UI用的
import 'slick-carousel/slick/slick.css'; // react-slick
import 'slick-carousel/slick/slick-theme.css'; // react-slick
import 'antd/dist/reset.css';

//新增的
import '../styles/tailwind.css';
import '../styles/antd.scss';

// =============================================================================

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

type TmyPageProps = {
  isAdmin: boolean;
  userInfo: TuserDto | undefined | null;
  userGrade: number;
  userErpFeature: TerpFeatureDto[] | undefined | null;
};

// =============================================================================

// MARK: START
function MyApp({ Component, pageProps, ...appProps }: AppPropsWithLayout) {
  const router = appProps.router;

  // 這個東西在產品環境沒用，因為程式都被編譯過了，即使有錯誤log也難以解讀
  // useGlobalErrorCatcher();

  // 檢查是否有備份的狀態過期並清除
  useClearBackup();

  // ----------------------------------------------------------------------------

  const globalState_review = useGlobal_review();
  const optionalConfig = useGlobal_OptionalConfig();
  const { isInIframe } = useWindow();

  // ----------------------------------------------------------------------------
  const [ready, setReady] = useState(false);

  const { userInfo, userErpFeature, isAdmin, userGrade, update: update_userInfo } = useGlobal_userInfo();

  // ----------------------------------------------------------------------------

  useEffect(() => {
    (async () => {
      // 檢查是否已登入
      await update_userInfo();
      setReady(true);
    })();
  }, []);

  useEffect(() => {
    if (userInfo) {
      globalState_review.editUserId(userInfo?.employee?.id);
      // globalState_review.update();
      globalState_review.update_2();
    }
  }, [userInfo]);

  useEffect(() => {
    optionalConfig.init();
  }, []);

  // -----------------------------------------------------------------------
  const appContextValue = {
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

  const getLayout = (() => {
    let getLayout = Component.getLayout;

    if (getLayout) {
      return getLayout;
    }

    if (!userInfo || !userErpFeature || isInIframe) {
      getLayout = (page) => page;
    } else {
      getLayout = (page) => {
        return <Layer>{page}</Layer>;
      };
    }

    return getLayout;
  })();

  // ------------------------------------------------------------------

  const myPageProps: TmyPageProps = {
    isAdmin: isAdmin,
    userInfo: userInfo,
    userGrade: userGrade,
    userErpFeature: userErpFeature,
  };

  // ------------------------------------------------------------------

  // MARK: RENDER

  return (
    <AntdConfigProvider
      // 根据 Ant Design 设计规范要求，我们会在按钮内(文本按钮和链接按钮除外)只有两个汉字时自动添加空格，
      // 如果你不需要这个特性，可以设置 ConfigProvider 的 autoInsertSpaceInButton 为 false。
      button={{ autoInsertSpace: false }}
      locale={locale}
    >
      <Head>
        <title>三久ERP</title>
      </Head>

      <ErrorBoundary>
        {getLayout(
          <ErrorBoundary pathname={router.pathname}>
            <Component {...pageProps} {...myPageProps} />
          </ErrorBoundary>
        )}
      </ErrorBoundary>
      {/* 全域loading cover */}
      {/* 只能在這邊呼叫這"一次"，不可以在其他地方使用 */}
      <RootLoadingCover />
    </AntdConfigProvider>
  );
}

// MARK:END

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// MARK:設定

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

// ----------------------------------------------------------------------------

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

export type { NextPageWithLayout, TmyPageProps };

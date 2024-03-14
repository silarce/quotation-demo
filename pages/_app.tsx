import { useState, useEffect, createContext, useCallback } from 'react';
import type { ReactElement, ReactNode } from 'react';
import _ from 'lodash';

import Head from 'next/head';
import type { AppProps } from 'next/app';
import type { NextPage } from 'next';

import { useMediaQuery } from 'react-responsive';

// antd
import { ConfigProvider as AntdConfigProvider } from 'antd';

// conponents
import Layer from 'components/Layer/Layer';

// global gear
import RootLoadingCover from 'components/global/gear/loadingCover/rootLoadingCover';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import MyButton_v2 from 'components/global/gear/button/myButton_v2';

// api
import { TuserDto, apiLogout, useApiAuthMe, apiLogin } from 'js/api/api_auth';
import { useApiErpFeaturesMe, TerpFeatureDto } from 'js/api/api_erpFeature';

// css
import 'antd/dist/antd.css';
import '../styles/globals.scss';
import 'react-big-calendar/lib/css/react-big-calendar.css'; // 行事曆 UI用的
import 'slick-carousel/slick/slick.css'; // react-slick
import 'slick-carousel/slick/slick-theme.css'; // react-slick

// 全域moment語系轉換
import 'moment/locale/zh-tw';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

// =============================================================================
type TappContext = {
  rwd1023: boolean;
  rwd1439: boolean;
  userInfo: TuserDto | undefined;
  userGrade: number;
  erpFeature: TerpFeatureDto[] | undefined;
};

export const AppContext = createContext<TappContext>(null!);

// =============================================================================
function MyApp({ Component, pageProps, ...appProps }: AppPropsWithLayout) {
  const router = appProps.router;
  const [ready, setReady] = useState(false);
  const rwd1023 = useMediaQuery({ query: '(max-width: 1023px)' });
  const rwd1439 = useMediaQuery({ query: '(max-width: 1439px)' });

  const { userInfo, setUserInfo, updateUserInfo } = useApiAuthMe();
  const { erpFeature: userErpFeature, setErpFeature, updateErpFeature: updateUserErpFeature } = useApiErpFeaturesMe();

  useGlobalErrorCatcher();

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
      // setIsLoged(true)
    } catch {
      myAlert.err({ title: '帳號或密碼錯誤' });
    }
  };

  // -----------------------------------------------------------------------
  const reqLogout = async () => {
    try {
      await apiLogout();
      setUserInfo(undefined);
      setErpFeature(undefined);
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

  if ((!userInfo || !userErpFeature) && router.route !== '/login') {
    router.push('/login');

    return null;
  }

  if (userInfo && userErpFeature && router.route === '/login') {
    router.push('/home');
  }
  // ------------------------------------------------------------------

  let getLayout = Component.getLayout;

  if (!getLayout) {
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
  return (
    <AntdConfigProvider autoInsertSpaceInButton={false}>
      <Head>
        <title>三久ERP</title>
      </Head>
      <AppContext.Provider value={appContextValue}>
        {getLayout(
          <Component
            {...pageProps}
            isAdmin={userInfo?.account === 'admin3'}
            userInfo={userInfo}
            userGrade={userGrade}
            userErpFeature={userErpFeature}
            rwd1023={rwd1023}
            rwd1439={rwd1439}
            onLogin={onLogin}
          />
        )}
      </AppContext.Provider>
      {/* 全域loading cover */}
      {/* 只能在這邊呼叫這"一次"，不可以在其他地方使用 */}
      <RootLoadingCover />
    </AntdConfigProvider>
  );
}

export default MyApp;

// =============================================================

const useGlobalErrorCatcher = () => {
  const erroEventHandler = useCallback((event: ErrorEvent) => {
    // const errorJson = JSON.stringify(event.error, Object.getOwnPropertyNames(event.error));

    // event幾乎都是不可枚舉property，所以要手動把需要的東西取出來
    const obj = {
      colno: event.colno,
      lineno: event.lineno,
      filename: event.filename,
      // currentTarget: event.currentTarget, // 全都是不可枚舉property，無法取得
      // target: event.target, // 全都是不可枚舉property，無法取得
      error: {
        message: event.error.message,
        stack: event.error.stack,
      },
    };

    const onBtnClick = async () => {
      try {
        const objJson = JSON.stringify(obj);

        await navigator.clipboard.writeText(objJson);
      } catch (error) {
        myAlert.err({ title: '複製錯誤資訊失敗' });
      }
    };

    myAlert.err({
      title: '發生非預期錯誤',
      props: {
        okText: '關閉',
        maskClosable: false,
        content: <Foo onBtnClick={onBtnClick} />,
        closable: true,
      },
    });
  }, []);

  useEffect(() => {
    window.removeEventListener('error', erroEventHandler);
    window.addEventListener('error', erroEventHandler);
  }, []);
};

const Foo = ({ onBtnClick }: { onBtnClick?: () => void }) => {
  return (
    <div>
      <p className="whitespace-pre-wrap text-left">
        {`
請依以下步驟操作
1. 點擊"複製錯誤訊息"按鈕
2. 回到電腦桌面，右鍵新增文字文件
3. 右鍵貼上並儲存
4. 請關閉這個提示，然後將整個畫面截圖
5. 將截圖與文字文件一起傳給開發人員
        `}
      </p>
      <p>感謝您的配合</p>
      <br />
      <MyButton_v2 onClick={onBtnClick} label="複製錯誤訊息" />
      <br />
      <br />
    </div>
  );
};

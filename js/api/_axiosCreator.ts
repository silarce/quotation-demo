import axios, { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TnetCoreapiBody } from './api_netCore/_schemas';

// =================================================================================
const axi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

const axi2 = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_NETCORE_URL,

  // .netCore後端沒有登入的行為，沒有取得cookie，自然也不用帶cookie。帶了反而CORS
  // withCredentials: true,
});

export const domain = process.env.NEXT_PUBLIC_API_BASE_URL;

// =================================================================================
axi.interceptors.request.use(
  (config) => {
    // req攔截器
    return config;
  },
  (err) => {
    // req錯誤攔截器
    return Promise.reject(err);
  }
);

axi.interceptors.response.use(
  (res) => {
    // res攔截器
    return res;
  },
  (err) => {
    const url = err.config?.url ?? '';
    const ignore401 = ['/auth/login', '/auth/me'];

    if (err.response) {
      switch (err.response.status) {
        case 401:
          if (ignore401.includes(url)) {
            break;
          }

          myAlert.warning({
            title: '系統提醒',
            content: '登入過期，請重新登入',
            props: {
              onOk: () => {
                window.location.reload();
              },
              onCancel: () => {
                window.location.reload();
              },
            },
          });
          console.log('401，沒有權限');
          break;

        case 404:
          console.log('404錯誤');
          break;

        case 429:
          // myAlert.warning({ title: '短時間內呼叫太多次請求', content: '請兩分鐘後再次嘗試' });

          const pathname = window.location.pathname;
          const origin = window.location.origin;

          if (pathname !== '/errorProcess/429') {
            window.location.href = `${origin}/errorProcess/429`;
          }

          break;

        case 500:
          console.log('500錯誤');
          break;
        default:
          console.log(err.message);
      }
    }

    if (!window.navigator.onLine) {
      alert('網路出了問題，請檢查網路後重新整理網頁');
    }

    return Promise.reject(err);
  }
);

// =================================================================================

axi2.interceptors.request.use(
  (config) => {
    // req攔截器

    const { method, data, params } = config;

    if (method === 'post' || method === 'patch') {
      const body: TnetCoreapiBody = {
        TypeName: 'ERP',
        ServiceName: 'AccountService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(data),
      };
      config.data = body;
    }

    if (method === 'get') {
      const input = {
        TypeName: 'ERP',
        ServiceName: 'AccountService',
        FunctionName: 'no',
        FilterConditions: JSON.stringify(params || {}),
      };
      config.params = { input: JSON.stringify(input) };
    }

    return config;
  },
  (err) => {
    // req錯誤攔截器
    return Promise.reject(err);
  }
);

axi2.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const { status } = err.response ?? {};

    switch (status) {
      case 401:
        myAlert.warning({
          title: '系統提醒',
          content: '登入過期，請重新登入',
          props: {
            onOk: () => {
              window.location.reload();
            },
            onCancel: () => {
              window.location.reload();
            },
          },
        });
        console.log('401，沒有權限');
        break;

      default:
        console.log(err.message);
    }

    return Promise.reject(err);
  }
);

// =================================================================================
export { axi, axi2 };
export type { AxiosError };

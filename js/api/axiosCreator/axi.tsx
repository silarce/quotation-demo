import axios, { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

let is429ing = false;
let is401ing = false;

// ====================================

const axi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  withCredentials: true,
});

// ====================================
axi.interceptors.request.use(
  (config) => {
    const { url } = config;
    const isUrlAuthMe = url === '/auth/me';

    // req攔截器
    if (is429ing && !isUrlAuthMe) {
      return Promise.reject();
    }

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
    const url = err.config?.url;
    const ignore401 = ['/auth/login', '/auth/me', '/erp-features/me'];

    if (err.response) {
      switch (err.response.status) {
        case 401:
          if (ignore401.includes(url)) {
            break;
          }

          if (is401ing) {
            break;
          }

          myAlert.warning({
            title: '登入過期，請重新登入',
            props: {
              onOk: () => {
                window.location.reload();
              },
              onCancel: () => {
                window.location.reload();
              },
            },
          });

          is401ing = true;

          console.log('401，沒有權限');
          break;

        case 404:
          console.log('404錯誤');
          break;

        case 429:
          // myAlert.warning({ title: '短時間內呼叫太多次請求', content: '請兩分鐘後再次嘗試' });

          // const pathname = window.location.pathname;
          // const origin = window.location.origin;

          // if (pathname !== '/errorProcess/429') {
          //   window.location.href = `${origin}/errorProcess/429`;
          // }

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

export default axi;

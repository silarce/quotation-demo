import axios from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TnetCoreApiBody } from 'js/api/api_netCore/schemas';

let is401ing = false;

// =======================================================

const axi_netCore = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_NETCORE_URL,

  // .netCore後端沒有登入的行為，沒有取得cookie，自然也不用帶cookie。帶了反而CORS
  // withCredentials: true,
});

// =======================================================

axi_netCore.interceptors.request.use(
  (config) => {
    // req攔截器

    const { method, data, params } = config;

    if (method === 'post' || method === 'patch') {
      const body: TnetCoreApiBody = {
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

axi_netCore.interceptors.response.use(
  (res) => {
    return res;
  },
  (err) => {
    const { status } = err.response ?? {};

    switch (status) {
      case 401:
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

      default:
        console.log(err.message);
    }

    return Promise.reject(err);
  }
);

export default axi_netCore;

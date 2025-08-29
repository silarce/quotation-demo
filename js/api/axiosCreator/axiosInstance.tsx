import axios from 'axios';
import { message } from 'antd';

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_SYS_URL,
  timeout: 1500,
  headers: {
    'Content-Type': 'application/json',
  },
  // 只攔截 500 以上的錯誤
  validateStatus: (status) => status < 500,
});

// === Response 攔截器 ===
instance.interceptors.response.use(
  (response) => {
    const { status, data } = response;

    if (data === null || data === undefined) {
      message.error('API 回傳空資料');

      return Promise.reject('API 回傳空資料');
    }

    if (status >= 400 && status < 500) {
      const errorMsg =
        data?.title || data?.errors?.[Object.keys(data?.errors || {})[0]]?.[0] || data?.returnMessage || '請求錯誤';

      message.error('API錯誤: ' + errorMsg);

      return Promise.reject(errorMsg);
    }

    if (data && data.returnCode !== undefined && data.returnCode !== 0) {
      const errorMsg = data.returnMessage || '操作失敗';
      message.error(errorMsg);

      return Promise.reject(errorMsg);
    }

    return response;
  },
  (error) => {
    let errorMsg = '伺服器錯誤，請稍後再試';

    if (error.message === 'Network Error') {
      errorMsg = '無法連線到伺服器，請確認網路或 API 是否可用';
    } else if (error.code === 'ECONNABORTED') {
      errorMsg = '請求逾時，請稍後再試';
    } else if (error.response?.data) {
      const resData = error.response.data;
      errorMsg =
        resData?.title ||
        resData?.errors?.[Object.keys(resData?.errors || {})[0]]?.[0] ||
        resData?.returnMessage ||
        errorMsg;
    }

    message.error(errorMsg);

    return Promise.reject(errorMsg);
  }
);

// === Request 攔截器 (自動帶 Token) ===
instance.interceptors.request.use((config) => {
  config.headers = {
    ...(config.headers as any),
    ...getAuthHeader(),
  };

  return config;
});

export default instance;

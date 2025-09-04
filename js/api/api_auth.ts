import { axi, axi_monkey } from './axiosCreator';

import axios from 'js/api/axiosCreator/axiosInstance';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;

// type
import { TuserDto, TuserDto_login, LoginInfo, LoginInfoResponse } from './dtoTypes';
export type { TuserDto };

// 登入
export const apiLogin = (body: { account: string; password: string }) => {
  const api = '/auth/login';

  return axi
    .post(api, body)
    .then(({ data }) => {
      return data as TuserDto_login;
    })
    .catch((err) => Promise.reject(err));
};

// 登出
export const apiLogout = () => {
  const api = '/auth/logout';

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 取得使用者資料
export const apiAuthMe = () => {
  const api = '/auth/me';

  //如果是admin帳號，不會有employee
  return axi
    .get(api)
    .then(({ data }) => data as TuserDto)
    .catch((err) => Promise.reject(err));
};

//MARK:Get JWT

const STORAGE_KEYS = {
  sessionId: 'sessionId',
  accessToken: 'access_token',
  refreshToken: 'refresh_token',
  tokenType: 'token_type',
  tokenExpiresAt: 'token_expires_at',
} as const;

export const apiGetLoginInfoBySessionId = async (sessionId: string): Promise<LoginInfo | null> => {
  try {
    const url = `${BASE_URL}/api/v1/logininfo/${encodeURIComponent(sessionId)}`;
    const res = await axios.get<LoginInfoResponse>(url);

    if (!res || !res.data) {
      console.warn('未取得 response');

      return null;
    }

    if (res.data?.returnCode !== 0 || !res.data?.data?.auth_info?.access_token) {
      console.warn(res.data?.returnMessage ?? '取得登入資訊失敗');

      return null;
    }

    return res.data.data.auth_info;
  } catch (err) {
    console.error('呼叫 logininfo API 失敗:', err);

    return null; // 出錯時也回傳 null，不 throw
  }
};

export const persistSessionId = (sessionId: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  localStorage.setItem(STORAGE_KEYS.sessionId, sessionId);
  axi_monkey.defaults.headers.common['Sessionid'] = sessionId;
};

export const persistTokens = (auth: LoginInfo) => {
  if (typeof window === 'undefined') {
    return;
  }

  const expiresAt = Date.now() + auth.expires_in * 1000;

  localStorage.setItem(STORAGE_KEYS.accessToken, auth.access_token);
  localStorage.setItem(STORAGE_KEYS.refreshToken, auth.refresh_token);
  localStorage.setItem(STORAGE_KEYS.tokenType, auth.token_type || 'Bearer');
  localStorage.setItem(STORAGE_KEYS.tokenExpiresAt, String(expiresAt));

  // 設定預設 Authorization
  const authHeader = `${auth.token_type || 'Bearer'} ${auth.access_token}`;
  axi.defaults.headers.common['Authorization'] = authHeader;
  axi_monkey.defaults.headers.common['Authorization'] = authHeader;
};
//===========================================================================

// 取得使用者權限
export const apiAuthPermissions = () => {
  const api = '/auth/permissions';

  return axi
    .get(api)
    .then(({ data }) => data as TuserDto)
    .catch((err) => Promise.reject(err));
};

/**  變更密碼 */
export const apiAuthPassword = (body: { oldPassword: string; newPassword: string }) => {
  const api = '/auth/password';

  return axi
    .patch(api, body)
    .then(({ data }) => data as TuserDto)
    .catch((err) => Promise.reject(err));
};

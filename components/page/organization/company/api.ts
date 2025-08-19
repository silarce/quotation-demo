const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import axios from 'axios';

import Cookies from 'js-cookie';
const token = Cookies.get('token');

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

type DeptQueryParams = {
  keyword?: string; // 關鍵字
  pageIndex?: number; // 分頁索引（預設 1）
  pageSize?: number; // 分頁大小（預設 10）
};

export const getCompanyList = async ({ keyword = '', pageIndex = 1, pageSize = 10 }: DeptQueryParams = {}) => {
  const params = new URLSearchParams({
    keyword,
    pageIndex: String(pageIndex),
    pageSize: String(pageSize),
  });

  const url = `${BASE_URL}/api/org/company/Query?${params.toString()}`;
  const res = await axios.get(url, {
    headers: {
      // GET 不需要 Content-Type
      Accept: 'application/json',
      ...getAuthHeader(),
    },
  });

  return res.data;
};

export const deleteCompany = async (com_id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/org/company/${com_id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.return_code === 0) {
      console.log('公司刪除成功');
    } else {
      console.error('刪除失敗:', response.data.return_message);
    }
  } catch (error) {
    console.error('發生錯誤:', error);
  }
};

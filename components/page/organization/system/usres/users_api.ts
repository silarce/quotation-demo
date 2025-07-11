const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;

import axios from 'axios';

import Cookies from 'js-cookie';
const token = Cookies.get('token');

export interface RawUserItem {
  user_id: string;
  user_name: string;
  user_email: string;
  is_active: boolean;
  is_invalid: boolean;
}

//取得使用者列表
export const getUserList = async (keyword = '') => {
  const res = await axios.get(`${BASE_URL}/api/v2/sys/user`, {
    params: { fe_search_keyword: keyword },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (res.data.return_code !== 0) {
    console.log('取得使用者資料失敗');
  }

  return res.data.data as RawUserItem[];
};

//刪除使用者
export const deleteUser = async (user_id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/api/v2/sys/user/${user_id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('刪除失敗:', error);
  }
};

//取得可綁定員工的資料清單
export const getBindableEmployeeList = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v2/sys/user/querybindableemplist`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error('刪除失敗:', error);
  }
};

export const bindUserToEmployee = async (user_id: string, emp_id: string) => {
  const res = await axios.post(`${BASE_URL}/api/v2/sys/user/bind`, {
    user_id,
    emp_id,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import axios from 'axios';

import Cookies from 'js-cookie';
const token = Cookies.get('token');

export const getCompanyList = async (fe_search: string) => {
  const res = await axios.get(`${BASE_URL}/org/company`, {
    params: { fe_search },
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const deleteCompany = async (com_id: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/org/company/${com_id}`, {
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

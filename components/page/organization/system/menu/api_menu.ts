const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import axios from 'js/api/axiosCreator/axiosInstance';

export const getMenuList = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/sys/menu`);

  return res.data;
};

export const getMenuPaths = async () => {
  const res = await axios.get(`${BASE_URL}/api/v1/sys/menu/selectmenupath`);

  return res;
};

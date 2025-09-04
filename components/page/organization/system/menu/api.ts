const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import { useNavStore } from 'hooks/globalState/useGlobal_navStore';
import { MenuItem, NestedMenuItem } from './type';
import axios from 'js/api/axiosCreator/axiosInstance';

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

// 取得 Header Nav (第一層)
export const fetchHeaderNav = async () => {
  const res = await axios.get(`${BASE_URL}/api/v2/home/headerbar/loadfirstlevelmenu`, {
    headers: getAuthHeader(),
  });
  const data = res.data.data ?? [];
  useNavStore.getState().setHeaderNav(data);

  return data;
};

// 取得 Side Nav (第二三層)
export const fetchSideNav = async (parent_menu_id: string): Promise<NestedMenuItem[]> => {
  const res = await axios.get(`${BASE_URL}/home/menu/loadMenu`, {
    params: { parent_menu_id },
    headers: getAuthHeader(),
  });

  const flatData: MenuItem[] = res.data.data ?? [];

  // 轉換成巢狀結構
  const level2Items = flatData.filter((d: MenuItem) => d.level === 2);
  const level3Items = flatData.filter((d: MenuItem) => d.level === 3);

  const nested: NestedMenuItem[] = level2Items.map((lv2) => ({
    ...lv2,
    children: level3Items.filter((lv3) => lv3.parent_menu_id === lv2.menu_id),
  }));

  useNavStore.getState().setSideNav(nested);

  return nested;
};

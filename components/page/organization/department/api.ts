const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import { CreateDepFormState } from './type';
import axios from 'js/api/axiosCreator/axiosInstance';

// === 查詢部門 ===
export async function getDepartment(keyword: string = '', pageIndex: number = 1, pageSize: number = 10) {
  try {
    const res = await axios.get(`${BASE_URL}/api/org/department/Query`, {
      params: { keyword, pageIndex, pageSize },
    });

    if (!res) {
      return { data: [], totalCount: 0 };
    }

    return res.data;
  } catch (error) {
    console.error('查詢部門失敗:', error);

    return { data: [], totalCount: 0 };
  }
}

// === 新增部門 ===
export const createDepartment = async (payload: CreateDepFormState) => {
  try {
    const res = await axios.post(`${BASE_URL}/api/org/department`, payload);

    if (!res || res.data.returnCode !== 0) {
      return null;
    }

    return res.data;
  } catch {
    return null;
  }
};

// === 更新部門 ===
export const updateDepartment = async (dep_id: string, payload: any) => {
  try {
    const res = await axios.put(`${BASE_URL}/api/org/department/${dep_id}`, payload);

    if (!res || res.data.returnCode !== 0) {
      return null;
    }

    return res.data;
  } catch (err) {
    console.error('更新部門失敗:', err);

    return null;
  }
};

// === 刪除部門 ===
export async function deleteDepartment(depId: string) {
  try {
    const res = await axios.delete(`${BASE_URL}/api/org/department/${depId}`);

    if (!res || res.data.returnCode !== 0) {
      return null;
    }

    return res.data;
  } catch (err) {
    console.error('刪除部門失敗:', err);

    return null;
  }
}

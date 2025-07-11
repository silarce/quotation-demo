const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import axios from 'axios';
import Cookies from 'js-cookie';
const token = Cookies.get('token');

interface CreateDepartmentPayload {
  dep_code: string;
  parent_id?: string; // 若無父層，就傳固定值 "00000000-0000-0000-0000-000000000000"
  dep_ch_name: string;
  dep_en_name: string;
  description: string;
}

export const getDepartment = async (fe_search = '') => {
  const res = await axios.get(`${BASE_URL}/org/department`, {
    params: { fe_search },
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const createDepartment = async (payload: CreateDepartmentPayload) => {
  const res = await axios.post(`${BASE_URL}/org/department`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateDepartment = async (dep_id: string, payload: any) => {
  const res = await axios.put(`${BASE_URL}/org/department/${dep_id}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

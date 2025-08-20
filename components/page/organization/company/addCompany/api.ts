const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import Cookies from 'js-cookie';
const token = Cookies.get('token');

import axios from 'axios';
import { CompanyData } from './type';

export const createCompany = async (companyData: CompanyData) => {
  const response = await axios.post(`${BASE_URL}/api/org/company`, companyData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const getCompanyDetail = async (com_id: string) => {
  const res = await axios.get(`${BASE_URL}/api/org/company/${com_id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const updateCompany = async (com_id: string, companyData: CompanyData) => {
  const res = await axios.put(`${BASE_URL}/api/org/company/${com_id}`, companyData, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return res.data;
};

export const uploadCompanyLogo = async (com_id: string, file: File) => {
  const formData = new FormData();
  formData.append('com_id', com_id);
  formData.append('fe_logo_file', file);

  const res = await axios.post(`${BASE_URL}/api/org/company/Logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

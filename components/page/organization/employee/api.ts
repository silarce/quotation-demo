import axios from 'axios';
import { CreateEmployeePayload } from './type';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import Cookies from 'js-cookie';
import { headers } from 'next/headers';
const token = Cookies.get('token');

interface GetEmployeeParams {
  fe_search?: string; // 可選，查詢關鍵字
  dep_id?: string; // 可選，部門 ID
}

export const getEmployeeList = async ({ fe_search, dep_id }: GetEmployeeParams = {}) => {
  try {
    const response = await axios.get(`http://mspc1140427:8080/api/org/employee`, {
      params: {
        ...(fe_search ? { fe_search } : {}),
        ...(dep_id ? { dep_id } : {}),
      },
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.data.return_code !== 0) {
      console.error('取得員工資料失敗:', response.data.return_message);

      return [];
    }

    return response.data.data;
  } catch (error) {
    console.error('API 錯誤:', error);
    // 如果 API 錯誤，回傳空陣列

    return [];
  }
};

export const getAllEmployeeSelectOptions = async () => {
  const params = new URLSearchParams();

  // target elements
  const targets = [
    'gender_pcode',
    'marital_pcode',
    'education_pcode',
    'residence_county_pcode',
    'residence_district_pcode',
    'mailing_county_pcode',
    'mailing_district_pcode',
    'military_service_type_pcode',
    'emergency_contact_relationship',
    'department',
    'job_grade_id',
  ];

  const modules = ['ORG', 'ORG', 'ORG', 'MDM', 'MDM', 'MDM', 'MDM', 'MDM', 'ORG', 'ORG', 'ORG'];

  const codes = [
    'GENDER_CODE',
    'MARITAL_CODE',
    'EDUCATION_CODE',
    'COUNTY_CODE',
    'DISTRICT_CODE',
    'COUNTY_CODE',
    'DISTRICT_CODE',
    'MILITARY_SERVICE_TYPE_CODE',
    'EMERGENCY_CONTACT_RELATIONSHIP',
    'DEPARTMENT',
    'JOB_GRADE_ID',
  ];

  const conditions = ['', '', '', '', '65000', '', '65000', '', '', '', ''];

  // append all to URLSearchParams
  targets.forEach((v) => params.append('fe_target_element', v));
  modules.forEach((v) => params.append('fe_module_code', v));
  codes.forEach((v) => params.append('fe_param_code', v));
  conditions.forEach((v) => params.append('fe_param_value_condition', v));

  const response = await axios.get(`${BASE_URL}/org/employee/QueryDataSource`, {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.data;
};

export const createEmployee = async (data: CreateEmployeePayload) => {
  try {
    const response = await axios.post(`${BASE_URL}/api/org/employee`, {
      data,
      headers: { Authorization: `Bearer ${token}` },
    });

    return response.data;
  } catch (error: any) {
    console.error('新增員工失敗:', error);

    throw error;
  }
};

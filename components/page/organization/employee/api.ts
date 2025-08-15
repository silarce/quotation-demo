import axios from 'axios';
import { CreateEmployeePayload } from './type';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import Cookies from 'js-cookie';
const token = Cookies.get('token');

export interface GetEmployeeParams {
  keyword?: string;
  departmentId?: string;
  pageIndex?: number;
  pageSize?: number;
}

export interface EmployeeItem {
  empId: string;
  empCode?: string;
  userId?: string;
  idNo?: string;
  empChName?: string;
  empEnName?: string;
  nationalityPcode?: string;
  nationalityPcodeText?: string;
  defaultShiftName?: string;
  workTypePcode?: string;
  workTypePcodeText?: string;
  workLocationPcode?: string;
  workLocationPcodeText?: string;
  salaryAccountPcode?: string;
  salaryAccountPcodeText?: string;
  startDate?: string;
  department?: string;
  departmentText?: string;
  jobGradeId?: string;
  jobGradeIdText?: string;
  seniority?: string | number;
  familyRelativeCount?: number;
  basicSalary?: string | number;
  laborRetirePercentage?: number;
}

export interface QueryEmployeesAPIResp {
  returnCode: number; // 0: 成功
  returnMessage: string;
  beginTimestamp: string;
  endTimestamp: string;
  elapsedMilliseconds: number;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  data: EmployeeItem[];
}

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

export const getEmployeeList = async ({
  keyword = '',
  departmentId = '',
  pageIndex = 1,
  pageSize = 10,
}: GetEmployeeParams = {}): Promise<QueryEmployeesAPIResp> => {
  try {
    const res = await axios.get<QueryEmployeesAPIResp>(`${BASE_URL}/api/org/employee/query`, {
      params: { keyword, departmentId, pageIndex, pageSize },
      headers: {
        ...getAuthHeader(), // ✅ 沒 token 就不送，避免 "Bearer undefined"
      },
    });

    return res.data;
  } catch (e) {
    return {
      returnCode: 1,
      returnMessage: 'Network or server error',
      beginTimestamp: '',
      endTimestamp: '',
      elapsedMilliseconds: 0,
      totalCount: 0,
      pageIndex,
      pageSize,
      data: [],
    };
  }
};

type AllOpts = {
  countyCode?: string; // 給 DistrictPcode 用
  departmentId?: string; // 有帶才查職稱
};

export async function getAllEmployeeSelectOptions({ countyCode = '', departmentId }: AllOpts = {}) {
  const targets: string[] = [
    'genderPcode',
    'nationalityPcode',
    'CountyPcode',
    'DistrictPcode',
    'militaryServiceTypePcode',
    'emergencyContactRelationshipPcode',
    'workTypePcode',
    'workLocationPcode',
    'departmentId',
    // 'jobId',  // 先別加，等下視情況 push
    'shiftId',
    'salaryAccountPcode',
    'laborInsuranceSettingId',
    'healthInsuranceSettingId',
  ];
  const modules: string[] = [
    'MDM',
    'MDM',
    'MDM',
    'MDM',
    'HRM',
    'HRM',
    'HRM',
    'HRM',
    'HRM',
    // 'HRM', // jobId
    'HRM',
    'SAL',
    'HRM',
    'HRM',
  ];
  const codes: string[] = [
    'GENDER_CODE',
    'NATIONALITY_CODE',
    'COUNTY_CODE',
    'DISTRICT_CODE',
    'MILITARY_SERVICE_TYPE_CODE',
    'EMERGENCY_CONTACT_RELATIONSHIP_CODE',
    'WORK_TYPE_CODE',
    'WORK_LOCATION_CODE',
    'DEPARTMENT_ID',
    // 'JOB_ID', // jobId
    'SHIFT_ID',
    'SALARY_ACCOUNT_CODE',
    'LABOR_INSURANCE_SETTING_ID',
    'HEALTH_INSURANCE_SETTING_ID',
  ];
  const conds: string[] = [
    '',
    '', // gender, nationality
    '',
    countyCode, // county, district (區需要縣市代碼)
    '',
    '', // military, emergency relationship
    '',
    '', // work type, work location
    '', // department
    // departmentId ?? '', // jobId 需部門ID，但我們未加入 jobId，這行也先不加
    '', // shift
    '', // salary account
    '',
    '', // labor, health
  ];

  // 若有部門才把 jobId 插入同樣索引位置（對齊四個陣列）
  if (departmentId) {
    // 插回正確位置（departmentId 之後、shiftId 之前）
    const insertAt = targets.indexOf('departmentId') + 1;
    targets.splice(insertAt, 0, 'jobId');
    modules.splice(insertAt, 0, 'HRM');
    codes.splice(insertAt, 0, 'JOB_ID');
    conds.splice(insertAt, 0, departmentId);
  }

  // 構成 querystring
  const qs = new URLSearchParams();
  targets.forEach((v) => qs.append('feTargetElement', v));
  modules.forEach((v) => qs.append('feModuleCode', v));
  codes.forEach((v) => qs.append('feParamCode', v));
  conds.forEach((v) => qs.append('feParamValueCondition', v));

  const res = await axios.get(`${BASE_URL}/api/org/employee/QueryDataSource`, {
    params: qs,
    headers: { ...getAuthHeader() },
  });

  return res.data;
}

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

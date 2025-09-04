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
        ...getAuthHeader(),
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
    'genderPcode', //性別
    'maritalPcode', //婚姻
    'educationPcode', //學歷
    'nationalityPcode', //國籍
    'CountyPcode',
    'DistrictPcode', //縣市、區
    'militaryServiceTypePcode', //兵役
    'emergencyContactRelationshipPcode', //緊急聯絡人關係
    'workTypePcode', //勤務類別
    'workLocationPcode', //工作所在地
    'departmentId', //部門
    // 'jobId', //職稱
    'shiftId', //班別
    'salaryAccountPcode', //薪資帳別
    'laborInsuranceSettingId',
    'healthInsuranceSettingId', //勞保級距、健保級距
    'domesticPcode', //眷屬是否國內外
  ];
  const modules: string[] = [
    'MDM', //for 性別
    'MDM', //for 婚姻
    'MDM', //for 學歷
    'MDM', //for 國籍
    'MDM',
    'MDM', //for 縣市、區
    'HRM', //for 兵役
    'HRM', //緊急聯絡人關係
    'HRM', //for 勤務類別
    'HRM', //for 工作所在地
    'HRM', //for 部門
    // 'HRM', //for 職稱
    'HRM', //for 班別
    'SAL', //for 薪資帳別
    'HRM',
    'HRM', //for 勞保級距、健保級距
    'MDM', //員工眷屬是否國外。
  ];
  const codes: string[] = [
    'GENDER_CODE', //性別
    'MARITAL_CODE', //婚姻
    'EDUCATION_CODE', //學歷
    'NATIONALITY_CODE', //國籍
    'COUNTY_CODE',
    'DISTRICT_CODE', //縣市、區
    'MILITARY_SERVICE_TYPE_CODE', //兵役
    'EMERGENCY_CONTACT_RELATIONSHIP_CODE', //緊急聯絡人關係
    'WORK_TYPE_CODE', //勤務類別
    'WORK_LOCATION_CODE', //工作所在地
    'DEPARTMENT_ID', //部門
    // 'JOB_ID', //職稱
    'SHIFT_ID', //班別
    'SALARY_ACCOUNT_CODE', //薪資帳別
    'LABOR_INSURANCE_SETTING_ID',
    'HEALTH_INSURANCE_SETTING_ID', //勞保級距、健保級距
    'DOMESTIC_CODE', //員工眷屬是否國外。
  ];
  const conds: string[] = [
    '', //for 性別
    '', //for 婚姻
    '', //for 學歷
    '', //for 國籍
    '',
    '10001', //for 縣市、區(需傳入已經選擇的縣市代碼)
    '', //for 兵役
    '', //緊急聯絡人關係
    '', //for 勤務類別
    '', //for 工作所在地
    '', //for 部門
    '部門ID', //for 職稱(需傳入已經選擇的所屬部門ID)
    '', //for 班別
    '', //for 薪資帳別
    '',
    '', //for 勞保級距、健保級距
    '', //for 員工眷屬是否國外。
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
    const response = await axios.post(`${BASE_URL}/api/org/employee`, data, {
      headers: { ...getAuthHeader() },
    });

    return response.data;
  } catch (error: any) {
    console.error('新增員工失敗:', error);

    throw error;
  }
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_FARM_URL;
import axios from 'axios';

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

export interface ShiftQueryParams {
  keyword?: string;
  pageIndex: number;
  pageSize: number;
}

export interface ShiftItem {
  shiftId: string;
  comId: string;
  shiftName: string;
  shiftDesc: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  restHour: number;
  restMinute: number;
  sectionHours1: number;
  sectionMinute1: number;
  sectionHours2: number;
  sectionMinute2: number;
  isCardRequired: boolean;
  isEnable: boolean;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  deletedBy?: string;
  deletedAt?: string;
  isInvalid: boolean;
}

export interface ShiftQueryResponse {
  returnCode: number;
  returnMessage: string;
  beginTimestamp: string;
  endTimestamp: string;
  elapsedMilliseconds: number;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  data: ShiftItem[];
}

// 新增班別 DTO
export interface AddShiftDto {
  shiftName: string; // 班別名稱
  shiftDesc: string; // 班別說明
  startHour: number; // 上班時
  startMinute: number; // 上班分
  endHour: number; // 下班時
  endMinute: number; // 下班分
  restHour: number; // 中間休息時
  restMinute: number; // 中間休息分
  sectionHours1: number; // 前段時數
  sectionMinute1: number; // 前段分數
  sectionHours2: number; // 後段時數
  sectionMinute2: number; // 後段分數
  isCardRequired: boolean; // 是否需要打卡
  isEnable: boolean; // 是否啟用
}

// 新增班別 DTO
export interface UpdateShiftDto {
  shiftId: string; // 班別唯一識別碼
  shiftName: string; // 班別名稱
  shiftDesc: string; // 班別說明
  startHour: number; // 上班時
  startMinute: number; // 上班分
  endHour: number; // 下班時
  endMinute: number; // 下班分
  restHour: number; // 中間休息時
  restMinute: number; // 中間休息分
  sectionHours1: number; // 前段時數
  sectionMinute1: number; // 前段分數
  sectionHours2: number; // 後段時數
  sectionMinute2: number; // 後段分數
  isCardRequired: boolean; // 是否需要打卡
  isEnable: boolean; // 是否啟用
}

// MARK:查詢班別清單
export const getShiftAssignments = async (params: ShiftQueryParams): Promise<ShiftQueryResponse> => {
  const res = await axios.get(`${BASE_URL}/api/att/shiftassignment/Query`, {
    params,
    headers: {
      ...getAuthHeader(),
    },
  });

  return res.data as ShiftQueryResponse;
};

// MARK:取得下拉選單資料
export async function getShiftDataSource() {
  const targets: string[] = ['hours', 'minutes'];
  const modules: string[] = ['MDM', 'MDM'];
  const codes: string[] = ['HOURS', 'MINUTES'];
  const conds: string[] = ['', ''];

  // 構成 querystring
  const qs = new URLSearchParams();
  targets.forEach((v) => qs.append('feTargetElement', v));
  modules.forEach((v) => qs.append('feModuleCode', v));
  codes.forEach((v) => qs.append('feParamCode', v));
  conds.forEach((v) => qs.append('feParamValueCondition', v));

  try {
    const res = await axios.get(`${BASE_URL}/api/att/shiftassignment/QueryDataSource`, {
      params: qs,
      headers: {
        ...getAuthHeader(),
      },
    });

    return res.data;
  } catch (error) {
    console.error('取得下拉選單資料失敗:', error);

    throw error;
  }
}

// MARK:新增班別
export async function createShiftAssignment(data: AddShiftDto) {
  try {
    const res = await axios.post(`${BASE_URL}/api/att/shiftassignment`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    return res.data;
  } catch (err) {
    console.error('新增班別失敗:', err);

    throw err;
  }
}

//MARK: 修改班別;
export async function updateShiftAssignment(data: UpdateShiftDto) {
  try {
    const res = await axios.put(`${BASE_URL}/api/att/shiftassignment/${data.shiftId}`, data, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    return res.data;
  } catch (err) {
    console.error('修改班別失敗:', err);

    throw err;
  }
}

//MARK:刪除班別
export async function deleteShiftAssignment(shiftId: string) {
  try {
    const res = await axios.delete(`${BASE_URL}/api/att/shiftassignment/${shiftId}`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      data: { shiftId }, // DELETE 需要 body 就用 data 帶
    });

    return res.data;
  } catch (err) {
    console.error('刪除班別失敗:', err);

    throw err;
  }
}

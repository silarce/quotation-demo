const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import axios from 'axios';

// UserRole 關聯資料
export interface UserRoleRelation {
  role_id: string;
  user_id: string;
  emp_code: string;
  user_name: string;
  user_roles: (string | null)[]; // 可能是字串或 null
}

// 獲取授權標頭
const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

export const getEmployeeList = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/sys/role/users`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
    });

    return res.data.data || [];
  } catch (error) {
    console.error('取得員工資料失敗:', error);
  }
};

export const saveUserRoles = async (user_id: string, role_ids: string[]) => {
  const res = await axios.post(
    `${BASE_URL}/api/v1/sys/role/update_user_roles`,
    { user_id, role_ids }, // body
    { headers: { ...getAuthHeader() } }
  );

  return res;
};

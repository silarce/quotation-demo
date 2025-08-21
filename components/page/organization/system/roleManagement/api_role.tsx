import { Role, UpdateRole } from './newRole/schema/system';
import axios from 'axios';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;

const getAuthHeader = () => {
  if (typeof window === 'undefined') {
    return {};
  }

  const token = localStorage.getItem('access_token');
  const type = localStorage.getItem('token_type') || 'Bearer';

  return token ? { Authorization: `${type} ${token}` } : {};
};

//獲得完整角色資料

export const getRoleList = async (keyword = ''): Promise<any[]> => {
  try {
    const res = await axios.get(`${BASE_URL}/api/v1/sys/role`, {
      params: { fe_search_keyword: keyword },
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(), // 從 localStorage 取 token
      },
    });

    return res.data.data; // API 回傳格式為 { data: [...] }
  } catch (e) {
    console.error('取得角色資料失敗', e);

    return [];
  }
};

//新增角色
export const createRole = async (role: Role) => {
  try {
    const res = await axios.post(
      `${BASE_URL}/api/v1/sys/role`,
      role, // axios 會自動幫你轉成 JSON
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error('新增角色失敗:', error);

    throw error;
  }
};

// 更新角色
export async function updateRole(role: UpdateRole) {
  const { role_id, ...body } = role;

  try {
    const res = await axios.put(
      `${BASE_URL}/api/v1/sys/role/${role_id}`,
      { role_id, ...body }, // axios 會自動轉 JSON
      {
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
      }
    );

    return res.data;
  } catch (error) {
    console.error('更新角色失敗:', error);

    throw error;
  }
}

// 刪除角色
export const deleteRoleById = async (role_id: string) => {
  try {
    const res = await axios.delete(`${BASE_URL}/api/v1/sys/role/`, {
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader(),
      },
      params: { role_id }, // axios delete 建議用 params 傳 query string
    });

    return res.data;
  } catch (error) {
    console.error('刪除角色失敗:', error);

    throw error;
  }
};

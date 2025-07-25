import { Role, UpdateRole } from './newRole/schema/system';
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;

import Cookies from 'js-cookie';
const token = Cookies.get('token');

//獲得完整角色資料

export const getRoleList = async (keyword = '') => {
  const token = Cookies.get('token'); // ← 從 Cookie 取 token

  const res = await fetch(`${BASE_URL}/api/v2/sys/role?fe_search_keyword=${keyword}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    // credentials: 'include', // 通常 fetch 有帶 token 就不用了，除非有設 cookie-based session
    mode: 'cors',
  });

  if (!res.ok) {
    console.error('取得角色資料失敗', res.status);

    return [];
  }

  const result = await res.json();

  return result.data;
};

//新增角色
export const createRole = async (role: Role) => {
  const res = await fetch(`${BASE_URL}/api/v2/sys/role`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify(role),
  });

  const data = await res.json();

  return handleResponse(data);
};

//=================================================
//修改角色
export async function updateRole(role: UpdateRole) {
  const { role_id, ...body } = role;

  const res = await fetch(`${BASE_URL}/api/v2/sys/role/${role_id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ role_id, ...body }),
  });
  const data = await res.json();

  return handleResponse(data);
}

export const deleteRoleById = async (role_id: string) => {
  const res = await fetch(`${BASE_URL}/api/v2/sys/role/?role_id=${role_id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const result = await res.json();

  return result;
};

//=================================================
async function handleResponse(res: any) {
  if (res.return_code === 0) {
    return res.data;
  } else {
    throw new Error(res.return_message);
  }
}

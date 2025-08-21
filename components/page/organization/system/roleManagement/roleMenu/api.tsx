const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import Cookies from 'js-cookie';
const token = Cookies.get('token');
import axios from 'axios';

interface SaveRolePermissionPayload {
  role_id: string;
  fe_menu_permission: {
    menu_id: string;
    fe_enable_function_id_list: string[];
  }[];
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

export async function getRoleMenuPermission(roleId: string) {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/sys/role/${roleId}/menu`, {
      headers: {
        ...getAuthHeader(),
      },
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch role menu permissions:', error);

    throw error;
  }
}

export async function saveRolePermission(payload: SaveRolePermissionPayload) {
  return fetch(`${BASE_URL}/api/v2/sys/role/menu_permission`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  }).then((res) => {
    if (!res.ok) {
      console.log(res);
    }

    return res.json();
  });
}

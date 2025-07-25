const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import Cookies from 'js-cookie';
const token = Cookies.get('token');

interface SaveRolePermissionPayload {
  role_id: string;
  fe_menu_permission: {
    menu_id: string;
    fe_enable_function_id_list: string[];
  }[];
}

export async function getRoleMenuPermission(roleId: string) {
  try {
    const response = await fetch(`${BASE_URL}/api/v2/sys/role/${roleId}/menu`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return result;
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

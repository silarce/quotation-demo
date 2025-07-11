import { useReducer } from 'react';

type Role = {
  role_id: string;
  role_name: string;
  role_code: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
};

type RoleAction =
  | { type: 'ADD_ROLE'; payload: { role_name: string; description: string; role_code: string; role_id: string } }
  | { type: 'DELETE_ROLE'; payload: { role_code: string } }
  | { type: 'START_EDIT'; payload: Role }
  | { type: 'UPDATE_ROLE'; payload: Role }
  | { type: 'CANCEL_EDIT' }
  | { type: 'RESET_FORM' }
  | { type: 'SET_ROLE_LIST'; payload: Role[] };

type RoleState = {
  roles: Role[];
  editingRole?: Role;
  originalRoleId?: string; // 新增：記錄編輯前的原始 role_code
};

const roleReducer = (state: RoleState, action: RoleAction): RoleState => {
  switch (action.type) {
    case 'ADD_ROLE': {
      //   const maxCode = Math.max(...state.roles.map((r) => parseInt(r.role_code)));
      //   const newCode = (maxCode + 1).toString().padStart(4, '0');
      const now = new Date().toISOString();
      const newRole: Role = {
        ...action.payload,
        created_by: '系統自動', // 可以改成登入者
        created_at: now,
      };

      return {
        ...state,
        roles: [...state.roles, newRole],
      };
    }

    case 'DELETE_ROLE': {
      return {
        ...state,
        roles: state.roles.filter((r) => r.role_code !== action.payload.role_code),
      };
    }

    case 'START_EDIT':
      return {
        ...state,
        editingRole: action.payload,
      };

    case 'UPDATE_ROLE': {
      return {
        ...state,
        roles: state.roles.map((role) => (role.role_id === action.payload.role_id ? action.payload : role)),
        editingRole: undefined,
        originalRoleId: undefined,
      };
    }

    case 'CANCEL_EDIT':
      return {
        ...state,
        editingRole: undefined,
      };
    case 'SET_ROLE_LIST':
      return {
        ...state,
        roles: action.payload, // 直接更新角色清單
      };
    default:
      return state;
  }
};

const initialRoles: Role[] = [];

export const useRoleReducer = () => {
  return useReducer(roleReducer, {
    roles: [],
    editingRole: undefined,
  });
};

export type { Role };
export default initialRoles;

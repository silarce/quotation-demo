type AddRoleType = {
  role_id: string;
  role_name: string;
  role_code: string;
  description: string;
};

interface Role {
  role_name: string;
  role_code: string;
  description: string;
}

interface UpdateRole {
  role_id: string;
  role_name: string;
  role_code: string;
  description: string;
  created_by: string;
  created_at: string;
  updated_at?: string;
}

export type { Role, UpdateRole, AddRoleType };

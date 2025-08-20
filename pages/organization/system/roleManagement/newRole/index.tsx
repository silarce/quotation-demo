import { useEffect, useState } from 'react';
import AddRoleForm from 'components/page/organization/system/roleManagement/newRole/AddRoleTable';
import RoleTable from 'components/page/organization/system/roleManagement/newRole/RoleTable';
import { message } from 'antd';

// api
import {
  getRoleList,
  createRole,
  deleteRoleById,
  updateRole,
} from 'components/page/organization/system/roleManagement/api_role';
import { Role } from 'components/page/organization/system/roleManagement/newRole/hook/useRoleReducer';

export default function AddRolePage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [editingRole, setEditingRole] = useState<Role | null>(null);

  // 取得角色列表
  const getRoles = async () => {
    const roleList = await getRoleList();
    setRoles(roleList);
  };

  useEffect(() => {
    getRoles();
  }, []);

  // 刪除角色
  const handleDelete = async (role_id: string) => {
    try {
      await deleteRoleById(role_id);
      message.success('角色已刪除');
      await getRoles();
      setEditingRole(null);
    } catch (err) {
      console.error('刪除錯誤：', err);
    }
  };

  // 更新角色
  const handleUpdate = async (role: Role) => {
    try {
      await updateRole(role);
      message.success('角色已更新');
      await getRoles();
      setEditingRole(null);
    } catch (err) {
      console.error('更新錯誤：', err);
    }
  };

  // 新增角色
  const handleAdd = async (data: Omit<Role, 'role_id' | 'created_by' | 'created_at'>) => {
    try {
      await createRole(data);
      message.success('角色已新增');
      await getRoles();
    } catch (err) {
      message.error('新增失敗');
    }
  };

  return (
    <div className="w-full">
      <AddRoleForm
        onAddRole={handleAdd}
        editingRole={editingRole || undefined}
        onUpdate={handleUpdate}
        onCancel={() => setEditingRole(null)}
      />

      <div className="w-full mt-8 flex justify-center">
        <div className="w-full overflow-hidden">
          <RoleTable data={roles} onEdit={(role) => setEditingRole(role)} onDelete={handleDelete} />
        </div>
      </div>
    </div>
  );
}

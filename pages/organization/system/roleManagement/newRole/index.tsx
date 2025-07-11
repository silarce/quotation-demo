// components/page/setting/system/roleManagement/AddRolePage.tsx
import { useEffect } from 'react';
import AddRoleForm from 'components/page/organization/system/roleManagement/newRole/AddRoleTable';
import RoleTable from 'components/page/organization/system/roleManagement/newRole/RoleTable';
import { message } from 'antd';

// hooks & types
import { useRoleReducer, Role } from 'components/page/organization/system/roleManagement/newRole/hook/useRoleReducer';
import { getRoleList, deleteRoleById, updateRole } from 'components/page/organization/system/roleManagement/api_role';

export default function AddRolePage() {
  const [state, dispatchRole] = useRoleReducer();

  const getRoles = async () => {
    const roleList = await getRoleList();
    dispatchRole({ type: 'SET_ROLE_LIST', payload: roleList });
  };

  useEffect(() => {
    getRoles();
  }, []);

  const handleDelete = async (role_id: string) => {
    try {
      await deleteRoleById(role_id);
      message.success('角色已刪除');
      getRoles();
      dispatchRole({ type: 'CANCEL_EDIT' });
    } catch (err) {
      console.error('刪除錯誤：', err);
    }
  };

  const handleUpdate = async (role: Role) => {
    try {
      const newRole = await updateRole(role);
      dispatchRole({ type: 'UPDATE_ROLE', payload: newRole });
      getRoles();
      message.success('角色已更新');
    } catch (err) {
      console.error('更新錯誤：', err);
    }
  };

  return (
    <>
      <div className="w-full">
        <AddRoleForm
          onAddRole={(data) => dispatchRole({ type: 'ADD_ROLE', payload: data })}
          editingRole={state.editingRole}
          onUpdate={handleUpdate}
          onCancel={() => dispatchRole({ type: 'CANCEL_EDIT' })}
        />

        <div className="w-full mt-8 flex justify-center">
          <div className="w-full overflow-hidden">
            <RoleTable
              data={state.roles}
              onEdit={(role) => dispatchRole({ type: 'START_EDIT', payload: role })}
              onDelete={handleDelete}
            />
          </div>
        </div>
      </div>
    </>
  );
}

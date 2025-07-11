import { getRoleList } from '../../api_role';
import { message } from 'antd';

export const useRoleActions = () => {
  const GetRoleList = async () => {
    try {
      const roles = await getRoleList();
      console.log('角色清單:', roles);

      return roles;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error.message);
        message.error(error.message);
      }

      return [];
    }
  };

  // const handleUpdate = async () => {
  //   try {
  //     const updatedRole = await updateRole({
  //       role_id: '9da135d0-bb94-4aa7-a6be-11e15139c3d5',
  //       role_name: '管理者',
  //       role_code: 'admin',
  //       description: '擁有最高權限的角色',
  //     });

  //     message.success('角色更新成功');

  //     return updatedRole;
  //   } catch (error) {
  //     if (error instanceof Error) {
  //       message.error(error.message || '更新角色失敗');
  //     }
  //   }
  // };

  return {
    GetRoleList,
    // handleUpdate,
  };
};

import { useEffect, useMemo, useState } from 'react';
import EmployeeFilterForm from 'components/page/organization/system/roleManagement/roleAssignment/EmployeeFilterForm';
import EmployeeTable from 'components/page/organization/system/roleManagement/roleAssignment/employeeTable';
import { getEmployeeList, saveUserRoles } from 'components/page/organization/system/roleManagement/roleAssignment/api';

import Cookies from 'js-cookie';
interface User {
  role_id: string;
  user_id: string;
  emp_code: string;
  user_name: string;
  dep_ch_name: string;
  user_roles: string[];
}

export default function RoleAssignmentPage() {
  // 員工原始資料列表
  const [allData, setAllData] = useState<User[]>([]);
  // 搜尋文字狀態
  const [searchText, setSearchText] = useState('');
  // 被選中的角色 ID（篩選用）
  const [selectedRole, setSelectedRole] = useState('');
  // 被勾選的員工 ID 清單
  const [checkedUserIds, setCheckedUserIds] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      const data = await getEmployeeList();
      setAllData(data);
    } catch (err) {
      console.error('取得員工清單失敗', err);
    }
  };

  const handleSaveUserRoles = async (user_id: string, role_ids: string[]) => {
    await saveUserRoles(user_id, role_ids); // API 呼叫
    await fetchUsers(); // 重撈最新資料
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 過濾員工資料（依搜尋關鍵字與角色）
  const filteredUsers = useMemo(() => {
    return allData.filter((user) => {
      const textMatch =
        user.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.emp_code.toLowerCase().includes(searchText.toLowerCase());
      // user.dep_ch_name.toLowerCase().includes(searchText.toLowerCase());

      const roleMatch = selectedRole ? user.user_roles?.includes?.(selectedRole) : true;

      return textMatch && roleMatch;
    });
  }, [allData, searchText, selectedRole]);

  return (
    <div className="border-[1px] border-[#616161] bg-white rounded-lg py-8 px-6 h-full">
      <div className="pb-6 flex items-center gap-4">
        <EmployeeFilterForm
          searchText={searchText}
          setSearchText={setSearchText}
          selectedRole={selectedRole}
          setSelectedRole={setSelectedRole}
          checkedUserIds={checkedUserIds}
        />
      </div>

      <EmployeeTable
        data={filteredUsers}
        onReload={getEmployeeList}
        onSaveRoles={handleSaveUserRoles}
        checkedUserIds={checkedUserIds}
        setCheckedUserIds={setCheckedUserIds}
      />
    </div>
  );
}

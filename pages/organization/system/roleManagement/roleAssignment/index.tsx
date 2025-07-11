const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_SYS_URL;
import { useEffect, useMemo, useState } from 'react';
import EmployeeFilterForm from 'components/page/organization/system/roleManagement/roleAssignment/EmployeeFilterForm';
import EmployeeTable from 'components/page/organization/system/roleManagement/roleAssignment/employeeTable';

import Cookies from 'js-cookie';
const token = Cookies.get('token');

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

  const getEmployeeList = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/v2/sys/role/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setAllData(data.data || []);
    } catch (error) {
      console.error('取得員工資料失敗:', error);
    }
  };

  useEffect(() => {
    getEmployeeList();
  }, []);

  // 過濾員工資料（依搜尋關鍵字與角色）
  const filteredUsers = useMemo(() => {
    return allData.filter((user) => {
      const textMatch =
        user.user_name.toLowerCase().includes(searchText.toLowerCase()) ||
        user.emp_code.toLowerCase().includes(searchText.toLowerCase()) ||
        user.dep_ch_name.toLowerCase().includes(searchText.toLowerCase());

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
        checkedUserIds={checkedUserIds}
        setCheckedUserIds={setCheckedUserIds}
      />
    </div>
  );
}

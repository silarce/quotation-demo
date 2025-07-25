import { useState } from 'react';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

// 三個子頁面元件
import AddRolePage from './newRole/index';
import RoleAssignmentPage from './roleAssignment/index';
import RolePermissionPage from './roleMenu/index';

export default function RoleManagementIndex() {
  const [activeTab, setActiveTab] = useState<'add' | 'assignment' | 'permission'>('add');

  const activeClass = 'border border-[#14256A] bg-[#E9ECF5] text-[#14256A] border-b-2 ';
  const inactiveClass =
    'bg-[#FFFFFF] border-[#616161] border-[1px] text-[#212121] hover:border-[#14256A] hover:text-[#14256A]';

  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: 'AddRole',
        onClick: () => setActiveTab('add'),
        className: activeTab === 'add' ? activeClass : inactiveClass,
      },
      {
        name: 'rolePerson',
        onClick: () => setActiveTab('assignment'),
        className: activeTab === 'assignment' ? activeClass : inactiveClass,
      },
      {
        name: 'RoleMenu',
        onClick: () => setActiveTab('permission'),
        className: activeTab === 'permission' ? activeClass : inactiveClass,
      },
    ],
  };

  return (
    <div className="relative">
      <PageHeader {...mapPageHeaderTop} />
      <div className="mt-4">
        {activeTab === 'add' && <AddRolePage />}
        {activeTab === 'assignment' && <RoleAssignmentPage />}
        {activeTab === 'permission' && <RolePermissionPage />}
      </div>
    </div>
  );
}

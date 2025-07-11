import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

import ShiftSetting from 'components/page/personnel/shift/shiftSetting/index';
import AddStaff from 'components/page/personnel/shift/addStaff';
import SetHoliday from 'components/page/personnel/shift/setholiday';
import MonthlySchedule from 'components/page/personnel/shift/monthlySchedule';

type TabKey = 'shiftSetting' | 'addStaff' | 'setHoliday' | 'monthlySchedule';

export default function RoleManagementIndex() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('shiftSetting');

  // 初始化根據 query 設定 tab
  useEffect(() => {
    const tab = router.query.tab as TabKey;

    if (tab && ['shiftSetting', 'addStaff', 'setHoliday', 'monthlySchedule'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [router.query.tab]);

  const handleTabChange = (tabKey: TabKey) => {
    setActiveTab(tabKey);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, tab: tabKey },
      },
      undefined,
      { shallow: true }
    );
  };

  const activeClass = 'border border-[#14256A] bg-[#E9ECF5] text-[#14256A] border-b-2 ';
  const inactiveClass =
    'bg-[#FFFFFF] border-[#616161] border-[1px] text-[#212121] hover:border-[#14256A] hover:text-[#14256A]';

  const mapPageHeaderTop: MapPageHeader = {
    title: [
      {
        name: '班別設定',
        onClick: () => handleTabChange('shiftSetting'),
        className: activeTab === 'shiftSetting' ? activeClass : inactiveClass,
      },
      {
        name: '新增人員班別',
        onClick: () => handleTabChange('addStaff'),
        className: activeTab === 'addStaff' ? activeClass : inactiveClass,
      },
      {
        name: '假日設定',
        onClick: () => handleTabChange('setHoliday'),
        className: activeTab === 'setHoliday' ? activeClass : inactiveClass,
      },
      {
        name: '每月班表',
        onClick: () => handleTabChange('monthlySchedule'),
        className: activeTab === 'monthlySchedule' ? activeClass : inactiveClass,
      },
    ],
  };

  return (
    <div className="relative">
      <PageHeader {...mapPageHeaderTop} />
      <div className="mt-4">
        {activeTab === 'shiftSetting' && <ShiftSetting />}
        {activeTab === 'addStaff' && <AddStaff />}
        {activeTab === 'setHoliday' && <SetHoliday />}
        {activeTab === 'monthlySchedule' && <MonthlySchedule />}
      </div>
    </div>
  );
}

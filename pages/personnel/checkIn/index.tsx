import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

import ImportAttendance from './importingAttendance/index';
import AttendanceSettlement from './attendanceSettlement/index';
import CardApplication from './cardApplication';
import AbnormalAttendance from './abnormalAttendance';

type TabKey = 'ImportAttendance' | 'AttendanceSettlement' | 'CardApplication' | 'AbnormalAttendance';

export default function RoleManagementIndex() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('ImportAttendance');

  // 初始化根據 query 設定 tab
  useEffect(() => {
    const tab = router.query.tab as TabKey;

    if (tab && ['ImportAttendance', 'AttendanceSettlement', 'CardApplication', 'AbnormalAttendance'].includes(tab)) {
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
        name: '打卡資料匯入',
        onClick: () => handleTabChange('ImportAttendance'),
        className: activeTab === 'ImportAttendance' ? activeClass : inactiveClass,
      },
      {
        name: '考勤結算',
        onClick: () => handleTabChange('AttendanceSettlement'),
        className: activeTab === 'AttendanceSettlement' ? activeClass : inactiveClass,
      },
      {
        name: '補卡申請單',
        onClick: () => handleTabChange('CardApplication'),
        className: activeTab === 'CardApplication' ? activeClass : inactiveClass,
      },
      {
        name: '考勤異常查詢',
        onClick: () => handleTabChange('AbnormalAttendance'),
        className: activeTab === 'AbnormalAttendance' ? activeClass : inactiveClass,
      },
    ],
  };

  return (
    <div className="relative">
      <PageHeader {...mapPageHeaderTop} />
      <div className="mt-4">
        {activeTab === 'ImportAttendance' && <ImportAttendance />}
        {activeTab === 'AttendanceSettlement' && <AttendanceSettlement />}
        {activeTab === 'CardApplication' && <CardApplication />}
        {activeTab === 'AbnormalAttendance' && <AbnormalAttendance />}
      </div>
    </div>
  );
}

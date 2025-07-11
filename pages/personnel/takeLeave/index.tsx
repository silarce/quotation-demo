import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

// 三個子頁面元件
import LeaveSetting from 'components/page/personnel/takeLeave/leaveSetting/index';
import AddStaffLeave from 'components/page/personnel/takeLeave/addStaffLeave/index';
import LeaveApplication from 'components/page/personnel/takeLeave/leaveApplication/index';
import BusinessTrip from 'components/page/personnel/takeLeave/businessTrip';

type TabKey = 'leaveSetting' | 'addStaffLeave' | 'leaveApplication' | 'businessTrip';

export default function TakeLeave() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('leaveSetting');

  // 根據 query 初始化 tab
  useEffect(() => {
    const tab = router.query.tab as TabKey;

    if (tab && ['leaveSetting', 'addStaffLeave', 'leaveApplication', 'businessTrip'].includes(tab)) {
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
        name: '假別設定',
        onClick: () => handleTabChange('leaveSetting'),
        className: activeTab === 'leaveSetting' ? activeClass : inactiveClass,
      },
      {
        name: '新增人員假別',
        onClick: () => handleTabChange('addStaffLeave'),
        className: activeTab === 'addStaffLeave' ? activeClass : inactiveClass,
      },
      {
        name: '請假單申請',
        onClick: () => handleTabChange('leaveApplication'),
        className: activeTab === 'leaveApplication' ? activeClass : inactiveClass,
      },
      {
        name: '出差單申請',
        onClick: () => handleTabChange('businessTrip'),
        className: activeTab === 'businessTrip' ? activeClass : inactiveClass,
      },
    ],
  };

  return (
    <div className="relative">
      <PageHeader {...mapPageHeaderTop} />
      <div className="mt-4">
        {activeTab === 'leaveSetting' && <LeaveSetting />}
        {activeTab === 'addStaffLeave' && <AddStaffLeave />}
        {activeTab === 'leaveApplication' && <LeaveApplication />}
        {activeTab === 'businessTrip' && <BusinessTrip />}
      </div>
    </div>
  );
}

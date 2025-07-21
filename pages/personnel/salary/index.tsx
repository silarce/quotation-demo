import { useRouter } from 'next/router';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

import SalaryMaintain from './salaryMaintain/index';
import BonusMaintain from './bonusMaintain/index';
// import SetHoliday from 'components/page/personnel/shift/setholiday';
// import MonthlySchedule from 'components/page/personnel/shift/monthlySchedule';

type TabKey = 'SalaryMaintain' | 'BonusMaintain' | 'setHoliday' | 'monthlySchedule';

interface Tquery {
  tab?: TabKey;
}

export default function Salary() {
  const router = useRouter();

  const query = router.query as Tquery;

  const activeTab = query.tab || 'SalaryMaintain';

  const handleTabChange = (tabKey: TabKey) => {
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
        name: '薪資維護',
        onClick: () => handleTabChange('SalaryMaintain'),
        className: activeTab === 'SalaryMaintain' ? activeClass : inactiveClass,
      },
      {
        name: '獎金/津貼維護',
        onClick: () => handleTabChange('BonusMaintain'),
        className: activeTab === 'BonusMaintain' ? activeClass : inactiveClass,
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
        {activeTab === 'SalaryMaintain' && <SalaryMaintain />}
        {activeTab === 'BonusMaintain' && <BonusMaintain />}
        {/* {activeTab === 'setHoliday' && <SetHoliday />} */}
        {/* {activeTab === 'monthlySchedule' && <MonthlySchedule />} */}
      </div>
    </div>
  );
}

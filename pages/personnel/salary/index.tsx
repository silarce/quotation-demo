import { useRouter } from 'next/router';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

import SalaryMaintain from './salaryMaintain/index';
import BonusMaintain from './bonusMaintain/index';
import AnnualBonus from './annualBonus/index';
import SalarySettlement from './SalarySettlement/index';

type TabKey = 'SalaryMaintain' | 'BonusMaintain' | 'AnnualBonus' | 'SalarySettlement';

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
        name: '年終獎金維護',
        onClick: () => handleTabChange('AnnualBonus'),
        className: activeTab === 'AnnualBonus' ? activeClass : inactiveClass,
      },
      {
        name: '結算薪資作業',
        onClick: () => handleTabChange('SalarySettlement'),
        className: activeTab === 'SalarySettlement' ? activeClass : inactiveClass,
      },
    ],
  };

  return (
    <div className="relative">
      <PageHeader {...mapPageHeaderTop} />
      <div className="mt-4">
        {activeTab === 'SalaryMaintain' && <SalaryMaintain />}
        {activeTab === 'BonusMaintain' && <BonusMaintain />}
        {activeTab === 'AnnualBonus' && <AnnualBonus />}
        {activeTab === 'SalarySettlement' && <SalarySettlement />}
      </div>
    </div>
  );
}

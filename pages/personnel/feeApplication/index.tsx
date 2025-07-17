import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import PageHeader, { MapPageHeader } from 'components/global/myCom/pageHeader';

import TravelAllowance from './travelAllowance/index';
import Borrow from './borrow/index';
import PettyCash from './pettyCash/index';
import Bonus from './bonus/index';

type TabKey = 'TravelAllowance' | 'PettyCash' | 'Borrow' | 'Bonus';

interface Tquery {
  tab?: TabKey;
}

export default function FeeApplication() {
  const router = useRouter();
  const query = router.query as Tquery;

  const activeTab = query.tab || 'shiftSetting';

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
        name: '出差津貼申請',
        onClick: () => handleTabChange('TravelAllowance'),
        className: activeTab === 'TravelAllowance' ? activeClass : inactiveClass,
      },
      {
        name: '零用金申請',
        onClick: () => handleTabChange('PettyCash'),
        className: activeTab === 'PettyCash' ? activeClass : inactiveClass,
      },
      {
        name: '借支申請',
        onClick: () => handleTabChange('Borrow'),
        className: activeTab === 'Borrow' ? activeClass : inactiveClass,
      },

      {
        name: '獎金申請',
        onClick: () => handleTabChange('Bonus'),
        className: activeTab === 'Bonus' ? activeClass : inactiveClass,
      },
    ],
  };

  return (
    <div className="relative">
      <PageHeader {...mapPageHeaderTop} />
      <div className="mt-4">
        {activeTab === 'TravelAllowance' && <TravelAllowance />}
        {activeTab === 'Borrow' && <Borrow />}
        {activeTab === 'PettyCash' && <PettyCash />}
        {activeTab === 'Bonus' && <Bonus />}
      </div>
    </div>
  );
}

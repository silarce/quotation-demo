import Router from 'next/router';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

export default function QuotationList() {
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '新增報價單',
      onClick: () => {
        Router.push(`${Router.pathname}/edit`);
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="報價單" panelList={panelList} />
      <div>建構中</div>
    </SubLayer>
  );
}

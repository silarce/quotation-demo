// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component

// gaer
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

export default function AnnualPerformanceStatistics() {
  const panelList: TpanelList = [
    {
      searchGroup: {
        searchTargetList: [
          {
            placeholder: '輸入搜尋內容',
          },
        ],
        doSearch: (v) => {
          console.log(v);
        },
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tag="年度業績統計表" panelList={panelList} />
    </SubLayer>
  );
}

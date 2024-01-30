import { useState, useMemo } from 'react';
import moment from 'moment';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable } from 'components/global/gear/table/table01';

// ========================================================
type TfilterBy = 'vendor' | 'month';

// ========================================================
export default function OutsourcingPricing() {
  const [showListBy, setShowListBy] = useState<TfilterBy>('vendor');

  const [sortByVendor, setSortByVendor] = useState<string>();
  const [sortByDate, setSortByDate] = useState<`${number}-${number}`>();

  // ------------------------------------------------------------------------

  // ------------------------------------------------------------------------

  const control_table: Ttable['tbody']['rowArr'] = useMemo(() => {
    return fakeDataArr.map((data) => {
      return {
        minHeight: tableConfig.row.minHeight,
        onClick: () => {
          setSortByVendor(data.id);
        },
        cellArr: [
          {
            children: data.name,
            width: cellCofig.vendor.width,
          },
          {
            children: data.phoneNumber,
            width: cellCofig.phoneNumber.width,
          },
        ],
      };
    });
  }, []);

  const fakeTable: Ttable = {
    thead: fakeThead,
    tbody: {
      rowArr: control_table,
    },
  };

  // ------------------------------------------------------------------------
  const tagList: TtagList = [
    {
      label: '外包廠商',
      onClick: () => {
        setShowListBy('vendor');
      },
    },
    {
      label: '月份排列',
      onClick: () => {
        setShowListBy('month');
      },
    },
  ];

  return (
    <SubLayer>
      <PageHeader02 tagList={tagList} />

      <div>
        <Wrapper_tab
          className={'m-auto mb-5'}
          childrenOption={{
            noBorderTop: true,
          }}
          stickyTop={{
            top: 40,
          }}
        >
          <Table01 {...fakeTable} />
        </Wrapper_tab>
      </div>
    </SubLayer>
  );
}

// ====================================================================

type TcellConfig = {
  [key: string]: {
    label: string;
    width?: React.CSSProperties['width'];
    flex?: React.CSSProperties['flex'];
  };
};

const tableConfig = {
  row: {
    minHeight: '40px',
  },
};

const cellCofig: TcellConfig = {
  vendor: {
    label: '外包廠商',
    width: '160px',
  },
  phoneNumber: {
    label: '連絡電話',
    width: '180px',
    // flex: 'auto',
  },
};

const fakeThead: Ttable['thead'] = {
  stickyTop: {
    top: '40px',
  },
  rowProps: {
    minHeight: tableConfig.row.minHeight,
  },
  cellArr: [
    {
      children: cellCofig.vendor.label,
      width: cellCofig.vendor.width,
    },
    {
      children: cellCofig.phoneNumber.label,
      width: cellCofig.phoneNumber.width,
      // flex: cellCofig.phoneNumber.flex,
    },
  ],
};

type TfakeData = {
  id: string;
  name: string;
  phoneNumber: string;
  date: string;
};

const fakeDataArr: TfakeData[] = [
  // 生成30筆，id要依序
  ...Array.from({ length: 30 }, (v, index) => ({
    id: `${index}`,
    name: '王小名',
    phoneNumber: '0928-777-777',
    date: generateRandomDate(),
  })),
];

// ====================================================================

function generateRandomDate(): string {
  const start = moment().year(2022).startOf('year');
  const end = moment().year(2024).endOf('year');
  const randomDate = start.add(Math.random() * end.diff(start));

  return randomDate.toISOString();
}

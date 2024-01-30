// 這裡一系列的介面切換
// 其實都是同一個資料來源，不同的呈現方式

import { useState, useMemo } from 'react';
import moment from 'moment';
import classNames from 'classnames';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TtagList, TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Wrapper_tab, { Ttab } from 'components/global/gear/wrapper_tab/wrapper_tab01';
import Table01, { Ttable } from 'components/global/gear/table/table01';
import DateCollapse, { Tcontrol_dateCollapse } from 'components/page/worksDepartment/outsourcingPricing/dateCollapse';

// css
import scss from './index.module.scss';

// ========================================================
type TfilterBy = 'vendor' | 'month';

// ========================================================
export default function OutsourcingPricing() {
  const [showListBy, setShowListBy] = useState<TfilterBy>('vendor');

  const [sortByVendor, setSortByVendor] = useState<string>();
  const [sortByDate, setSortByDate] = useState<`${number}-${number}`>();

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

  const control_dateCollapse: Tcontrol_dateCollapse = useMemo(() => {
    const yearMonthList = generateMonthsSinceNow();

    let panelArr: Tcontrol_dateCollapse['panelArr'] = Object.entries(yearMonthList).map(([year, monthArr]) => {
      const twYear = String(Number(year) - 1911);

      const cardList = monthArr.map((month) => {
        return {
          label: `${month}月`,
          onClick: () => {
            setSortByDate(`${Number(year)}-${month}`);
          },
        };
      });

      return {
        label: twYear,
        cardArr: cardList,
      };
    });

    panelArr = panelArr.reverse();

    return {
      panelArr,
    };
  }, []);

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
    <SubLayer bodyClassName={classNames(scss.subLayerBody, scss.plus)}>
      <PageHeader02 tagList={tagList} />

      <div>
        <Wrapper_tab
          className={classNames('m-auto mb-5', showListBy !== 'vendor' && 'hidden')}
          childrenOption={{
            noBorderTop: true,
          }}
          stickyTop={{
            top: 40,
          }}
        >
          <Table01 {...fakeTable} />
        </Wrapper_tab>

        <DateCollapse
          className={classNames('m-auto mb-5 mt-[40px]', showListBy !== 'month' && 'hidden')}
          control={control_dateCollapse}
        />
      </div>
    </SubLayer>
  );
}

// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================
// ====================================================================

function generateRandomDate(): string {
  const start = moment().year(2022).startOf('year');
  const end = moment().year(2024).endOf('year');
  const randomDate = start.add(Math.random() * end.diff(start));

  return randomDate.toISOString();
}

const fakeDataTempArr = [
  {
    name: '王小名',
    phoneNumber: '0928-777-777',
  },
  {
    name: '林小美',
    phoneNumber: '0928-666-666',
  },
  {
    name: '陳小華',
    phoneNumber: '0928-555-555',
  },
  {
    name: '張小英',
    phoneNumber: '0928-444-444',
  },
  {
    name: '黃小強',
    phoneNumber: '0928-333-333',
  },
];

const getRandomItem = () => {
  const index = Math.floor(Math.random() * fakeDataTempArr.length);

  return fakeDataTempArr[index];
};

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
    // name: '王小名',
    // phoneNumber: '0928-777-777',
    name: getRandomItem().name,
    phoneNumber: getRandomItem().phoneNumber,
    date: generateRandomDate(),
  })),
];

// ====================================================================

function generateMonthsSinceNow(): { [key: `${number}`]: number[] } {
  const currentYear = new Date().getFullYear();
  const result: { [key: string]: number[] } = {};

  for (let year = 2020; year <= currentYear; year++) {
    result[year.toString()] = Array.from({ length: 12 }, (_, i) => i + 1);
  }

  return result;
}

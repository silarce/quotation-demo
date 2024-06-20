import { useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';
import classNames from 'classnames';

import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import Row, { Cell } from 'components/global/gear/table/row';

// utils
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

import scss from './index.module.scss';

import type { Tparams } from 'js/api/dtoTypes';

// ============================================================================

type Tquery = {
  year: string;
  month: string;
  keyword: string;
};

// ============================================================================

// MARK:START

export default function BillCashingDetailList() {
  const { thisYear, thisMonth, yearOptionArr, monthOptionArr } = useYearMonth_options();

  const router = useRouter();
  const query = router.query as Tquery;
  const { year = thisYear.toString(), month = thisMonth.toString() } = query;
  const keyword = query.keyword || undefined;

  // --------------------------------------------------------------------------

  const params: Tparams = useMemo(() => {
    return {
      populate: ['incomeBill', 'invoices'],
      filter: {
        insertDate: {
          $gte: moment()
            .set({ year: Number(year), month: Number(month) - 1 })
            .startOf('month')
            .toISOString(),
          $lte: moment()
            .set({ year: Number(year), month: Number(month) - 1 })
            .endOf('month')
            .toISOString(),
        },
        $or: [
          // {
          //   vendorName: {
          //     $contains: keyword,
          //   },
          // },
        ],
      },
    };
  }, [year, month, keyword]);

  // --------------------------------------------------------------------------

  // MARK:PROPS

  const selectPropsArr = useYearMonth_selectBar_query({
    year,
    month,
    yearOptionArr,
    monthOptionArr,
  });

  const searchTargetList: TsearchGroup['searchTargetList'] = [
    {
      width: '200px',
      defaultValue: keyword,
      placeholder: '關鍵字搜尋',
    },
  ];

  const searchGroup: TsearchGroup = {
    searchTargetList,
    doSearch: (arr) => {
      const keyword = arr[0] as string;

      router.replace({
        query: {
          ...router.query,
          keyword,
        },
      });
    },
  };

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '匯出',
      onClick: () => {},
    },
  ];
  // --------------------------------------------------------------------------

  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="票據兌現明細表"
        customeLeft={[
          <SelectBar
            //
            key="selectBar"
            className="ml-5"
            selectPropsArr={selectPropsArr}
          />,
        ]}
        panelList={panelList}
      />

      <div></div>
    </SubLayer>
  );
}

// MARK:END
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

type TconfigItem = {
  label: string;
  style?: React.CSSProperties;
  className?: string;
  bodyClassName?: string;
};

type Tconfig = {
  [key: string]: TconfigItem;
};

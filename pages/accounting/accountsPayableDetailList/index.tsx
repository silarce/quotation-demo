import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList, TsearchGroup } from 'components/PageHeader/PageHeader02/PageHeader02';

// gear
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import DragableModal from 'components/global/gear/dragableModal/dragableModal';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import Row, { Cell } from 'components/global/gear/table/row';

import type { TuserDto } from 'js/api/dtoTypes';

import { useTranslation } from 'react-i18next';

import scss from './index.module.scss';

// ================================================================================

// interface Tdata {
//   應付帳款單號: string | null;
//   廠商編號: string | null;
//   發票廠商: string | null;
//   付款帳號: string | null;
//   支票號碼: string | null;
//   發票廠商: string | null;
//   發票號碼: string | null;
//   發票金額: string | null;
//   付款狀態: string | null;
//   發票日期: string | null;
// }

// ================================================================================
type Tquery = {
  year?: string;
  month?: string;
  invoiceNumber?: string;
};

// ================================================================================

// MARK: START
export default function AccountsPayableDetailList() {
  // MARK: DATA
  // MARK: API
  // MARK: HANDLE
  // MARK: useEffect

  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="應付帳款明細表"
        customeLeft={[<DateSelector key="DateSelector" />]}
        panelList={usePanelList()}
      />

      <div>
        <Spin spinning={false} delay={300}>
          <h1>fooo</h1>
        </Spin>
      </div>
    </SubLayer>
  );
}
// MARK: END

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

// MARK:usePanelList

const usePanelList = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { invoiceNumber } = query;

  const searchGroup: TsearchGroup = {
    searchTargetList: [
      {
        defaultValue: invoiceNumber,
        placeholder: '以發票號碼搜尋',
      },
    ],

    doSearch: (searchValueArr) => {
      const invoiceNumber = searchValueArr[0] as string;

      const newQuery: Tquery = {
        ...query,
        invoiceNumber,
      };

      if (!newQuery.invoiceNumber) {
        delete newQuery.invoiceNumber;
      }

      router.replace({
        query: newQuery,
      });
    },
  };

  const panelList: TpanelList = [
    { searchGroup },
    {
      type: 'myButton',
      label: '產生當月應付帳款',
      onClick: () => {
        console.log('產生當月應付帳款');
      },
    },
  ];

  return panelList;
};

// MARK: DateSelector
const DateSelector = () => {
  const router = useRouter();
  const query = router.query as Tquery;

  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();
  const {
    //
    year = thisYear.toString(),
    month = thisMonth.toString(),
  } = query;

  const selectPropsArr = useYearMonth_selectBar_query({
    year: year,
    month: month,
    yearOptionArr,
    monthOptionArr,
  });

  return <SelectBar key="selectBar" className="ml-10" selectPropsArr={selectPropsArr} />;
};

// ==========================================================================

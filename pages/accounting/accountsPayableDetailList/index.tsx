import { useState, useEffect, useMemo, useRef } from 'react';
import classNames from 'classnames';
import { nanoid } from 'nanoid';
import moment, { Moment } from 'moment';
import Decimal from 'decimal.js';
import { useRouter } from 'next/router';

// antd
import { Spin, Switch } from 'antd';

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
import SearchBar from 'components/global/gear/HOC/searchBar/searchBar';

import type { TuserDto } from 'js/api/dtoTypes';

import { useTranslation } from 'react-i18next';

import scss from './index.module.scss';

import {
  useGetAccountPayableBySupplierId,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  useGetAccountPayableStatisticsDetailByStatisticsId,
  apiPostAddAccountPayableStatistics,
  apiPatchUpdateAccountPayableStatisticsById,
  apiDeleteAccountPayableStatisticsById,
} from 'js/api/api_netCore/api_accountant';

import { Toption } from 'js/utils/options/options';

// ================================================================================

// ================================================================================
type Tquery = {
  year?: string;
  month?: string;
  invoiceNumber?: string;
  searchType: 'date' | 'invoice';
};

// ================================================================================

// MARK: START
export default function AccountsPayableDetailList() {
  const router = useRouter();
  const query = router.query as Tquery;

  const { thisYear, thisMonth } = useYearMonth_options();
  const {
    //
    year,
    month,
    invoiceNumber,
    searchType = 'date',
  } = query;

  // MARK: DATA

  const params = useMemo(() => {
    let params: Parameters<typeof useGetAccountPayableBy>[0] = undefined;

    if (searchType === 'date' && year && month) {
      params = {
        dateForUnpaid: {
          date: `${year}-${month}`,
        },
      };
    } else if (searchType === 'invoice' && invoiceNumber) {
      params = {
        invoiceNumber: {
          invoice_number: invoiceNumber,
        },
      };
    }

    return params;
  }, [year, month, invoiceNumber, searchType]);

  const { raw: raw_accountPayable } = useGetAccountPayableBy(params, { autoUpdate: true });

  // MARK: API
  // MARK: HANDLE
  // ----------------------------------------------------------------
  // MARK: useEffect
  useEffect(() => {
    if (!query.year || !query.month) {
      router.replace({
        query: {
          ...query,
          year: thisYear.toString(),
          month: thisMonth.toString(),
        },
      });
    }
  }, []);

  // ----------------------------------------------------------------
  // MARK: RENDER
  return (
    <SubLayer>
      <PageHeader02
        tag="應付帳款明細表"
        // customeLeft={[
        //   <DateSelector
        //     key="DateSelector"
        //     yearOptionArr={yearOptionArr}
        //     monthOptionArr={monthOptionArr}
        //     year={year}
        //     month={month}
        //   />,
        // ]}
        // panelList={usePanelList()}
        customeRight={[<MySwitch key="0" />]}
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

  const { yearOptionArr, monthOptionArr, thisYear, thisMonth } = useYearMonth_options();
  const {
    //
    year = thisYear.toString(),
    month = thisMonth.toString(),
    invoiceNumber,
  } = query;
  const searchGroup_invoice: TsearchGroup = {
    searchTargetList: [
      {
        width: '220px',
        defaultValue: invoiceNumber,
        placeholder: '以發票號碼搜尋所有應付帳款',
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
  const search_date: TsearchGroup = {
    searchTargetList: [
      {
        placeholder: '選擇年份',
        options: yearOptionArr,
        defaultValue: year,
      },
      {
        placeholder: '選擇月份',
        options: monthOptionArr,
        defaultValue: month,
      },
    ],
    doSearch: () => {},
  };

  const panelList: TpanelList = [
    // { searchGroup: search_date },
    { searchGroup: searchGroup_invoice },
    // {
    //   type: 'inputSearch',
    //   placeholder: 'fooo',
    //   onClick: () => {},
    // },
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
const DateSelector = ({
  yearOptionArr,
  monthOptionArr,
  year,
  month,
  className,
}: {
  yearOptionArr: Toption[];
  monthOptionArr: Toption[];
  year: string;
  month: string;
  className?: string;
}) => {
  const selectPropsArr = useYearMonth_selectBar_query({
    year: year,
    month: month,
    yearOptionArr,
    monthOptionArr,
  });

  return <SelectBar key="selectBar" className={className} selectPropsArr={selectPropsArr} />;
};

const MySwitch = () => {
  const router = useRouter();
  const query = router.query as Tquery;
  const { yearOptionArr, monthOptionArr } = useYearMonth_options();
  const {
    //
    year,
    month,
    invoiceNumber,
    searchType,
  } = query;

  const checked = searchType === 'invoice';

  const searchGroup_invoice: TsearchGroup = {
    searchTargetList: [
      {
        width: '220px',
        defaultValue: invoiceNumber,
        placeholder: '以發票號碼搜尋所有應付帳款',
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

  return (
    <div className={scss.mySwitch}>
      <Switch
        className={classNames(scss.antdSwitch)}
        checked={searchType === 'invoice'}
        onChange={(checked) => {
          const searchType = checked ? 'invoice' : 'date';
          router.replace({
            query: {
              ...router.query,
              searchType,
            },
          });
        }}
        checkedChildren={
          <>
            以<i className="text-white font-bold">發票</i> 搜尋 <i className="text-white font-bold">所有</i> 應付帳款
          </>
        }
        unCheckedChildren={
          <>
            以<i className="text-white font-bold">日期</i> 搜尋 <i className="text-white font-bold">未付</i> 應付帳款
          </>
        }
      />
      {!checked && (
        <DateSelector
          key="DateSelector"
          className="ml-2"
          yearOptionArr={yearOptionArr}
          monthOptionArr={monthOptionArr}
          year={year || ''}
          month={month || ''}
        />
      )}
      {checked && <SearchBar className="ml-2 w-[282px]" {...searchGroup_invoice} />}
    </div>
  );
};
// ==========================================================================

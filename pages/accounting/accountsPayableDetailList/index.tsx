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

// component
import SearchSwitch from 'components/page/accounting/accountsPayableDetailList/SearchSwitch';

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
        customeLeft={[<SearchSwitch className="ml-2" key="0" />]}
        panelList={createPanel()}
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
// ==============================================================================

// ==========================================================================

const createPanel = () => {
  const panelList: TpanelList = [
    {
      type: 'myButton',
      label: '產生當月應付帳款統計表',
      onClick: () => {},
    },
    {
      type: 'myButton',
      label: '查看當月應付帳款統計表',
      onClick: () => {},
    },
  ];

  return panelList;
};

// ==========================================================================

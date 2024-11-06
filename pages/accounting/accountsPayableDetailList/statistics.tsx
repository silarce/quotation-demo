import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
// import SearchSwitch from 'components/page/accounting/accountsPayableDetailList/index/SearchSwitch';
import { Row_thead, Row_tbody } from 'components/page/accounting/accountsPayableDetailList/index/Table';

// gear

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';

import {
  Taccount_payable_Dto,
  //
  useGetAccountPayableBySupplierId,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  useGetAccountPayableStatisticsDetailByStatisticsId,
  apiPostAddAccountPayableStatistics,
  apiPatchUpdateAccountPayableStatisticsById,
  apiDeleteAccountPayableStatisticsById,
} from 'js/api/api_netCore/api_accountant';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ================================================================================

interface Tquery {
  year?: string;
  month?: string;
}

// ================================================================================
export default function Statistics() {
  const router = useRouter();
  const { year, month } = router.query as Tquery;

  // -------------------------------------------------------------------------

  const { raw } = useGetAccountPayableStatisticsByIdOrDate({
    date: `${year}-${month}`,
  });

  // -------------------------------------------------------------------------

  return (
    <SubLayer>
      <PageHeader02 tag="應付帳款統計表" />
      <div></div>
    </SubLayer>
  );
}

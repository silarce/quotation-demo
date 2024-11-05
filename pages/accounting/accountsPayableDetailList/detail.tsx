import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import moment from 'moment';

// antd
import { Spin } from 'antd';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// component
import Profile from 'components/page/accounting/accountsPayableDetailList/detail/Profile';
import InvoiceInfo from 'components/page/accounting/accountsPayableDetailList/detail/InvoiceInfo';
import Balancing from 'components/page/accounting/accountsPayableDetailList/detail/Balance';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { useYearMonth_options, useYearMonth_selectBar_query, SelectBar } from 'js/utils/helpers/hook/useYearMonth';
import SquareBtn from 'components/global/gear/button/larrysBtn/squarebtn';
import ThreePartBar from 'components/global/container/bar/threePartBar';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

import {
  Taccount_payable_Dto,
  //
  useGetAccountPayableBySupplierId,
  useGetAccountPayableBy,
  useGetAccountPayableStatisticsByIdOrDate,
  useGetAccountPayableStatisticsDetailByStatisticsId,
  useGetSearchAccountPayableByInvoiceNumber,
  apiPostAddAccountPayableStatistics,
  apiPatchUpdateAccountPayableStatisticsById,
  apiDeleteAccountPayableStatisticsById,
} from 'js/api/api_netCore/api_accountant';

// utils
import { getTaiwanDateStr } from 'js/utils/helpers/date/convertDate';

// ================================================================================
type Tquery = {
  invoiceNumber?: string | undefined;
};
// ================================================================================

export default function AccountsPayableDetail() {
  const router = useRouter();
  const { invoiceNumber } = router.query as Tquery;

  const [disabled, setDisabled] = useState(true);

  // -----------------------------------------------------------------------------

  const { raw, isFetching } = useGetSearchAccountPayableByInvoiceNumber(invoiceNumber);

  console.log(raw);

  const {
    serial_number,
    agentEmployee,

    invoice_date,
    invoice_number,
  } = raw ?? {};

  const invoiceInfo: Parameters<typeof InvoiceInfo>[0] = {
    發票類別: 'no property',
    invoice_date: getTaiwanDateStr(invoice_date),
    invoice_number,
    申報期別: 'no property',
    進貨費用: 'no property',
    買受人統一編號: 'no property',
    買受人抬頭: 'no property',
    買受人發票地址: 'no property',
    營業人統一編號: 'no property',
    營業人抬頭: 'no property',
    稅別: 'no property',
    稅額: 'no property',
    進項金額: 'no property',
    合計金額: 'no property',
  };

  // -----------------------------------------------------------------------------

  return (
    <SubLayer bodyPreStyle="style01">
      <PageHeader02 tag="應付帳款明細" />
      <div>
        <BtnBar />
        <Spin spinning={false}>
          <Profile
            serial_number={serial_number}
            支出單號進貨收票單號={'no property'}
            agentName={agentEmployee?.chName}
          />
          <br />
          <InvoiceInfo {...invoiceInfo} />
          <br />
          <Balancing />
        </Spin>
      </div>
    </SubLayer>
  );
}

// ================================================================================

const BtnBar = () => {
  return (
    <ThreePartBar>
      <>
        <SquareBtn content="search" />
        <SquareBtn content="export" />
      </>
      <>
        <SquareBtn content="edit" />
      </>
      <>
        <SquareBtn content="sentReview" />
      </>
    </ThreePartBar>
  );
};

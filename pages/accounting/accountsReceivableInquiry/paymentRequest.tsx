import { useEffect } from 'react';

import { useRouter } from 'next/router';

import Btn from 'components/global/gear/button/btn_fong';

import {
  useApiGetARPaymentData,
  useApiGetARPaymentDataInsert,
  apiGetPaymentRequestType,
} from 'js/api/api_netCore/api_accountsReceivable';

// component
import CurrentlyAccumulated from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentlyAccumulated';
import CurrentPaymentRequestDetails from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentPaymentRequestDetails';
import History from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/history';
import ProjectDetail from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/projectDetail';

import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';

import scss from './paymentRequest.module.scss';
import { modal_empty } from 'components/global/gear/modal/fongModal';

// ============================================================================

interface Tquery {
  id?: string;
  accountsReceivableId?: string;
}

// ============================================================================
// MARK: START
export default function PaymentRequest() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: paymentQuestId, accountsReceivableId } = query;
  const isNew = !paymentQuestId;

  const { data: data_paymentQuest } = useApiGetARPaymentData(paymentQuestId);
  const { data: data_forNew } = useApiGetARPaymentDataInsert(isNew ? accountsReceivableId : undefined);

  const { accountsReceivables, paymentRequest, salesOrder } = data_paymentQuest ?? data_forNew ?? {};
  const salesOrderItems = salesOrder?.salesOrderItems ?? [];

  // useEffect(() => {
  //   apiGetPaymentRequestType();
  // }, []);

  // MARK:RENDER

  return (
    <div>
      {/*  */}
      <div className="pageTop">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">請款單編輯</div>
          <div>
            {/* <Btn onClick={handle_test}>test</Btn> */}
            <Btn onClick={router.back}>返回</Btn>
          </div>
        </div>
      </div>

      {/* 項目明細 */}
      <ProjectDetail className="mb-4" data={salesOrderItems} allowEdit={isNew} />
      {/* 目前累計 */}
      <CurrentlyAccumulated className="mb-10" data={accountsReceivables} />
      {/* 本次請款明細 含沖銷明細 */}
      <CurrentPaymentRequestDetails className="mb-10" paymentRequest={paymentRequest} />
      {/* 請款紀錄 */}
      <History />

      {/*  */}
    </div>
  );
}

// MARK: END

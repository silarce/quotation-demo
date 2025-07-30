import { useRouter } from 'next/router';

import Btn from 'components/global/gear/button/btn_fong';

import { useApiGetARPaymentData, apiGetPostARPaymentDataInsert } from 'js/api/api_netCore/api_accountsReceivable';

// component
import CurrentlyAccumulated from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentlyAccumulated';
import CurrentPaymentRequestDetails from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentPaymentRequestDetails';
import History from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/history';
import ProjectDetail from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/projectDetail';

import scss from './paymentRequest.module.scss';

// ============================================================================

interface Tquery {
  id?: string;
}

// ============================================================================
// MARK: START
export default function PaymentRequest() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id } = query;

  const { data } = useApiGetARPaymentData(id);
  const { accountsReceivables, paymentRequest, salesOrder } = data ?? {};
  const salesOrderItems = salesOrder?.salesOrderItems ?? [];

  // MARK:RENDER

  return (
    <div>
      {/*  */}
      <div className="pageTop">
        <div className="flex justify-between items-center">
          <div className="text-xl font-semibold">請款單</div>
          <div>
            <Btn onClick={router.back}>返回</Btn>
          </div>
        </div>
      </div>

      {/* 工程項目明細 */}
      <ProjectDetail className="mb-4" data={salesOrderItems} />
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

import { useState, useEffect, useMemo } from 'react';

import { useRouter } from 'next/router';

import { DeepNonNullable } from 'ts-essentials';

import Btn from 'components/global/gear/button/btn_fong';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  TinsertpaymentRequest,
  //
  useApiGetARPaymentData,
  useApiGetARPaymentDataInset,
  apiGetPaymentRequestType,
  apiPostInsertPaymentRequest,
  apiPatchInsertPaymentRequest,
} from 'js/api/api_netCore/api_accountsReceivable';

// component
import CurrentlyAccumulated from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentlyAccumulated';
import CurrentPaymentRequestDetails from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentPaymentRequestDetails';
import History from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/history';
import ProjectDetail from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/projectDetail';
import PrOffsetDetails from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/prOffsetDetails';

import Selector_invoiceBook from 'components/composition/selectorModal/selector_invoiceBook';

import scss from './paymentRequest.module.scss';
import { modal_empty } from 'components/global/gear/modal/fongModal';

import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

import {
  usePaymentRequest,
  Tstate_paymentRequest,
} from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/hook/usePaymentRequest';

// ============================================================================

interface Tquery {
  id?: string;
  accountsReceivableId?: string;
}

// ============================================================================
// MARK: START
export default function PayentRequest() {
  const router = useRouter();
  const query = router.query as Tquery;
  const { id: paymentQuestId, accountsReceivableId } = query;
  const isNew = !paymentQuestId;

  const { userInfo } = useGlobal_userInfo();

  const { data: data_paymentQuest } = useApiGetARPaymentData(paymentQuestId);
  const { data: data_forNew } = useApiGetARPaymentDataInset(isNew ? accountsReceivableId : undefined);

  const { accountsReceivables, paymentRequest, salesOrder } = data_paymentQuest ?? data_forNew ?? {};
  const salesOrderItems = salesOrder?.salesOrderItems ?? [];

  const instance_paymentRequest = usePaymentRequest(paymentRequest);

  useEffect(() => {
    apiGetPaymentRequestType();
  }, []);

  const req_postInsertPaymentRequest = async (paymentRequest: Tstate_paymentRequest) => {
    if (!accountsReceivables) {
      myAlert.err({ title: '未取得必要資料' });

      return;
    }

    const { sourceType, sourceId } = accountsReceivables!;

    if (!sourceId) {
      return;
    }

    if (!userInfo) {
      return;
    }

    const isInvalid_paymentRequest = Object.values(paymentRequest).some((item) => !item);

    if (isInvalid_paymentRequest) {
      return;
    }

    const validPaymentRequest = paymentRequest as DeepNonNullable<Tstate_paymentRequest>;
    const {
      type,
      paymentAmount,
      營業稅,
      保留款,
      稅別,
      保留款金額,
      發票本,
      發票日期,
      invoiceNumber,
      invoiceAmount,
      customerName,
      customerNumber,
      統一編號,
    } = validPaymentRequest;

    // const body: TinsertpaymentRequest = {
    //   paymentRequest: {
    //     createdAt: new Date().toISOString(),
    //     createdBy: userInfo.id,
    //     updatedAt: new Date().toISOString(),
    //     updatedBy: userInfo.id,

    //     sourceFormType: sourceType,
    //     sourceFormId: sourceId,
    //     accountsReceivableId: accountsReceivables.id,

    //     customerNumber: customerNumber,
    //     customerName: customerName,

    //     type: type,

    //     paymentCurrency, // 請款幣別,
    //     foreignCurrencyAmount, // 外幣金額,
    //     paymentAmount: Number(paymentAmount), // 請款金額, // 本期合計

    //     retainageType: '保留款', // "保留款", // retainageType type?這是金額還是類型?
    //     retainageTaxCategory, // 保留款稅別(含稅、未稅、無),
    //     retainageRate: Number(保留款), // 保留款%數 10 ,
    //     retainageAmount: Number(保留款金額), // 保留款金額 61601,

    //     completedProduct,
    //   },
    // };

    // apiPostInsertPaymentRequest
  };

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
      <CurrentPaymentRequestDetails className="mb-10" instance_paymentRequest={instance_paymentRequest}>
        <PrOffsetDetails prOffsetDetails={paymentRequest?.prOffsetDetails} />
      </CurrentPaymentRequestDetails>
      {/* 請款紀錄 */}
      <History />

      {/*  */}
    </div>
  );
}

// MARK: END

// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================
// ============================================================================

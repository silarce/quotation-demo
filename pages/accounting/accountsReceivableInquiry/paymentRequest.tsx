import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';

import Decimal from 'decimal.js';

import { Dayjs } from 'dayjs';

import { DeepNonNullable } from 'ts-essentials';

import Btn from 'components/global/gear/button/btn_fong';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  TinsertpaymentRequest,
  Tbody_apiPostInsertPrOffsetDetail,
  //
  useApiGetARPaymentData,
  useApiGetARPaymentDataInset,
  apiGetPaymentRequestType,
  apiPostInsertPaymentRequest,
  apiPatchInsertPaymentRequest,
  apiPostInsertPrOffsetDetail,
} from 'js/api/api_netCore/api_accountsReceivable';

// component
import CurrentlyAccumulated from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentlyAccumulated';
import CurrentPaymentRequestDetails from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/currentPaymentRequestDetails';
import History from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/history';
import SalesOrderItem from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/salesOrderItem';
import PrOffsetDetails from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/prOffsetDetails';

import scss from './paymentRequest.module.scss';

import { useGlobal_userInfo } from 'hooks/globalState/useGlobal_userInfo';

import {
  usePaymentRequest,
  Tstate_paymentRequest,
} from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/hook/usePaymentRequest';

import {
  Tstate_salesOrderItem,
  useSalesOrderItemArr,
} from 'components/page/accounting/accountsReceivableInquiry/paymentRequest/hook/useSalesOrderItemArr';
import { TaccountantDto } from 'js/api/dtoTypes';

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

  const { data: data_paymentQuest, update: update_paymentQuest } = useApiGetARPaymentData(paymentQuestId);
  const { data: data_forNew } = useApiGetARPaymentDataInset(isNew ? accountsReceivableId : undefined);

  const { accountsReceivables, paymentRequest, salesOrder, paymentRequestLogs } =
    data_paymentQuest ?? data_forNew ?? {};
  const salesOrderItems = salesOrder?.salesOrderItems ?? [];

  const instance_paymentRequest = usePaymentRequest(paymentRequest, accountsReceivables);
  const instance_salesOrderItem = useSalesOrderItemArr(salesOrderItems);

  useEffect(() => {
    apiGetPaymentRequestType();
  }, []);

  const createBody = () => {
    if (!accountsReceivables) {
      myAlert.err({ title: '未取得必要資料' });

      return null;
    }

    const { state_paymentRequest } = instance_paymentRequest;
    const { sourceType, sourceId } = accountsReceivables!;

    if (!sourceId) {
      myAlert.err({ title: '沒有sourceId' });

      return null;
    }

    if (!userInfo) {
      myAlert.err({ title: '沒有userInfo' });

      return null;
    }

    const isInvalid_paymentRequest = Object.values(state_paymentRequest).some((item) => !item);

    if (isInvalid_paymentRequest) {
      myAlert.err({ title: '本次請款明細資料未填妥' });

      return null;
    }

    const validPaymentRequest = state_paymentRequest as DeepNonNullable<Tstate_paymentRequest>;
    const {
      type,
      paymentAmount,
      營業稅,
      retainageRate,
      稅別,
      retainageAmount,
      invoiceBook,
      invoiceDate,
      invoiceNumber,
      invoiceAmount,
      customerName,
      customerNumber,
      customerTaxId,
    } = validPaymentRequest;

    const completedProduct = instance_salesOrderItem.stateArr.map((item) => ({
      salesOrderItemId: item.salesOrderItemId,
      completedQuantity: Number(item.completedQuantity),
      completedPayment: item.completedPayment ?? 0,
    }));

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
    //     retainageRate: Number(retainageRate), // 保留款%數 10 ,
    //     retainageAmount: Number(retainageAmount), // 保留款金額 61601,

    //     completedProduct: completedProduct,
    //   },
    //   invoice: {
    //     invoiceDate: invoiceDate.format('YYYY-MM-DD'), // 發票開立日期 "2025-05-03",
    //     invoiceNumber, // 發票號碼 "MV34400404",
    //     buyer: customerName, // 客戶抬頭 "一代冷氣空調有限公司",

    //     amount, // 發票金額 9524, //
    //     taxes, // 發票稅額 476, //
    //     totalAmount: Number(invoiceAmount), //總金額 10000, // UI上叫發票金額

    //     taxId: customerTaxId, // 統一編號 "54741781",
    //     taxAddress, // 發票地址 null,
    //     remark, // 備註 null ,

    //     invoiceBookId: invoiceBook.id, // 發票本Id "6600f3cb-d0f5-4a17-b88e-7eb7f002e354",
    //     period: `${invoiceBook.period}`, //發票期數 "3"
    //   },
    // };
  };

  const req_postInsertPaymentRequest = async () => {
    const body = createBody();

    // apiPostInsertPaymentRequest
  };

  const req_postInsertPrOffsetDetail = async ({
    state,
    accountant,
    destroy,
  }: {
    state: {
      date: Dayjs | null;
      amount: `${number}` | '';
      type: string;
      fee?: `${number}` | '';
      remarks: string;
    };
    accountant: TaccountantDto;
    destroy: () => void;
  }) => {
    const idNumber = userInfo?.employee?.idNumber;
    const paymentRequestId = paymentRequest?.id;
    const accountantId = accountant.id;
    const customerName = accountsReceivables?.customerName;
    const customerNumber = accountsReceivables?.customerNumber;
    const prOffsetDate = state.date?.toISOString();
    const type = state.type;

    let warningMessage = '';

    if (!idNumber) {
      warningMessage = '沒有員工ID';
    } else if (!paymentRequestId) {
      warningMessage = '請先建立請款單';
    } else if (!prOffsetDate) {
      warningMessage = '請先選擇沖銷日期';
    } else if (!customerName || !customerNumber) {
      warningMessage = '工程聯絡單沒有客戶資料';
    } else if (!type) {
      warningMessage = '請先選擇 請款類別/扣款類別';
    }

    if (warningMessage) {
      myAlert.warning({ title: warningMessage });

      return;
    }

    const body: Tbody_apiPostInsertPrOffsetDetail = {
      createdAt: new Date().toISOString(),
      createdBy: idNumber!,
      updatedAt: new Date().toISOString(),
      updatedBy: idNumber!,
      accountantId,
      paymentRequestId: paymentRequestId!,
      prOffsetDate: prOffsetDate!,
      prOffsetType: state.type, // 沖銷類別
      paymentCurrency: accountant.currency, // 請款幣別
      exchangeRate: Number(accountant.exchangeRate || 0), // 匯率
      paymentAmount: Number(state.amount || 0), // 沖銷金額
      // 與paymentAmount同一個來源
      totalAmount: Number(state.amount || 0),
      fee: state.fee === undefined ? null : Number(state.fee || 0), // 手續費
      customerNumber: customerNumber!,
      customerName: customerName!,
    };

    try {
      await apiPostInsertPrOffsetDetail(body, { returnError: true });
      destroy();
      update_paymentQuest();
    } catch (error) {}
  };

  // ----------------------------------------------------------------------------

  const completedPaymentTotal = useMemo(() => {
    return instance_salesOrderItem.stateArr
      .reduce((current, { completedPayment }) => {
        return current.add(new Decimal(completedPayment || 0));
      }, new Decimal(0))
      .toNumber();
  }, [instance_salesOrderItem.stateArr]);

  useEffect(() => {
    instance_paymentRequest.setPaymentAmount(`${completedPaymentTotal}`);
  }, [completedPaymentTotal]);

  // ----------------------------------------------------------------------------

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
      <SalesOrderItem className="mb-4" instance_salesOrderItem={instance_salesOrderItem} allowEdit={isNew} />
      {/* 目前累計 */}
      <CurrentlyAccumulated className="mb-10" data={accountsReceivables} />
      {/* 本次請款明細 含沖銷明細 */}
      <CurrentPaymentRequestDetails
        className="mb-10"
        instance_paymentRequest={instance_paymentRequest}
        onConfirm={req_postInsertPaymentRequest}
      >
        {!isNew && (
          <PrOffsetDetails
            prOffsetDetails={paymentRequest?.prOffsetDetails}
            onAddDataConfirm={req_postInsertPrOffsetDetail}
            onAddDeductionConfirm={req_postInsertPrOffsetDetail}
          />
        )}
      </CurrentPaymentRequestDetails>
      {/* 請款紀錄 */}
      <History paymentRequestLogs={paymentRequestLogs} />

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

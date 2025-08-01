import { useState, useEffect } from 'react';

import { axi_monkey } from '../_axiosCreator';

import type { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type {
  TapiParams,
  Tmeta,
  TpageResponse,
  TaccountsReceivablesList_Dto,
  TquotationListViewModel_Dto,
  TaccountsReceivable,
  TpaymentRequest_Dto,
} from './_schemas';

const apiGetAccountsReceivablesList = async (params?: TapiParams & { filter?: string }) => {
  // const api = '/api/AccountsReceivable/GetAccountsReceivablesList';
  // return axi_monkey.get<TaccountsReceivablesList_Dto[]>(api).then(({ data }) => data);

  const api = '/api/AccountsReceivable/GetAccountsReceivablesListPaged';

  return axi_monkey.get<TpageResponse<TaccountsReceivablesList_Dto>>(api, { params }).then(({ data }) => data);
};

const useApiGetAccountsReceivablesList = (
  params: TapiParams & { filter?: string } = {},
  { autoUpdate = true }: { autoUpdate?: boolean } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TpageResponse<TaccountsReceivablesList_Dto> | null>();

  const update = async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetAccountsReceivablesList(params).catch((err: AxiosError) => {
      console.error('useApiGetAccountsReceivablesList error:', err);

      setRes(null);

      return null;
    });

    setRes(res);
    setIsFetching(false);
  };

  useEffect(() => {
    autoUpdate && update();
  }, [params]);

  return {
    isFetching,
    data: res?.items,
    meta: res?.meta,
    update,
  };
};

const apiGetQuotationList = async (
  params?: TapiParams & {
    contractNumber?: string;
    customerName?: string;
    quotationNumber?: string;
    projectName?: string;
  }
) => {
  const api = '/api/AccountsReceivable/GetQuotationList';

  return axi_monkey.get<TpageResponse<TquotationListViewModel_Dto>>(api, { params }).then(({ data }) => data);
};

const useApiGetQuotationList = (
  params?: Parameters<typeof apiGetQuotationList>[0],
  { autoUpdate = true }: { autoUpdate?: boolean } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TpageResponse<TquotationListViewModel_Dto> | null>();

  const update = async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetQuotationList(params).catch((err: AxiosError) => {
      console.error('useApiGetQuotationList error:', err);

      setRes(null);

      return null;
    });

    setRes(res);
    setIsFetching(false);
  };

  useEffect(() => {
    autoUpdate && update();
  }, [params]);

  return {
    isFetching,
    data: res?.items,
    meta: res?.meta,
    update,
  };
};

//
//
//

// 經由報價單新增應收款
const apiQuotationToAccountsReceivables = async (quotationId: string) => {
  const api = '/api/AccountsReceivable/QuotationToAccountsReceivables';

  return axi_monkey
    .post<string>(api, quotationId, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({
        title: '新增應收款失敗',
        content: err.message,
      });

      return '';
    });
};

// 取得應收款
const apiGetAccountsReceivables = async (accountsReceivableId: string) => {
  const api = '/api/AccountsReceivable/GetAccountsReceivablesEditMode';

  const params = { id: accountsReceivableId };

  return axi_monkey.get<TaccountsReceivable>(api, { params }).then(({ data }) => data);
};

const useGetAccountsReceivables = (
  accountsReceivableId: string | undefined,
  {
    isAutoUpdate = true,
  }: {
    isAutoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TaccountsReceivable | null>();

  const update = async () => {
    if (isFetching || !accountsReceivableId) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetAccountsReceivables(accountsReceivableId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        myAlert.notify.error({ message: '無法取得應收款資料', description: err.message });
        setRes(null);

        return null;
      });

    setIsFetching(false);

    return res;
  };

  useEffect(() => {
    isAutoUpdate && update();
  }, [accountsReceivableId]);

  return {
    isFetching,
    data: res,
    update,
  };
};

// /api/AccountsReceivable/GetPaymentRequest?id=

const apiGetPaymentRequest = async (paymentRequestiId: string) => {
  const api = '/api/AccountsReceivable/GetPaymentRequest';

  const params = { id: paymentRequestiId };

  return axi_monkey.get<TpaymentRequest_Dto>(api, { params }).then(({ data }) => data);
};

const useGetPaymentRequest = (
  paymentRequestiId: string | undefined,
  {
    isAutoUpdate = true,
  }: {
    isAutoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TpaymentRequest_Dto | null>();

  const update = async () => {
    if (isFetching || !paymentRequestiId) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetPaymentRequest(paymentRequestiId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        myAlert.notify.error({ message: '無法取得應收請款資料', description: err.message });
        setRes(null);

        return null;
      });

    setIsFetching(false);

    return res;
  };

  useEffect(() => {
    isAutoUpdate && update();
  }, [paymentRequestiId]);

  return {
    isFetching,
    data: res,
    update,
  };
};

const apiGetARPaymentData = async (paymentRequestId: string) => {
  const api = '/api/AccountsReceivable/GetARPaymentData';

  const params = { paymentRequestId };

  return axi_monkey.get<Tres_apiGetARPaymentData>(api, { params }).then(({ data }) => data);
};

const useApiGetARPaymentData = (
  paymentRequestId: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<Tres_apiGetARPaymentData | null>();

  const update = async () => {
    if (isFetching || !paymentRequestId) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetARPaymentData(paymentRequestId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        myAlert.notify.error({ message: '無法取得應收付款資料', description: err.message });
        setRes(null);

        return null;
      });

    setIsFetching(false);

    return res;
  };

  useEffect(() => {
    autoUpdate && update();
  }, [paymentRequestId]);

  return {
    isFetching,
    data: res,
    update,
  };
};

const apiGetARPaymentDataInset = async (accountsReceivableId: string) => {
  const api = '/api/AccountsReceivable/GetARPaymentDataInset';

  const params = { accountsReceivableId };

  return axi_monkey.get<Tres_apiGetARPaymentDataInsert>(api, { params }).then(({ data }) => data);
};

const useApiGetARPaymentDataInset = (
  accountsReceivableId: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<Tres_apiGetARPaymentDataInsert | null>();

  const update = async () => {
    if (isFetching || !accountsReceivableId) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetARPaymentDataInset(accountsReceivableId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        myAlert.notify.error({ message: '無法取得應收付款資料', description: err.message });
        setRes(null);

        return null;
      });

    setIsFetching(false);

    return res;
  };

  useEffect(() => {
    autoUpdate && update();
  }, [accountsReceivableId]);

  return {
    isFetching,
    data: res,
    update,
  };
};

const apiPostInsertPaymentRequest = async (body: Tbody_insertPaymentRequest) => {
  const api = '/api/AccountsReceivable/InsertPaymentRequest';

  return axi_monkey.post(api, body).catch((err) => {
    const error = err as AxiosError;
    myAlert.err({
      title: '新增請款單失敗',
      content: error.message,
    });
  });
};

const apiPatchInsertPaymentRequest = async (body: Tbody_insertPaymentRequest) => {
  const api = '/api/AccountsReceivable/UpdateAccountsReceivables';

  return axi_monkey.patch(api, body).catch((err) => {
    const error = err as AxiosError;
    myAlert.err({
      title: '更新請款單失敗',
      content: error.message,
    });
  });
};

// 未上beta，回應404
const apiGetPaymentRequestType = async () => {
  const api = '/api/AccountsReceivable/GetPaymentRequestType';

  return axi_monkey.get<never>(api).then(({ data }) => data);
};

// ========================================================================

// MARK:Tres_apiGetARPaymentData
interface Tres_apiGetARPaymentData {
  // 目前累計
  accountsReceivables: {
    id: string; //應收帳款id
    accountsReceivableNumber: string; //應收帳款編號
    sourceType: string; //來源類型
    sourceId: string | null; //來源id
    customerNumber: string; //客戶編號
    customerName: string; //客戶名稱
    companyPhone: string; //公司電話
    companyFax: string; //公司傳真
    salesAmount: number | null; // 銷售金額
    taxes: number | null; //稅金
    salesCurrency: string; //幣別
    exchangeRate: number | null; //匯率
    foreignCurrencyAmount: number | null; //外幣金額
    prAmount: number | null; //已請款金額 總計
    collectAmount: number | null; //已收款項 總計
    uncollectedPayment: number | null; //未收款項 (已請款未收款項)
    totalAmount: number | null; //總金額
    createdAt: string | null; //建立時間
    updatedAt: string | null; //更新時間
    createdBy: string | null; //建立人
    updatedBy: string | null; //更新人
    status: string | null; //狀態
    deduction: number | null; //扣款金額
    quotationContractNumber: string | null; //合約編號
    projectName: string | null; //案場名稱
    salesOrderNumber: string | null; //銷售訂單編號
    taxId: string | null;
    taxDeductionCategory: string | null;
  };

  // 本次請款明細
  paymentRequest: {
    id: string | null; //請款單Id
    paymentRequestNumber: string | null; //請款單編號
    sourceFormType: string | null; //來源表單類型
    sourceFormId: string | null; //來源表單Id
    customerNumber: string; //客戶編號
    customerName: string; //客戶名稱
    createdAt: string | null; //建立時間
    createdBy: string | null; //建立人員
    updatedAt: string | null; //更新時間
    updatedBy: string | null; // 更新人員
    invoiceNumber: string | null; //發票號碼
    invoiceAmount: number | null; //發票金額
    accountsReceivableId: string | null; //應收帳款Id
    type: string; //請款單類型
    period: string; //請款單期別
    paymentCurrency: string; //請款幣別
    foreignCurrencyAmount: number | null; //外幣金額
    paymentAmount: number | null; //請款金額
    collect_amount: number | null; //已收金額,餘額在repo裡計算
    receipt_balance: number | null; //收款餘額
    deduction: number | null; //扣款金額

    //請款單沖銷明細 // 沖銷明細
    prOffsetDetails: {
      id: string | null; //沖銷明細Id
      prOffsetNumber: string | null; //沖銷編號
      accountantId: string | null; //會計收管管理Id
      paymentRequestId: string | null; //請款單Id
      prOffsetDate: string; //沖銷日期
      paymentCurrency: string | null; //請款幣別
      exchangeRate: number | null; //匯率
      paymentAmount: number; //收款金額
      settlementSerial: string | null; //結算序號
      isCashierSeen: boolean | null; //出納是否已查看
      isWorkSupervisorSeen: boolean | null; // 工作主管是否已查看
      isManagerSeen: boolean | null; // 總經理是否已查看
      declarationCurrency: string | null; // PostgreSQL enum 建議轉 string 處理
      declarationExchangeRate: number | null; // 申報匯率
      declarationCurrencyPayment: number | null; // 申報幣別收款金額
      declarationPayment: number | null; // 申報收款金額
      exchangeBenefits: number | null; // 匯兌利益
      customerNumber: string | null; // 客戶編號
      customerName: string | null; // 客戶名稱
      fee: number | null; // 手續費
      totalAmount: number | null; // 總金額
      account: string | null; // 會計科目
      createdAt: string | null; //建立時間
      createdBy: string | null; //建立人員
      updatedAt: string | null; //更新時間
      updatedBy: string | null; // 更新人員
    }[];
  };
  salesOrder: {
    id: string; //銷售訂單id
    salesOrderNumber: string; //銷售訂單編號
    customerId: string; //客戶id
    customerNumber: string; //客戶編號
    customerName: string; //客戶名稱
    constructionSite: string; //工地名稱
    companyPhone: string; //公司電話
    companyFax: string; //公司傳真
    address: string; //地址
    salesCurrency: string; //幣別
    exchangeRate: number | null; //匯率
    currencyAmount: number | null; //外幣金額
    salesAmount: number | null; //銷售金額
    taxes: number | null; //稅金
    changedAmount: number | null; //追加減金額
    changedTaxes: number | null; //追加減稅金
    totalAmount: number | null; //總金額
    createdAt: string; //建立時間
    updatedAt: string; //更新時間
    createdBy: string | null; //建立人員
    updatedBy: string | null; //更新人員
    status: number | null; //狀態
    sourceType: string; //來源類型
    sourceId: string | null; //來源id
    quotationNumber: string | null; //報價單編號
    //銷貨明細  // 工程項目明細
    salesOrderItems: {
      id: string; //銷貨明細id
      itemNumber: string; //項目編號
      salesOrderNumber: string; //銷售訂單編號
      productId: string; //產品id
      discount: number | null; //折扣
      productName: string; //產品名稱
      productNumber: string; //產品編號
      unitPrice: number | null; //單價
      quantity: number | null; //數量
      amount: number | null; //金額
      taxes: number | null; //稅金
      attachedToProductId: string | null; //附加產品id
      dualPrice: number; //牌價
    }[];
  };
}

// MARK:Tres_apiGetARPaymentDataInsert
type Tres_apiGetARPaymentDataInsert = Omit<Tres_apiGetARPaymentData, 'paymentRequest'> & { paymentRequest: null };

// MARK:Tbody_insertPaymentRequest
interface Tbody_insertPaymentRequest {
  paymentRequest: {
    createdAt: string; // 建立時間,
    createdBy: string; // 建立人員(員工編號),
    updatedAt: string; //  修改時間,
    updatedBy: string; // 修改人員(員工編號),

    accountsReceivableId: string; // 應收帳款Id,
    sourceFormType: string; //  來源類別-accountsReceivableList.sourceType,
    sourceFormId: string; // 來源ID-accountsReceivableList.sourceId,

    customerNumber: string; // 客戶編號,
    customerName: string; // 客戶名稱,

    type: string; // 請款類別 "訂金"、"支軌"、"安裝"...,

    paymentCurrency: string; // 請款幣別,
    foreignCurrencyAmount: string; // 外幣金額,
    paymentAmount: string; // 請款金額
  };
  // 有發票號碼的話要加invoice
  invoice?: {
    invoiceBookId: string; // 發票本Id "6600f3cb-d0f5-4a17-b88e-7eb7f002e354",
    invoiceNumber: string; // 發票號碼 "MV34400404",
    invoiceDate: string; // 發票開立日期 "2025-05-03",
    period: string; //發票期數 "3" // 發票本的期數

    buyer: string; // 客戶抬頭 "一代冷氣空調有限公司",
    taxId: string; //  統一編號 "54741781",
    taxAddress: string | null; //  發票地址 null,

    amount: string; // 發票金額 9524,
    taxes: string; // 發票稅額 476,
    totalAmount: number; // 總金額 10000,

    remark: string | null; // 備註 null ,
  };
}

// ========================================================================
export type { TaccountsReceivablesList_Dto, TquotationListViewModel_Dto, TaccountsReceivable, TpaymentRequest_Dto };

export type { Tres_apiGetARPaymentData, Tres_apiGetARPaymentDataInsert };

export {
  apiQuotationToAccountsReceivables,
  apiGetARPaymentDataInset as apiGetARPaymentDataInsert,
  apiPostInsertPaymentRequest,
  apiPatchInsertPaymentRequest,
};

export {
  useApiGetAccountsReceivablesList,
  useApiGetQuotationList,
  useGetAccountsReceivables,
  useGetPaymentRequest,
  useApiGetARPaymentData,
  useApiGetARPaymentDataInset as useApiGetARPaymentDataInsert,
};

export { apiGetPaymentRequestType };

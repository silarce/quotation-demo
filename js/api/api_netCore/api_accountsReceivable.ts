import { useState, useEffect } from 'react';

import { axi_monkey } from '../_axiosCreator';

import type { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import type {
  TapiParams,
  Tmeta,
  TpageResponse,
  Guid,
  decimal,
  DateTime,
  int,
  TaccountsReceivablesList_Dto,
  TquotationListViewModel_Dto,
  TaccountsReceivable,
  TpaymentRequest_Dto,
  TinsertpaymentRequest,
  Tres_apiGetARPaymentData,
  Tres_apiGetARPaymentDataInset,
  Tbody_updatePRInvoice,
} from './schemas';

import type { TemployeeDto } from '../dtoTypes';

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

  return axi_monkey.get<Tres_apiGetARPaymentDataInset>(api, { params }).then(({ data }) => data);
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
  const [res, setRes] = useState<Tres_apiGetARPaymentDataInset | null>();

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

const apiPostInsertPaymentRequest = async (body: TinsertpaymentRequest) => {
  const api = '/api/AccountsReceivable/InsertPaymentRequest';

  return axi_monkey
    .post<string>(api, body)
    .then(({ data: paymentQuestId }) => paymentQuestId)
    .catch((err) => {
      const error = err as AxiosError;
      myAlert.err({
        title: '新增請款單失敗',
        content: error.message,
      });
    });
};

const apiPatchInsertPaymentRequest = async (body: Tbody_updatePRInvoice) => {
  const api = '/api/Invoice/UpdatePRInvoice';

  return axi_monkey.put(api, body).catch((err) => {
    const error = err as AxiosError;
    myAlert.err({
      title: '更新請款單失敗',
      content: error.message,
    });
  });
};

const apiGetPaymentRequestType = async () => {
  const api = '/api/AccountsReceivable/GetPaymentRequestType';

  return axi_monkey
    .get<
      {
        codeName: string;
        name: string;
      }[]
    >(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.notify.error({
        message: '取得請款單類型失敗',
      });
      console.error('apiGetPaymentRequestType error:', err);
    });
};

const useApiGetPaymentRequestType = ({
  autoUpdate = true,
}: {
  autoUpdate?: boolean;
} = {}) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<{ codeName: string; name: string }[] | null>();

  const update = async () => {
    if (isFetching) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetPaymentRequestType();

    if (!res) {
      setIsFetching(false);
      setRes(null);

      return null;
    }

    setRes(res);
    setIsFetching(false);

    return res;
  };

  useEffect(() => {
    autoUpdate && update();
  }, []);

  return {
    isFetching,
    data: res,
    update,
  };
};

interface Tbody_apiInsertSalesOrderData {
  CustomerId: Guid | null; //客戶id
  CustomerNumber: string | null; //客戶編號
  CustomerName: string; //客戶名稱
  ConstructionSite: string; //工地名稱
  CompanyPhone: string; //公司電話
  CompanyFax: string; //公司傳真
  Address: string; //地址
  SalesCurrency: string; //幣別
  ExchangeRate: decimal | null; //匯率
  CurrencyAmount: decimal | null; //外幣金額
  SalesAmount: decimal; //銷售金額
  Taxes: decimal; //稅金
  ChangedAmount: decimal | null; //追加減金額
  ChangedTaxes: decimal | null; //追加減稅金
  TotalAmount: decimal; //總金額
  CreatedAt: DateTime | null; //建立時間
  UpdatedAt: DateTime | null; //更新時間
  CreatedBy: string | null; //建立人員
  UpdatedBy: string | null; //更新人員
  Status: int | null; //狀態
  SourceType: string; //來源類型
  SourceId: Guid | null; //來源id(合約ID)
  QuotationNumber: string | null; //報價單編號
  QuotationContractNumber: string | null; //合約編號
  TaxId: string | null; //統一編號
  TaxDeductionCategory: string | null; //稅別
  InvoiceType: string | null; //發票類型
  SalesOrderItems: {
    Id: Guid | null; //銷貨明細id
    ItemNumber: string | null; //項目編號
    SalesOrderNumber: string; //銷售訂單編號
    ProductId: Guid; //產品id
    Discount: decimal | null; //折扣
    ProductName: string; //產品名稱
    ProductNumber: string; //產品編號
    UnitPrice: decimal | null; //單價
    Quantity: decimal | null; //數量
    Amount: decimal | null; //金額
    Taxes: decimal | null; //稅金
    AttachedToProductId: Guid | null; //附加產品id
    DualPrice: decimal | null; //牌價
  }[]; //銷貨明細
}

const apiInsertSalesOrderData = async (body: Tbody_apiInsertSalesOrderData) => {
  const api = '/api/AccountsReceivable/InsertSalesOrderData';

  return axi_monkey.post(api, body).catch((err) => {
    myAlert.err({
      title: '新增銷售單失敗',
    });
  });
};

interface Tbody_apiUpdateSalesOrderData {
  Id: Guid; //銷售訂單id
  SalesOrderNumber: string; //銷售訂單編號
  CustomerId: Guid | null; //客戶id
  CustomerNumber: string | null; //客戶編號
  CustomerName: string; //客戶名稱
  ConstructionSite: string; //工地名稱
  CompanyPhone: string; //公司電話
  CompanyFax: string; //公司傳真
  Address: string; //地址
  SalesCurrency: string; //幣別
  ExchangeRate: decimal | null; //匯率
  CurrencyAmount: decimal | null; //外幣金額
  SalesAmount: decimal; //銷售金額
  Taxes: decimal; //稅金
  ChangedAmount: decimal | null; //追加減金額
  ChangedTaxes: decimal | null; //追加減稅金
  TotalAmount: decimal; //總金額
  CreatedAt: DateTime; //建立時間
  UpdatedAt: DateTime; //更新時間
  CreatedBy: string | null; //建立人員
  UpdatedBy: string | null; //更新人員
  Status: int | null; //狀態
  SourceType: string; //來源類型
  SourceId: Guid | null; //來源id(合約ID)
  QuotationNumber: string | null; //報價單編號
  QuotationContractNumber: string | null; //報價單合約編號
  TaxId: string | null; //統一編號
  TaxDeductionCategory: string | null; //稅別
  InvoiceType: string | null; //發票類型
  SalesOrderItems: {
    Id: Guid; //銷貨明細id
    ItemNumber: string; //項目編號
    SalesOrderNumber: string; //銷售訂單編號
    ProductId: Guid; //產品id
    Discount: decimal | null; //折扣
    ProductName: string; //產品名稱
    ProductNumber: string; //產品編號
    UnitPrice: decimal | null; //單價
    Quantity: decimal | null; //數量
    Amount: decimal | null; //金額
    Taxes: decimal | null; //稅金
    AttachedToProductId: Guid | null; //附加產品id
    DualPrice: decimal | null; //牌價
  }[]; //銷貨明細
}

const apiUpdateSalesOrderData = async (body: Tbody_apiUpdateSalesOrderData) => {
  const api = '/api/AccountsReceivable/UpdateSalesOrderData';

  return axi_monkey.patch(api, body).catch((err) => {
    myAlert.err({
      title: '更新銷售單失敗',
    });
  });
};

interface Tres_apiGetSalesOrderById {
  id: string;
  salesOrderNumber: string;
  customerId: string;
  customerNumber: string;
  customerName: string;
  constructionSite: string;
  companyPhone: string;
  companyFax: string;
  address: string;
  salesCurrency: string;
  exchangeRate: number | null;
  currencyAmount: number | null;
  salesAmount: number | null;
  taxes: number | null;
  changedAmount: number | null;
  changedTaxes: number | null;
  totalAmount: number | null;
  createdAt: string | null;
  updatedAt: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  status: number | null;
  sourceType: string | null;
  sourceId: string | null;
  salesOrderItems: {
    id: string;
    itemNumber: null;
    salesOrderNumber: string | null;
    productId: string | null;
    discount: number | null;
    productName: string | null;
    productNumber: string | null;
    unitPrice: number | null;
    quantity: number | null;
    amount: number | null;
    taxes: number | null;
    attachedToProductId: string | null;
    dualPrice: number | null;
  }[];
}

const apiGetSalesOrderById = async (salesOrderId: string) => {
  const api = '/api/AccountsReceivable/GetSalesOrderById';
  const params = { id: salesOrderId };

  return axi_monkey.get<Tres_apiGetSalesOrderById>(api, { params }).then(({ data }) => data);
};

const useApiGetSalesOrderById = (
  salesOrderId: string | undefined,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<Tres_apiGetSalesOrderById | null>();

  const update = async () => {
    if (isFetching || !salesOrderId) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetSalesOrderById(salesOrderId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        myAlert.notify.error({ message: '無法取得銷售單資料', description: err.message });
        setRes(null);

        return null;
      });
    setIsFetching(false);

    return res;
  };

  useEffect(() => {
    autoUpdate && update();
  }, [salesOrderId]);

  return {
    isFetching,
    data: res,
    update,
  };
};

interface Tbody_apiPostInsertPrOffsetDetail {
  createdAt: string; //建立時間
  createdBy: TemployeeDto['idNumber']; // `EM-${number}-${number}` //建立人員
  updatedAt: string; //修改時間
  updatedBy: TemployeeDto['idNumber']; // `EM-${number}-${number}` //修改人員

  accountantId: string; //會計收管管理Id
  paymentRequestId: string; //請款單Id

  prOffsetDate: string; //沖銷日期
  prOffsetType: string; //沖銷類別
  paymentCurrency: string; //請款幣別
  exchangeRate: number; //匯率

  paymentAmount: number; //收款金額
  customerNumber: string; // 客戶編號
  customerName: string; //客戶名稱
  fee: number | null; //手續費
  totalAmount: number; //收款金額
}

const apiPostInsertPrOffsetDetail = async (
  body: Tbody_apiPostInsertPrOffsetDetail,
  {
    returnError = false,
  }: {
    returnError?: boolean;
  } = {}
) => {
  const api = '/api/AccountsReceivable/InsertPrOffsetDetail';

  return axi_monkey.post(api, body).catch((err) => {
    const error = err as AxiosError;
    myAlert.err({
      title: '新增請款單失敗',
      content: error.message,
    });

    if (returnError) {
      return Promise.reject(error);
    }
  });
};

// ========================================================================
export type {
  TaccountsReceivablesList_Dto,
  TquotationListViewModel_Dto,
  TaccountsReceivable,
  TpaymentRequest_Dto,
  TinsertpaymentRequest,
};

export type {
  Tres_apiGetARPaymentData,
  Tres_apiGetARPaymentDataInset as Tres_apiGetARPaymentDataInsert,
  Tbody_apiPostInsertPrOffsetDetail,
  Tbody_updatePRInvoice,
};

export {
  apiQuotationToAccountsReceivables,
  apiGetARPaymentDataInset as apiGetARPaymentDataInsert,
  apiPostInsertPaymentRequest,
  apiPatchInsertPaymentRequest,
  apiInsertSalesOrderData,
  apiUpdateSalesOrderData,
  apiPostInsertPrOffsetDetail,
};

export {
  useApiGetAccountsReceivablesList,
  useApiGetQuotationList,
  useGetAccountsReceivables,
  useGetPaymentRequest,
  useApiGetARPaymentData,
  useApiGetARPaymentDataInset,
  useApiGetPaymentRequestType,
};

export { apiGetPaymentRequestType };

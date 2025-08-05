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
  TinsertpaymentRequest,
  Tres_apiGetARPaymentData,
  Tres_apiGetARPaymentDataInset,
} from './schemas';

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

  return axi_monkey.post(api, body).catch((err) => {
    const error = err as AxiosError;
    myAlert.err({
      title: '新增請款單失敗',
      content: error.message,
    });
  });
};

const apiPatchInsertPaymentRequest = async (body: unknown) => {
  const api = '/api/AccountsReceivable/UpdateAccountsReceivables';

  return axi_monkey.patch(api, body).catch((err) => {
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

// ========================================================================
export type {
  TaccountsReceivablesList_Dto,
  TquotationListViewModel_Dto,
  TaccountsReceivable,
  TpaymentRequest_Dto,
  TinsertpaymentRequest,
};

export type { Tres_apiGetARPaymentData, Tres_apiGetARPaymentDataInset as Tres_apiGetARPaymentDataInsert };

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
  useApiGetARPaymentDataInset,
  useApiGetPaymentRequestType,
};

export { apiGetPaymentRequestType };

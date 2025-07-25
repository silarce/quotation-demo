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

const apiQuotationToAccountsReceivables = async (quotationId: string) => {
  const api = '/api/AccountsReceivable/QuotationToAccountsReceivables';

  return axi_monkey
    .post<string>(api, quotationId, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then(({ data }) => data);
};

const apiGetAccountsReceivables = async (accountsReceivableId: string) => {
  const api = '/api/AccountsReceivable/GetAccountsReceivablesEditMode';

  const params = { id: accountsReceivableId };

  return axi_monkey.get<TaccountsReceivable>(api, { params }).then(({ data }) => data);
};

// ========================================================================

const getAccountsReceivableFromQuotation = async (quotationId: string) => {
  try {
    const accountsReceivableId = await apiQuotationToAccountsReceivables(quotationId);

    return await apiGetAccountsReceivables(accountsReceivableId);
  } catch (error) {
    const err = error as AxiosError;
    console.error('getAccountsReceivableFromQuotation error:', err);
    myAlert.err({
      title: '錯誤',
      content: `無法從報價單 ${quotationId} 取得應收帳款資料。`,
    });

    return null;
  }
};

// ========================================================================
export type { TaccountsReceivablesList_Dto, TquotationListViewModel_Dto };

export { apiQuotationToAccountsReceivables };

export { useApiGetAccountsReceivablesList, useApiGetQuotationList };

export { getAccountsReceivableFromQuotation };

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';

import { createUseInfinite } from './createUseInfinite';

// type
import type {
  //
  Tparams,
  TpageMetaDto,
  TpageResponse,
  TaccountantDto,
  TcreateAccountantDto,
  TupdateAccountantDto,
  TupdateAccountantDeductionDto,
  TupdateAccountReceivableDeductionDto,
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
  TaccountantExchangeFromDto,
  TcreateAccountantExchangeFromDto,
  TaccountantInvoiceBookDto,
  TcreateAccountantInvoiceBookDto,
  TupdateAccountantInvoiceBookDto,
  TapiError,
} from './dtoTypes';

export type {
  //
  Tparams,
  TpageMetaDto,
  TpageResponse,
  TaccountantDto,
  TcreateAccountantDto,
  TupdateAccountantDto,
  TupdateAccountantDeductionDto,
  TupdateAccountReceivableDeductionDto,
  TaccountantPresetDto,
  TcreateAccountantPresetDto,
  TupdateAccountantPresetDto,
  TaccountantExchangeFromDto,
  TcreateAccountantExchangeFromDto,
  TaccountantInvoiceBookDto,
  TcreateAccountantInvoiceBookDto,
  TupdateAccountantInvoiceBookDto,
} from './dtoTypes';

type TgetAccountant = TpageResponse<TaccountantDto>;

const apiGetAccountant = async (params?: Tparams) => {
  const api = '/accountant';

  return axi
    .get<TgetAccountant>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

const useGetAccountant_infinite = createUseInfinite<TgetAccountant>({
  apiClient: apiGetAccountant,
  errTitle: '取得收款紀錄列表失敗',
});

const useGetAccountant = ({
  params,
  autoUpdate = true,
  callAlert = true,
}: {
  params?: Tparams;
  autoUpdate?: boolean;
  callAlert?: boolean;
} = {}) => {
  const [res, setRes] = useState<TgetAccountant>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(async () => {
    setIsFetching(true);

    try {
      const res = await apiGetAccountant(params);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      callAlert &&
        myAlert.err({
          title: '取得收款紀錄列表失敗',
          content: err.message,
        });

      return err;
    } finally {
      setIsFetching(false);
    }
  }, [callAlert, params]);

  useEffect(() => {
    autoUpdate && update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoUpdate, params]);

  const list = useMemo(() => {
    const list: { [id: string]: TaccountantDto } = {};

    res?.data.forEach((item) => {
      list[item.id] = item;
    });

    return list;
  }, [res]);

  return {
    data: res?.data,
    dataList: list,
    meta: res?.meta,
    update,
    isFetching,
  };
};

const apiGetAccountant_id = async (id: string, params?: Tparams) => {
  const api = `/accountant/${id}`;

  return axi
    .get<TaccountantDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetAccountant_id = (
  id: string | undefined | null,
  {
    //
    autoUpdate = true,
    params,
  }: {
    //
    autoUpdate?: boolean;
    params?: Tparams;
  } = {}
) => {
  //
  params = {
    populate: [
      //
      'invoices',
      'incomeBill.accountsReceivableDeduction',
      'accountsReceivableDeduction',
      'exchangeFrom',
    ],
    ...params,
  };

  const [res, setRes] = useState<TaccountantDto>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);

    try {
      const res = await apiGetAccountant_id(id, params);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得收款紀錄失敗',
        content: err.message,
      });

      return err;
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  useEffect(() => {
    autoUpdate && update();
  }, [update]);

  return {
    data: res,
    update,
    isFetching,
  };
};

const apiPostAccountant = async ({
  //
  body,
  callAlert = true,
}: {
  body: TcreateAccountantDto;
  callAlert?: boolean;
}) => {
  const api = '/accountant';

  return axi
    .post<TaccountantDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      callAlert && myAlert.err({ title: '新增收款紀錄失敗', content: err.message });

      return Promise.reject(err);
    });
};

const apiPatchAccountant = async (
  id: string,
  {
    //
    body,
    callAlert = true,
  }: {
    body: TupdateAccountantDto;
    callAlert?: boolean;
  }
) => {
  const api = `/accountant/${id}`;

  return axi
    .patch<TaccountantDto>(api, body)
    .then(({ data }) => data)
    .catch((err: AxiosError<TapiError>) => {
      callAlert && myAlert.err({ title: '更新收款紀錄失敗', content: err.response?.data.message ?? err.message });

      return Promise.reject(err);
    });
};

const deleteAccountant = async (
  id: string,
  {
    callAlert = true,
  }: {
    callAlert?: boolean;
  } = {}
) => {
  const api = `/accountant/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => {
      callAlert && myAlert.err({ title: '刪除收款紀錄失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 棄用
// 以 id 更新 匯費和扣款明細與排序
// // const apiPatchAccountant_accountReceivable = async (
// //   id: string,
// //   body: TupdateAccountantDeductionDto,
// //   {
// //     callAlert = true,
// //   }: {
// //     callAlert?: boolean;
// //   } = {}
// // ) => {
// //   const api = `/accountant/${id}/account-receivable`;
//
// //   return axi
// //     .patch(api, body)
// //     .then(({ data }) => data)
// //     .catch((err) => {
// //       callAlert && myAlert.err({ title: '更新收款紀錄失敗', content: err.message });
//
// //       return Promise.reject(err);
// //     });
// // };

const apiGetAccountantPreset = async (params?: Tparams) => {
  const api = '/accountant-preset';

  return axi
    .get<TpageResponse<TaccountantPresetDto>>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

const useGetAccountantPreset = ({
  params,
  autoUpdate = true,
  callAlert,
}: {
  params?: Tparams;
  autoUpdate?: boolean;
  callAlert?: boolean;
} = {}) => {
  params = {
    sort: 'createdAt',
    ...params,
  };

  const [res, setRes] = useState<TpageResponse<TaccountantPresetDto>>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(async () => {
    setIsFetching(true);

    try {
      const res = await apiGetAccountantPreset(params);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      callAlert &&
        myAlert.err({
          title: '取得銀行帳戶列表失敗',
          content: err.message,
        });

      return err;
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    autoUpdate && update();
  }, [update]);

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isFetching,
  };
};

const apiGetAccountantExchangeFrom = async (id: string) => {
  const api = `/accountant-exchange-from/${id}`;

  const params = {
    populate: ['accountant'],
  };

  return axi
    .get<TaccountantExchangeFromDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetAccountantExchangeFrom = (id: string, { autoUpdate = true }: { autoUpdate?: boolean } = {}) => {
  const [res, setRes] = useState<TaccountantExchangeFromDto>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(async () => {
    setIsFetching(true);

    try {
      const res = await apiGetAccountantExchangeFrom(id);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得匯費資料失敗',
        content: err.message,
      });

      return err;
    } finally {
      setIsFetching(false);
    }
  }, [id]);

  useEffect(() => {
    autoUpdate && update();
  }, [update]);

  return {
    data: res,
    update,
    isFetching,
  };
};

export const apiPostAccountantExchangeFrom = async (
  body: TcreateAccountantExchangeFromDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = '/accountant-exchange-from';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      callAlert &&
        myAlert.err({
          title: '新增票據兌現失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

// ==============================================================================

// MARK: invoice-book

const apiGetAccountantInvoiceBook = async (params?: Tparams) => {
  const api = '/accountant-invoice-book';

  return axi
    .get<TpageResponse<TaccountantInvoiceBookDto>>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

const useGetAccountantInvoiceBook = ({
  params,
  autoUpdate = true,
  callAlert = true,
  reducer: reducer,
}: {
  params?: Tparams;
  autoUpdate?: boolean;
  callAlert?: boolean;
  reducer?: (data: TaccountantInvoiceBookDto[]) => TaccountantInvoiceBookDto[];
} = {}) => {
  const [res, setRes] = useState<TpageResponse<TaccountantInvoiceBookDto>>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(async () => {
    setIsFetching(true);

    try {
      const res = await apiGetAccountantInvoiceBook(params);

      if (reducer) {
        res.data = reducer(res.data);
      }

      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      callAlert &&
        myAlert.err({
          title: '取得發票簿列表失敗',
          content: err.message,
        });

      return err;
    } finally {
      setIsFetching(false);
    }
  }, [params]);

  const clearData = () => {
    setRes(undefined);
  };

  useEffect(() => {
    autoUpdate && update();
  }, [params]);

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    clearData,
    isFetching,
  };
};

const useGetAccountantInvoiceBook_infinite = createUseInfinite<TpageResponse<TaccountantInvoiceBookDto>>({
  apiClient: apiGetAccountantInvoiceBook,
  errTitle: '取得發票本列表失敗',
});

const apiPostAccountantInvoiceBook = async (
  body: TcreateAccountantInvoiceBookDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = '/accountant-invoice-book';

  return axi
    .post<TaccountantInvoiceBookDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      callAlert &&
        myAlert.err({
          title: '新增發票簿失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

const apiPatchAccountantInvoiceBook = async (
  id: string,
  body: TupdateAccountantInvoiceBookDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = `/accountant-invoice-book/${id}`;

  return axi
    .patch<TaccountantInvoiceBookDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      callAlert &&
        myAlert.err({
          title: '更新發票簿失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

const deleteAccountantInvoiceBook = async (id: string, { callAlert = true }: { callAlert?: boolean } = {}) => {
  const api = `/accountant-invoice-book/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => {
      callAlert &&
        myAlert.err({
          title: '刪除發票簿失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

// ==============================================================================
export {
  apiGetAccountant,
  apiPostAccountant,
  apiPatchAccountant,
  deleteAccountant,
  //  // apiPatchAccountant_accountReceivable,
  apiPostAccountantInvoiceBook,
  apiPatchAccountantInvoiceBook,
  deleteAccountantInvoiceBook,
  //
  useGetAccountant_infinite,
  useGetAccountant,
  useGetAccountantPreset,
  useGetAccountantInvoiceBook,
  useGetAccountantInvoiceBook_infinite,
};

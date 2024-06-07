import { useState, useEffect, useCallback } from 'react';
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
}) => {
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

  return {
    data: res?.data,
    meta: res?.meta,
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
    .catch((err) => {
      callAlert && myAlert.err({ title: '更新收款紀錄失敗', content: err.message });

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

// 以 id 更新 手續費和扣款明細與排序
const apiPatchAccountant_accountReceivable = async (
  id: string,
  body: TupdateAccountantDeductionDto,
  {
    callAlert = true,
  }: {
    callAlert?: boolean;
  } = {}
) => {
  const api = `/accountant/${id}/account-receivable`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => {
      callAlert && myAlert.err({ title: '更新收款紀錄失敗', content: err.message });

      return Promise.reject(err);
    });
};

export {
  apiGetAccountant,
  apiPostAccountant,
  apiPatchAccountant,
  deleteAccountant,
  apiPatchAccountant_accountReceivable,
  //
  useGetAccountant_infinite,
  useGetAccountant,
};

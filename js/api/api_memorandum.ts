import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';

import { createUseInfinite } from './createUseInfinite';

import {
  //
  Tparams,
  TpageMetaDto,
  TfileDto,
  TmemorandumDto,
  Tpopulate_memorandumDto,
  TcreateMemorandumDto,
} from 'js/api/dtoTypes';

type TgetMemorandum<P extends Tpopulate_memorandumDto = Tpopulate_memorandumDto> = {
  data: TmemorandumDto<P>[];
  meta: TpageMetaDto;
};

export type { Tparams, TpageMetaDto, TfileDto, TmemorandumDto, TcreateMemorandumDto };

// ============================================================================

// /memorandum/contract/{id}

async function apiGetMemorandum<P extends Tpopulate_memorandumDto = Tpopulate_memorandumDto>(
  contractId: string,
  params?: Tparams
) {
  const api = `memorandum/contract/${contractId}`;

  params = {
    ...params,
  };

  return axi
    .get<TgetMemorandum<P>>(api, { params })
    .then(({ data }) => data)
    .catch((error) => Promise.reject(error));
}

export function useGetMemorandum<P extends Tpopulate_memorandumDto = Tpopulate_memorandumDto>(
  contractId: string | undefined | null,
  {
    customParams,
    onError,
    showAlert = true,
  }: {
    customParams?: Tparams;
    onError?: (error: AxiosError) => void;
    showAlert?: boolean;
  } = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TgetMemorandum<P>>();

  const params = {
    ...customParams,
  };

  const update = async () => {
    if (!contractId) {
      return;
    }

    setIsFetching(true);

    return await apiGetMemorandum<P>(contractId, params)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((error) => {
        setRes(undefined);
        const err = error as AxiosError;
        showAlert && myAlert.err({ title: '取得備忘錄列表失敗', content: err.message });
        onError && onError(err);

        return Promise.reject(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isFetching,
  };
}

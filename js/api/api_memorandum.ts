import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './axiosCreator';
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

async function apiGetMemorandum_id(memorandumId: string) {
  const api = `memorandum/${memorandumId}`;
  const params = {
    populate: ['poster', 'recipient'],
  };

  return axi
    .get<
      TmemorandumDto<{
        poster: true;
        recipient: true;
      }>
    >(api, { params })
    .then(({ data }) => data)
    .catch((error) => Promise.reject(error));
}

export function useGetMemorandum_id(
  memorandumId: string | undefined | null,
  {
    onError,
    showAlert = true,
  }: {
    onError?: (error: AxiosError) => void;
    showAlert?: boolean;
  } = {}
) {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<
    TmemorandumDto<{
      poster: true;
      recipient: true;
    }>
  >();

  const update = async () => {
    if (!memorandumId) {
      return;
    }

    setIsFetching(true);

    return await apiGetMemorandum_id(memorandumId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((error) => {
        setRes(undefined);
        const err = error as AxiosError;
        showAlert && myAlert.err({ title: '取得備忘錄失敗', content: err.message });
        onError && onError(err);

        return Promise.reject(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  // const reducer_addMemorandum = (newMemorandumId: string) => {
  //   setRes((res) => {
  //     if (!res) {
  //       return res;
  //     }

  //     return {
  //       ...res,
  //       mailThread: [...(res.mailThread ?? []), newMemorandumId],
  //     };
  //   });
  // };

  return {
    data: res,
    update,
    isFetching,
    // reducer_addMemorandum,
  };
}

export const apiPostMemorandum = async (contractId: string, body: TcreateMemorandumDto) => {
  const api = `/memorandum/contract/${contractId}`;

  return axi
    .post<TmemorandumDto>(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      myAlert.err({ title: '新增備忘錄失敗', content: error.message });

      return Promise.reject(error);
    });
};

const apiGetMemorandumAttachments = async (memorandumId: string) => {
  const api = `/memorandum/${memorandumId}/attachments`;

  return axi
    .get<TfileDto[]>(api)
    .then(({ data }) => data)
    .catch((error) => Promise.reject(error));
};

export const useGetMemorandumAttachments = (
  memorandumId: string | undefined | null,
  {
    onError,
    showAlert = true,
  }: {
    onError?: (error: AxiosError) => void;
    showAlert?: boolean;
  } = {}
) => {
  const [isFetching, setIsFetching] = useState(false);
  const [res, setRes] = useState<TfileDto[]>();

  const update = async () => {
    if (!memorandumId) {
      return;
    }

    setIsFetching(true);

    return await apiGetMemorandumAttachments(memorandumId)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((error) => {
        setRes(undefined);
        const err = error as AxiosError;
        showAlert && myAlert.err({ title: '取得備忘錄附件失敗', content: err.message });
        onError && onError(err);

        return Promise.reject(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    data: res,
    update,
    isFetching,
  };
};

export const apiPostMemorandumAttachments = async (memorandumId: string, body: FormData) => {
  const api = `/memorandum/${memorandumId}/attachments`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      return Promise.reject(err);
    });
};

// 發email
export const apiPostMemorandumEmail = (memorandumId: string) => {
  const api = `/memorandum/email/${memorandumId}`;

  return axi
    .post(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '發送Email失敗', content: err.message });

      return Promise.reject(error);
    });
};

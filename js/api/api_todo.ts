import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';

import { createUseInfinite } from './createUseInfinite';

import type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  Tpopulate_todoDto,
  //
  TtodoDto,
  TtodoContactDto,
  TcreateTodoDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  //
  TtodoDto,
  TtodoContactDto,
  TcreateTodoDto,
};

type TgetTodo<P extends Tpopulate_todoDto = Partial<Tpopulate_todoDto>> = TpageResponse<TtodoDto<P>>;

// ==================================================================

async function apiGetTodo<P extends Tpopulate_todoDto = Partial<Tpopulate_todoDto>>(params?: Tparams) {
  const api = '/todo';

  return axi
    .get<TgetTodo<P>>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
}

export async function UseGetTodo<P extends Tpopulate_todoDto = Partial<Tpopulate_todoDto>>(params?: Tparams) {
  const [res, setRes] = useState<TgetTodo<P>>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    try {
      setIsLoading(true);
      const res = await apiGetTodo(params);
      setRes(res);
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得待辦事項失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isLoading,
  };
}

export const apiPostTodo = async (body: TcreateTodoDto[], { callAlert = true }: { callAlert?: boolean } = {}) => {
  const api = '/todo';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      callAlert &&
        myAlert.err({
          title: '新增待辦事項失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

export const apiPatchTodo = async (body: TcreateTodoDto[], { callAlert = true }: { callAlert?: boolean } = {}) => {
  const api = '/todo';

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      callAlert &&
        myAlert.err({
          title: '修改待辦事項失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

export const apiDeleteTodo = async (id: string, { callAlert = true }: { callAlert?: boolean } = {}) => {
  const api = `/todo/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      callAlert &&
        myAlert.err({
          title: '刪除待辦事項失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

export const apiPatchCreateDispatching = async (id: string) => {
  const api = `/todo/${id}/create-dispatching`;

  return axi
    .patch(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({
        title: '派工失敗',
        content: err.message,
      });

      return Promise.reject(err);
    });
};

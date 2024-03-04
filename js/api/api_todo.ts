import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import moment from 'moment';

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
  TupdateTodoDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  //
  TtodoDto,
  TtodoContactDto,
  TcreateTodoDto,
  TupdateTodoDto,
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

export function useGetTodo<P extends Tpopulate_todoDto = Partial<Tpopulate_todoDto>>(params?: Tparams) {
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

export async function apiGetTodo_id<P extends Tpopulate_todoDto = Partial<Tpopulate_todoDto>>(
  id: string,
  params?: Tparams
) {
  const api = `/todo/${id}`;

  return axi
    .get<TtodoDto<P>>(api, { params })
    .then(({ data }) => data)
    .catch((err) => {
      myAlert.err({
        title: '取得待辦事項失敗',
        content: err.message,
      });

      return Promise.reject(err);
    });
}

export const apiPostTodo = async (body: TcreateTodoDto[], { callAlert = true }: { callAlert?: boolean } = {}) => {
  const api = '/todo';

  // 後端收的不是ISOstring，送ISOstring的話會因為時區的問題而get錯誤的日期
  body[0].notificationDate = moment(body[0].notificationDate).format('yyyy-MM-DD');
  body[0].entryDate = moment(body[0].entryDate).format('yyyy-MM-DD');

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

export const apiPatchTodo = async (body: TupdateTodoDto[], { callAlert = true }: { callAlert?: boolean } = {}) => {
  const api = '/todo';

  // 後端收的不是ISOstring，送ISOstring的話會因為時區的問題而get錯誤的日期
  body[0].notificationDate = moment(body[0].notificationDate).format('yyyy-MM-DD');
  body[0].entryDate = moment(body[0].entryDate).format('yyyy-MM-DD');

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

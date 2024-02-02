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
  ToutsourcingDto,
  ToutsourcingPaymentDto,
  TdeductionDto,
  ToutsourcingPaymentDetailDto,
  TcreateOutsourcingDto,
  TupdateOutsourcingDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  ToutsourcingDto,
  ToutsourcingPaymentDto,
  TdeductionDto,
  ToutsourcingPaymentDetailDto,
  TcreateOutsourcingDto,
  TupdateOutsourcingDto,
};

// /outsourcing
type TgetOutsourcing = TpageResponse<ToutsourcingDto>;

export const apiGetOutsourcing = async (params?: Tparams) => {
  const api = '/outsourcing';

  return axi<TgetOutsourcing>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcing = createUseInfinite<TgetOutsourcing>({
  apiClient: apiGetOutsourcing,
  errTitle: '取得外包廠商失敗',
});

export const apiGetOutsourcing_id = async (id: string) => {
  const api = `/outsourcing/${id}`;

  return axi<ToutsourcingDto>(api)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcing_id = (id?: string) => {
  const [res, setRes] = useState<ToutsourcingDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      const res = await apiGetOutsourcing_id(id);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得外包廠商失敗',
        content: err.message,
      });
    }
  };

  return {
    data: res,
    update,
  };
};

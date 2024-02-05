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

  return axi
    .get<TgetOutsourcing>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcing = createUseInfinite<TgetOutsourcing>({
  apiClient: apiGetOutsourcing,
  errTitle: '取得外包廠商失敗',
});

export const apiGetOutsourcing_id = async (id: string) => {
  const api = `/outsourcing/${id}`;

  return axi
    .get<ToutsourcingDto>(api)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcing_id = (id?: string) => {
  const [res, setRes] = useState<ToutsourcingDto>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetOutsourcing_id(id);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得外包廠商失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res,
    update,
    isLoading_outsourcing: isLoading,
  };
};

export const apiPostOutsourcing = async (
  body: TcreateOutsourcingDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = '/outsourcing';

  return axi
    .post(api, body)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;

      callAlert &&
        myAlert.err({
          title: '新增外包廠商失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

export const apiPatchOutsourcing = async (
  id: string,
  body: TcreateOutsourcingDto,
  { callAlert = true }: { callAlert?: boolean } = {}
) => {
  const api = `/outsourcing/${id}`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((error) => {
      const err = error as AxiosError;

      callAlert &&
        myAlert.err({
          title: '更新外包廠商失敗',
          content: err.message,
        });

      return Promise.reject(err);
    });
};

//

export const apiGetOutsourcingPayment = async (params?: Tparams) => {
  const api = '/outsourcing-payment';

  params = {
    populate: ['outsourcing'],
    ...params,
  };

  return axi
    .get<TpageResponse<ToutsourcingPaymentDto>>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcingPayment = createUseInfinite<TpageResponse<ToutsourcingPaymentDto>>({
  apiClient: apiGetOutsourcingPayment,
  errTitle: '取得外包計價列表失敗',
});

export const apiGetOutsourcingPayment_id = async (id: string) => {
  const api = `/outsourcing-payment/${id}`;

  const params = {
    populate: ['outsourcing'],
  };

  return axi
    .get<ToutsourcingPaymentDto>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

export const useGetOutsourcingPayment_id = (id?: string) => {
  const [res, setRes] = useState<ToutsourcingPaymentDto>();
  const [isLoading, setIsLoading] = useState(false);

  const update = async () => {
    if (!id) {
      return;
    }

    try {
      setIsLoading(true);
      const res = await apiGetOutsourcingPayment_id(id);
      setRes(res);

      return res;
    } catch (error) {
      const err = error as AxiosError;
      myAlert.err({
        title: '取得外包計價失敗',
        content: err.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data: res,
    update,
    isLoading_outsourcingPayment: isLoading,
  };
};

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
} from './dtoTypes';

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

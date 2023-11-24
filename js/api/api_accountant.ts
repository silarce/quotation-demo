import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi } from './_axiosCreator';

import { createUseInfinite } from './createUseInfinite';

// type
import type {
  //
  Tparams,
  TpageMetaDto,
  TaccountantDto,
  TcreateAccountantDto,
} from './dtoTypes';

export type {
  //
  Tparams,
  TpageMetaDto,
  TaccountantDto,
  TcreateAccountantDto,
} from './dtoTypes';

type TgetAccountant = {
  data: TaccountantDto[];
  meta: TpageMetaDto;
};

export const apiGetAccountant = async (params?: Tparams) => {
  const api = '/accountant';

  return axi
    .get<TgetAccountant>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetAccountant = createUseInfinite<TgetAccountant>({
  apiClient: apiGetAccountant,
  errTitle: '取得收款紀錄列表失敗',
});

export const apiPostAccountant = async (dto: TcreateAccountantDto) => {
  const api = '/accountant';

  return axi
    .post<TaccountantDto>(api, dto)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

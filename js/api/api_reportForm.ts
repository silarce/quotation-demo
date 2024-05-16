import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import _, { sortBy } from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi, domain } from './_axiosCreator';
import { createUseInfinite } from './createUseInfinite';
import { AxiosError } from 'axios';

// type
import type { Tparams, TpageMetaDto, TpageResponse, TbonusDto } from './dtoTypes';

export type { Tparams, TpageMetaDto, TbonusDto };

// ==================================================================
const apiGetReportFormBonus = async (params?: Tparams) => {
  const api = '/report-form/bonus';

  return axi
    .get<TpageResponse<TbonusDto>>(api, { params })
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '取得獎金統計表失敗', content: err.message });

      // return err;
      return Promise.reject(err);
    });
};

const useGetReportFormBonus = (params?: Tparams) => {
  const [res, setRes] = useState<TpageResponse<TbonusDto>>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(() => {
    setIsFetching(true);
    apiGetReportFormBonus(params)
      .then((res) => {
        setRes(res);
      })
      .catch((error) => {
        setRes(undefined);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [params]);

  return {
    data: res?.data,
    meta: res?.meta,
    isFetching,
    update,
  };
};

// ==================================================================
export { useGetReportFormBonus };

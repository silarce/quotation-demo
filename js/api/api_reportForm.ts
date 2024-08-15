import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
// import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi, domain } from './_axiosCreator';
import { createUseInfinite } from './createUseInfinite';
import { AxiosError } from 'axios';

// type
import type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  TbonusDto,
  TsettlementCycleDto,
  TcreateSettlementCycleDto,
  TsettleBonusDto,
  TupdateSettlementCycleDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TbonusDto,
  TsettlementCycleDto,
  TcreateSettlementCycleDto,
  TsettleBonusDto,
  TupdateSettlementCycleDto,
};

// ==================================================================
// region 獎金統計表

const apiGetReportForm_bonus = async (params?: Tparams) => {
  const api = '/report-form/bonus';

  return axi
    .get<TpageResponse<TbonusDto>>(api, { params })
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      // return err;
      return Promise.reject(err);
    });
};

const useGetReportForm_bonus = (
  params: Tparams | undefined,
  { isAutoUpdate = true }: { isAutoUpdate?: boolean } = {}
) => {
  const [res, setRes] = useState<TpageResponse<TbonusDto>>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(() => {
    setIsFetching(true);
    apiGetReportForm_bonus(params)
      .then((res) => {
        setRes(res);
      })
      .catch((error) => {
        setRes(undefined);
        const err = error as AxiosError;
        myAlert.err({ title: '取得獎金統計表失敗', content: err.message });
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [params]);

  const clear = () => {
    setRes(undefined);
  };

  useEffect(() => {
    isAutoUpdate && update();
  }, [isAutoUpdate, update]);

  return {
    data: res?.data,
    meta: res?.meta,
    isFetching,
    update,
    clear,
  };
};

// 結算獎金
const apiPostReportForm_bonus = async (body: TsettleBonusDto) => {
  const api = '/report-form/settle';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      myAlert.err({ title: '結算獎金失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 獎金送審
const apiPatchReportForm_bonus_submit = async (id: string) => {
  const api = `/report-form/bonus/${id}/submit`;

  return axi
    .patch(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      myAlert.err({ title: '送審獎金失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 獎金審核
const apiPatchReportForm_bonus_review = async (id: string, body: { isPass: boolean }) => {
  const api = `/report-form/bonus/${id}/review`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      myAlert.err({ title: '審核獎金失敗', content: err.message });

      return Promise.reject(err);
    });
};

// =========================================================================
// region 獎金週期

const apiGetReportForm_settlementCycle = async (params?: Tparams) => {
  const api = '/report-form/settlement-cycle';

  return axi
    .get<TpageResponse<TsettlementCycleDto>>(api, { params })
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      return Promise.reject(err);
    });
};

const useGetReportForm_settlementCycle = (
  params?: Tparams,
  {
    autoUpdate = true,
  }: {
    autoUpdate?: boolean;
  } = {}
) => {
  const [res, setRes] = useState<TpageResponse<TsettlementCycleDto>>();
  const [isFetching, setIsFetching] = useState(false);

  const update = useCallback(() => {
    setIsFetching(true);
    apiGetReportForm_settlementCycle(params)
      .then((res) => {
        setRes(res);
      })
      .catch((error) => {
        const err = error as AxiosError;
        myAlert.err({ title: '取得獎金週期失敗', content: err.message });
        setRes(undefined);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [params]);

  useEffect(() => {
    autoUpdate && update();
  }, [autoUpdate, update]);

  return {
    data: res?.data,
    meta: res?.meta,
    isFetching,
    update,
  };
};

const apiPostReportForm_settlementCycle = async (body: TcreateSettlementCycleDto) => {
  const api = '/report-form/settlement-cycle';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;

      myAlert.err({ title: '新增獎金週期失敗', content: err.message });

      return Promise.reject(err);
    });
};

const apiPatchReportForm_settlementCycle = async (body: TupdateSettlementCycleDto) => {
  const api = `/report-form/settlement-cycle`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '更新獎金週期失敗', content: err.message });

      return Promise.reject(err);
    });
};

const apiDeleteReportForm_settlementCycle = async (id: string) => {
  const api = `/report-form/settlement-cycle/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '刪除獎金週期失敗', content: err.message });

      return Promise.reject(err);
    });
};

// ==================================================================
export {
  useGetReportForm_bonus,
  apiPostReportForm_bonus,
  apiPatchReportForm_bonus_submit,
  apiPatchReportForm_bonus_review,
  //
  useGetReportForm_settlementCycle,
  apiPostReportForm_settlementCycle,
  apiPatchReportForm_settlementCycle,
  apiDeleteReportForm_settlementCycle,
};

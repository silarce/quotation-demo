import { useState, useEffect } from 'react';

import { axi } from './_axiosCreator';

// type
import { Tparams, TemployeeDto, TpageMetaDto } from './dtoTypes';

export type { TemployeeDto, Tparams };

// =============================================
// 員工資料

// 員工資料列表
export type TgetEmployee = {
  data: TemployeeDto[];
  meta: TpageMetaDto;
};

// 新增、更新員工資料的body
export type TpostEmployee = {
  idNumber: undefined;
  chName: string;
  enName: string;
  identity: string;
  birthday: Date | undefined | string;
  gender: string;
  marital: string;
  education: string;
  expertise: string;
  phone1: string;
  phone2: string;
  email: string;
  residenceCounty: string;
  residenceDistrict: string;
  residenceAddress: string;
  mailingCounty: string;
  mailingDistrict: string;
  mailingAddress: string;
  seniority: string;
  startDate: Date | undefined | string;
  leaveDate: Date | undefined | string;
  retireDate: Date | undefined | string;
  severanceDate: Date | undefined | string;
  processPermission: true;
  militaryServiceType: string;
  qualifications: { name: string; years: number }[];
  jobId: string[];
};

type Tpopulate = ('jobs' | 'jobs.department')[];

// =======================================================
// 取得員工資料列表
export type TapiGetEmployeeParams = {
  order?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
  filter?: {
    [key: string]: any;
  };
  populate?: string[];
  sort?: keyof TemployeeDto;
};

const apiGetEmployee = (params?: Tparams) => {
  // const api = "/employees?filter[user][$notNull]"
  const api = '/employees';

  return (
    axi
      .get<TgetEmployee>(api, { params })
      // return axi.get(api)
      .then(({ data }) => data)
      .catch((err) => Promise.reject(err.message))
  );
};

export const useEmployee = (params?: Tparams) => {
  const [data, setData] = useState<TgetEmployee>();

  const update = async () => {
    const data = (await apiGetEmployee(params)) as TgetEmployee;

    if (data) {
      setData(data);
    }

    return data;
  };

  const update_infinite = async () => {
    if (!data) {
      return;
    }

    const apiRes = await apiGetEmployee(params);
    const newData = apiRes.data;
    const oldData = data.data;
    apiRes.data = [...oldData, ...newData];

    setData({ ...apiRes });

    return apiRes;
  };

  return { data, setData, update, update_infinite };
};

export const useCheckEmployee = (idNumber: string) => {
  type Tcheck = 'ok' | 'notOk' | 'loading';

  const params: TapiGetEmployeeParams = {
    order: 'ASC',
    page: 1,
    pageSize: 999,
    filter: {
      idNumber: {
        $eq: idNumber,
      },
    },
  };
  const [check, setCheck] = useState<Tcheck>('loading');

  const update = async () => {
    try {
      setCheck('loading');
      const res = await apiGetEmployee(params);

      if (res.data.length === 0) {
        setCheck('ok');
      } else {
        setCheck('notOk');
      }
    } catch {
      setCheck('notOk');
    }
  };

  return {
    check,
    setCheck,
    reCheck: update,
  };
};

// =======================================================
// 取得個別員工資料
export type TapiGetEmployee_idParams = {
  populate: Tpopulate;
};

const apiGetEmployee_id = (id: string, params?: TapiGetEmployee_idParams) => {
  const api = `/employees/${id}`;

  return axi
    .get(api, { params })
    .then(({ data }) => {
      return data;
    })
    .catch((err) => false);
};

export const useEmployeeById = (id: string, params?: TapiGetEmployee_idParams) => {
  const [data, setData] = useState<TemployeeDto>();

  const update = async () => {
    const res = await apiGetEmployee_id(id, params);

    if (res) {
      setData(res);
    }

    return res;
  };

  return { data, setData, update };
};

// =======================================================
// 新增員工資料

export const apiPostEmployee = (body: TpostEmployee) => {
  const api = '/employees';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// =======================================================
// 修改員工資料
export const apiPatchEmployee = (body: TpostEmployee, id: string) => {
  const api = `/employees/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// =======================================================
// 刪除員工資料

export const apiDeleteEmployee = (id: string) => {
  const api = `/employees/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// =======================================================
// 新增ERP使用者

export const apiPostEmployeeErpUser = (id: string) => {
  const api = `/employees/${id}/erp-user`;

  return axi
    .post(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 刪除ERP使用者
export const apiDeleteEmployeeErpUser = (id: string) => {
  const api = `/employees/${id}/erp-user`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};
// =======================================================================
// =======================================================================
// =======================================================================

import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

export const useEmployee_lab = ({ customParams }: { customParams?: Tparams }) => {
  /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
  const [resetCount, setResetCount] = useState(0);
  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();
  // ----------------------------------------------------------------
  const [dataList, setDataList] = useState<{ [key: `${number}`]: TemployeeDto[] }>({});

  const [page, setPage] = useState<number>();
  const [meta, setMeta] = useState<TpageMetaDto>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();

  // ----------------------------------------------------------------
  const defaultParams = {
    page,
  };
  // ----------------------------------------------------------------

  const update = async (dynaParams?: Tparams) => {
    const params = {
      ...defaultParams,
      ...customParams,
      ...dynaParams,
    };

    try {
      if (page === 1) {
        setIsLoadingPage1(true);
      }

      setIsloading(true);

      const res = await apiGetEmployee(params);

      if (res) {
        setDataList((list) => {
          list[`${res.meta.page}`] = res.data;

          return { ...list };
        });
        setMeta(res.meta);
        setHasNextPage(res.meta.hasNextPage);
      }

      return res;
      //
    } catch (error) {
      myAlert.err({ title: '取得員工資料失敗' });
      console.log(error);
    } finally {
      setIsloading(false);
      setIsLoadingPage1(false);
    }
  };

  const nextPage = () => {
    if (hasNextPage === false || !page) {
      return;
    }

    setPage((page) => (page ? page + 1 : page));
  };

  // -----------------------------------------------
  const init = () => {
    setDataList({});
    setPage(undefined);
    setHasNextPage(undefined);
    setResetCount(0);
  };

  const reset = () => {
    setDataList({});
    setPage(1);
    setHasNextPage(true);
    setResetCount((count) => ++count);
  };

  // -----------------------------------------------
  useEffect(() => {
    if (!page) {
      return;
    }

    update();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, resetCount]);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (inView_bottom) {
      nextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView_bottom, isLoading]);
  // -----------------------------------------------

  return {
    dataList,
    dataArr: _.flatten(Object.values(dataList)),
    viewRef_top,
    viewRef_bottom,
    isLoadingPage1,
    isLoading,
    meta,
    init,
    reset,
  };
};

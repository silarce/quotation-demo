import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';

import { axi } from './_axiosCreator';

// config
import { customerTypesLookup } from 'config/lookupTable';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
import type { Tparams, TcustomerDto, TcustomerDto_Populate, TpageMetaDto, Tcontact } from './dtoTypes';

/**
 * "types"、"contacts"為必須
 */
type TcustomerDto_TC = TcustomerDto_Populate<['types', 'contacts']>;

export type { Tparams, TcustomerDto, TcustomerDto_Populate, TcustomerDto_TC, Tcontact as Tcontacts };
// ===============================================================
export { customerTypesLookup };
// ===============================================================

// export const customerTypesLookup = Object.freeze({
//   construction: "營造",
//   firm: "事務所",
//   propertyOwner: "業主",
//   contractor: "協力廠商",
// } as const);

type TcustomerTypesLookupKeys = keyof typeof customerTypesLookup;
export const customerTypesArr = (Object.keys(customerTypesLookup) as TcustomerTypesLookupKeys[]).map((key) => ({
  value: key,
  label: customerTypesLookup[key],
}));

// export const customerTypesArr = [
//   { value: "construction", label: "營造" },
//   { value: "firm", label: "事務所" },
//   { value: "propertyOwner", label: "業主" },
//   { value: "contractor", label: "協力廠商" },
// ]

// ===============================================================

export type TapiGetCustomersParams = {
  order?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
  filter?: {
    [key: string]: any;
  };
  populate?: ('contacts' | 'types')[];
  sort?: keyof TcustomerDto;
};

export type TgetCustomers = {
  data: TcustomerDto[];
  meta: TpageMetaDto;
};

export type TpostCustomer = {
  id?: string;
  createdAt?: string; // "2022-10-19T05:36:03.899Z",
  updatedAt?: string; // "2022-10-19T05:36:03.899Z",
  customerNumber: string; // 不可以為空字串
  name: string; //客戶全稱
  nickname: string; //客戶簡稱
  types: ('construction' | 'firm' | 'propertyOwner' | 'contractor')[];
  principal: string; //客戶負責人
  taxDeductionCategory: string; //扣稅類別
  taxId: string; //統一編號
  phone: string;
  fax: string;
  county: string;
  district: string;
  address: string;
  invoiceCounty: string; //發票地址縣市
  invoiceDistrict: string; //發票地址區域
  invoiceAddress: string; //發票地址剩餘地址
  contacts: {
    id?: string;
    createdAt?: string; //"2022-10-17T05:35:08.115Z",
    updatedAt?: string; //"2022-10-17T05:35:08.115Z",
    createdBy?: string;
    updatedBy?: string;
    deletedBy?: string | null;
    name: string;
    phone: string;
  }[]; //聯絡人
};

// ============================================================
// 取得客戶列表

const apiGetCustomers = (params?: Tparams) => {
  const api = '/customers';

  return axi
    .get(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useCustomers = (params?: TapiGetCustomersParams) => {
  const [res, setRes] = useState<TgetCustomers>();

  const update = async () => {
    const data = await apiGetCustomers(params);

    if (data) {
      setRes(data);
    }

    return data;
  };

  const update_infinite = async () => {
    if (!res) {
      return;
    }

    const apiRes = await apiGetCustomers(params);
    const newData = apiRes.data;
    const oldData = res.data;
    res.data = [...oldData, ...newData];
    setRes({ ...res });

    return apiRes;
  };

  return {
    data: res?.data,
    meta: res?.meta,
    setData: setRes,
    update,
    update_infinite,
  };
};

export const useGetCustomers_infinite = ({ customParams }: { customParams?: Tparams } = {}) => {
  /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
  const [resetCount, setResetCount] = useState(0);
  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();
  // ----------------------------------------------------------------
  const [dataList, setDataList] = useState<{ [key: `${number}`]: TcustomerDto[] }>({});

  const [page, setPage] = useState<number>();
  const [meta, setMeta] = useState<TpageMetaDto>();
  const [hasNextPage, setHasNextPage] = useState<boolean>();

  // ----------------------------------------------------------------
  const defaultParams = {
    page,
    populate: ['contract'],
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

      const res = await apiGetCustomers(params);

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
      const err = error as Error;
      myAlert.err({ title: '取得列表失敗', content: err?.message });
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

// ============================================================
const apiCustomersNameExist = (name: string) => {
  const api = `/customers/name-exist/${name}`;

  return axi
    .get(api)
    .then(({ data }) => data as { isExist: boolean })
    .catch((err) => Promise.reject(err.message));
};

export const useApiCustomersNameExist = (name: string) => {
  type Tcheck = 'ok' | 'notOk' | 'loading';
  const [check, setCheck] = useState<Tcheck>('loading');

  const reCheck = async () => {
    try {
      setCheck('loading');
      const res = await apiCustomersNameExist(name);

      if (!res.isExist) {
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
    reCheck,
  };
};

const apiCustomersNumberExist = (customerNumber: string) => {
  const api = `/customers/customer-number-exist/${customerNumber}`;

  return axi
    .get(api)
    .then(({ data }) => data as { isExist: boolean })
    .catch((err) => Promise.reject(err.message));
};

export const useApiCustomersNumberExist = (customerNumber: string) => {
  type Tcheck = 'ok' | 'notOk' | 'loading';
  const [check, setCheck] = useState<Tcheck>('loading');

  const reCheck = async () => {
    try {
      setCheck('loading');
      const res = await apiCustomersNumberExist(customerNumber);

      if (!res.isExist) {
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
    reCheck,
  };
};

// ============================================================
// 取得個別客戶資料

const apiGetCustomers_id = (id: string, params?: TapiGetCustomersParams) => {
  const api = `/customers/${id}`;

  params = {
    ...params,
    populate: ['contacts', 'types', ...(params?.populate ?? [])],
  };

  return axi
    .get<TcustomerDto_TC>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useCustomersById = (id: string | undefined, params?: TapiGetCustomersParams) => {
  const [data, setData] = useState<TcustomerDto_TC>();

  const update = async () => {
    if (!id) {
      return;
    }

    const data = await apiGetCustomers_id(id, params);

    if (data) {
      setData(data);
    }

    return data;
  };

  return { data, setData, update };
};

// ==============================================================
// 新增客戶資料
export const apiPostCustomers = (body: TpostCustomer) => {
  const api = `/customers`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

// ==============================================================
// 編輯客戶資料
export const apiPatchCustomers_id = (id: string, body: TpostCustomer) => {
  body.id && delete body.id;
  const api = `/customers/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

// ==============================================================
// 刪除客戶資料
export const apiDeleteCustomers_id = (id: string) => {
  const api = `/customers/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

// =============================================================================

export const useCustomers_infinite_lab = (customParams?: TapiGetCustomersParams) => {
  const [viewRef, inView] = useInView();
  const [page, setPage] = useState(1);

  const params = {
    page,
    // pageSize必須大於畫面一次可顯示的item數量才不會壞掉
    // 不過應該只有在嚴格模式會壞掉
    pageSize: 20,
    sort: 'customerNumber',
  } as const;

  const [dataArrQueue, setDataArrQueue] = useState<TgetCustomers['data'][]>([]);

  const [data, setData] = useState<TgetCustomers['data']>();
  const [meta, setMeta] = useState<TgetCustomers['meta']>();

  const update_infinite = async () => {
    if (meta && !meta.hasNextPage) {
      return;
    }

    const res = await apiGetCustomers(params);
    const dataArrQueueCopy = [...dataArrQueue];
    dataArrQueueCopy[page - 1] = res.data;
    setDataArrQueue(dataArrQueueCopy);
    setData(dataArrQueueCopy.flat());

    return res;
  };

  const nextPage = async () => {
    if (meta && !meta.hasNextPage) {
      return;
    }

    setPage(page + 1);
  };

  const reset = () => {
    setDataArrQueue([]);
    setData(undefined);
    setMeta(undefined);
    setPage(1);
  };

  useEffect(() => {
    update_infinite();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    if (inView) {
      nextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  useEffect(() => {
    reset();
  }, [customParams]);

  return {
    data,
    meta,
    setData,
    // update,
    nextPage,
    viewRef,
    reset,
  };
};

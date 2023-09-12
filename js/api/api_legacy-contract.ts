import { useState, useEffect } from 'react';

import { axi, domain } from './_axiosCreator';

import { useInView } from 'react-intersection-observer';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import _ from 'lodash';

import {
  TpaymentMethodDto,
  TlegacyContractProductDto,
  TlegacyContractAdditionDto,
  TlegacyContractDto,
  TcreateLegacyContractProductDto,
  TcreateLegacyContractAdditionDto,
  TcreateLegacyContractDto,
  TupdateLegacyContractDto,
  TpageMetaDto,
  TfileDto,
  TmodifyLegacyContractDto,
} from './dtoTypes';

export { domain };

export type Tparams = {
  order?: 'ASC' | 'DESC';
  page?: number;
  pageSize?: number;
  filter?: {
    [key: string]: any;
  };
  populate?: string[];
  sort?: string;
};

type TgetLegacyContracts = {
  data: TlegacyContractDto[];
  meta: TpageMetaDto;
};

export type {
  TpaymentMethodDto,
  TlegacyContractProductDto,
  TlegacyContractAdditionDto,
  TlegacyContractDto,
  TcreateLegacyContractProductDto,
  TcreateLegacyContractAdditionDto,
  TcreateLegacyContractDto,
  TupdateLegacyContractDto,
};

// =================================================================

const apiGetLegacyContracts = (params?: Tparams) => {
  const api = '/legacy-contracts';

  return axi
    .get<TgetLegacyContracts>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useLegacyContracts = (params?: Tparams) => {
  const [res, setRes] = useState<TgetLegacyContracts>();

  const update = async () => {
    const res = await apiGetLegacyContracts(params);

    if (res) {
      setRes(res);
    }

    return res;
  };

  const update_infinite = async () => {
    if (!res) {
      return;
    }

    const apiRes = await apiGetLegacyContracts(params);
    const newData = apiRes.data;
    const oldData = res.data;
    res.data = [...oldData, ...newData];
    setRes({ ...res });

    return apiRes;
  };

  return {
    legacyContractsArr: res?.data,
    legacyContractsMeta: res?.meta,
    setLegacyContracts: setRes,
    updateLegacyContracts: update,
    updateLegacyContracts_infinite: update_infinite,
  };
};

export const apiGetLegacyContracts_id = (id: string, params: Tparams = {}) => {
  const api = `/legacy-contracts/${id}`;

  return axi
    .get(api, { params })
    .then(({ data }) => data as TlegacyContractDto)
    .catch((err) => Promise.reject(err));
};

export const useLegacyContract_id = (id: string | undefined, params?: Tparams) => {
  const [res, setRes] = useState<TlegacyContractDto>();

  const update = async () => {
    if (!id) {
      return undefined;
    }

    const res = await apiGetLegacyContracts_id(id, params);

    if (res) {
      setRes(res);
    }

    return res;
  };

  return {
    legacyContract: res,
    updateLegacyContract: update,
  };
};

export const apiPostLegacyContracts = (body: TcreateLegacyContractDto) => {
  const api = `/legacy-contracts`;

  return axi
    .post(api, body)
    .then(({ data }) => data as TlegacyContractDto)
    .catch((err) => Promise.reject(err));
};

export const apiPatchLegacyContracts_id = (id: string, body: TupdateLegacyContractDto) => {
  const api = `/legacy-contracts/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data as TlegacyContractDto)
    .catch((err) => Promise.reject(err));
};

export const apiDeleteLegacyContracts_id = (id: string) => {
  const api = `/legacy-contracts/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data as TlegacyContractDto)
    .catch((err) => Promise.reject(err));
};

/**取得舊合約附件 */
export const apiGetLegacyContracts_id_attachments = (id: string) => {
  const api = `/legacy-contracts/${id}/attachments`;

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useLegacyContracts_id_attachments = (id: string | undefined) => {
  const [res, setRes] = useState<TfileDto[]>();

  const update = async () => {
    if (!id) {
      return undefined;
    }

    const res = (await apiGetLegacyContracts_id_attachments(id)) as TfileDto[];

    if (res) {
      setRes(res);
    }

    return res;
  };

  return {
    attachments: res,
    updateAttachments: update,
    domain,
  };
};

/**上傳舊合約附件 */
export const apiPostLegacyContracts_id_attachments = (contractId: string, body: FormData) => {
  const api = `/legacy-contracts/${contractId}/attachments`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**移除舊合約附件 */
export const apiDelLegacyContracts_id_attachments = (contractId: string, fileId: string) => {
  const api = `/legacy-contracts/${contractId}/attachments/${fileId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ==========================================================================

export const apiPatchLegacyContracts_id_modify = ({
  id,
  body,
}: //
{
  id: string;
  body: TmodifyLegacyContractDto;
}) => {
  const api = `/legacy-contracts/${id}/modify`;

  return axi
    .patch<{
      latestBatch: number;
      // 其他property用不到，省略
    }>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiPatchLegacyContracts_id_updateBatchNumber = ({
  id,
  body,
}: //
{
  id: string;
  body: { batchNumber: string };
}) => {
  const api = `/legacy-contracts/${id}/update-batch-number`;

  return axi
    .patch<TlegacyContractDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ==============================================================================

export const useLegacyContract_infinite = ({ customParams }: { customParams?: Tparams }) => {
  /**resetCount就只是用來使呼叫reset後，若page沒有改變的話，還是可以觸發update*/
  const [resetCount, setResetCount] = useState(0);
  const [isLoadingPage1, setIsLoadingPage1] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  const [viewRef_top, inView_top] = useInView();
  const [viewRef_bottom, inView_bottom] = useInView();
  // ----------------------------------------------------------------
  const [dataList, setDataList] = useState<{ [key: `${number}`]: TlegacyContractDto[] }>({});

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

      const res = await apiGetLegacyContracts(params);

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
      myAlert.err({ title: '取得資料失敗' });
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

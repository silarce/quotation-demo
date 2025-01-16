import { useState, useEffect, useCallback } from 'react';
import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { createUseInfinite } from './createUseInfinite';

import { apiGetReviewById, TgetReviewById } from './api_netCore/api_review';

import type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  TdocType,
  TcertificatedDocDto,
  TcertificatedProductDto,
  TsettleProductDto,
  TcreateCertificatedDocDto,
  TupdateCertificatedDocDto,
  TcreateCertificatedProductDto,
  TupdateCertificatedProductDto,
  TquotationContentDto,
  TsubmitCertificatedDocDto,
  TreviewCertificatedDocDto,
  TcreateCertificatedDocSnapShotDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TpageResponse,
  TdocType,
  TcertificatedDocDto,
  TcertificatedProductDto,
  TsettleProductDto,
  TcreateCertificatedDocDto,
  TupdateCertificatedDocDto,
  TcreateCertificatedProductDto,
  TupdateCertificatedProductDto,
  TsubmitCertificatedDocDto,
  TreviewCertificatedDocDto,
  TcreateCertificatedDocSnapShotDto,
};

type TcertificatedDocDto_addition = TcertificatedDocDto & {
  addition: {
    reviewArr?: TgetReviewById[] | undefined;
  };
};

export type { TcertificatedDocDto_addition };

// ===========================================================================

const apiGetCertificatedDoc = async (params?: Tparams) => {
  const api = '/certificated-doc';

  return axi
    .get<TpageResponse<TcertificatedDocDto>>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

const useGetCertificatedDoc_infinite = createUseInfinite<TpageResponse<TcertificatedDocDto>>({
  apiClient: apiGetCertificatedDoc,
  errTitle: '取得證明文件列表失敗',
});

const useGetCertificatedDoc = (params?: Tparams) => {
  const [res, setRes] = useState<TpageResponse<TcertificatedDocDto> | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  params = {
    pageSize: 99999,
    ...params,
  };

  const update = async () => {
    setIsFetching(true);

    return await apiGetCertificatedDoc(params)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        myAlert.err({ title: '取得證明文件列表失敗', content: err.message });

        return Promise.reject(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isFetching,
  };
};

const useGetCertificatedDoc_contractId = (contractId: string | undefined, params: Tparams) => {
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const [res, setRes] = useState<TpageResponse<TcertificatedDocDto_addition> | undefined>(undefined);

  params = {
    pageSize: 99999,
    populate: [
      'products',
      'reviewGuarantorEmployee',
      'reviewAccountingEmployee',
      'reviewAuditorEmployee',
      'reviewManagerEmployee',
      'agentEmployee',
    ],
    ...params,
    filter: {
      ...params.filter,
      contractId: { $eq: contractId },
    },
  };

  const update = async () => {
    if (!contractId) {
      return;
    }

    setIsFetching(true);

    const res = await apiGetCertificatedDoc(params)
      .then(async (res) => {
        const dataArr = res.data;
        const dataArr_addition: TcertificatedDocDto_addition[] = [];

        for (const data of dataArr) {
          const { id } = data;
          const reviewArr = await apiGetReviewById(id);
          dataArr_addition.push({ ...data, addition: { reviewArr } });
        }

        const result: TpageResponse<TcertificatedDocDto_addition> = {
          data: dataArr_addition,
          meta: res.meta,
        };

        setRes(result);

        return result;
      })

      .catch((err: AxiosError) => {
        myAlert.err({ title: '取得證明文件列表失敗', content: err.message });

        return Promise.reject(err);
      })
      .finally(() => {
        setIsFetching(false);
      });

    return res;
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
    isFetching,
  };
};

// --------------------------------------------------------------------
const apiGetCertificatedDoc_id = async (id: string) => {
  const api = `/certificated-doc/${id}`;

  const params = {
    populate: [
      //
      'products',
      'reviewGuarantorEmployee',
      'reviewManagerEmployee',
      'agentEmployee',
      'contract.content',
    ],
  };

  return axi
    .get<TcertificatedDocDto>(api, { params })
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

const useGetCertificatedDoc_id = (
  id: string | undefined,
  {
    callAlert = true,
  }: {
    callAlert?: boolean;
  } = {}
) => {
  const [res, setRes] = useState<TcertificatedDocDto | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const update = useCallback(async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);

    return await apiGetCertificatedDoc_id(id)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        callAlert && myAlert.err({ title: '取得證明文件失敗', content: err.message });

        return Promise.reject(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  }, [callAlert, id]);

  return {
    data: res,
    update,
    isFetching,
  };
};

// --------------------------------------------------------------------

const apiPostCertificatedDoc = async (body: TcreateCertificatedDocDto) => {
  const api = '/certificated-doc';

  return axi
    .post<TcertificatedDocDto>(api, body)
    .then((res) => res.data)
    .catch((err) => {
      myAlert.err({ title: '新增證明文件失敗' });

      return Promise.reject(err);
    });
};

const apiPatchCertificatedDoc = async (id: string, body: TupdateCertificatedDocDto) => {
  const api = `/certificated-doc/${id}`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((err) => {
      myAlert.err({ title: '更新證明文件失敗' });

      return Promise.reject(err);
    });
};

const apiDeleteCertificatedDoc = async (id: string) => {
  const api = `/certificated-doc/${id}`;

  return axi
    .delete(api)
    .then((res) => res.data)
    .catch((err) => {
      myAlert.err({ title: '刪除證明文件失敗' });

      return Promise.reject(err);
    });
};

// --------------------------------------------------------------------

const apiGetQuotationContentSettleProduct = (id?: string) => {
  const api = `/quotation/content/${id}`;

  const params = {
    populate: ['settleProducts'],
  };

  return axi
    .get<TquotationContentDto>(api, { params })
    .then(({ data }) => {
      return data.settleProducts;
    })
    .catch((err) => Promise.reject(err));
};

const apiGetQuotationContentSettleProduct_pseudoMeta = (
  // 在修改好createUseInfinite之前，params與id先這樣處理
  params?: Tparams,
  { id }: { id?: string } = {}
) => {
  const api = `/quotation/content/${id}`;

  params = {
    populate: ['settleProducts'],
    ...params,
  };

  return axi
    .get<TquotationContentDto>(api, { params })
    .then(({ data }) => {
      const res: TpageResponse<TsettleProductDto> = {
        data: data.settleProducts,
        meta: {
          page: 1,
          pageSize: 99999,
          itemCount: 99999,
          pageCount: 1,
          hasPreviousPage: false,
          hasNextPage: false,
        },
      };

      return res;
    })
    .catch((err) => Promise.reject(err));
};

const useGetQuotationContentSettleProduct = ({ params, id }: { params?: Tparams; id?: string } = {}) => {
  const [res, setRes] = useState<TsettleProductDto[] | undefined>(undefined);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const update = async () => {
    if (!id) {
      return;
    }

    setIsFetching(true);

    return await apiGetQuotationContentSettleProduct(id)
      .then((res) => {
        setRes(res);

        return res;
      })
      .catch((err: AxiosError) => {
        myAlert.err({ title: '取得產品列表失敗', content: err.message });

        return Promise.reject(err);
      })
      .finally(() => {
        setIsFetching(false);
      });
  };

  return {
    data: res,
    update,
    isLoading: isFetching,
  };
};

const useGetQuotationContentSettleProduct_pseudoMeta = createUseInfinite<TpageResponse<TsettleProductDto>>({
  apiClient: apiGetQuotationContentSettleProduct_pseudoMeta,
  errTitle: '取得產品列表失敗',
});

// --------------------------------------------------------------------

const apiPatchCertificatedDoc_spanShot = async (id: string, body: TcreateCertificatedDocSnapShotDto) => {
  const api = `/certificated-doc/${id}/snap-shot`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((error) => {
      const err = error as AxiosError;
      myAlert.err({ title: '更新證明書失敗', content: err.message });

      return Promise.reject(err);
    });
};

// --------------------------------------------------------------------

// 送審
const apiPatchCertificatedDoc_submit = async (id: string, body: TsubmitCertificatedDocDto) => {
  const api = `/certificated-doc/${id}/submit`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((err) => {
      myAlert.err({ title: '送審失敗', content: err.message });

      return Promise.reject(err);
    });
};

// 審核
const apiPatchCertificatedDoc_review = async (id: string, body: TreviewCertificatedDocDto) => {
  const api = `/certificated-doc/${id}/review`;

  return axi
    .patch(api, body)
    .then((res) => res.data)
    .catch((err) => {
      myAlert.err({ title: '審核失敗', content: err.message });

      return Promise.reject(err);
    });
};

// ========================================================================
export {
  //
  useGetCertificatedDoc,
  useGetCertificatedDoc_infinite,
  useGetCertificatedDoc_id,
  useGetCertificatedDoc_contractId,
  apiPostCertificatedDoc,
  apiPatchCertificatedDoc,
  apiDeleteCertificatedDoc,
  apiPatchCertificatedDoc_submit,
  apiPatchCertificatedDoc_review,
  apiPatchCertificatedDoc_spanShot,
  //
  useGetQuotationContentSettleProduct_pseudoMeta,
  useGetQuotationContentSettleProduct,
};

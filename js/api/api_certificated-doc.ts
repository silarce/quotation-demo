import { useState, useEffect } from 'react';
import { axi } from './_axiosCreator';
import { AxiosError } from 'axios';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { createUseInfinite } from './createUseInfinite';

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
};

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

// --------------------------------------------------------------------
const apiGetCertificatedDoc_id = async (id: string) => {
  const api = `/certificated-doc/${id}`;

  return axi
    .get<TcertificatedDocDto>(api)
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

  const update = async () => {
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
  };

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
    .post(api, body)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

const apiPatchCertificatedDoc = async (id: string, body: TupdateCertificatedDocDto) => {
  const api = `/certificated-doc/${id}`;

  return axi
    .post(api, body)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

const apiDeleteCertificatedDoc = async (id: string) => {
  const api = `/certificated-doc/${id}`;

  return axi
    .delete(api)
    .then((res) => res.data)
    .catch((err) => Promise.reject(err));
};

// ========================================================================
export {
  //
  useGetCertificatedDoc_infinite,
  useGetCertificatedDoc_id,
  apiPostCertificatedDoc,
  apiPatchCertificatedDoc,
  apiDeleteCertificatedDoc,
};

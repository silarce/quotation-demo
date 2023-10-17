// apiGetQuotationProducts

import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import _ from 'lodash';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { axi, domain } from './_axiosCreator';

// type
import type {
  Tparams,
  TpageMetaDto,
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TcreateEngineeringContactDto,
  TdispatchingDto,
  TcreateDispatchingDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TcreateEngineeringContactDto,
  TdispatchingDto,
  TcreateDispatchingDto,
} from './dtoTypes';

// ========================================================================
export const apiGetEngineeringContact = async (contractId: string) => {
  const api = `/engineering/engineering-contact/${contractId}`;

  return axi
    .get<TengineeringContactDto>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetEngineeringContact = (contractId: string) => {
  const [res, setRes] = useState<TengineeringContactDto>();

  const update = async () => {
    const newRes = await apiGetEngineeringContact(contractId);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res,
    update,
  };
};

/**以id更新工程聯絡單 */
export const apiPatchEngineeringContact = async (id: string, body: TupdateEngineeringContactDto) => {
  const api = `/engineering/engineering-contact/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**新增工程聯絡單 */
export const apiPostEngineeringContact = async (body: TcreateEngineeringContactDto) => {
  const api = `/engineering/engineering-contact`;

  return axi
    .post<TengineeringContactDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ------------------------------------------------------------------------

type TgetDispatchingList = {
  data: TdispatchingDto[];
  meta: TpageMetaDto;
};

/**取得派工單列表 */
export const apiGetEngineeringDispatchingList = async (params?: Tparams) => {
  const api = '/engineering/dispatching-list';

  return axi
    .get<TgetDispatchingList>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**取得派工單列表 */
export const useGetEngineeringDispatchingList = (params?: Tparams) => {
  const [res, setRes] = useState<TgetDispatchingList>();

  const update = async () => {
    const newRes = await apiGetEngineeringDispatchingList(params);

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    data: res?.data,
    meta: res?.meta,
    update,
  };
};

/**新增派工單 */
export const apiPostEngineeringDispatching = async (body: TcreateDispatchingDto) => {
  const api = '/engineering/dispatching';

  return axi
    .post<TdispatchingDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

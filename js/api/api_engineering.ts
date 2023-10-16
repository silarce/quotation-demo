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
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TengineeringContactDto,
  TupdateEngineeringContactDto,
  TcreateEngineeringContactDto,
} from './dtoTypes';

type TgetEngineeringContact = {
  data: TengineeringContactDto[];
  meta: TpageMetaDto;
};

export const apiGetEngineeringContact = async (contractId: string) => {
  const api = `/engineering/engineering-contact/${contractId}`;

  return axi
    .get<TgetEngineeringContact>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useGetEngineeringContact = (contractId: string) => {
  const [res, setRes] = useState<TgetEngineeringContact>();

  const update = async () => {
    const newRes = await apiGetEngineeringContact(contractId);

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

/**以id更新工程聯絡單 */
export const apiPatchEngineeringContact = async (id: string, body: TupdateEngineeringContactDto) => {
  const api = `/engineering/engineering-contact/${id}`;

  return axi
    .patch(api, { body })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**新增工程聯絡單 */
export const apiPostEngineeringContact = async (body: TcreateEngineeringContactDto) => {
  const api = `/engineering/engineering-contact`;

  return axi
    .post<TengineeringContactDto>(api, { body })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

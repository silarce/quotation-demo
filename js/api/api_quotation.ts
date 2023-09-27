import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { axi, domain } from './_axiosCreator';

// type
import type {
  Tparams,
  TpageMetaDto,
  TquotationContentDto,
  TquotationDto,
  TcreateQuotationContentDto,
  TfileDto,
} from './dtoTypes';

export type {
  Tparams,
  TpageMetaDto,
  TquotationContentDto,
  TquotationDto,
  TcreateQuotationContentDto,
} from './dtoTypes';

type TgetQuotation = {
  data: TquotationDto[];
  meta: TpageMetaDto;
};

export const apiGetQuotation = async (params?: Tparams) => {
  const api = '/quotation';

  params = {
    populate: [
      'contents',
      'latestContent.customer',
      'latestContent.agentEmployee',
      'latestContent.reviewSalesEmployee',
      'latestContent.reviewSupervisorEmployee',
      'latestContent.products.quantity',
      'latestContent.products.options',
    ],
    ...params,
  };

  return axi
    .get<TgetQuotation>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation = (customParams?: Tparams) => {
  const [res, setRes] = useState<TgetQuotation>();

  const update = async () => {
    const newRes = await apiGetQuotation(customParams);

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

export const apiGetQuotation_Id = async (id: string) => {
  const api = `/quotation/${id}`;

  const params = {
    populate: [
      'contents',
      'latestContent.customer',
      'latestContent.agentEmployee',
      'latestContent.supervisorEmployee',
      'latestContent.managerEmployee',
      'latestContent.reviewSalesEmployee',
      'latestContent.reviewSupervisorEmployee',

      'latestContent.products.items.accessories',
      'latestContent.products.items.components',
      'latestContent.others',
    ],
  };

  return axi
    .get<TquotationDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation_id = (id: string | undefined) => {
  const [res, setRes] = useState<TquotationDto>();

  const update = async () => {
    if (!id) {
      return;
    }

    const newRes = await apiGetQuotation_Id(id);

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

export const apiPostQuotation = (body: TcreateQuotationContentDto) => {
  const api = '/quotation';

  return axi
    .post<TquotationDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiPatchQuotation = (body: TcreateQuotationContentDto, id: string) => {
  const api = `/quotation/${id}`;

  return axi
    .patch<TquotationDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 設定報價單審核人員
export const apiQuotationSubmitReview = (
  id: string,
  body: {
    reviewSalesEmployeeId: string | null;
    reviewSupervisorEmployeeId: string | null;
  }
) => {
  const api = `/quotation/${id}/submit-review`;

  return axi
    .patch<undefined>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// 審核該報價單
export const apiQuotationReview = (id: string) => {
  const api = `/quotation/${id}/review`;

  return axi
    .patch<undefined>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiQuotationunLock = (id: string) => {
  const api = `/quotation/${id}/unLock`;

  return axi
    .patch<undefined>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// ================================================================

/**取得報價單附件 */
export const apiGetQuotation_id_attachments = (id: string) => {
  const api = `/quotation/${id}/attachments`;

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const useQuotation_id_attachments = (id: string | undefined) => {
  const [res, setRes] = useState<TfileDto[]>();

  const update = async () => {
    if (!id) {
      return undefined;
    }

    const res = (await apiGetQuotation_id_attachments(id)) as TfileDto[];

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

/**上傳報價單附件 */
export const apiPostQuotation_id_attachments = (id: string, body: FormData) => {
  const api = `/quotation/${id}/attachments`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

/**移除報價單附件 */
export const apiDelQuotation_id_attachments = (id: string, fileId: string) => {
  const api = `/quotation/${id}/attachments/${fileId}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

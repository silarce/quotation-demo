import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { axi } from './_axiosCreator';

// type
import type { TpageMetaDto, TquotationContentDto, TquotationDto, TcreateQuotationContentDto } from './dtoTypes';
import { get } from 'lodash';

export type { TpageMetaDto, TquotationContentDto, TquotationDto, TcreateQuotationContentDto } from './dtoTypes';

type TgetQuotation = {
  data: TquotationDto[];
  meta: TpageMetaDto;
};

export const apiGetQuotation = async () => {
  const api = '/quotation';

  const params = {
    populate: ['contents', 'latestContent.customer', 'latestContent.agentEmployee'],
  };

  return axi
    .get<TgetQuotation>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useGetQuotation = () => {
  const [res, setRes] = useState<TgetQuotation>();

  const update = async () => {
    const newRes = await apiGetQuotation();

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
    populate: ['contents', 'latestContent.customer', 'latestContent.agentEmployee'],
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
    .post<TgetQuotation>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

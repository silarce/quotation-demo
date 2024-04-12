import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { axi } from './_axiosCreator';

import { createUseApi_array_infinite } from './apiClientHookCreator';
import { createUseInfinite } from './createUseInfinite';

// type
import {
  Tparams,
  TpageMetaDto,
  TannotationDto,
  TcreateAnnotationDto,
  TcreateQuotationRangeDto,
  TquotationRangeDto,
  TworksheetDto,
  TcreateWorksheetDto,
} from './dtoTypes';

type TgetAnnotation = {
  data: TannotationDto[];
  meta: TpageMetaDto;
};

type TgetQuotataionRanges = {
  data: TquotationRangeDto[];
  meta: TpageMetaDto;
};

export type {
  Tparams,
  TgetAnnotation,
  TgetQuotataionRanges,
  TcreateAnnotationDto,
  TcreateQuotationRangeDto,
  TworksheetDto as TworkSheetDto,
  TcreateWorksheetDto as TcreateWorkSheetDto,
  TannotationDto,
  TquotationRangeDto,
};

// ==========================================================================
// ==========================================================================
// ==========================================================================

export const apiGetAnnotation = (params?: Tparams) => {
  const api = '/work-sheet/presets/annotations';

  return axi
    .get(api, { params })
    .then(({ data }) => data as TgetAnnotation)
    .catch((err) => Promise.reject(err));
};

export const useGetAnnotation = (otherParams?: Tparams) => {
  const [page, setPage] = useState(1);
  const params = {
    page,
    pageSize: 9999,
    sort: 'category',
    ...otherParams,
  };

  const [res, setRes] = useState<TgetAnnotation>();

  const update = async () => {
    const res = await apiGetAnnotation(params);

    if (res) {
      setRes(res);
    }

    return res;
  };

  return {
    annotationArr: res?.data,
    annotationMeta: res?.meta,
    update_anno: update,
    // update_infinite_anno: update_infinite,
  };
};

const defaultParams_anno: Tparams = {
  pageSize: 20,
  sort: 'category',
  order: 'DESC',
};

export const useGetAnnotation_v2 = createUseApi_array_infinite({
  apiClient: apiGetAnnotation,
  defaultParams: defaultParams_anno,
});

export const useGetAnnotation_infinite = createUseInfinite({
  apiClient: apiGetAnnotation,
  errTitle: '取得報價單備註列表失敗',
});

export const apiPostAnnotation = ({ body }: { body: TcreateAnnotationDto }) => {
  const api = '/work-sheet/presets/annotations';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiPatchAnnotation = ({ body, id }: { body: TcreateAnnotationDto; id: string }) => {
  const api = `/work-sheet/presets/annotations/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiDeleteAnnotation = ({ id }: { id: string }) => {
  const api = `/work-sheet/presets/annotations/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

// =====================================================================

export const apiGetQuotationRanges = (params?: Tparams) => {
  const api = '/work-sheet/presets/quotation-ranges';

  return axi
    .get<TgetQuotataionRanges>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

const defaultParams_qr: Tparams = {
  pageSize: 20,
  sort: 'category',
  order: 'DESC',
};

export const useGetQuotationRanges_v2 = createUseApi_array_infinite({
  apiClient: apiGetQuotationRanges,
  defaultParams: defaultParams_qr,
});

export const useGetQuotationRanges_infinite = createUseInfinite({
  apiClient: apiGetQuotationRanges,
  errTitle: '取得報價單報價範圍列表失敗',
});

export const apiPostQuotationRanges = ({ body }: { body: TcreateAnnotationDto }) => {
  const api = '/work-sheet/presets/quotation-ranges';

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiPatchQuotationRanges = ({ body, id }: { body: TcreateAnnotationDto; id: string }) => {
  const api = `/work-sheet/presets/quotation-ranges/${id}`;

  return axi
    .patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiDeleteQuotationRanges = ({ id }: { id: string }) => {
  const api = `/work-sheet/presets/quotation-ranges/${id}`;

  return axi
    .delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

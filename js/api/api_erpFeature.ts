import { useState } from 'react';
import { axi } from './_axiosCreator';

// type
import { TpageMetaDto, TerpFeatureDto } from './dtoTypes';

export type { TerpFeatureDto };

const apiGetErpFeatures = () => {
  const api = '/erp-features';

  return axi
    .get(api)
    .then(({ data }) => data as TerpFeatureDto[])
    .catch((err) => Promise.reject(err));
};

export const useErpFeatures = () => {
  const [data, setData] = useState<TerpFeatureDto[]>();

  const update = async () => {
    const res = await apiGetErpFeatures();

    if (res) {
      setData(res);
    }

    return res;
  };

  return { data, setData, update };
};

type TpostErpFeaturesBody = {
  departmentIds: string[];
};

////////////////////////////////////////// 這個id是什麼的id
export const apiPostErpFeatures_id_departments = (id: string, body: TpostErpFeaturesBody) => {
  const api = `/erp-features/${id}/departments`;

  return axi
    .post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiDeleteErpFeatures_id_departments = (id: string, body: TpostErpFeaturesBody) => {
  const api = `/erp-features/${id}/departments`;

  return axi
    .delete(api, { data: { ...body } })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiErpFeaturesMe = () => {
  const api = '/erp-features/me';

  return axi
    .get(api)
    .then(({ data }) => data as TerpFeatureDto[])
    .catch((err) => Promise.reject(err));
};

export const useApiErpFeaturesMe = () => {
  const [res, setRes] = useState<TerpFeatureDto[]>();

  const update = async () => {
    const res = await apiErpFeaturesMe();

    if (res) {
      setRes(res);
    }

    return res;
  };

  return { erpFeature: res, setErpFeature: setRes, updateErpFeature: update };
};

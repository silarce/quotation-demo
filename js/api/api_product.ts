import { useState, useEffect } from 'react';

import { axi } from './_axiosCreator';

// type
import type {
  // TdoorMaterialDto,
  TdoorModelInfoDto,
  // TdoorGeneralSpecsMotorBoxPropertyDto,
  // TdoorGeneralSpecsMotorBoxDto,
  // TdoorGeneralSpecsMotorDto,
  TdoorGeneralSpecsDto,
  // TdoorSlatDto,
  // TdoorBottomBarDto,
  // TdoorGuideRailDto,
  // TdoorSidePlateDto,
  // TdoorRollerDto,
  // TdoorMotorDto,
  // TdoorMotorAccessoriesDto,
  // TdoorHeadBoxDto,
  TdoorComponentListDto,
} from './dtoTypes';

// const apiGetAssets = (path: string) => {
//   return `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/${path}`;
// };

export type { TdoorModelInfoDto, TpcgsPrams, TdoorGeneralSpecsDto, TpacParams };
// =======================================================================

export const apiGetAssets = async (path: string) => {
  const api = `/products/assets/${path}`;

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const apiGetProdDoorModels = async () => {
  const api = '/products/door/models';

  return axi
    .get<TdoorModelInfoDto[]>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

export const useApiGetProdDoorModels = () => {
  const [res, setRes] = useState<TdoorModelInfoDto[]>();

  const update = async () => {
    const newRes = await apiGetProdDoorModels();

    if (newRes) {
      setRes(newRes);
    }

    return newRes;
  };

  return {
    res,
    update,
  };
};

// =======================================================================
type TpcgsPrams = {
  modelName: TdoorModelInfoDto['name'];
  height: number;
  isAntiTyphoon: boolean;
} & (
  | {
      fullWidth: number;
      WG?: undefined;
    }
  | {
      fullWidth?: undefined;
      WG: number;
    }
);

export const apiGetProdCalcGeneralSpec = async (params: TpcgsPrams) => {
  const api = '/products/door/calc-general-spec';

  return axi
    .get<TdoorGeneralSpecsDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

type TpcdsPrams = {
  modelName: TdoorModelInfoDto['name'];
  height: number;
  B: number;
};

/**似乎是api還沒做好，目前只會回傳門片數量 */
export const apiGetProdCalcDetailSpec = async (params: TpcdsPrams) => {
  const api = '/products/door/calc-detail-spec';

  return axi
    .get<{ slatCount: number }>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

// =======================================================================

type TpacParams = {
  modelName: TdoorModelInfoDto['name'];
  weight: number;
  isAntiTyphoon: boolean;
  rollerDiameter: number;
};

export const apiGetProdAvailableComponents = async (params: TpacParams) => {
  const api = '/products/door/available-components';

  return axi
    .get<TdoorComponentListDto>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err.message));
};

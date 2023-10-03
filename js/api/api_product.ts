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
  TgenerateDoorProductBomDto_ComponentInfo,
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto,
  TdoorBomDto_Component,
  TdoorProductBomDto,
  TdoorAccessoryDto,
} from './dtoTypes';

// const apiGetAssets = (path: string) => {
//   return `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/${path}`;
// };

export type {
  TdoorModelInfoDto,
  TpcgsPrams,
  TdoorGeneralSpecsDto,
  TpacParams,
  TdoorComponentListDto,
  TgenerateDoorProductBomDto_ComponentInfo,
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto,
  TdoorBomDto_Component,
  TdoorProductBomDto,
  TdoorAccessoryDto,
};
// =======================================================================

export const apiGetAssets = async (path: string) => {
  const api = `/products/assets/${path}`;

  return axi
    .get(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiGetProdDoorModels = async () => {
  const api = '/products/door/models';

  return axi
    .get<TdoorModelInfoDto[]>(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
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
    .catch((err) => Promise.reject(err));
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
    .catch((err) => Promise.reject(err));
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
    .catch((err) => Promise.reject(err));
};

// =======================================================================

// FIXME 20231002 必須要再提供兩個參數bottomBarAngleIron bottomBarPlate
export const apiPostProdGenerateDoorProductBom = (body: TgenerateDoorProductBomDto) => {
  const api = '/products/door/generate-door-product-bom';

  return axi
    .post<TdoorProductBomDto>(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

export const apiGetProdAccessories = (params: { modelName: string }) => {
  const api = '/products/door/accessories';

  return axi
    .get<TdoorAccessoryDto[]>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

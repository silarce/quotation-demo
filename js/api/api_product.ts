import { useState, useEffect, useMemo } from 'react';
import { axi } from './_axiosCreator';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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
  TgetBoxDParams,
};
// =======================================================================

export const apiGetAssets = async (path: string) => {
  const api = `/products/assets/door-track/${path}`;

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
    try {
      const newRes = await apiGetProdDoorModels();

      if (newRes) {
        setRes(newRes);
      }

      return newRes;
    } catch (error) {
      const err = error as Error;
      myAlert.err({ title: '取得門型列表失敗', content: err.message });

      return err;
    }
  };

  const doorModelList = useMemo(() => {
    if (!res) {
      return undefined;
    }

    const list: { [key: string]: TdoorModelInfoDto } = {};

    res.forEach((item) => {
      list[item.name] = item;
    });

    return list;
  }, [res]);

  return {
    res,
    update,
    doorModelList,
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

type TgetBoxDParams = {
  modelName: string;
  rollerDiameter: number;
  sidePlateSizeB: number;
  hp: string;
  motorVendor: string;
};

export const apiGetboxD = (params: TgetBoxDParams) => {
  const api = '/products/door/calc-side-plate-size-d';

  return axi
    .get<{ sidePlateSizeD: number }>(api, { params })
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err));
};

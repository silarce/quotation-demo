import { ClassProd } from './classProd_remake';

import { AxiosError } from 'axios';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import { TapiError, TdoorModel, TgenerateDoorProductBomDto_DoorSpec, TmaterialSurface } from 'js/api/dtoTypes';

import type { TclassComponentDict } from '../../useQuotationProduct';

// api
import {
  Thp,
  //
  TpcgsPrams,
  apiGetProdCalcGeneralSpec,
  //
  TpcdsPrams,
  apiGetProdCalcDetailSpec,
  //
  TpacParams,
  apiGetProdAvailableComponents,
  //
  TgetBoxDParams,
  TgetBoxDParams_strict,
  //
  TgenerateDoorProductBomDto,
  apiPostProdGenerateDoorProductBom,
  //
  apiGetboxD,
} from 'js/api/api_product';

// ===========================================================================

type TresError = AxiosError<TapiError>;
type TerrRes = { title: string; content?: string };

// ===========================================================================

// MARK:reqGetProdCalcGeneralSpec
const reqGetProdCalcGeneralSpec = async ({ classProd, withHp = false }: { classProd: ClassProd; withHp?: boolean }) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject({
      title: '取得產品規格失敗',
      content: `無效的門型`,
    });
  }

  const prodData = classProd.data;

  // '1/4' | '1/3' | '1/2' | '3/4' | '1' | '1 1/2' | '2' | '3' | '5';
  const hp = prodData.horsepower.replaceAll('HP', '') as Thp;

  const body: TpcgsPrams = {
    // classProd.doorModelName的實際型別為string而非TpcgsPrams['modelName']
    // 預期可能會422，但已在catch處理
    // modelName: classProd.doorModelName as TpcgsPrams['modelName'],
    modelName: prodData.doorModelName as TpcgsPrams['modelName'],
    height: classProd.height_mm,
    //
    fullWidth: classProd.fullWidth_mm,
    WG: undefined, // 不使用WG，統一使用fullWidth
    //
    isAntiTyphoon: !!prodData.isAntiTyphoon,
    // hp:  hp || undefined,
    hp: withHp ? hp : undefined,
  };

  return await apiGetProdCalcGeneralSpec(body)
    .then((res) => res)
    .catch((err: TresError) => {
      console.log(err);

      let message = err.response?.data.message as any;

      if (typeof message === 'string') {
        message = message;
      } else if (typeof message === 'object') {
        message = JSON.stringify(message);
      }

      return Promise.reject({
        title: '取得產品規格失敗',
        content: message,
      });
    });
};

// MARK:reqGetAvailableComponents
const reqGetAvailableComponents = async (classProd: ClassProd) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject({ title: '取得可用材料配件失敗', content: '無效的門型' });
  }

  const prodData = classProd.data;

  const body: TpacParams = {
    modelName: prodData.doorModelName as TdoorModel,
    weight: Number(prodData.weight || 0),
    isAntiTyphoon: !!prodData.isAntiTyphoon,
    rollerDiameter: Number(prodData.diameter || 0),
  };

  return await apiGetProdAvailableComponents(body)
    .then((res) => res)
    .catch((err: TresError) => {
      let message = err.response?.data.message as any;

      if (typeof message === 'string') {
        message = message;
      } else if (typeof message === 'object') {
        message = JSON.stringify(message);
      }

      return Promise.reject({ title: '取得可用材料配件失敗', content: message });
    });
};

// MARK:reqGetBom
const reqGetBom = async (classProd: ClassProd) => {
  const prodData = classProd.data;
  const doorModelName = prodData.doorModelName;

  const componentDict = classProd.state.data_componentDict;

  const infoDict_partial: Partial<Omit<TgenerateDoorProductBomDto, 'doorSpec'>> = {};

  const componentInfoDict = Object.entries(componentDict).reduce((acc, [_key, component]) => {
    const key = _key as keyof TclassComponentDict;

    const { rawData, material, isPainted, type } = component;

    let materialSurface = component.materialSurface;
    const guideRailThickness = key === 'guideRail' ? classProd.data.guideRailThickness : undefined; // 門軌厚度

    if (
      !(
        doorModelName === 'SJ-302' ||
        doorModelName === 'SJ-312' ||
        doorModelName === 'SJ-303A' ||
        doorModelName === 'SJ-303AS'
      ) &&
      (materialSurface === '烤漆' || materialSurface === '氟碳' || materialSurface === '烤漆指定色')
    ) {
      materialSurface = '2B';
    }

    acc[type] = {
      id: rawData!.id,
      material,
      materialSurface: (materialSurface as TmaterialSurface) || undefined,
      isPainted,
      thickness: guideRailThickness,
    };

    return acc;
  }, infoDict_partial) as Omit<TgenerateDoorProductBomDto, 'doorSpec'>;

  const doorSpec: TgenerateDoorProductBomDto_DoorSpec = {
    modelName: prodData.doorModelName as TdoorModel,
    weight: classProd.data.weight ? Number(classProd.data.weight) : -1,
    height: classProd.height_mm,
    B: classProd.boxB_mm,
    D: classProd.boxD_mm,
    slatLength: prodData.slatLength || -1,
    guideRailLength: prodData.guideRailLength || -1,
    rollerLength: prodData.bearingHousingTotalLength ? Number(prodData.bearingHousingTotalLength) : -1,
    headBoxLength: prodData.headBoxLength || -1,
    isAntiTyphoon: !!prodData.isAntiTyphoon,
    rollerDiameter: prodData.diameter ? Number(prodData.diameter) : 0,
    bearingType: prodData.bearingName ?? '',
    gearNumber: prodData.gearNumber ?? '',
    chains: prodData.sprocketWheelChains ? Number(prodData.sprocketWheelChains) : -1,
    fullWidth: classProd.fullWidth_mm,
    bottomBarAngleIron: prodData.bottomBarAngleIron ?? '',
    bottomBarPlate: prodData.bottomBarPlate ?? '',
  };

  const body: TgenerateDoorProductBomDto = {
    doorSpec,
    ...componentInfoDict,
  };

  return await apiPostProdGenerateDoorProductBom(body).catch((err: TresError) => {
    let message = err.response?.data.message as any;

    if (typeof message === 'string') {
      message = message;
    } else if (typeof message === 'object') {
      message = JSON.stringify(message);
    }

    return Promise.reject({ title: '取得BOM失敗', content: message });
  });
};

// MARK:reqGetBoxD
const reqGetBoxD = async (classProd: ClassProd) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject({ title: '取得boxD失敗', content: '無效的門型' });
  }

  const body: TgetBoxDParams_strict = {
    modelName: classProd.doorModelName as TdoorModel,
    rollerDiameter: Number(classProd.data.diameter || 0),
    sidePlateSizeB: classProd.boxB_mm,
    hp: classProd.data.horsepower,
    motorVendor: classProd.data.motorVendor || '',
  };

  return await apiGetboxD(body)
    .then((res) => res.sidePlateSizeD)
    .catch((err: TresError) => {
      let message = err.response?.data.message as any;

      if (typeof message === 'string') {
        message = message;
      } else if (typeof message === 'object') {
        message = JSON.stringify(message);
      }

      return Promise.reject({ title: '取得boxD失敗', content: message });
    });
};

// MARK:reqGetSlatCount
const reqGetSlatCount = async (classProd: ClassProd) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject({ title: '門片數量失敗', content: '無效的門型' });
  }

  const body: TpcdsPrams = {
    modelName: classProd.doorModelName as TdoorModel,
    height: classProd.height_mm,
    B: classProd.boxB_mm,
  };

  return await apiGetProdCalcDetailSpec(body)
    .then((res) => res.slatCount)
    .catch((err: TresError) => {
      let message = err.response?.data.message as any;

      if (typeof message === 'string') {
        message = message;
      } else if (typeof message === 'object') {
        message = JSON.stringify(message);
      }

      return Promise.reject({ title: '取得門片數量失敗', content: message });
    });
};

// ===========================================================================
// ===========================================================================
// ===========================================================================
export { reqGetProdCalcGeneralSpec, reqGetAvailableComponents, reqGetBom, reqGetBoxD, reqGetSlatCount };
export type { TerrRes };

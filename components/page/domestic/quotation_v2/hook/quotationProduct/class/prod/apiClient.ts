import { ClassProd_1 } from './classProd_remake';

import Decimal from 'decimal.js';
import _ from 'lodash';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
import { TstateProd } from '../../type';
import { TnodeConfig } from './config';
import {
  TdoorModelInfoDto,
  //
  TdoorGeneralSpecsDto,
  //
  TdoorComponentListDto,
  TdoorSlatDto,
  TdoorBottomBarDto,
  TdoorGuideRailDto,
  TdoorSidePlateDto,
  TdoorRollerDto,
  TdoorMotorDto,
  TdoorMotorAccessoriesDto,
  TdoorHeadBoxDto,
  TdoorMiddlePillarDto,
  TdoorBackBoneDto,

  //
  TdoorModel,
  //
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto_ComponentInfo,
  //
  TmaterialSurface,
  TdoorComponentType,
} from 'js/api/dtoTypes';

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
import { createAssetUrl } from 'js/api/api_product';

// utils
import { checkIsFloat } from 'js/utils/checkValue';
import {
  calcProductArea,
  calcProductVolume,
  calcProductWG_withWAndG,
  calcProductFullWidth,
  calcW,
  calcW_2,
  // findBDoptions,
  calcFullHeight,
  calcAngleIronSize,
  calcProductWG,
} from 'js/utils/product/calc';

import {
  Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_prime,
  Interface_ClassProd_special,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/interface';

import * as componentFilter from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/componentFilter';

import { createComponentDict } from '../createComponentDict';

import {
  optionsCreator_surface,
  optionsCreator_surface_onlyPaint,
  optionsCreator_doorModel,
  optionsCreator_bottomBarAngleIron,
  optionsCreator_bottomBarPlate,
  optionsCreator_bottomBarAngleIron_303A,
  optionsCreator_bottomBarPlate_303A,
  optionsCreator_bottomBarAngleIron_303AS,
  optionsCreator_bottomBarPlate_303AS,
  optionsCreator_boxB_SJ302,
  optionsCreator_boxB_SJ303A,
  optionsCreator_boxB_SJ312,
  optionsCreator_boxB_SJ305D,
  optionsCreator_horsePower,
  optionsCreator_quoteType,
  lookup_options_bottomBarAngleIronAndPlate,
  optionsCreator_doorModelName,
  lookup_quoteType_doorModelName,
} from 'js/utils/options/productOptions';

import { checkIsSST, checkIsGalvanized } from '../library';

import { createEmptyStateProd } from '../../emptyProdState';

import { Toption } from 'js/utils/options/options';

import { createEmptyComponentStateDict } from '../../emptyComponentState';

import { handle__options_surface } from './handleProd/handle__options_surface';

// ===========================================================================

// MARK:reqGetProdCalcGeneralSpec
const reqGetProdCalcGeneralSpec = async (classProd: ClassProd_1) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject(null);
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
    hp: hp || undefined,
  };

  return await apiGetProdCalcGeneralSpec(body)
    .then((res) => res)
    .catch(() => {
      myAlert.err({ title: '取得產品規格失敗' });

      return Promise.reject(null);
    });
};

// MARK:reqGetAvailableComponents
const reqGetAvailableComponents = async (classProd: ClassProd_1) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject(null);
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
    .catch(() => {
      myAlert.err({ title: '取得材料配件失敗' });

      return Promise.reject(null);
    });
};

// MARK:reqGetBom
const reqGetBom = async (classProd: ClassProd_1) => {
  const prodData = classProd.data;

  const componentDict = classProd.state.data_componentDict;

  const infoDict_partial: Partial<Omit<TgenerateDoorProductBomDto, 'doorSpec'>> = {};

  const componentInfoDict = Object.entries(componentDict).reduce((acc, [_key, component]) => {
    const key = _key as keyof TclassComponentDict;
    const { rawData, material, isPainted, type } = component;
    let materialSurface = component.materialSurface;
    const guideRailThickness = key === 'guideRail' ? classProd.data.guideRailThickness : undefined; // 門軌厚度

    if (materialSurface === '烤漆' || materialSurface === '氟碳') {
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

  const res = await apiPostProdGenerateDoorProductBom(body).catch(() => {
    myAlert.err({ title: '取得BOM失敗' });

    return null;
  });

  return res;
};

// MARK:reqGetBoxD
const reqGetBoxD = async (classProd: ClassProd_1) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject(null);
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
    .catch(() => {
      myAlert.err({ title: '取得boxD失敗' });

      return Promise.reject(null);
    });
};

// MARK:reqGetSlatCount
const reqGetSlatCount = async (classProd: ClassProd_1) => {
  if (!classProd.isValid_doorModel) {
    return Promise.reject(null);
  }

  const body: TpcdsPrams = {
    modelName: classProd.doorModelName as TdoorModel,
    height: classProd.height_mm,
    B: classProd.boxB_mm,
  };

  return await apiGetProdCalcDetailSpec(body)
    .then((res) => res.slatCount)
    .catch(() => {
      myAlert.err({ title: '取得門片數量失敗' });

      return Promise.reject(null);
    });
};

// ===========================================================================
// ===========================================================================
// ===========================================================================
export { reqGetProdCalcGeneralSpec, reqGetAvailableComponents, reqGetBom, reqGetBoxD, reqGetSlatCount };

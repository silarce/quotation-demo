import Decimal from 'decimal.js';
import _, { create } from 'lodash';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import InputSel, {
  TinputSelProps,
  inputLocaleStringSwitcher,
  InputSel_input_timeout,
} from 'components/global/gear/inputAndSel_v2/inputSel';
import {
  InputSel_prod,
  InputSel_prod_memo_select,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';

// type
import { Toption } from 'js/utils/options/options';
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
} from 'js/api/dtoTypes';

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
  apiGetboxD,
  TgetBoxDParams_strict,
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

import { ClassProd_base } from './classProd_base';
import { th } from 'date-fns/locale';

// ========================================================================

const options_surface_onlyPaint = optionsCreator_surface_onlyPaint();
const options_surface = optionsCreator_surface();

// ========================================================================
// 修改style與className時要注意避免修改影響寬度的樣式，避免與其他的row不對齊
const customizeNodeConfig = ({ classProd, nodeConfig }: { classProd: ClassProd_prime; nodeConfig: TnodeConfig }) => {
  const config: typeof nodeConfig = {
    ...nodeConfig,

    materialName: {
      ...nodeConfig.materialName,
      createNode: ({ disabled }) => {
        const options = classProd.options_material;
        const v = classProd.materialName;
        const value = v ? { value: v, label: v } : null;

        const inputSelProps: TinputSelProps = {
          disabled,
          selectProps: {
            props: {
              options,
              value,
              onChange: (option) => {
                const value = option?.value || '';
                classProd.materialName = value;
              },
            },
          },
        };

        return <InputSel_prod_memo_select {...inputSelProps} />;
      },
    },

    materialSurface: {
      ...nodeConfig.materialSurface,
      createNode: ({ disabled }) => {
        const options = classProd.options_surface;
        const v = classProd.data.materialSurface;
        const value = v ? { value: v, label: v } : null;

        const inputSelProps: TinputSelProps = {
          disabled,
          selectProps: {
            props: {
              options,
              value,
              onChange: (option) => {
                const value = option?.value || '';
                classProd.materialSurface = value;
              },
            },
          },
        };

        return <InputSel_prod_memo_select {...inputSelProps} />;
      },
    },
  };

  // ----------------------------------------------------------------------

  return config;
};

// ========================================================================

//MARK:ClassProd_prime
class ClassProd_prime extends ClassProd_base implements Interface_ClassProd_prime {
  doorModel: TdoorModel = 'SJ-302';

  _options_material: Toption[] | undefined;
  _options_surface: Toption[] | undefined;

  constructor(props: ConstructorParameters<typeof ClassProd_base>[0]) {
    super(props);

    const nodeConfig = this.nodeConfig;

    this._nodeConfig = customizeNodeConfig({
      classProd: this,
      nodeConfig,
    });
  }

  // ---------------------------------------------------------------------------------

  // region options
  get options_material() {
    if (!this._options_material) {
      this._options_material = createOptions_material(this);
    }

    return this._options_material;
  }

  get options_surface() {
    if (!this.materialName || !this.doorModelName) {
      return undefined;
    }

    if (!this._options_surface) {
      this._options_surface = createOptions_surface(this);
    }

    return this._options_surface;
  }

  // ---------------------------------------------------------------------------------

  protected clearGeneralSpec() {
    this.data.gapA = '';
    this.data.gapC = '';
    this.data.gearNumber = null;
    this.data.weight = null;
    this.data.thickness = '';
    this.data.sprocketWheelModel = null;
    this.data.sprocketWheelTeethNumber = null;
    this.data.sprocketWheelChains = null;
    this.data.bearingInnerDiameter = null;
    this.data.diameter = null;
    this.data.bearingHousingTotalLength = null;
    this.data.slatLength = null;
    this.data.guideRailLength = null;
    this.data.headBoxLength = null;
    this.data.bearingHousingSize = null;
    this.data.bearingName = null;

    this.data.motorPhase = null;
    this.data.motorVendor = null;
    this.data.motorVoltage = null;
    this.data.horsepower = '';
    this.data.boxB = '';
    this.data.boxD = '';

    return this;
  }

  protected clearComponent() {
    this.state.availableComponents = null;
    this.state.data_componentDict = {};
    this.state.componentKeyArr = [];
  }

  //-------------------------------------------------------------------------------

  // MARK:handle_afterUpdateGeneralSpec
  protected afterUpdateGeneralSpec_sideEffect(generalSpecs: TdoorGeneralSpecsDto) {
    // const generalSpecs = this.state.generalSpecs;

    // if (!generalSpecs) {
    //   throw new Error('in afterUpdateGeneralSpec, generalSpecs is undefined or null');
    // }

    // if (!generalSpecs) {
    //   this.data.gapA = '';
    //   this.data.gapC = '';
    //   this.data.gearNumber = null;
    //   this.data.weight = null;
    //   this.data.thickness = '';
    //   this.data.sprocketWheelModel = null;
    //   this.data.sprocketWheelTeethNumber = null;
    //   this.data.sprocketWheelChains = null;
    //   this.data.bearingInnerDiameter = null;
    //   this.data.diameter = null;
    //   this.data.bearingHousingTotalLength = null;
    //   this.data.slatLength = null;
    //   this.data.guideRailLength = null;
    //   this.data.headBoxLength = null;
    //   this.data.bearingHousingSize = null;
    //   this.data.bearingName = null;

    //   this.data.motorPhase = null;
    //   this.data.motorVendor = null;
    //   this.data.motorVoltage = null;
    //   this.data.horsepower = '';
    //   this.data.boxB = '';
    //   this.data.boxD = '';

    //   return this;
    // }

    generalSpecs.bearingInnerDiameter === 'N/A' && (generalSpecs.bearingInnerDiameter = '');
    generalSpecs.bearingName === 'N/A' && (generalSpecs.bearingName = '');
    generalSpecs.gearNumber === 'N/A' && (generalSpecs.gearNumber = '');
    generalSpecs.sprocketWheelModel === 'N/A' && (generalSpecs.sprocketWheelModel = '');
    generalSpecs.sprocketWheelTeethNumber === 'N/A' && (generalSpecs.sprocketWheelTeethNumber = '');

    this.data.gapA = `${generalSpecs.gapA}`;
    this.data.gapC = `${generalSpecs.gapC}`;
    this.data.gearNumber = generalSpecs.gearNumber || null;
    this.data.weight = `${generalSpecs.weight}`;
    this.data.thickness = generalSpecs.thickness as `${number}`;
    this.data.sprocketWheelModel = generalSpecs.sprocketWheelModel || null;
    this.data.sprocketWheelTeethNumber = generalSpecs.sprocketWheelTeethNumber || null;
    this.data.sprocketWheelChains = `${generalSpecs.sprocketWheelChains}`;
    this.data.bearingInnerDiameter = generalSpecs.bearingInnerDiameter || null;
    this.data.diameter = `${generalSpecs.diameter}`;
    this.data.bearingHousingTotalLength = `${generalSpecs.bearingHousingTotalLength}`;
    this.data.slatLength = generalSpecs.slatLength;
    this.data.guideRailLength = generalSpecs.guideRailLength;
    this.data.headBoxLength = generalSpecs.headBoxLength;
    this.data.bearingHousingSize = generalSpecs.bearingHousingSize;
    this.data.bearingName = generalSpecs.bearingName || null;

    const WG_mm = calcProductWG({
      fullWidth: this.fullWidth_mm,
      gapA: this.data.gapA,
      gapC: this.data.gapC,
    });

    this.data.WG = new Decimal(WG_mm).div(1000).toString() as `${number}`;
    this.data.thickness = generalSpecs.thickness as `${number}`;

    const {
      //
      hp,
      box: { default: defaultVendor, 大同, 東元 } = {},
    } = generalSpecs.motors[generalSpecs.defaultMotorIndex];
    this.data.horsepower = hp === 'N/A' ? '' : hp;

    if (東元) {
      this.data.motorVendor = '東元';
      this.data.boxB = new Decimal(東元.boxB).div(1000).toString() as `${number}`;
    } else if (defaultVendor) {
      this.data.motorVendor = '東元';
      this.data.boxB = new Decimal(defaultVendor.boxB).div(1000).toString() as `${number}`;
    } else if (大同) {
      this.data.motorVendor = '大同';
      this.data.boxB = new Decimal(大同.boxB).div(1000).toString() as `${number}`;
    } else {
      this.data.motorVendor = null;
      this.data.boxB = '';
    }

    this.data.area = ClassProd_prime.calcArea(this);

    return this;
  }

  protected afterAvailableComponentsUpdated_sideEffect(availableComponents: TdoorComponentListDto) {
    const { componentDict, changedMotorVendor } = createComponentDict({
      classProd: this,
      availableComponents,
    });

    Object.values(this.classComponentDict).forEach((classComponent) => {
      const data_component = componentDict[classComponent.key];

      if (data_component) {
        classComponent.replaceState();
      }
    });

    Object.values(this.classComponentDict).forEach((classComponent) => {
      classComponent.init();
    });
  } // handleAvailableComponentsUpdated

  // region reqChain
  protected async reqChain_01() {
    try {
      const generalSpec = await ClassProd_prime.reqGetProdCalcGeneralSpec(this);
      // 取得generalSpec
      this.state.generalSpecs = generalSpec;
      // 送入generalSpec更新state
      this.afterUpdateGeneralSpec_sideEffect(generalSpec);

      // 取得boxD並更新state
      const boxD = await reqGetBoxD(this);
      this.data.boxD = new Decimal(boxD || 0).div(1000).toString() as `${number}`;

      // 取得slatCount並更新state
      const slatCount = await reqGetSlatCount(this);
      this.data.slatCount = slatCount === null ? null : `${slatCount}`;

      // 取得可用材料配件
      const availableComponents = await ClassProd_prime.reqGetAvailableComponents(this);
      // 更新可用材料配件
      this.state.availableComponents = availableComponents;

      // 更新材料配件
      this.afterAvailableComponentsUpdated_sideEffect(availableComponents);

      const bom = await ClassProd_prime.reqGetBom(this);
      this.state.generateDoorProductBom = bom;

      Object.values(this.classComponentDict).forEach((classComponent) => classComponent.onBomUpdate());

      this.render();

      // 接著要取得BOM資料
    } catch (error) {
      this.clearGeneralSpec();
      this.clearComponent();
    }
  }

  // ---------------------------------------------------------------------------------
  async afterFullWidthChange() {
    this.state.isFetching = true;
    this.render();

    await this.reqChain_01();

    this.state.isFetching = false;
    this.render();
  }

  // ---------------------------------------------------------------------------------
  // MARK: 值

  get materialName() {
    return super.materialName;
  }

  set materialName(value: string) {
    super.materialName = value;

    Object.values(this.classComponentDict).forEach((classComponent) => {
      classComponent.onProdChangeMaterial(this.data.materialName);
    });

    // 更新表面選項
    this._options_surface = createOptions_surface(this);

    const isSurfaceValid = this._options_surface.some((item) => item.value === this.data.materialSurface);

    if (!isSurfaceValid) {
      this.data.materialSurface = this._options_surface[0].value;
    }

    this.render();
  }

  get materialSurface() {
    return super.materialSurface;
  }

  set materialSurface(value) {
    super.materialSurface = value;

    Object.values(this.classComponentDict).forEach((classComponent) =>
      // slat  headBox  guideRail // 只有這三個有作用
      classComponent.onProdChangeSurface(this.data.materialSurface)
    );

    this.render();
  }
} // ClassProd_prime

// MARK: END

// ========================================================================
// ========================================================================
// ========================================================================

// region API

// const reqGetProdCalcGeneralSpec = async (classProd: ClassProd_base) => {
//   if (!classProd.isValid_doorModelName) {
//     return Promise.reject(null);
//   }

//   // '1/4' | '1/3' | '1/2' | '3/4' | '1' | '1 1/2' | '2' | '3' | '5';
//   const hp = classProd.horsepower.replaceAll('HP', '') as Thp;

//   const body: TpcgsPrams = {
//     // classProd.doorModelName的實際型別為string而非TpcgsPrams['modelName']
//     // 預期可能會422，但已在catch處理
//     // modelName: classProd.doorModelName as TpcgsPrams['modelName'],
//     modelName: classProd.doorModelName as TpcgsPrams['modelName'],
//     height: classProd.height_mm,
//     //
//     fullWidth: classProd.fullWidth_mm,
//     WG: undefined, // 不使用WG，統一使用fullWidth
//     //
//     isAntiTyphoon: !!classProd.isAntiTyphoon,
//     hp: hp || undefined,
//   };

//   return await apiGetProdCalcGeneralSpec(body)
//     .then((res) => res)
//     .catch(() => {
//       myAlert.err({ title: '取得產品規格失敗' });

//       return Promise.reject(null);
//     });
// };

// const reqGetAvailableComponents = async (classProd: ClassProd_base) => {
//   if (!classProd.isValid_doorModelName) {
//     return Promise.reject(null);
//   }

//   const body: TpacParams = {
//     modelName: classProd.doorModelName as TdoorModel,
//     weight: Number(classProd.data.weight || 0),
//     isAntiTyphoon: !!classProd.data.isAntiTyphoon,
//     rollerDiameter: Number(classProd.data.diameter || 0),
//   };

//   return await apiGetProdAvailableComponents(body)
//     .then((res) => res)
//     .catch(() => {
//       myAlert.err({ title: '取得材料配件失敗' });

//       return Promise.reject(null);
//     });
// };

const reqGetBoxD = async (classProd: ClassProd_base) => {
  if (!classProd.isValid_doorModelName) {
    return Promise.reject(null);
  }

  const body: TgetBoxDParams_strict = {
    modelName: classProd.doorModel as TdoorModel,
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

// const reqGetSlatCount = async (body: TpcdsPrams) => {
//   return await apiGetProdCalcDetailSpec(body)
//     .then((res) => res.slatCount)
//     .catch(() => {
//       myAlert.err({ title: '取得門片數量失敗' });

//       return null;
//     });
// };

const reqGetSlatCount = async (classProd: ClassProd_base) => {
  if (!classProd.isValid_doorModelName) {
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

// const reqGetAvailableComponents = async (body: TpacParams) => {
//   return await apiGetProdAvailableComponents(body)
//     .then((res) => res)
//     .catch(() => {
//       myAlert.err({ title: '取得材料配件失敗' });

//       return null;
//     });
// };

// ========================================================================

const createOptions_material = (classProd: ClassProd_prime) => {
  const doorModel = classProd.state.doorModel;

  if (!doorModel) {
    return undefined;
  }

  const slatMaterialsArr = doorModel.slatMaterials;
  const order = ['黑鐵', '鍍鋅鋼板', 'SST#304', 'SST#316', '樹脂鋼板', '高耐鍍鋅鋼板'];
  const orderedArr = _.orderBy(slatMaterialsArr, (item) => order.indexOf(item.name));

  const options = orderedArr.map((item) => {
    return {
      value: item.name,
      label: item.name,
    };
  });

  // 把黑鐵的label改為鐵材烤漆
  const blackIron = options.find((item) => item.value === '黑鐵');
  blackIron && (blackIron.label = '鐵材烤漆');

  return options;
};

const createOptions_surface = (classProd: ClassProd_prime) => {
  let options = options_surface_onlyPaint;

  const isSST = checkIsSST(classProd.data.materialName);
  const isGalvanized = checkIsGalvanized(classProd.data.materialName); // 是否鍍鋅

  if (isSST) {
    options = options_surface;
  }

  if (!isGalvanized) {
    options = options.filter((item) => item.value !== '無烤漆');
  }

  return options;
};

// ========================================================================
export type { Interface_ClassProd_prime };
export { ClassProd_prime };

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

import {
  reqGetProdCalcGeneralSpec,
  reqGetAvailableComponents,
  reqGetBom,
  reqGetBoxD,
  reqGetSlatCount,
} from './apiClient';

// ================================================================================

interface Tprops_constructor {
  stateProd: TstateProd;
  setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
  nodeConfig: TnodeConfig;
}

// ================================================================================

const doorModelNameLookup: {
  [key in TdoorModel]: key;
} = {
  'SJ-302': 'SJ-302',
  'SJ-312': 'SJ-312',
  'SJ-305D': 'SJ-305D',
  'SJ-303A': 'SJ-303A',
  'SJ-303AS': 'SJ-303AS',
  W2: 'W2',
};
// ================================================================================

// const doorModelNameArr = Object.keys(doorModelNameLookup) as TdoorModel[];

// 在子類別中，可以透過customizeNodeConfig方法來覆寫nodeConfig
// 務必要先進行深拷貝，避免影響到原本的nodeConfig
const customizeNodeConfig = ({ nodeConfig }: { nodeConfig: TnodeConfig }) => {
  const config = _.cloneDeep(nodeConfig);

  // 修改style與className時要注意避免修改影響寬度的樣式，避免與其他的row不對齊

  // 範例
  // config.itemName.style = { ...config.itemName.style, background: 'red' };
  // config.itemName.className = classNames(config.itemName.className, scss.foo);
  // config.itemName.createNode = (state) => {
  //   return null;
  // };

  return config;
};

// ================================================================================

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

class ClassProd {
  readonly state: TstateProd;
  protected readonly setState: React.Dispatch<React.SetStateAction<TstateProd>>;
  protected render() {
    this.setState({ ...this.state });
  }
  // data: TstateProd['data_prod'];
  get data() {
    return this.state.data_prod;
  }

  readonly classComponentDict: TclassComponentDict = {};

  readonly nodeConfig: TnodeConfig;

  // _options_material: Toption[] | undefined;
  // _options_surface: Toption[] | undefined;

  // 是否為特殊門
  get isSpecial() {
    return !this.isValid_doorModel;
  }
  // ---------------------------------------------------------------------------
  // MARK:constructor
  constructor({ stateProd, setStateProd, nodeConfig }: Tprops_constructor) {
    // cloneDeep對效能的負擔太大了
    // this.state = _.cloneDeep(stateProd);
    this.state = stateProd;
    // this.data = this.state.data_prod;
    this.setState = setStateProd;
    this.nodeConfig = customizeNodeConfig({ nodeConfig });
  } // constructor
  // ---------------------------------------------------------------------------

  setClassComponentDict(classComponentDict: TclassComponentDict) {
    Object.clearAndAssign(this.classComponentDict, classComponentDict);
  }
  protected clearClassComponentDict() {
    Object.clearAndAssign(this.classComponentDict, {});
  }

  async init() {
    this.state.isFetching = true;
    this.render();

    if (this.isValid_doorModel) {
      try {
        const generalSpec = await reqGetProdCalcGeneralSpec(this);
        this.state.generalSpecs = generalSpec;

        const availableComponents = await reqGetAvailableComponents(this);
        this.state.availableComponents = availableComponents;
      } catch {
        this.state.generalSpecs = null;
        this.state.availableComponents = null;
      }
    }

    this.state.isFetching = false;
    this.render();
  }

  // ---------------------------------------------------------------------------

  calcArea(classProd: ClassProd) {
    const fullWidth = classProd.fullWidth_mm;
    const height = classProd.height_mm;
    const boxb = classProd.boxB_mm;

    let area = calcProductArea({ fullWidth, height, boxb });
    area = new Decimal(area).div(1000000).toDecimalPlaces(2).toString() as `${number}`;

    return area;
  }

  protected renewSurface() {
    // 更新表面選項
    // this._options_surface = createOptions_surface(this);

    // const options_surface = this.options_surface;

    const isSurfaceValid = this.options_surface?.some((item) => item.value === this.data.materialSurface);

    if (!isSurfaceValid) {
      this.data.materialSurface = this.options_surface?.[0].value ?? '';
    }

    this.render();
  }

  // ---------------------------------------------------------------------------

  // get prodData(): typeof this.data {
  //   // 配合deepClone
  //   // const deepFreeze = (obj: any) => {
  //   //   Object.keys(obj).forEach((key) => {
  //   //     if (typeof obj[key] === 'object' && obj[key] !== null) {
  //   //       deepFreeze(obj[key]);
  //   //     }
  //   //   });
  //   //   return Object.freeze(obj);
  //   // };

  //   return { ...this.data };
  // }

  // get componentDict() {
  //   return { ...this.state.data_componentDict };
  // }

  // get doorModelName() {
  //   return this.data.doorModelName;
  // }

  // ---------------------------------------------------------------------------

  changeDoorModel({ doorModel }: { doorModel: TdoorModelInfoDto | null }) {
    this.state.doorModel = doorModel;
    this.data.doorModelName = doorModel?.name ?? '';

    if (!this.state.doorModel) {
      return this;
    }

    const {
      thickness,
      // density,
      // guideRails,
      // slatMaterials,
    } = this.state.doorModel;

    this.data.thickness = thickness.replaceAll('t', '') as `${number}`;

    const is304InMaterialOptions = this.options_material?.some((item) => item.value === 'SST#304');

    if (this.data.doorModelName === 'SJ-305D') {
      const theOption = this.options_material?.find((option) => {
        if (option.value.includes('內SST') && option.value.includes('外SST')) {
          return true;
        }
      });
      this.data.materialName = theOption?.value || '';
    } else if (is304InMaterialOptions) {
      this.data.materialName = 'SST#304';
    } else {
      this.data.materialName = this.options_material?.[0]?.value ?? '';
    }

    this.renewSurface();

    // this.data.horsepower = ''; // 相關 reqGetProdCalcGeneralSpec

    // this.addAfterChange('reqChain_01');

    this.render();
  }
  // ==========================================================================
  // region SPEC
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

  // MARK:afterUpdateGeneralSpec_sideEffect
  protected afterUpdateGeneralSpec_sideEffect(generalSpecs: TdoorGeneralSpecsDto) {
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

    this.data.area = this.calcArea(this);

    return this;
  }
  // endregion SPEC
  // ==========================================================================
  // region COMPONENT

  protected clearComponent() {
    this.state.availableComponents = null;
    this.state.data_componentDict = {};
    this.state.componentKeyArr = [];
  }

  // MARK:afterAvailableComponentsUpdated_sideEffect
  protected afterAvailableComponentsUpdated_sideEffect(availableComponents: TdoorComponentListDto) {
    const { componentDict, changedMotorVendor } = createComponentDict({
      classProd: this,
      availableComponents,
    });

    // console.log(componentDict.motor?.rawData?.id);
    // console.log(componentDict.motor);

    Object.entries(this.state.data_componentDict).forEach(([_key, component]) => {
      const key = _key as keyof typeof this.state.data_componentDict;

      // if (!componentDict[key]) {
      //   this.state.data_componentDict[key] = undefined;
      // } else {
      //   Object.assign(component, {
      //     ...componentDict[key],
      //     material: component.material,
      //     materialSurface: component.materialSurface,
      //   });
      // }

      // 將每個component的值替換掉，而不改變參照
      Object.assign(component, {
        ...componentDict[key],
        material: component.material,
        materialSurface: component.materialSurface,
      });
    });

    // Object.values(this.classComponentDict).forEach((classComponent) => {
    //   const data_component = componentDict[classComponent.key];

    //   if (data_component) {
    //     classComponent.replaceState();
    //   }
    // });

    Object.values(this.classComponentDict).forEach((classComponent) => {
      classComponent.init();
    });

    this.render();
  } // handleAvailableComponentsUpdated

  replaceToEmptyComponent({ returnOnly }: { returnOnly?: boolean } = {}) {
    const emptyComponentDict = createEmptyComponentStateDict();

    if (returnOnly) {
      return emptyComponentDict;
    }

    const { backBone, middlePillar, ...rest } = emptyComponentDict;

    this.state.data_componentDict = rest;
    this.state.componentKeyArr = Object.keys(rest) as TdoorComponentType[];

    this.render();

    return emptyComponentDict;
  }

  resetComponentKeyArr() {
    this.state.componentKeyArr = Object.keys(this.state.data_componentDict) as TdoorComponentType[];
    this.render();
  }

  get isComponentValid() {
    return true;

    // 目前isComponentValid只會為true，未來要再製作
    // 除了檢查材料配件是否齊全，還要檢查RAW跟BOM有沒有資料

    // 參考
    // get isComponentOk() {
    //   const componentBodyArr = this.comBodyArr;
    //   let isComponentBreak = false;

    //   if (this.isSpecialProd) {
    //     isComponentBreak = false;
    //     // WARNING W2判斷
    //   } else if (this.isW2 && componentBodyArr.length !== 5) {
    //     isComponentBreak = true;
    //   } else if (!this.isW2 && componentBodyArr.length !== 8) {
    //     isComponentBreak = true;
    //   }

    //   componentBodyArr.forEach((com) => {
    //     if (!com.componentId) {
    //       isComponentBreak = true;
    //     }
    //   });

    //   // if (isComponentBreak) {
    //   //   myAlert.err({ title: '主產品無材料配件或無componentId', content: `項目:${this.itemName}` });
    //   // }

    //   return !isComponentBreak;
    // }
  }

  // endregion COMPONENT

  // ==========================================================================
  // region API

  protected async reqChain_01() {
    try {
      const generalSpec = await reqGetProdCalcGeneralSpec(this);
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
      const availableComponents = await reqGetAvailableComponents(this);

      // 更新可用材料配件
      // this.state.availableComponents = availableComponents;
      // if (this.state.availableComponents) {
      //   Object.assign(this.state.availableComponents, availableComponents);
      // } else {
      //   this.state.availableComponents = availableComponents;
      // }
      this.state.availableComponents = availableComponents;

      // 更新材料配件
      this.afterAvailableComponentsUpdated_sideEffect(availableComponents);

      const bom = await reqGetBom(this);
      this.state.generateDoorProductBom = bom;

      Object.values(this.classComponentDict).forEach((classComponent) => classComponent.onBomUpdate());

      this.render();
    } catch (error) {
      // alert(error);
      // throw error;
      // TODO: 重構報價單 處理reqChain_01的catch

      myAlert.err({ title: '取得資料失敗' });
      console.log(error);
      this.clearGeneralSpec();
      this.clearComponent();

      return Promise.reject(null);
    }
  }

  // ---------------------------------------------------------------------------
  addAfterChange(funcName: 'reqChain_01') {
    if (!this.state.afterChangeQueue) {
      this.state.afterChangeQueue = [];
    }

    this.state.afterChangeQueue.push(funcName);
    this.render();
  }
  clearAfterChange() {
    this.state.afterChangeQueue = undefined;
    this.render();
  }

  async runAfterChange() {
    let afterChangeQueue = this.state.afterChangeQueue;

    if (!afterChangeQueue) {
      return;
    }

    afterChangeQueue = _.uniq(afterChangeQueue);

    this.state.isFetching = true;
    this.render();

    let thisFuncName = '';

    try {
      for (const _funcName of afterChangeQueue) {
        thisFuncName = _funcName;
        const funcName = _funcName as Parameters<typeof this.addAfterChange>[0];

        await this[funcName]();
      }
    } catch (error) {
      console.log(`${thisFuncName} failed`, error);
    }

    this.state.afterChangeQueue = undefined;
    this.state.isFetching = false;
    this.render();
  }
  // endregion API

  // ==========================================================================
  // region interface

  get isValid_doorModel(): boolean {
    const isValid = (this.state.doorModel?.name || 'undefined') in doorModelNameLookup;

    return isValid;
  }

  get isInited() {
    let isInit = true;

    if (this.state.generalSpecs === undefined) {
      isInit = false;
    } else if (this.state.availableComponents === undefined) {
      isInit = false;
    }

    return isInit;
  }

  get isFetching() {
    return !!this.state.isFetching;
  }

  // ----------------------------------------------------------------

  get options_material() {
    const doorModel = this.state.doorModel;

    if (!doorModel) {
      return undefined;
    }

    // 選項來源為doorModel.slatMaterials
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
  }

  get options_surface() {
    if (
      //
      !this.data.materialName ||
      !this.isValid_doorModel ||
      this.data.materialName === '鋁合金'
    ) {
      return undefined;
    }

    // handle__options_surface

    // if (!this._options_surface) {
    //   this._options_surface = createOptions_surface(this);
    // }

    const options = handle__options_surface(this.doorModelName)(this);

    return options;
  }

  // ----------------------------------------------------------------

  get key() {
    return this.state.key;
  }

  get id() {
    return this.data.id;
  }

  get itemName() {
    return this.data.itemName;
  }
  set itemName(value) {
    this.data.itemName = value;
    this.render();
  }

  get discount() {
    return this.data.discount;
  }
  set discount(value) {
    // if (checkIsFloat3(value)) {
    //   return;
    // }

    this.data.discount = value;
    this.render();
  }

  get quoteType() {
    return this.data.quoteType;
  }
  set quoteType(value) {
    if (this.data.quoteType === value) {
      return;
    }

    const newState = createEmptyStateProd(this.state.key);

    newState.data_prod.itemName = this.itemName;
    newState.data_prod.discount = this.discount;
    Object.clearAndAssign(this.state, newState);

    // this.data = this.state.data_prod;
    this.data.quoteType = value;

    this.render();
  }

  get doorModelName() {
    return this.data.doorModelName;
  }
  set doorModelName(value) {
    this.data.doorModelName = value;
    this.render();
  }

  get fullWidth() {
    return this.data.fullWidth;
  }
  set fullWidth(value) {
    this.data.fullWidth = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.data.area = this.calcArea(this);
    this.data.horsepower = ''; // 相關 reqGetProdCalcGeneralSpec

    this.addAfterChange('reqChain_01');
    this.render();
  }
  get fullWidth_mm() {
    return new Decimal(this.data.fullWidth || 0).mul(1000).toNumber();
  }

  // get WG() {
  //   return this.data.WG;
  // }
  // set WG(value) {
  //   this.setData('WG', value);
  // }
  // get WG_mm() {
  //   return new Decimal(this.data.WG).mul(1000).toNumber();
  // }

  // W要額外處理
  get W() {
    const WG_mm = new Decimal(this.data.WG || 0).mul(1000).toNumber();
    const G = this.data.guideRailG || 0;

    const W_num = calcW({
      WG: WG_mm,
      G,
    });

    return new Decimal(W_num).div(1000).toString() as `${number}` | '';
  }
  set W(v) {
    const v_num = new Decimal(v || 0).toDecimalPlaces(3, Decimal.ROUND_DOWN).toNumber();

    const WG_mm = calcProductWG_withWAndG({
      W: v_num,
      G: this.data.guideRailG || 0,
    });

    this.data.WG = new Decimal(WG_mm).div(1000).toString() as `${number}` | '';
  }

  get height() {
    return this.data.height;
  }
  set height(value) {
    this.data.height = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.data.horsepower = ''; // 相關 reqGetProdCalcGeneralSpec

    this.addAfterChange('reqChain_01');
    this.render();
  }
  get height_mm() {
    return new Decimal(this.data.height || 0).mul(1000).toNumber();
  }

  get boxB() {
    return this.data.boxB;
  }
  set boxB(value) {
    // if (checkIsFloat3(value)) {
    //   return;
    // }

    this.data.boxB = value;
    this.render();
  }
  get boxB_mm() {
    return new Decimal(this.data.boxB || 0).mul(1000).toNumber();
  }

  get boxD() {
    return this.data.boxD;
  }
  set boxD(value) {
    this.data.boxD = value;
    this.render();
  }
  get boxD_mm() {
    return new Decimal(this.data.boxD).mul(1000).toNumber();
  }

  get area() {
    return this.data.area ?? '';
  }

  get volume() {
    return this.data.volume ?? '';
  }

  get thickness() {
    return `999` as `${number}`;
  }

  get materialName() {
    return this.data.materialName;
  }
  set materialName(value) {
    if (this.data.materialName === value) {
      return;
    }

    this.data.materialName = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    // if (this.data.materialName === '鋁合金') {
    //   this.materialSurface = null;
    //   this.render();

    //   return;
    // }

    this.renewSurface();

    Object.values(this.classComponentDict).forEach((classComponent) => {
      classComponent.onProdChangeMaterial(this.data.materialName);
    });

    this.render();
  }

  get materialSurface() {
    return this.data.materialSurface;
  }
  set materialSurface(value) {
    if (this.data.materialSurface === value) {
      return;
    }

    this.data.materialSurface = value;

    Object.values(this.classComponentDict).forEach((classComponent) =>
      // slat  headBox  guideRail // 只有這三個有作用
      classComponent.onProdChangeSurface(this.data.materialSurface)
    );

    this.render();
  }

  get horsepower() {
    return this.data.horsepower;
  }
  set horsepower(value) {
    if (this.data.horsepower === value) {
      return;
    }

    this.data.horsepower = value;
    this.render();
  }

  get motorVendor() {
    return this.data.motorVendor;
  }
  set motorVendor(value) {
    this.data.motorVendor = value;
    this.render();
  }

  get motorVoltage() {
    return this.data.motorVoltage;
  }
  set motorVoltage(value) {
    this.data.motorVoltage = value;
    this.render();
  }

  get motorPhase() {
    return this.data.motorPhase;
  }
  set motorPhase(value) {
    this.data.motorPhase = value;
    this.render();
  }

  get guideRail() {
    return this.data.guideRail;
  }
  set guideRail(value) {
    this.data.guideRail = value;
    const guideRail = this.data.guideRail;

    const guideRails = this.state.doorModel?.guideRails ?? [];

    const guideRailInfo = guideRails.find((item) => item.imgSrc === guideRail);

    const data = this.data;

    if (guideRailInfo) {
      data.guideRailThickness = guideRailInfo.thickness.replaceAll('t', '') as `${number}`;
      data.hasSilencingStrip = guideRailInfo.hasSilencingStrip;
      data.isAntiTyphoon = guideRailInfo.withHook;
      data.guideRailsOpening = guideRailInfo.opening;
      data.guideRailG = guideRailInfo.width;
    } else {
      data.guideRailThickness = '';
      data.hasSilencingStrip = null;
      data.isAntiTyphoon = null;
      data.guideRailsOpening = null;
      data.guideRailG = null;
    }

    this.render();
  }

  get guideRailImg() {
    if (!this.data.guideRail) {
      return undefined;
    }

    return createAssetUrl(this.data.guideRail);
  }

  get guideRailThickness() {
    return this.data.guideRailThickness;
  }
  set guideRailThickness(value) {
    // 門軌厚度的選項是從availableComponents中取得的
    // 門軌厚度的選項是從availableComponents中取得的
    // 門軌厚度的選項是從availableComponents中取得的
    // 門軌厚度的選項是從availableComponents中取得的
    // 門軌厚度的選項是從availableComponents中取得的
    // 門軌厚度的選項是從availableComponents中取得的

    this.data.guideRailThickness = value;
    this.render();
  }

  get hasSilencingStrip() {
    return this.data.hasSilencingStrip;
  }
  // set hasSilencingStrip(value) {
  //   this.setData_simple('hasSilencingStrip', value);
  // }

  get isULGuideRail() {
    return this.data.isULGuideRail;
  }
  set isULGuideRail(value) {
    this.data.isULGuideRail = value;
    this.render();
  }

  get isIntegratedHeadBox() {
    return this.data.isIntegratedHeadBox;
  }
  set isIntegratedHeadBox(value) {
    this.data.isIntegratedHeadBox = value;
    this.render();
  }

  get headBoxThickness() {
    return this.data.headBoxThickness;
  }
  set headBoxThickness(value) {
    this.data.headBoxThickness = value;
    this.render();
  }

  get isAntiTyphoon() {
    return this.data.isAntiTyphoon;
  }
  // set isAntiTyphoon(value) {
  //   this.setData_simple('isAntiTyphoon', value);
  // }

  get bounceDoorWidth() {
    return this.data.bounceDoorWidth;
  }
  set bounceDoorWidth(value) {
    // if (checkIsFloat3(value)) {
    //   return;
    // }

    this.data.bounceDoorWidth = value;
    this.data.bounceDoor = !!value;
    this.render();
  }

  get closingType() {
    return this.data.closingType;
  }
  set closingType(value) {
    // this.setData_simple('closingType', value);
    this.data.closingType = value;
    this.render();
  }

  get notes() {
    return this.data.notes;
  }
  set notes(value) {
    this.data.notes = value;
    this.render();
  }

  get bottomBarAngleIron() {
    return this.data.bottomBarAngleIron;
  }
  set bottomBarAngleIron(value) {
    this.data.bottomBarAngleIron = value;
    this.render();
  }

  get bottomBarPlate() {
    return this.data.bottomBarPlate;
  }
  set bottomBarPlate(value) {
    this.data.bottomBarPlate = value;
    this.render();
  }

  get quantity() {
    return this.data.quantity;
  }
  set quantity(value) {
    this.data.quantity = value;
    this.render();
  }

  get unitPrice() {
    return this.data.unitPrice;
  }
  set unitPrice(value) {
    this.data.unitPrice = value;
    this.render();
  }

  get totalPrice() {
    return this.data.totalPrice;
  }
  set totalPrice(value) {
    this.data.totalPrice = value;
    this.render();
  }

  get price() {
    return this.data.price;
  }
  set price(value) {
    this.data.price = value;
    this.render();
  }

  get dualPrice() {
    return this.data.dualPrice;
  }
  set dualPrice(value) {
    this.data.dualPrice = value;
    this.render();
  }
}
// MARK: END

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

export { ClassProd };

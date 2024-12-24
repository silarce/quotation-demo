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

import { checkIsSST, checkIsGalvanized, fixedToFloat3 } from '../library';

import { createEmptyStateProd } from '../../emptyProdState';

import { Toption } from 'js/utils/options/options';

import { createEmptyComponentStateDict } from '../../emptyComponentState';

import { handle__options_surface } from './handleProd/handle__options_surface';

import {
  TerrRes,
  reqGetProdCalcGeneralSpec,
  reqGetAvailableComponents,
  reqGetBom,
  reqGetBoxD,
  reqGetSlatCount,
} from './apiClient';

import { Class_accessory } from '../accessory/classAccessory';

import type { Tdata_componentDict } from '../../type';

import { lookup_hpToGapAGapC, lookup_distributionBoxPrice } from 'config/product/lookup';

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

// MARK:ClassProd
class ClassProd {
  readonly state: TstateProd;
  protected readonly setState: React.Dispatch<React.SetStateAction<TstateProd>>;
  protected render() {
    // this.setState({ ...this.state });
    this.state.renderCount = this.state.renderCount ? this.state.renderCount + 1 : 1;
    this.setState(this.state);
  }
  // data: TstateProd['data_prod'];
  get data() {
    return this.state.data_prod;
  }

  readonly nodeConfig: TnodeConfig;

  readonly classComponentDict: TclassComponentDict = {};
  registerClassComponentDict(classComponentDict: TclassComponentDict) {
    Object.clearAndAssign(this.classComponentDict, classComponentDict);
  }
  protected clearClassComponentDict() {
    Object.clearAndAssign(this.classComponentDict, {});
  }

  readonly classAcceoooryDict: Record<string, Class_accessory> = {};
  registerClassAccessoryDict(classAccessoryDict: Record<string, Class_accessory>) {
    Object.clearAndAssign(this.classAcceoooryDict, classAccessoryDict);
  }
  protected clearClassAccessoryDict() {
    Object.clearAndAssign(this.classAcceoooryDict, {});
  }

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

  async init() {
    this.state.isFetching = true;
    this.render();

    if (this.isValid_doorModel) {
      try {
        const generalSpec = await reqGetProdCalcGeneralSpec({ classProd: this });
        this.state.generalSpecs = generalSpec;

        const availableComponents = await reqGetAvailableComponents(this);
        this.state.availableComponents = availableComponents;
      } catch (error) {
        const err = error as TerrRes;

        if ('title' in err) {
          myAlert.err({ title: err.title, content: err.content });
        } else {
          throw err;
        }

        this.state.generalSpecs = null;
        this.clearGeneralSpec();
        this.state.availableComponents = null;
        this.replaceToEmptyComponent();
      }
    }

    this.state.isFetching = false;
    this.render();
  }

  clearState({
    keepItemName,
    keepDiscount,
    keepQuoteType,
  }: // keepIsAntiTyphoon,
  // keepBounceDoorWidth,
  // keepClosingType,
  // keepNotes,
  // keepIsIntegratedHeadBox,
  // keepIsULGuideRail,
  // keepHasSilencingStrip,

  // keepFullWidth,
  // keepHeight,
  // keepWG,

  // keepMaterialName,
  // keepMaterialSurface,

  // keepDoorModel,
  {
    keepItemName?: boolean;
    keepDiscount?: boolean;
    keepQuoteType?: boolean;

    // keepIsAntiTyphoon?: boolean;
    // keepBounceDoorWidth?: boolean;
    // keepClosingType?: boolean;
    // keepNotes?: boolean;
    // keepIsIntegratedHeadBox?: boolean;
    // keepIsULGuideRail?: boolean;
    // keepHasSilencingStrip?: boolean;

    // keepFullWidth?: boolean;
    // keepHeight?: boolean;
    // keepWG?: boolean;

    // keepMaterialName?: boolean;
    // keepMaterialSurface?: boolean;

    // keepDoorModel?: boolean;
  } = {}) {
    const newState = createEmptyStateProd(this.state.key);

    const data_prod = this.state.data_prod;

    keepItemName && (newState.data_prod.itemName = data_prod.itemName);
    keepDiscount && (newState.data_prod.discount = data_prod.discount);
    keepQuoteType && (newState.data_prod.quoteType = data_prod.quoteType);

    // keepIsAntiTyphoon && (newState.data_prod.isAntiTyphoon = this.data.isAntiTyphoon);
    // keepBounceDoorWidth && (newState.data_prod.bounceDoorWidth = this.data.bounceDoorWidth);
    // keepClosingType && (newState.data_prod.closingType = this.data.closingType);
    // keepNotes && (newState.data_prod.notes = this.data.notes);
    // keepIsIntegratedHeadBox && (newState.data_prod.isIntegratedHeadBox = this.data.isIntegratedHeadBox);
    // keepIsULGuideRail && (newState.data_prod.isULGuideRail = this.data.isULGuideRail);
    // keepHasSilencingStrip && (newState.data_prod.hasSilencingStrip = this.data.hasSilencingStrip);

    // keepFullWidth && (newState.data_prod.fullWidth = this.data.fullWidth);
    // keepHeight && (newState.data_prod.height = this.data.height);
    // keepWG && (newState.data_prod.WG = this.data.WG);

    // keepMaterialName && (newState.data_prod.materialName = this.data.materialName);
    // keepMaterialSurface && (newState.data_prod.materialSurface = this.data.materialSurface);

    // if (keepDoorModel) {
    //   newState.data_prod.doorModelName = this.data.doorModelName;
    //   newState.doorModel = this.state.doorModel;
    // }

    Object.clearAndAssign(this.state, newState);
  }

  clearState_some() {
    // const newState = createEmptyStateProd(this.state.key);

    const data_prod = this.state.data_prod;

    data_prod.boxB = '';
    data_prod.boxD = '';
    data_prod.area = null;
    data_prod.volume = null;
    data_prod.horsepower = '';
    data_prod.motorVendor = null;
    data_prod.motorVoltage = null;
    data_prod.motorPhase = null;
    data_prod.slatCount = null;

    this.clearGeneralSpec();
    this.replaceToEmptyComponent();

    this.render();

    // const data_prod = this.state.data_prod;

    // newState.afterChangeQueue = this.state.afterChangeQueue;
    // newState.isFetching = this.state.isFetching;

    // newState.doorModel = this.state.doorModel;
    // newState.data_prod.doorModelName = data_prod.doorModelName;

    // newState.data_componentDict = this.state.data_componentDict;
    // this.replaceToEmptyComponent();
    // newState.componentKeyArr = this.state.componentKeyArr;

    // newState.data_accessoryDict = this.state.data_accessoryDict;
    // newState.accessoryKeyArr = this.state.accessoryKeyArr;

    // newState.data_prod.itemName = data_prod.itemName;
    // newState.data_prod.discount = data_prod.discount;
    // newState.data_prod.quoteType = data_prod.quoteType;

    // newState.data_prod.fullWidth = data_prod.fullWidth;
    // newState.data_prod.height = data_prod.height;
    // newState.data_prod.WG = data_prod.WG;

    // newState.data_prod.materialName = data_prod.materialName;
    // newState.data_prod.materialSurface = data_prod.materialSurface;
    // newState.data_prod.guideRail = data_prod.guideRail;

    // newState.data_prod.isAntiTyphoon = data_prod.isAntiTyphoon;
    // newState.data_prod.bounceDoorWidth = data_prod.bounceDoorWidth;
    // newState.data_prod.closingType = data_prod.closingType;
    // newState.data_prod.notes = data_prod.notes;
    // newState.data_prod.isIntegratedHeadBox = data_prod.isIntegratedHeadBox;
    // newState.data_prod.isULGuideRail = data_prod.isULGuideRail;
    // newState.data_prod.hasSilencingStrip = data_prod.hasSilencingStrip;

    // Object.clearAndAssign(this.state, newState);
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

  // 更新電相
  protected renewPhase() {
    const hp = this.data.horsepower as keyof typeof lookup_hpToGapAGapC;
    const hpValue = lookup_hpToGapAGapC[hp].HPValue;

    const phase = hpValue >= 1.5 ? 3 : 1;

    this.data.motorPhase = phase;
  }

  // 更新配電箱牌價
  protected renewDistributionBoxPrice() {
    const hp = this.data.horsepower as keyof typeof lookup_hpToGapAGapC;
    const hpValue = lookup_hpToGapAGapC[hp].distributionBoxPrice;

    if (hpValue !== undefined) {
      this.data.distributionBoxPrice = `${hpValue}`;
    } else {
      myAlert.warning({ title: `${hp} 配電箱牌價未知` });
      this.data.distributionBoxPrice = '';
    }
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

  // MARK: changeDoorModel
  changeDoorModel({ doorModel }: { doorModel: TdoorModelInfoDto | null }) {
    this.clearState({
      keepItemName: true,
      keepDiscount: true,
      keepQuoteType: true,
    });

    this.state.doorModel = doorModel;
    this.data.doorModelName = doorModel?.name ?? '';

    if (!this.state.doorModel) {
      return;
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

    this.replaceToEmptyComponent();

    this.render();
  }
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
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
  }
  // endregion SPEC
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // region COMPONENT

  // protected clearComponent() {
  //   this.state.availableComponents = null;
  //   this.state.data_componentDict = {};
  //   this.state.componentKeyArr = [];
  // }

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

    // this.render();
  } // handleAvailableComponentsUpdated

  protected replaceToEmptyComponent() {
    const emptyComponentDict = createEmptyComponentStateDict();

    const {
      //
      slat,
      bottomBar,
      guideRail,
      sidePlate,
      roller,
      motor,
      motorAccessories,
      headBox,
      middlePillar,
      backBone,
    } = emptyComponentDict;

    const componentDict: Tdata_componentDict = {
      slat,
      bottomBar,
      guideRail,
      sidePlate,
      roller,
      motor,
      motorAccessories,
      headBox,
    };
    const componentDict_W2: Tdata_componentDict = {
      slat,
      bottomBar,
      guideRail,
      backBone,
      middlePillar,
    };

    let newComponentDict = componentDict;

    if (this.data.doorModelName === 'W2') {
      newComponentDict = componentDict_W2;
    }

    Object.clearAndAssign(this.state.data_componentDict, newComponentDict);

    const newComponentKeyArr = Object.keys(this.state.data_componentDict) as TdoorComponentType[];
    this.state.componentKeyArr.length = 0;
    this.state.componentKeyArr.push(...newComponentKeyArr);

    // this.render();
  }

  resetComponentKeyArr() {
    this.state.componentKeyArr = Object.keys(this.state.data_componentDict) as TdoorComponentType[];
    // this.render();
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
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // region API

  checkShouldCallReqChain01() {
    let pass = true;

    !this.isValid_doorModel && (pass = false);
    this.fullWidth === '' && (pass = false);
    this.height === '' && (pass = false);

    return pass;
  }

  // MARK:reqChain_01
  protected async reqChain_01({ withHp }: { withHp?: boolean } = {}) {
    try {
      await this.updateProductSpec({ withHp });
      await this.updateAvailableComponents();
      await this.updateBom();
    } catch (error) {
      const err = error as { title?: string; content?: string };

      if (err && 'title' in err) {
        myAlert.err({ title: err?.title, content: err?.content });

        return Promise.reject(null);
      } else {
        myAlert.err({ title: '預期外的錯誤' });

        throw error;
      }
    }
  }

  // MARK:reqChain_01_withHp
  protected async reqChain_01_withHp() {
    return await this.reqChain_01({ withHp: true });
  }

  // MARK:reqChain_02
  protected async reqChain_02() {
    try {
      await this.updateAvailableComponents();
      await this.updateBom();
    } catch (error) {
      const err = error as { title?: string; content?: string };

      if (err && 'title' in err) {
        myAlert.err({ title: err?.title, content: err?.content });

        return Promise.reject(null);
      } else {
        myAlert.err({ title: '預期外的錯誤' });

        throw error;
      }
    }
  }

  // MARK:reqChain_03
  protected async reqChain_03() {
    try {
      await this.updateBom();
    } catch (error) {
      const err = error as { title?: string; content?: string };

      if (err && 'title' in err) {
        myAlert.err({ title: err?.title, content: err?.content });

        return Promise.reject(null);
      } else {
        myAlert.err({ title: '預期外的錯誤' });

        throw error;
      }
    }
  }

  // MARK:updateProductSpec
  async updateProductSpec({ withHp }: { withHp?: boolean } = {}) {
    const generalSpec = await reqGetProdCalcGeneralSpec({ classProd: this, withHp }).catch((err) => {
      this.clearGeneralSpec();

      throw err;
    });
    // 取得generalSpec
    this.state.generalSpecs = generalSpec;

    // 送入generalSpec更新state
    this.afterUpdateGeneralSpec_sideEffect(this.state.generalSpecs);
    this.renewPhase();
    this.renewDistributionBoxPrice();

    // 取得boxD並更新state
    const boxD = await reqGetBoxD(this);
    this.data.boxD = new Decimal(boxD || 0).div(1000).toString() as `${number}`;

    // 取得slatCount並更新state
    const slatCount = await reqGetSlatCount(this);
    this.data.slatCount = slatCount === null ? null : `${slatCount}`;
  }

  // MARK:updateAvailableComponents
  async updateAvailableComponents() {
    // 取得可用材料配件
    const availableComponents = await reqGetAvailableComponents(this).catch((err) => {
      this.replaceToEmptyComponent();
      this.state.availableComponents = null;

      throw err;
    });

    this.state.availableComponents = availableComponents;

    this.data.motorVoltage = Number(this.options_motorVoltage?.[0].value) || null;

    // 更新材料配件
    this.afterAvailableComponentsUpdated_sideEffect(availableComponents);
    const invalidComponentArr = checkComponentRawData(this.state.data_componentDict);

    if (invalidComponentArr) {
      const message = invalidComponentArr.join(', ');
      this.replaceToEmptyComponent();
      this.state.availableComponents = null;

      throw { title: '取得資料失敗，以下材料配件不匹配', content: message };
    }
  }

  // MARK:updateBom
  async updateBom() {
    const bom = await reqGetBom(this);
    this.state.generateDoorProductBom = bom;

    Object.values(this.classComponentDict).forEach((classComponent) => classComponent.onBomUpdate());
  }

  // ---------------------------------------------------------------------------

  // 不可以直接把方法放進陣列中等待執行
  // 加入方法後類跟狀態都會更新，實際要呼叫時，方法範疇裡的類跟狀態都是舊的
  addAfterChange(
    funcName: 'reqChain_01' | 'reqChain_01_withHp' | 'reqChain_02' | 'reqChain_03',
    { render = true }: { render?: boolean } = {}
  ) {
    if (!this.state.afterChangeQueue) {
      this.state.afterChangeQueue = [];
    }

    this.state.afterChangeQueue.push(funcName);
    render && this.render();
  }
  clearAfterChange() {
    this.state.afterChangeQueue = undefined;
    this.render();
  }

  async runAfterChange() {
    const afterChangeQueue = this.state.afterChangeQueue;

    if (!afterChangeQueue || afterChangeQueue.length === 0) {
      return;
    }

    const qniqQuestion = _.uniq(afterChangeQueue);

    if (qniqQuestion.length !== afterChangeQueue.length) {
      myAlert.warning({ title: '開發者提示', content: 'afterChangeQueue有重複的方法，預期不應重複' });
      console.log('afterChangeQueue有重複的方法', afterChangeQueue);
    }

    this.state.isFetching = true;

    this.render();

    let thisFuncName = '';

    for (const _funcName of afterChangeQueue) {
      thisFuncName = _funcName;
      const funcName = _funcName as Parameters<ClassProd['addAfterChange']>[0];

      try {
        await this[funcName]();
      } catch (error) {
        console.log(`${thisFuncName} failed`, error);
        break;
      }
    }

    this.state.afterChangeQueue = undefined;
    this.state.isFetching = false;

    this.render();
  }
  // endregion API

  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // region INTERFACE

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

  // region options

  // 未來若要電相或馬達廠商的選項，從availableComponents過濾出來

  get options_bottomBarAngleIron() {
    const doorModelName = this.data.doorModelName as keyof typeof lookup_options_bottomBarAngleIronAndPlate;

    return lookup_options_bottomBarAngleIronAndPlate[doorModelName]?.angleIron();
  }
  get options_bottomBarPlate() {
    const doorModelName = this.data.doorModelName as keyof typeof lookup_options_bottomBarAngleIronAndPlate;

    return lookup_options_bottomBarAngleIronAndPlate[doorModelName]?.plate();
  }

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

  get options_horsepower() {
    if (this.isSpecial) {
      return optionsCreator_horsePower();
    }

    if (this.doorModelName === 'W2') {
      return undefined;
    }

    const motorArr = this.state.availableComponents?.motors;

    if (!motorArr) {
      return undefined;
    }

    let options: Toption[] = motorArr.map((motor) => {
      let { horsePower } = motor;

      if (horsePower === '1.5HP') {
        horsePower = '1 1/2HP';
      }

      return {
        value: horsePower,
        label: horsePower,
      };
    });

    options = _.uniqBy(options, (option) => option.value);

    options = _.sortBy(options, (option) => {
      const hp = option.value as keyof typeof lookup_hpToGapAGapC;
      const hpValue = lookup_hpToGapAGapC[hp].HPValue;

      return hpValue;
    });

    return options;
  }

  // 這個基本上只有在更新材料配件時會用到
  get options_motorVoltage() {
    const motorArr = this.state.availableComponents?.motors;

    if (!motorArr) {
      return undefined;
    }

    let options: Toption[] = motorArr.map((motor) => {
      const { voltage } = motor;

      return {
        value: String(voltage ?? ''),
        label: voltage === 220 ? '220V' : voltage === 380 ? '380V' : `${voltage ?? ''}`,
      };
    });

    options = _.uniqBy(options, (option) => option.value);

    return options;
  }

  get options_headBoxThickness() {
    const headBoxes = this.state.availableComponents?.headBoxes;

    if (!headBoxes) {
      return undefined;
    }

    let options: Toption[] = headBoxes.map((headBox) => {
      const { thickness } = headBox;

      return {
        value: thickness,
        label: `${thickness} t`,
      };
    });

    options = _.uniqBy(options, (option) => option.value);

    return options;
  }

  get options_guideRailThickness() {
    const guideRails = this.state.availableComponents?.guideRails;

    if (!guideRails) {
      return undefined;
    }

    let options: Toption[] = guideRails.map((guideRail) => {
      const { thickness } = guideRail;

      return {
        value: thickness ?? '',
        label: `${thickness} t`,
      };
    });

    options = _.uniqBy(options, (option) => option.value);

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

    this.clearState({
      keepItemName: true,
      keepDiscount: true,
    });

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

    this.clearState_some();

    this.data.area = this.calcArea(this);

    this.checkShouldCallReqChain01() && this.addAfterChange('reqChain_01');
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

    const W_mm = calcW({
      WG: WG_mm,
      G,
    });

    return new Decimal(W_mm).div(1000).toString() as `${number}` | '';
  }
  set W(v) {
    const v_num = fixedToFloat3(v || 0);
    const v_mm = new Decimal(v_num).mul(1000).toNumber();

    const WG_mm = calcProductWG_withWAndG({
      W: v_mm,
      G: this.data.guideRailG || 0,
    });

    this.data.WG = new Decimal(WG_mm).div(1000).toString() as `${number}`;

    if (this.isSpecial) {
      this.render();

      return;
    }

    const fullWidth = calcProductFullWidth({
      WG: new Decimal(this.data.WG).mul(1000).toNumber(),
      gapA: Number(this.data.gapA ?? 0),
      gapC: Number(this.data.gapC ?? 0),
    });

    this.data.fullWidth = new Decimal(fullWidth).div(1000).toString() as `${number}`;

    this.clearState_some();
    this.checkShouldCallReqChain01() && this.addAfterChange('reqChain_01_withHp');

    this.render();
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

    this.clearState_some();

    this.checkShouldCallReqChain01() && this.addAfterChange('reqChain_01');
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
    return this.data.thickness;
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

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.renewPhase();
    this.renewDistributionBoxPrice();

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

    if (this.isSpecial) {
      this.render();

      return;
    }

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

      if (!data.guideRailThickness) {
        data.guideRailThickness = (this.options_guideRailThickness?.[0]?.value ?? '') as `${number}` | '';
      }
    } else {
      data.guideRailThickness = '';
      data.hasSilencingStrip = null;
      data.isAntiTyphoon = null;
      data.guideRailsOpening = null;
      data.guideRailG = null;

      if (this.doorModelName !== 'W2') {
        myAlert.warning({ title: '沒有對應的門軌資料' });
      }
    }

    const WG_mm = calcProductWG({
      fullWidth: this.fullWidth_mm,
      gapA: data.gapA || 0,
      gapC: data.gapC || 0,
    });
    const WG = new Decimal(WG_mm).div(1000).toString() as `${number}`;
    data.WG = WG;

    // this.addAfterChange('reqChain_02', { render: false });
    // this.reqChain_02();
    // this.runAfterChange();

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
  // 消音條在編輯guideRail時一併設置
  // set hasSilencingStrip(value) {
  //   this.data.hasSilencingStrip = value;
  //   this.render();
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
  // 防颱在編輯guideRail時一併設置
  // set isAntiTyphoon(value) {
  //   this.data.isAntiTyphoon = value;
  //   this.render();
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

const checkComponentRawData = (componentDict: Tdata_componentDict) => {
  const arr: string[] = [];

  Object.entries(componentDict).forEach(([key, com]) => {
    if (!com.rawData) {
      arr.push(key);
    }
  });

  return arr.length === 0 ? null : arr;
};

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

export { ClassProd };

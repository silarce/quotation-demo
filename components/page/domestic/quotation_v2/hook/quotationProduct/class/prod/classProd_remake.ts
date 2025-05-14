import Decimal from 'decimal.js';
import _ from 'lodash';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// type
import { TstateProd } from '../../type';
import { TnodeConfig } from './config';
import {
  TdoorModelInfoDto,
  TdoorGeneralSpecsDto,
  TdoorComponentListDto,
  TdoorModel,
  TdoorComponentType,
  TdoorAccessoryDto,
} from 'js/api/dtoTypes';

import type { TclassComponentDict } from '../../useQuotationProduct';

import { createAssetUrl } from 'js/api/api_product';

// utils
import {
  calcProductArea,
  calcProductVolume,
  calcProductWG_withWAndG,
  calcProductFullWidth,
  calcW,
  calcProductWG,
} from 'js/utils/product/calc';

import { createComponentDict } from '../createComponentDict';

import {
  optionDict_surface,
  optionsCreator_surface,
  optionsCreator_surface_onlyPaint,
  optionsCreator_surface_sst,
  optionsCreator_surface_galvanizedSteelPlate,
  optionsCreator_horsePower,
  lookup_options_bottomBarAngleIronAndPlate,
} from 'js/utils/options/productOptions';

import { checkIsSST, checkIsGalvanized, fixedToFloat3 } from '../library';

import { createEmptyStateProd } from '../../emptyProdState';

import { Toption } from 'js/utils/options/options';

import { createEmptyComponentStateDict } from '../../emptyComponentState';

import {
  TerrRes,
  reqGetProdCalcGeneralSpec,
  reqGetAvailableComponents,
  reqGetBom,
  reqGetBoxD,
  reqGetSlatCount,
} from './apiClient';

import { Class_accessory } from '../accessory/classAccessory';

import type { Tdata_componentDict, Tdata_accessoryDict } from '../../type';

import { lookup_hpToGapAGapC, lookup_distributionBoxPrice } from 'config/product/lookup';

import { calcAllPrice, calcPriceDiscount_percent } from '../../method/calcProd';

import {
  calcProdTotalPrice,
  calcProdDistributionBoxAndInstallationFee,
  calcQtyModify,
  calcProdRemain,
} from '../../method/calcProd';

// ================================================================================

interface Tprops_constructor {
  stateProd: TstateProd;
  setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
  nodeConfig: TnodeConfig;
  quotationDiscount: number | `${number}`;
  onPordTotalChange: () => void;
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

// MARK:ClassProd
class ClassProd {
  readonly state: TstateProd;
  protected readonly setState: React.Dispatch<React.SetStateAction<TstateProd>>;
  protected render() {
    // this.setState({ ...this.state });
    this.state.renderCount = this.state.renderCount ? this.state.renderCount + 1 : 1;

    this.setState(this.state);
  }

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

  readonly quotationDiscount: number | `${number}`;

  get priceDiscount_percent() {
    const priceDiscount_percent = calcPriceDiscount_percent({
      prodDiscount: (this.data.discount || 0) as `${number}` | number,
      quotationDiscount: this.quotationDiscount,
    });

    return priceDiscount_percent;
  }

  onPordTotalChange;

  // ---------------------------------------------------------------------------
  // MARK:constructor
  constructor({ stateProd, setStateProd, nodeConfig, quotationDiscount, onPordTotalChange }: Tprops_constructor) {
    this.state = stateProd;
    this.quotationDiscount = quotationDiscount;

    // this.data = this.state.data_prod;
    this.setState = setStateProd;
    this.nodeConfig = customizeNodeConfig({ nodeConfig });

    this.onPordTotalChange = onPordTotalChange;
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
        this.replaceComponentToEmpty();
      }
    }

    this.state.isFetching = false;
    this.render();
  }

  clearState({
    keepItemName = true,
    keepDiscount = true,
    keepQuoteType = true,
    keepDistributionBoxQuantity = true,
    keepQuantity = true,
  }: {
    keepItemName?: boolean;
    keepDiscount?: boolean;
    keepQuoteType?: boolean;
    keepDistributionBoxQuantity?: boolean;
    keepQuantity?: boolean;
  } = {}) {
    const newState = createEmptyStateProd(this.state.key);

    const data_prod = this.state.data_prod;

    newState.renderCount = this.state.renderCount;

    keepItemName && (newState.data_prod.itemName = data_prod.itemName);
    keepDiscount && (newState.data_prod.discount = data_prod.discount);
    keepQuoteType && (newState.data_prod.quoteType = data_prod.quoteType);
    keepDistributionBoxQuantity && (newState.data_prod.distributionBoxQuantity = data_prod.distributionBoxQuantity);
    keepQuantity && (newState.data_prod.quantity = data_prod.quantity);

    // 這三個基本上不允許在這裡變動
    newState.rootProduct = this.state.rootProduct;
    newState.latestIterativeId = this.state.latestIterativeId;
    newState.action = this.state.action;

    Object.clearAndAssign(this.state, newState);
  }

  clearState_some() {
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
    this.replaceComponentToEmpty();

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

      if (this.doorModelName === 'SJ-303A' || this.doorModelName === 'SJ-303AS') {
        const isPaintSpecifiedColorExist = this.options_surface?.some(
          (item) => item.value === optionDict_surface.PaintSpecifiedColor.value
        );
        isPaintSpecifiedColorExist && (this.data.materialSurface = optionDict_surface.PaintSpecifiedColor.value);
      }
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

  afterEditGuideRailInfo() {
    const guideRail = this.data.guideRail;
    const guideRails = this.state.doorModel?.guideRails ?? [];
    const guideRailInfo = guideRails.find((item) => item.imgSrc === guideRail);

    if (guideRailInfo) {
      this.data.guideRailThickness = guideRailInfo.thickness.replaceAll('t', '') as `${number}`;
      this.data.hasSilencingStrip = guideRailInfo.hasSilencingStrip;
      this.data.isAntiTyphoon = guideRailInfo.withHook;
      this.data.guideRailsOpening = guideRailInfo.opening;
      this.data.guideRailG = guideRailInfo.width;
    } else {
      this.data.guideRailThickness = '';
      this.data.hasSilencingStrip = null;
      this.data.isAntiTyphoon = null;
      this.data.guideRailsOpening = null;
      this.data.guideRailG = null;

      if (this.doorModelName !== 'W2') {
        myAlert.warning({ title: '沒有對應的門軌資料' });
      }
    }

    const WG_mm = calcProductWG({
      fullWidth: this.fullWidth_mm,
      gapA: this.data.gapA || 0,
      gapC: this.data.gapC || 0,
    });
    const WG = new Decimal(WG_mm).div(1000).toString() as `${number}`;
    this.data.WG = WG;
  }

  // MARK:renewProdAllPrice
  renewProdAllPrice_updateQuotationTotalPrice() {
    this.renewProdAllPrice();
    // this.updateQuotationTotalPrice();
    this.onPordTotalChange();

    this.render();
  }
  // renewProdAllPrice_updateQuotationTotalPrice_noComAndAcce() {
  //   this.renewProdAllPrice_noComAndAcce();
  //   this.updateQuotationTotalPrice();

  //   this.render();
  // }

  renewProdAllPrice() {
    const { price, dualPrice, unitPrice, totalPrice } = calcProdTotalPrice({
      stateProd: this.state,
      quotationDiscount: this.quotationDiscount,
    });

    this.data.price = price;
    this.data.dualPrice = dualPrice;
    this.data.unitPrice = unitPrice;
    this.data.totalPrice = totalPrice;
  }

  renewDistributionBoxAllPrice() {
    const { dualPrice, unitPrice, totalPrice } = calcAllPrice({
      price: this.data.distributionBoxPrice || 0,
      quantity: this.data.distributionBoxQuantity || 0,
      priceDiscount_percent: this.priceDiscount_percent,
    });

    this.data.distributionBoxDualPrice = `${dualPrice}`;
    this.data.distributionBoxUnitPrice = `${unitPrice}`;
    this.data.distributionBoxTotalPrice = `${totalPrice}`;
  }
  renewDistributionBoxAllPrice_byHorsepower() {
    const distributionBoxPrice = lookup_distributionBoxPrice[this.data.horsepower] || '0';
    this.data.distributionBoxPrice = `${distributionBoxPrice}`;
    this.renewDistributionBoxAllPrice();
  }

  renewInstallationFee() {
    let installationFeeQuantity = this.data.area || '0';
    let installationFeePrice = 1800;

    if (this.doorModelName === 'SJ-303A' || this.doorModelName === 'SJ-303AS') {
      if (Number(installationFeeQuantity) <= 10) {
        installationFeePrice = 5400;
      } else {
        installationFeePrice = 3600;
      }
    } else if (this.doorModelName === 'W2') {
      installationFeePrice = 0;
      installationFeeQuantity = '0';
    }

    this.data.installationFeePrice = `${installationFeePrice}`;

    const { dualPrice, unitPrice, totalPrice } = calcAllPrice({
      price: installationFeePrice,
      quantity: Number(installationFeeQuantity),
      priceDiscount_percent: this.priceDiscount_percent,
    });

    this.data.installationFeeQuantity = `${installationFeeQuantity}`;
    this.data.installationFeeDualPrice = `${dualPrice}`;
    this.data.installationFeeUnitPrice = `${unitPrice}`;
    this.data.installationFeeTotalPrice = `${totalPrice}`;
  }

  // ---------------------------------------------------------------------------

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

    if (this.data.calcByLW === 'l') {
      const WG_mm = calcProductWG({
        fullWidth: this.fullWidth_mm,
        gapA: this.data.gapA,
        gapC: this.data.gapC,
      });

      const W_mm = calcW({
        WG: WG_mm,
        G: this.data.guideRailG || 0,
      });

      this.data.W = new Decimal(W_mm).div(1000).toString() as `${number}`;
      this.data.WG = new Decimal(WG_mm).div(1000).toString() as `${number}`;
    } else {
      const fuillWidth_mm = calcProductFullWidth({
        WG: new Decimal(this.data.WG).mul(1000).toNumber(),
        gapA: Number(this.data.gapA ?? 0),
        gapC: Number(this.data.gapC ?? 0),
      });

      const fuillWidth = new Decimal(fuillWidth_mm).div(1000).toString() as `${number}`;

      this.data.fullWidth = fuillWidth;
    }

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

    this.renewDistributionBoxAllPrice_byHorsepower();

    this.data.area = this.calcArea(this);
    this.data.volume = calcProductVolume(Number(this.data.area));
    this.renewInstallationFee();
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

    if (changedMotorVendor) {
      this.data.motorVendor = changedMotorVendor;
    }

    Object.entries(this.state.data_componentDict).forEach(([_key, component]) => {
      const key = _key as keyof typeof this.state.data_componentDict;

      if (
        component.rawData?.id &&
        componentDict?.[key]?.rawData?.id &&
        component.rawData.id === componentDict[key]?.rawData?.id
      ) {
        return;
      }

      // 將每個component的值替換掉，而不改變參照
      Object.assign(component, {
        ...componentDict[key],
        material: component.material,
        materialSurface: component.materialSurface,
      });
    });

    Object.values(this.classComponentDict).forEach((classComponent) => {
      classComponent.init();
    });
  } // handleAvailableComponentsUpdated

  protected replaceComponentToEmpty() {
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

  // params:  Tdata_componentDict
  replaceTargetComponentToEmpty(...params: (keyof Tdata_componentDict)[]) {
    const emptyComponentDict = createEmptyComponentStateDict();

    const targetEmptyComponentDict = _.pick(emptyComponentDict, params);

    Object.assign(this.state.data_componentDict, targetEmptyComponentDict);
  }

  // replaceTargetComponentToEmpty("slat","bottomBar","guideRail","sidePlate","roller","motor","motorAccessories","headBox","middlePillar","backBone")

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

  // region ACCESSORY

  addAccessory(rawAccessoryArr: TdoorAccessoryDto[]) {
    const dict: Tdata_accessoryDict = {};

    rawAccessoryArr.forEach((acce) => {
      const newAcce = Class_accessory.createAcce({ classProd: this, doorAccesssory: acce });
      // codeName實為acce.id
      dict[newAcce.codeName] = newAcce;
    });

    Object.assign(this.state.data_accessoryDict, dict);
    const keys = Object.keys(dict);

    this.state.accessoryKeyArr.push(...keys);
    this.renewProdAllPrice_updateQuotationTotalPrice();

    this.render();
  }

  removeAccessory(key: string) {
    delete this.state.data_accessoryDict[key];
    this.state.accessoryKeyArr = this.state.accessoryKeyArr.filter((item) => item !== key);

    this.renewProdAllPrice_updateQuotationTotalPrice();

    this.render();
  }

  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // ==========================================================================
  // region API

  get isAllowReqChain() {
    let pass = true;

    !this.isValid_doorModel && (pass = false);
    this.fullWidth === '' && (pass = false);
    this.height === '' && (pass = false);

    return pass;
  }

  // MARK:reqChain
  protected async reqChain_01({
    //
    withHp,
    updateIsFetching = true,
  }: {
    //
    withHp?: boolean;
    updateIsFetching?: boolean;
  } = {}) {
    this.state.isCustomPrice = false;

    if (updateIsFetching) {
      this.state.isFetching = true;
      this.render();
    }

    try {
      await this.updateProductSpec({ withHp });

      this.classComponentDict;
      Object.values(this.classComponentDict).forEach((classComponentDict) => {
        classComponentDict.onProdChangeMaterial(this.data.materialName);
        classComponentDict.onProdChangeSurface(this.data.materialSurface);
      });

      await this.updateAvailableComponents();
      await this.updateComponent();
      await this.updateBom();
    } catch (error) {
      dealErr(error);
    } finally {
      this.state.isFetching = true;
      this.renewProdAllPrice_updateQuotationTotalPrice();
      this.render();
    }
  }

  protected async reqChain_01_withHp({
    updateIsFetching,
  }: {
    updateIsFetching?: boolean;
  } = {}) {
    return await this.reqChain_01({ withHp: true, updateIsFetching });
  }

  protected async reqChain_02({
    updateIsFetching = true,
    onUpdateAvailableComponentsSuccess,
  }: {
    updateIsFetching?: boolean;
    onUpdateAvailableComponentsSuccess?: () => void;
  } = {}) {
    this.state.isCustomPrice = false;

    if (updateIsFetching) {
      this.state.isFetching = true;
      this.render();
    }

    try {
      await this.updateAvailableComponents().then(onUpdateAvailableComponentsSuccess);
      await this.updateComponent();
      await this.updateBom();
    } catch (error) {
      dealErr(error);
    } finally {
      this.state.isFetching = false;
      this.renewProdAllPrice_updateQuotationTotalPrice();
      this.render();
    }
  }

  protected async reqChain_03({ updateIsFetching = true }: { updateIsFetching?: boolean } = {}) {
    this.state.isCustomPrice = false;

    if (updateIsFetching) {
      this.state.isFetching = true;
      this.render();
    }

    try {
      await this.updateComponent();
      await this.updateBom();
    } catch (error) {
      dealErr(error);
    } finally {
      this.state.isFetching = false;
      this.renewProdAllPrice_updateQuotationTotalPrice();
      this.render();
    }
  }

  async reqChain_04({ updateIsFetching = true }: { updateIsFetching?: boolean } = {}) {
    this.state.isCustomPrice = false;

    if (updateIsFetching) {
      this.state.isFetching = true;
      this.render();
    }

    try {
      await this.updateBom();
    } catch (error) {
      dealErr(error);
    } finally {
      this.state.isFetching = false;
      this.renewProdAllPrice_updateQuotationTotalPrice();
      this.render();
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

    if (this.doorModelName === 'W2') {
      return;
    }

    this.renewPhase();
    this.renewDistributionBoxPrice();

    // 取得boxD並更新state
    await this.updateBoxD();

    // 取得slatCount並更新state
    const slatCount = await reqGetSlatCount(this);
    this.data.slatCount = slatCount === null ? null : `${slatCount}`;
  }

  // MARK:updateAvailableComponents
  async updateAvailableComponents() {
    // 取得可用材料配件
    const availableComponents = await reqGetAvailableComponents(this).catch((err) => {
      this.replaceComponentToEmpty();
      this.state.availableComponents = null;

      throw err;
    });

    this.state.availableComponents = availableComponents;

    if (!this.data.guideRailThickness) {
      this.data.guideRailThickness = (this.options_guideRailThickness?.[0].value || '') as `${number}` | '';
    }

    if (this.doorModelName === 'W2') {
      return;
    }

    this.data.motorVoltage = Number(this.options_motorVoltage?.[0].value) || null;
    const headBoxThickness = (this.options_headBoxThickness?.[0].value || '') as `${number}`;
    this.data.headBoxThickness = headBoxThickness || null;
  }

  async updateComponent() {
    if (!this.state.availableComponents) {
      throw { title: 'updateComponent失敗', content: '未取得availableComponents' };
    }

    // 更新材料配件
    this.afterAvailableComponentsUpdated_sideEffect(this.state.availableComponents);
    const invalidComponentArr = checkComponentRawData(this.state.data_componentDict);

    if (invalidComponentArr) {
      const content = invalidComponentArr.join(', ');

      this.replaceTargetComponentToEmpty(...invalidComponentArr);

      throw { title: '更新材料配件失敗，以下材料配件不匹配', content: content };
    }
  }

  // MARK:updateBom
  async updateBom() {
    const bom = await reqGetBom(this);
    this.state.generateDoorProductBom = bom;

    Object.values(this.classComponentDict).forEach((classComponent) => classComponent.onBomUpdate());
  }

  // MARK: updateBodD
  async updateBoxD() {
    const boxD = await reqGetBoxD(this);
    this.data.boxD = new Decimal(boxD || 0).div(1000).toString() as `${number}`;
    this.render();
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

    this.state.isFetching = true;

    this.render();

    let thisFuncName = '';

    for (const _funcName of qniqQuestion) {
      thisFuncName = _funcName;
      const funcName = _funcName as Parameters<ClassProd['addAfterChange']>[0];

      try {
        await this[funcName]({ updateIsFetching: false });
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

    if (!this.isValid_doorModel) {
      return true;
    }

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

    if (blackIron) {
      blackIron.label = '鐵材烤漆';
      options.splice(options.indexOf(blackIron), 1); // 某天說要把鐵材烤漆選項拿掉
    }

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

    // const options = handle__options_surface(this.doorModelName)(this);
    const doorModelName = this.data.doorModelName;

    if (doorModelName === 'SJ-305D') {
      return [optionDict_surface.HL];
    }

    const material = this.data.materialName;

    let options = optionsCreator_surface_onlyPaint();

    if (material === 'SST#304' || material === 'SST#316') {
      options = optionsCreator_surface_sst();
    } else if (material === '鍍鋅鋼板') {
      options = optionsCreator_surface_galvanizedSteelPlate();
    } else {
      const isSST = checkIsSST(material);
      const isGalvanized = checkIsGalvanized(material);

      if (isSST) {
        options = optionsCreator_surface();
      }

      if (
        //
        !isGalvanized &&
        this.doorModelName !== 'SJ-305D' &&
        this.doorModelName !== 'W2'
      ) {
        options = options.filter((item) => {
          return item.value !== '無烤漆';
        });
      }
    }

    // if (doorModelName === 'SJ-302' || doorModelName === 'SJ-303A' || doorModelName === 'SJ-303AS') {
    //   options = options.filter((item) => {
    //     return item.value !== '烤漆';
    //   });
    // }

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

  get options_guideRail() {
    let { guideRails = [] } = this.state.doorModel ?? {};
    guideRails = _.sortBy(guideRails, 'imgSrc');

    const options = guideRails.map(({ imgSrc }) => {
      return {
        value: imgSrc,
        label: imgSrc,
        icon: createAssetUrl('door-track', imgSrc),
      };
    });

    return options;
  }

  // ----------------------------------------------------------------

  // region GET SET EDIT

  get key() {
    return this.state.key;
  }

  get id() {
    return this.data.id;
  }

  // MARK:itemName
  get itemName() {
    return this.data.itemName;
  }
  set itemName(value) {
    this.data.itemName = value;
    this.render();
  }

  // MARK:discount
  get discount() {
    return this.data.discount;
  }
  set discount(value) {
    value = `${fixedToFloat3(value || 0)}`;
    this.data.discount = value;

    const { distributionBoxUnitPrice, distributionBoxTotalPrice, installationFeeUnitPrice, installationFeeTotalPrice } =
      calcProdDistributionBoxAndInstallationFee({
        stateProd: this.state,
        priceDiscount_percent: this.priceDiscount_percent,
      });

    this.data.distributionBoxUnitPrice = distributionBoxUnitPrice;
    this.data.distributionBoxTotalPrice = distributionBoxTotalPrice;
    this.data.installationFeeUnitPrice = installationFeeUnitPrice;
    this.data.installationFeeTotalPrice = installationFeeTotalPrice;

    Object.values(this.classComponentDict).forEach((com) => com.renewComponentAllPrice());

    Object.values(this.classAcceoooryDict).forEach((acce) => {
      acce.renewAcceAllPrice();
    });

    this.renewProdAllPrice_updateQuotationTotalPrice();

    this.render();
  }

  // MARK:quoteType
  get quoteType() {
    return this.data.quoteType;
  }
  set quoteType(value) {
    if (this.data.quoteType === value) {
      return;
    }

    this.data.quoteType = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.clearState();

    this.render();
  }

  // MARK:doorModelName
  get doorModelName() {
    return this.data.doorModelName;
  }
  set doorModelName(value) {
    this.data.doorModelName = value;
    this.render();
  }
  // MARK: changeDoorModel
  changeDoorModel({ doorModel }: { doorModel: TdoorModelInfoDto | null }) {
    if (this.state.doorModel === doorModel) {
      return;
    }

    this.clearState({ keepDistributionBoxQuantity: doorModel?.name !== 'W2' });

    this.state.doorModel = doorModel;
    this.data.doorModelName = doorModel?.name ?? '';

    if (!this.state.doorModel) {
      return;
    }

    const { thickness } = this.state.doorModel;

    // 門軌

    this.data.guideRail = this.options_guideRail?.[0]?.value ?? '';

    this.afterEditGuideRailInfo();

    // 門片厚度
    this.data.thickness = thickness.replaceAll('t', '') as `${number}`;

    // 材質
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

    // 底座版與底座角鐵
    this.changeBottomBarAngleIronAndBottomBarPlate(this.materialName);

    // 表面
    this.renewSurface();

    // 材料配件
    this.replaceComponentToEmpty();

    this.render();
  }

  // MARK:fullWidth
  get fullWidth() {
    return this.data.fullWidth;
  }
  set fullWidth(value) {
    this.data.fullWidth = value;
    this.data.calcByLW = 'l';

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.data.WG = '0';
    this.data.W = '0';
    this.clearState_some();

    this.isAllowReqChain && this.addAfterChange('reqChain_01');
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
  get WG_mm() {
    return new Decimal(this.data.WG).mul(1000).toNumber();
  }

  get W() {
    return this.data.W;
  }
  set W(v) {
    this.data.W = v || '0';
    this.data.calcByLW = 'w';

    const W_mm = new Decimal(this.data.W).mul(1000).toNumber();

    const WG_mm = calcProductWG_withWAndG({
      W: W_mm,
      G: this.data.guideRailG || 0,
    });

    this.data.WG = new Decimal(WG_mm).div(1000).toString() as `${number}`;

    if (this.isSpecial) {
      this.render();

      return;
    }

    const fullWidth = 0;

    this.data.fullWidth = new Decimal(fullWidth).div(1000).toString() as `${number}`;

    this.clearState_some();

    this.isAllowReqChain && this.addAfterChange('reqChain_01');

    this.render();
  }

  // MARK:height
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

    this.renewInstallationFee();

    this.isAllowReqChain && this.addAfterChange('reqChain_01');
    this.render();
  }
  get height_mm() {
    return new Decimal(this.data.height || 0).mul(1000).toNumber();
  }

  // MARK:boxB
  get boxB() {
    return this.data.boxB;
  }
  set boxB(value) {
    value = value !== '' ? `${fixedToFloat3(value || 0)}` : value;
    this.data.boxB = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.data.area = this.calcArea(this);
    this.renewInstallationFee();

    this.isAllowReqChain &&
      (async () => {
        await this.updateBoxD();
        await this.reqChain_03();
      })();

    this.render();
  }
  get boxB_mm() {
    return new Decimal(this.data.boxB || 0).mul(1000).toNumber();
  }

  // MARK:boxD
  get boxD() {
    return this.data.boxD;
  }
  set boxD(value) {
    value = value !== '' ? `${fixedToFloat3(value || 0)}` : value;
    this.data.boxD = value;
    this.render();
  }
  get boxD_mm() {
    return new Decimal(this.data.boxD || 0).mul(1000).toNumber();
  }

  // MARK:area
  get area() {
    return this.data.area ?? '';
  }

  // MARK:volume
  get volume() {
    return this.data.volume ?? '';
  }

  // MARK:thickness
  get thickness() {
    return this.data.thickness;
  }

  // MARK:materialName
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

    this.renewSurface();

    Object.values(this.classComponentDict).forEach((classComponent) => {
      classComponent.onProdChangeMaterial(this.data.materialName);
    });

    this.changeBottomBarAngleIronAndBottomBarPlate(this.state.data_componentDict.bottomBar?.material ?? 'undefined');

    this.isAllowReqChain && this.reqChain_04();

    this.render();
  }
  // MARK:materialSurface
  get materialSurface() {
    return this.data.materialSurface;
  }
  set materialSurface(value) {
    if (this.data.materialSurface === value) {
      return;
    }

    this.data.materialSurface = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    Object.values(this.classComponentDict).forEach((classComponent) =>
      // slat  headBox  guideRail // 只有這三個有作用
      classComponent.onProdChangeSurface(this.data.materialSurface)
    );

    this.isAllowReqChain && this.reqChain_04();

    this.render();
  }
  // MARK:horsepower
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

    this.renewDistributionBoxAllPrice_byHorsepower();

    this.renewPhase();
    this.renewDistributionBoxPrice();

    this.isAllowReqChain &&
      (async () => {
        await this.reqChain_01_withHp();
        this.state.isFetching = false;
        // await this.updateBoxD();
        // await this.reqChain_03();
      })();

    // reqChain_01_withHp

    this.render();
  }
  // MARK:motorVendor
  get motorVendor() {
    return this.data.motorVendor;
  }
  set motorVendor(value) {
    this.data.motorVendor = value;
    this.render();
  }
  // MARK:motorVoltage
  get motorVoltage() {
    return this.data.motorVoltage;
  }
  set motorVoltage(value) {
    this.data.motorVoltage = value;
    this.render();
  }
  // MARK:motorPhase
  get motorPhase() {
    return this.data.motorPhase;
  }
  set motorPhase(value) {
    this.data.motorPhase = value;
    this.render();
  }
  // MARK:guideRail
  get guideRail() {
    return this.data.guideRail;
  }
  set guideRail(value) {
    this.data.guideRail = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.afterEditGuideRailInfo();

    this.isAllowReqChain &&
      this.reqChain_02({
        onUpdateAvailableComponentsSuccess: () => {
          if (!this.data.guideRailThickness) {
            this.data.guideRailThickness = (this.options_guideRailThickness?.[0]?.value ?? '') as `${number}` | '';
          }
        },
      });

    this.render();
  }
  // MARK:guideRailImg
  get guideRailImg() {
    if (!this.data.guideRail) {
      return undefined;
    }

    return createAssetUrl('door-track', this.data.guideRail);
  }
  // MARK:guideRailThickness
  get guideRailThickness() {
    return this.data.guideRailThickness;
  }
  set guideRailThickness(value) {
    // 門軌厚度的選項是從availableComponents中取得的

    this.data.guideRailThickness = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.isAllowReqChain && this.reqChain_03();

    this.render();
  }
  // MARK:hasSilencingStrip
  get hasSilencingStrip() {
    return this.data.hasSilencingStrip;
  }
  // 消音條在編輯guideRail時一併設置
  // set hasSilencingStrip(value) {
  //   this.data.hasSilencingStrip = value;
  //   this.render();
  // }
  // MARK:isUlGuideRail
  get isULGuideRail() {
    return this.data.isULGuideRail;
  }
  set isULGuideRail(value) {
    this.data.isULGuideRail = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.reqChain_03();

    this.render();
  }
  // MARK:isIntegratedHeadBox
  get isIntegratedHeadBox() {
    return this.data.isIntegratedHeadBox;
  }
  set isIntegratedHeadBox(value) {
    this.data.isIntegratedHeadBox = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.reqChain_03();
    this.render();
  }
  // MARK:headBoxThickness
  get headBoxThickness() {
    return this.data.headBoxThickness;
  }
  set headBoxThickness(value) {
    this.data.headBoxThickness = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    this.isAllowReqChain && this.reqChain_03();

    this.render();
  }
  // MARK:isAntiTyphoon
  get isAntiTyphoon() {
    return this.data.isAntiTyphoon;
  }
  // 防颱在編輯guideRail時一併設置
  // set isAntiTyphoon(value) {
  //   this.data.isAntiTyphoon = value;
  //   this.render();
  // }

  // MARK:bounceDoorWidth
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
  // MARK:closingType
  get closingType() {
    return this.data.closingType;
  }
  set closingType(value) {
    // this.setData_simple('closingType', value);
    this.data.closingType = value;
    this.render();
  }
  // MARK:notes
  get notes() {
    return this.data.notes;
  }
  set notes(value) {
    this.data.notes = value;
    this.render();
  }
  // MARK:bottomBarAngleIron
  get bottomBarAngleIron() {
    return this.data.bottomBarAngleIron;
  }
  set bottomBarAngleIron(value) {
    this.data.bottomBarAngleIron = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    // 使底座板與底座角鐵的材質一樣
    const angleIronMaterial = this.options_bottomBarAngleIron.find((item) => item.value === value)?.material as
      | string
      | undefined;
    const plateInfo = this.options_bottomBarPlate.find((item) => item.value === this.bottomBarPlate);
    const plateMaterial = plateInfo?.material;

    if (angleIronMaterial !== plateMaterial) {
      const newPlate = this.options_bottomBarPlate.find((item) => item.material === angleIronMaterial);

      if (!newPlate) {
        myAlert.err({ title: '找不到對應的底座版' });
      }

      this.data.bottomBarPlate = newPlate?.value ?? '';
    }

    if (this.classComponentDict.bottomBar) {
      this.classComponentDict.bottomBar.material = angleIronMaterial ?? '';
    }

    this.isAllowReqChain && this.reqChain_04();

    this.render();
  }
  // MARK:bottomBarPlate
  get bottomBarPlate() {
    return this.data.bottomBarPlate;
  }
  set bottomBarPlate(value) {
    this.data.bottomBarPlate = value;

    if (this.isSpecial) {
      this.render();

      return;
    }

    // 使底座板與底座角鐵的材質一樣
    const plateMaterial = this.options_bottomBarPlate.find((item) => item.value === value)?.material as
      | string
      | undefined;
    const angleIronInfo = this.options_bottomBarAngleIron.find((item) => item.material === this.bottomBarAngleIron);
    const angleIronMaterial = angleIronInfo?.material;

    if (plateMaterial !== angleIronMaterial) {
      const newAngleIron = this.options_bottomBarAngleIron.find((item) => item.material === plateMaterial);

      if (!newAngleIron) {
        myAlert.err({ title: '找不到對應的底座角鐵' });
      }

      this.data.bottomBarAngleIron = newAngleIron?.value ?? '';
    }

    if (this.classComponentDict.bottomBar) {
      this.classComponentDict.bottomBar.material = plateMaterial ?? '';
    }

    this.isAllowReqChain && this.reqChain_04();

    this.render();
  }

  // MARK:changeBottomBarAngleIronAndBottomBarPlate
  // 以材質更新底座板與底座角鐵
  changeBottomBarAngleIronAndBottomBarPlate(
    v: string // '鍍鋅鋼板' | '高耐鍍鋅鋼板' | 'SST#304' | 'SST#316'
  ) {
    const func = (v: string) => {
      const dict_bottomBarAngleIron = _.keyBy<Toption>(this.options_bottomBarAngleIron, 'material');
      const dict_bottomBarPlate = _.keyBy<Toption>(this.options_bottomBarPlate, 'material');

      const bottomBarAngleIron = dict_bottomBarAngleIron[v]?.value ?? '';
      const bottomBarPlate = dict_bottomBarPlate[v]?.value ?? '';

      return [bottomBarAngleIron, bottomBarPlate];
    };

    let [bottomBarAngleIron, bottomBarPlate] = func(v);

    if (!bottomBarAngleIron || !bottomBarPlate) {
      [bottomBarAngleIron, bottomBarPlate] = func('SST#304');
    }

    this.data.bottomBarAngleIron = bottomBarAngleIron;
    this.data.bottomBarPlate = bottomBarPlate;

    this.render();
  }
  // MARK:quantity
  get quantity() {
    return this.data.quantity;
  }
  set quantity(value) {
    this.data.quantity = value;
    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }
  // MARK:price
  get price() {
    return this.data.price;
  }
  set price(value) {
    this.data.price = value;
    this.state.isCustomPrice = true;
    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }
  // MARK:dualPrice
  get dualPrice() {
    return this.data.dualPrice;
  }
  set dualPrice(value) {
    this.data.dualPrice = value;
    this.render();
  }
  // MARK:unitPrice
  get unitPrice() {
    return this.data.unitPrice;
  }
  set unitPrice(value) {
    this.data.unitPrice = value;
    this.render();
  }
  // MARK:totalPrice
  get totalPrice() {
    return this.data.totalPrice;
  }
  set totalPrice(value) {
    this.data.totalPrice = value;
    this.render();
  }

  // MARK:qty_reduce
  get qty_reduce() {
    return this.state.qty_reduce;
  }
  set qty_reduce(value) {
    value = `${fixedToFloat3(value || 0)}`;

    const qtyAllow = new Decimal(this.qty_remain).add(this.state.qty_reduce || 0).toNumber();

    if (qtyAllow < Number(value || 0)) {
      return;
    }

    const qty_reduce = Number(value || 0);
    const qty_modify = this.qty_modify;
    const unitPrice = this.data.unitPrice || 0;

    this.state.qty_reduce = value;

    const deductedPrice = new Decimal(qty_reduce).add(qty_modify).mul(unitPrice).mul(-1).toNumber();
    this.state.deductedPrice = deductedPrice;

    this.render();
  }

  // MARK:qty_modify
  get qty_modify() {
    return calcQtyModify({ modifyedProduct: this.state.modifyedProduct });
  }
  // set qty_modify(value) {
  //   value = fixedToFloat3(value);

  //   const qtyAllow = this.qty_remain + this.state.qty_modify;

  //   if (qtyAllow < value) {
  //     throw new Error('數量不足');
  //   }

  //   this.state.qty_modify = value;

  //   const qty_reduce = this.state.qty_reduce || 0;
  //   const qty_modify = this.state.qty_modify;
  //   const unitPrice = this.data.unitPrice || 0;

  //   const deductedPrice = new Decimal(qty_reduce).add(qty_modify).mul(unitPrice).mul(-1).toNumber();
  //   this.state.deductedPrice = deductedPrice;

  //   this.render();
  // }

  // MARK:deductedPrice
  get deductedPrice() {
    return this.state.deductedPrice;
  }

  // MARK:qty_remain
  get qty_remain() {
    return calcProdRemain({ stateProd: this.state });
  }

  get isAttached() {
    return !!this.state.rootProduct;
  }

  // MARK:attachedToProductName
  get rootProductName() {
    return this.state.rootProduct?.data_prod.itemName ?? '';
  }

  // MARK:isQuantityValid
  get isQuantityValid() {
    return this.state.isQuantityValid;
  }
}
// MARK: END

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

const checkComponentRawData = (componentDict: Tdata_componentDict) => {
  const arr: (keyof Tdata_componentDict)[] = [];

  Object.entries(componentDict).forEach(([key, com]) => {
    if (!com.rawData) {
      arr.push(key as keyof Tdata_componentDict);
    }
  });

  return arr.length === 0 ? null : arr;
};

const dealErr = (error: unknown) => {
  const err = error as { title?: string; content?: string };

  if (err && 'title' in err) {
    myAlert.err({ title: err?.title, content: err?.content });

    return Promise.reject(null);
  } else {
    myAlert.err({ title: '預期外的錯誤' });

    throw error;
  }
};

// ================================================================================
// ================================================================================
// ================================================================================
// ================================================================================

export { ClassProd };

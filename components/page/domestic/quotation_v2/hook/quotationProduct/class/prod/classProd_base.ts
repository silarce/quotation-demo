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

// ================================================================================

type TdoorModelNameLookup = {
  [key in TdoorModel]: key;
};

interface Tprops_constructor {
  stateProd: TstateProd;
  setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
  nodeConfig: TnodeConfig;
}

// ================================================================================

const doorModelNameLookup: TdoorModelNameLookup = {
  'SJ-302': 'SJ-302',
  'SJ-312': 'SJ-312',
  'SJ-305D': 'SJ-305D',
  'SJ-303A': 'SJ-303A',
  'SJ-303AS': 'SJ-303AS',
  'SJ-120A': 'SJ-120A',
  'SJ-303S': 'SJ-303S',
  W2: 'W2',
};

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

const calcArea = (classProd: ClassProd_base) => {
  const fullWidth = classProd.fullWidth_mm;
  const height = classProd.height_mm;
  const boxb = classProd.boxB_mm;

  let area = calcProductArea({ fullWidth, height, boxb });
  area = new Decimal(area).div(1000000).toDecimalPlaces(2).toString() as `${number}`;

  return area;
};

const reqGetProdCalcGeneralSpec = async (classProd: ClassProd_base) => {
  if (!classProd.isValid_doorModelName) {
    return Promise.reject(null);
  }

  // '1/4' | '1/3' | '1/2' | '3/4' | '1' | '1 1/2' | '2' | '3' | '5';
  const hp = classProd.horsepower.replaceAll('HP', '') as Thp;

  const body: TpcgsPrams = {
    // classProd.doorModelName的實際型別為string而非TpcgsPrams['modelName']
    // 預期可能會422，但已在catch處理
    // modelName: classProd.doorModelName as TpcgsPrams['modelName'],
    modelName: classProd.doorModelName as TpcgsPrams['modelName'],
    height: classProd.height_mm,
    //
    fullWidth: classProd.fullWidth_mm,
    WG: undefined, // 不使用WG，統一使用fullWidth
    //
    isAntiTyphoon: !!classProd.isAntiTyphoon,
    hp: hp || undefined,
  };

  return await apiGetProdCalcGeneralSpec(body)
    .then((res) => res)
    .catch(() => {
      myAlert.err({ title: '取得產品規格失敗' });

      return Promise.reject(null);
    });
};

const reqGetAvailableComponents = async (classProd: ClassProd_base) => {
  if (!classProd.isValid_doorModelName) {
    return Promise.reject(null);
  }

  const body: TpacParams = {
    modelName: classProd.doorModelName as TdoorModel,
    weight: Number(classProd.data.weight || 0),
    isAntiTyphoon: !!classProd.data.isAntiTyphoon,
    rollerDiameter: Number(classProd.data.diameter || 0),
  };

  return await apiGetProdAvailableComponents(body)
    .then((res) => res)
    .catch(() => {
      myAlert.err({ title: '取得材料配件失敗' });

      return Promise.reject(null);
    });
};

// ================================================================================
// MARK: ClassProd_base
//
//
//
//
class ClassProd_base implements Interface_ClassProd_base {
  static calcArea = calcArea;
  static reqGetProdCalcGeneralSpec = reqGetProdCalcGeneralSpec;
  static reqGetAvailableComponents = reqGetAvailableComponents;
  // -----------------------------------------------------------------

  // -----------------------------------------------------------------

  constructor({ stateProd, setStateProd, nodeConfig }: Tprops_constructor) {
    // cloneDeep對效能的負擔太大了
    // this.state = _.cloneDeep(stateProd);
    this.state = stateProd;
    this.data = this.state.data_prod;
    this.setState = setStateProd;
    this._nodeConfig = customizeNodeConfig({ nodeConfig });
  } // constructor

  // -----------------------------------------------------------------------

  protected classComponentDict: TclassComponentDict = {};

  setClassComponentDict(classComponentDict: TclassComponentDict) {
    this.classComponentDict = classComponentDict;
  }
  clearClassComponentDict() {
    this.classComponentDict = {};
  }

  // -----------------------------------------------------------------------
  doorModel = 'SJ-302';
  protected _nodeConfig: TnodeConfig;
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  protected readonly setState: React.Dispatch<React.SetStateAction<TstateProd>>;

  state: TstateProd;
  data: TstateProd['data_prod'];
  protected render() {
    this.setState({ ...this.state });
  }

  // private setData(newStateData: TstateProd) {
  //   this.setState(newStateData);
  // }

  // private setData(newStateData: React.SetStateAction<TstateProd['data_prod']>) {
  //   const newStateDataValue = typeof newStateData === 'function' ? newStateData(this.data) : newStateData;
  //   this.setState((prev) => {
  //     const copy = { ...prev };
  //     copy.data_prod = newStateDataValue;

  //     return copy;
  //   });
  // }

  protected setData_simple<K extends keyof TstateProd['data_prod']>(key: K, value: TstateProd['data_prod'][K]) {
    this.setState((prev) => {
      const copy = { ...prev };
      copy.data_prod[key] = value;

      return copy;
    });
  }

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  get nodeConfig() {
    return this._nodeConfig;
  }

  get isFetching() {
    return !!this.state.isFetching;
  }

  // protected set isFetching(value) {
  //   this.state.isFetching = value;
  //   this.render();
  // }

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // region 輸出

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
    this.setData_simple('itemName', value);
  }

  get discount() {
    return this.data.discount;
  }
  set discount(value) {
    // if (checkIsFloat3(value)) {
    //   return;
    // }

    this.setData_simple('discount', value);
  }

  get quoteType() {
    return this.data.quoteType;
  }
  set quoteType(value) {
    this.setData_simple('quoteType', value);
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
    // if (!checkIsFloat3(value)) {
    //   return;
    // }

    this.data.fullWidth = value;
    this.data.area = ClassProd_base.calcArea(this);

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
    const WG_mm = new Decimal(this.data.WG).mul(1000).toNumber();
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
    this.setData_simple('height', value);
  }
  get height_mm() {
    return new Decimal(this.data.height).mul(1000).toNumber();
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
    this.setData_simple('materialName', value);
  }

  get materialSurface() {
    return this.data.materialSurface;
  }
  set materialSurface(value) {
    this.setData_simple('materialSurface', value);
  }

  get horsepower() {
    return this.data.horsepower;
  }
  set horsepower(value) {
    this.setData_simple('horsepower', value);
  }

  get motorVendor() {
    return this.data.motorVendor;
  }
  set motorVendor(value) {
    this.setData_simple('motorVendor', value);
  }

  get motorVoltage() {
    return this.data.motorVoltage;
  }
  set motorVoltage(value) {
    this.setData_simple('motorVoltage', value);
  }

  get motorPhase() {
    return this.data.motorPhase;
  }
  set motorPhase(value) {
    this.setData_simple('motorPhase', value);
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

    this.setData_simple('guideRailThickness', value);
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
    this.setData_simple('isULGuideRail', value);
  }

  get isIntegratedHeadBox() {
    return this.data.isIntegratedHeadBox;
  }
  set isIntegratedHeadBox(value) {
    this.setData_simple('isIntegratedHeadBox', value);
  }

  get headBoxThickness() {
    return this.data.headBoxThickness;
  }
  set headBoxThickness(value) {
    this.setData_simple('headBoxThickness', value);
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

    this.setData_simple('bounceDoorWidth', value);
    this.setData_simple('bounceDoor', !!value);
  }

  get closingType() {
    return this.data.closingType;
  }
  set closingType(value) {
    this.setData_simple('closingType', value);
  }

  get notes() {
    return this.data.notes;
  }
  set notes(value) {
    this.setData_simple('notes', value);
  }

  get bottomBarAngleIron() {
    return this.data.bottomBarAngleIron;
  }
  set bottomBarAngleIron(value) {
    this.setData_simple('bottomBarAngleIron', value);
  }

  get bottomBarPlate() {
    return this.data.bottomBarPlate;
  }
  set bottomBarPlate(value) {
    this.setData_simple('bottomBarPlate', value);
  }

  get quantity() {
    return this.data.quantity;
  }
  set quantity(value) {
    this.setData_simple('quantity', value);
  }

  get unitPrice() {
    return this.data.unitPrice;
  }
  set unitPrice(value) {
    this.setData_simple('unitPrice', value);
  }

  get totalPrice() {
    return this.data.totalPrice;
  }
  set totalPrice(value) {
    this.setData_simple('totalPrice', value);
  }

  get price() {
    return this.data.price;
  }
  set price(value) {
    this.setData_simple('price', value);
  }

  get dualPrice() {
    return this.data.dualPrice;
  }
  set dualPrice(value) {
    this.setData_simple('dualPrice', value);
  }

  //  endregion  輸出
  // -----------------------------------------------------------------------------------

  // region API UPDATE
  //
  //
  //
  //

  get isValid_doorModelName() {
    return this.doorModelName in doorModelNameLookup;
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

  // MARK:init
  async init() {
    this.state.isFetching = true;
    this.render();

    if (this.isValid_doorModelName) {
      try {
        const generalSpec = await ClassProd_base.reqGetProdCalcGeneralSpec(this);
        this.state.generalSpecs = generalSpec;

        const availableComponents = await ClassProd_base.reqGetAvailableComponents(this);
        this.state.availableComponents = availableComponents;
      } catch {
        this.state.generalSpecs = null;
        this.state.availableComponents = null;
      }
    }

    this.state.isFetching = false;
    this.render();
  }

  // MARK:updateGeneralSpec
  // modelName height fullWidth WG isAntiTyphoon hp
  // protected async updateGeneralSpec() {
  //   const generalSpecs = await reqGetProdCalcGeneralSpec(this);
  //   this.state.generalSpecs = generalSpecs;

  //   return this;
  // }

  // MARK:updateSlatCount
  // modelName height boxB
  // protected async updateSlatCount() {
  //   const res = await reqGetSlatCount(this).catch((res) => res);
  //   this.data.slatCount = res === null ? null : `${res}`;

  //   return this;
  // }

  // MARK:updateAvailableComponents
  // doorModelName weight isAntiTyphoon diameter
  // protected async updateAvailableComponents() {
  //   const res = await reqGetAvailableComponents(this);
  //   this.state.availableComponents = res;

  //   return this;
  // }

  // MARK:updateBoxD
  // modelName rollerDiameter sidePlateSizeB hp motorVendor
  // protected async updateBoxD() {
  //   const res = await reqGetBoxD(this);
  //   this.data.boxD = new Decimal(res || 0).div(1000).toString() as `${number}`;
  // }

  // -----------------------------------------------------------------------------------

  // region HANDLER

  changeDoorModel({ name, doorModel }: { name: string; doorModel: TdoorModelInfoDto | null }) {
    this.state.doorModel = doorModel;
    this.data.doorModelName = name;

    if (!doorModel) {
      return this;
    }

    const {
      name: doorModelName,
      thickness,
      // density,
      // guideRails,
      // slatMaterials,
    } = doorModel;

    name !== doorModelName && myAlert.notify.warning({ message: 'name與doorModelName不一致' });
    this.data.doorModelName = doorModelName;

    this.data.thickness = thickness.replaceAll('t', '') as `${number}`;

    this.render();

    return this;
  }

  // endregion HANDLER

  // -----------------------------------------------------------------------------------
} // ClassProd_base
// MARK: END

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

// // MARK: filterComponent
// const filterComponent = (classProd: ClassProd_base, availableComponents: TdoorComponentListDto) => {
//   const {
//     filter_slat,
//     filter_bottomBar,
//     filter_guideRail,
//     filter_sidePlate,
//     filter_roller,
//     filter_motor,
//     filter_motorAccessory,
//     filter_headBox,
//     filter_backBone,
//     filter_middlePillar,
//   } = componentFilter;

//   const { slat, optionalSlats } = filter_slat(availableComponents.slats, {
//     isAntiTyphoon: !!classProd.data.isAntiTyphoon,
//   });

//   const { bottomBar, optionalBottomBars } = filter_bottomBar(availableComponents.bottomBars, {
//     isAntiTyphoon: !!classProd.data.isAntiTyphoon,
//     isWaterProof: classProd.data.bottomBar === '止水型',
//     hasAluminumBarrier: classProd.data.bottomBar === '鋁障感型',
//   });

//   const { guideRail, optionalGuideRails } = filter_guideRail({
//     guideRails: availableComponents.guideRails,
//     params: {
//       thickness: Number(classProd.data.guideRailThickness),
//       isAntiTyphoon: !!classProd.data.isAntiTyphoon,
//       hasSilencingStrip: !!classProd.data.hasSilencingStrip,
//       imageName: classProd.data.guideRail || 'null',
//       isUL: !!classProd.data.isULGuideRail,
//     },
//   });

//   const { sidePlate, optionalSidePlates } = filter_sidePlate(availableComponents.sidePlates, {
//     bearingType: classProd.data.bearingName || 'null',
//     gearNumber: classProd.data.gearNumber,
//     isIntegrated: !!classProd.data.isIntegratedHeadBox,
//     motorVendor: classProd.data.motorVendor || 'null',
//     sizeB: classProd.boxB_mm,
//     weight: Number(classProd.data.weight ?? NaN),
//   });

//   const { roller, optionalRollers } = filter_roller(availableComponents.rollers, {
//     diameter: classProd.data.diameter ?? '-1',
//   });

//   let motorVendor = classProd.data.motorVendor;
//   let changedMotorVendor = null;
//   let { motor, optionalMotors } = filter_motor(availableComponents.motors, {
//     horsePower: classProd.data.horsepower,
//     gearNumber: classProd.data.gearNumber || 'null',
//     motorVendor: motorVendor || 'null',
//     phase: Number(classProd.data.motorPhase ?? NaN),
//     voltage: Number(classProd.data.motorVoltage ?? NaN),
//     weight: Number(classProd.data.weight ?? NaN),
//     hasSupportStand: !!classProd.data.hasMotorSupportStand,
//   });

//   // 現在使用者不能選擇馬達廠商，因此在這裡自動轉換
//   if (!motor && motorVendor) {
//     if (motorVendor === '東元') {
//       motorVendor = '大同';
//     } else if (motorVendor === '大同') {
//       motorVendor = '東元';
//     }

//     const result = filter_motor(availableComponents.motors, {
//       horsePower: classProd.data.horsepower,
//       gearNumber: classProd.data.gearNumber || 'null',
//       motorVendor: motorVendor || 'null',
//       phase: Number(classProd.data.motorPhase ?? NaN),
//       voltage: Number(classProd.data.motorVoltage ?? NaN),
//       weight: Number(classProd.data.weight ?? NaN),
//       hasSupportStand: !!classProd.data.hasMotorSupportStand,
//     });

//     if (result) {
//       motor = result.motor;
//       optionalMotors = result.optionalMotors;
//       changedMotorVendor = motorVendor;
//       // classProd.data.motorVendor = motorVendor;
//     }
//   }

//   const { motorAccessory, optionalMotorAccessories } = filter_motorAccessory(availableComponents.motorAccessories, {
//     chains: Number(classProd.data.sprocketWheelChains ?? NaN),
//     bearingType: classProd.data.bearingName ?? 'null',
//     gearNumber: classProd.data.gearNumber ?? 'null',
//   });

//   const { headBox, optionalHeadBoxes } = filter_headBox(availableComponents.headBoxes, {
//     thickness: Number(classProd.data.headBoxThickness ?? NaN),
//     isIntegrated: !!classProd.data.isIntegratedHeadBox,
//   });

//   const { backBone, optionalBackBones } = filter_backBone(availableComponents.backBone);

//   const { middlePillar, optionalMiddlePillars } = filter_middlePillar(availableComponents.middlePillar);

//   return {
//     slat,
//     optionalSlats,

//     bottomBar,
//     optionalBottomBars,

//     guideRail,
//     optionalGuideRails,

//     sidePlate,
//     optionalSidePlates,

//     roller,
//     optionalRollers,

//     motorAccessory,
//     optionalMotorAccessories,

//     headBox,
//     optionalHeadBoxes,

//     backBone,
//     optionalBackBones,

//     middlePillar,
//     optionalMiddlePillars,
//     //
//     //
//     changedMotorVendor,
//   };
// };

// const checkIsFloat3 = (v: Parameters<typeof checkIsFloat>[0]) => {
//   if (v === '') {
//     return true;
//   }

//   return checkIsFloat(v, 3);
// };

// ================================================================================

// ================================================================================
export { ClassProd_base };

export type {
  Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_prime,
  Interface_ClassProd_special,
  Tprops_constructor,
};

// interface Tone {
//   a: string;
//   b?: string;
// }

// interface Tfoo extends Tone {
//   a: string;
// }
// interface Tbar extends Tone {
//   a: string;
//   b: string;
// }

// class One implements Tone {
//   a = 'a';
// }
// class Foo extends One implements Tfoo {
//   a = 'a';
// }

// class Bar extends One implements Tbar {
//   a = 'a';
//   b = 'b';
// }

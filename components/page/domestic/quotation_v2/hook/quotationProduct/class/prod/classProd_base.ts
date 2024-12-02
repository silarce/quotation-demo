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

// ================================================================================

// 在子類別中，可以透過customizeNodeConfig方法來覆寫nodeConfig
// 務必要先進行深拷貝，避免影響到原本的nodeConfig
const customizeNodeConfig = (nodeConfig: TnodeConfig) => {
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
// MARK: START
//
//
//
//
class ClassProd_base implements Interface_ClassProd_base {
  // MARK: constructor
  constructor({
    stateProd,
    setStateProd,
    nodeConfig,
  }: {
    stateProd: TstateProd;
    setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
    nodeConfig: TnodeConfig;
  }) {
    // cloneDeep對效能的負擔太大了
    // this.state = _.cloneDeep(stateProd);
    this.state = stateProd;
    this.data = this.state.data_prod;
    this.setState = setStateProd;
    this.nodeConfig = customizeNodeConfig(nodeConfig);
  } // constructor
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  doorModel = 'SJ-302';
  readonly nodeConfig: TnodeConfig;
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
  changeDoorModel(doorModel: TdoorModelInfoDto | null) {
    this.state.doorModel = doorModel;

    return this;
  }
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
    if (checkIsFloat3(value)) {
      return;
    }

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
    this.setData_simple('doorModelName', value);
  }

  get fullWidth() {
    return this.data.fullWidth;
  }
  set fullWidth(value) {
    if (!checkIsFloat3(value)) {
      return;
    }

    this.data.fullWidth = value;
    this.data.area = calcArea(this);

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
    if (checkIsFloat3(value)) {
      return;
    }

    this.setData_simple('boxB', value);
  }
  get boxB_mm() {
    return new Decimal(this.data.boxB).mul(1000).toNumber();
  }

  get boxD() {
    return this.data.boxD;
  }
  set boxD(value) {
    this.setData_simple('boxD', value);
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
    this.setData_simple('guideRail', value);
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
    this.setData_simple('guideRailThickness', value);
  }

  get hasSilencingStrip() {
    return this.data.hasSilencingStrip;
  }
  set hasSilencingStrip(value) {
    this.setData_simple('hasSilencingStrip', value);
  }

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
  set isAntiTyphoon(value) {
    this.setData_simple('isAntiTyphoon', value);
  }

  get bounceDoorWidth() {
    return this.data.bounceDoorWidth;
  }
  set bounceDoorWidth(value) {
    if (checkIsFloat3(value)) {
      return;
    }

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

  // MARK:init
  async init() {
    const generalSpecs = await reqGetProdCalcGeneralSpec(this);
    this.state.generalSpecs = generalSpecs;
  }

  // MARK:updateGeneralSpec
  protected async updateGeneralSpec() {
    // await reqGetProdCalcGeneralSpec(this).then((res) => (this.state.generalSpecs = res));
    const generalSpecs = await reqGetProdCalcGeneralSpec(this);
    this.state.generalSpecs = generalSpecs;

    if (!generalSpecs) {
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

      return;
    }

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

    const boxD = await reqGetBoxD(this);
    this.data.boxD = new Decimal(boxD || 0).div(1000).toString() as `${number}`;

    this.data.area = calcArea(this);

    this.render();
  }

  // -----------------------------------------------------------------------------------

  // region HANDLER

  // async onFullWidthChange() {
  //   this.updateGeneralSpec();

  //   return this;
  // }

  // async onFullWidthChange() {
  //   this.updateGeneralSpec();

  //   return this;
  // }

  // endregion HANDLER

  // -----------------------------------------------------------------------------------
} // ClassProd_base
// MARK: END

// ================================================================================
// ================================================================================
// ================================================================================

//MARK:ClassProd_prime
class ClassProd_prime extends ClassProd_base implements Interface_ClassProd_prime {
  doorModel: TdoorModel = 'SJ-302';

  async onFullWidthChange() {
    this.updateGeneralSpec();

    return this;
  }
}

// ================================================================================
// ================================================================================
// ================================================================================

// region API

const reqGetProdCalcGeneralSpec = async (
  //
  classProd: ClassProd_base
  //
) => {
  // '1/4' | '1/3' | '1/2' | '3/4' | '1' | '1 1/2' | '2' | '3' | '5';
  const hp = classProd.horsepower.replaceAll('HP', '') as Thp;

  const body: TpcgsPrams = {
    // classProd.doorModelName的實際型別為string而非TpcgsPrams['modelName']
    // 預期可能會422，但已在catch處理
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

      return null;
    });
};

const reqGetBoxD = async (classProd: ClassProd_base) => {
  const body: TgetBoxDParams = {
    modelName: classProd.doorModel,
    rollerDiameter: Number(classProd.data.diameter || 0),
    sidePlateSizeB: classProd.boxB_mm,
    hp: classProd.data.horsepower,
    motorVendor: classProd.data.motorVendor || '',
  };

  return await apiGetboxD(body)
    .then((res) => res.sidePlateSizeD)
    .catch(() => {
      myAlert.err({ title: '取得boxD失敗' });

      return null;
    });
};

// const reqGetSlatCount = async (body: TpcdsPrams) => {
//   await apiGetProdCalcDetailSpec(body)
//     .then((res) => res.slatCount)
//     .catch(() => {
//       myAlert.err({ title: '取得門片數量失敗' });
//     });
// };

// const reqGetAvailableComponents = async (body: TpacParams) => {
//   return await apiGetProdAvailableComponents(body)
//     .then((res) => res)
//     .catch(() => {
//       myAlert.err({ title: '取得材料配件失敗' });

//       return null;
//     });
// };

// ================================================================================

const checkIsFloat3 = (v: Parameters<typeof checkIsFloat>[0]) => {
  if (v === '') {
    return true;
  }

  return checkIsFloat(v, 3);
};

const calcArea = (classProd: ClassProd_base) => {
  const fullWidth = classProd.fullWidth_mm;
  const height = classProd.height_mm;
  const boxb = classProd.boxB_mm;

  let area = calcProductArea({ fullWidth, height, boxb });
  area = new Decimal(area).div(1000000).toDecimalPlaces(2).toString() as `${number}`;

  return area;
};

// ================================================================================

export { ClassProd_base, ClassProd_prime };
export type {
  Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_prime,
  Interface_ClassProd_special,
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

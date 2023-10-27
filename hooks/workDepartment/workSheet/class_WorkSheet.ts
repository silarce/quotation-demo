import _ from 'lodash';
import Decimal from 'decimal.js';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { apiGetQuotationProducts } from 'js/api/api_quotation';
import {
  TdoorModelInfoDto,
  TgenerateDoorProductBomDto,
  TdoorAccessoryDto,
  TdoorGeneralSpecsDto,
  apiGetProdAccessories,
  apiGetProdCalcGeneralSpec,
  apiPostProdGenerateDoorProductBom,
  // apiGetProdAvailableComponents,
} from 'js/api/api_product';

// type
import { TquotationProductDto, TquotationProductItemDto, TquotationProductComponentsDto } from 'js/api/dtoTypes';

// config
import { lookup_boxBAndBoxD } from 'config/product/lookup';

// utils
import { calcProductArea, calcProductVolume, calcProductWG, findBDoptions } from 'js/utils/product/calc';

// ======================================================================
class Class_workSheet {
  constructor({
    forceUpdate,
    prod,
    itemIdArr, // itemIdArr裝的是被這個class代表的item的id，
    // 未來若分堆需求，oldProd可能會要是未被修改的資料
    // 這樣可以取父prod的oldProd放進來，prod則是父prod的資料
    oldProd = _.cloneDeep(prod),
  }: {
    //
    forceUpdate: () => void;
    prod: TquotationProductItemDto;
    itemIdArr: string[];
    oldProd?: TquotationProductItemDto;
  }) {
    this.forceUpdate = forceUpdate;
    this._prod = _.cloneDeep(prod);
    this.oldProd = oldProd;
    this.itemIdArr = itemIdArr;

    const comList: { [key: string]: TquotationProductComponentsDto } = {};

    this._prod.components.forEach((com) => {
      comList[com.type] = com;
    });

    this.comList = comList as { [key in TquotationProductComponentsDto['type']]: TquotationProductComponentsDto };

    // 暫時先放進name，在getAccessoriesArr會改成放進id
    this._acceIdArr = this._prod.accessories.map((item) => item.name);

    this.findBoxBoptions();
  } //  constructor close

  // ---------------------------------------------------------------------

  private _prod: TquotationProductItemDto;
  readonly oldProd: TquotationProductItemDto;
  private forceUpdate: () => void;
  private itemIdArr: string[];
  // ---------------------------------------------------------------------

  private comList: { [key in TquotationProductComponentsDto['type']]: TquotationProductComponentsDto };
  private _acceIdArr: string[];

  private _accessoriesOptionArr: TdoorAccessoryDto[] = [];
  private _accessoriesOptionList: { [key: string]: TdoorAccessoryDto } = {};
  private _accessoriesOptionArr_easy: { value: string; label: string }[] = [];

  private _prodSpec: TdoorGeneralSpecsDto | undefined = undefined;
  private _defaultBoxB = 0;
  // ---------------------------------------------------------------------
  options_boxB: { value: string; label: string }[] = [];
  // ---------------------------------------------------------------------

  async getAccessoriesArr() {
    this._accessoriesOptionArr = [];
    const res = await apiGetProdAccessories({ modelName: this.doorModelName });

    if (res) {
      this._accessoriesOptionArr = res;

      const list: typeof this._accessoriesOptionList = {};
      const arr: string[] = [];

      this._accessoriesOptionArr.forEach((item) => {
        list[item.id] = item;
        this._accessoriesOptionArr_easy.push({ value: item.id, label: item.name });

        const isHave = this._acceIdArr.some((name) => {
          return name === item.name;
        });

        if (isHave) {
          arr.push(item.id);
        }
      });

      this._acceIdArr = arr;

      this.forceUpdate();
    }
  }

  async getProdSpec() {
    try {
      const res = await apiGetProdCalcGeneralSpec({
        modelName: this.doorModelName as TdoorModelInfoDto['name'],
        height: this._prod.height,
        isAntiTyphoon: this.isAntiTyphoon,
        fullWidth: this._prod.fullWidth,
      });

      if (res) {
        this._prodSpec = res;

        return res;
      }
    } catch (error) {}
  }

  // ---------------------------------------------------------------------
  calcArea() {
    const area = calcProductArea({
      height: this._prod.height,
      boxb: this._prod.boxB,
      fullWidth: this._prod.fullWidth,
    });

    this._prod.area = area;
  }

  private toSetDefaultBoxB() {
    if (!this._prodSpec) {
      return;
    }

    const motorArr = this._prodSpec.motors;
    const hp = this.horsepower;
    const vendor = this.motorVendor as '東元' | '大同' | '';
    const defaultMotor = motorArr[this._prodSpec.defaultMotorIndex];
    const defaultHP = defaultMotor.hp;
    const box = defaultMotor.box;

    if (hp !== defaultHP || !vendor || !box) {
      return;
    }

    const boxB = box[vendor]?.boxB || box.default?.boxB;

    if (boxB) {
      this.boxB = String(boxB / 1000);
    }
  }

  findBoxBoptions() {
    const { options_boxB } = findBDoptions(this._prod.doorModelName);
    this.options_boxB = options_boxB ?? [];
  }

  //
  //
  //

  async calcProd() {
    const prodSpec = await this.getProdSpec();

    if (!prodSpec) {
      return;
    }

    // 計算出WG
    // this._prod.WG = (this._prod.fullWidth * 1000 - prodSpec.gapA - prodSpec.gapC) / 1000;
    this._prod.WG =
      calcProductWG({
        fullWidth: this._prod.fullWidth * 1000,
        gapA: prodSpec.gapA,
        gapC: prodSpec.gapC,
      }) / 1000;

    const defaultMotorIndex = prodSpec.defaultMotorIndex;
    const defaultMotor = prodSpec.motors[defaultMotorIndex];
    const defaultMotorBox = defaultMotor.box;

    // 設定馬力
    this.horsepower = defaultMotor.hp;

    // 設定boxB與thickness
    // 後端說boxB只會在defaultMotorIndex指定的motors裡面
    const boxB = defaultMotorBox?.default?.boxB || defaultMotorBox?.東元?.boxB || defaultMotorBox?.大同?.boxB;
    this._prod.thickness = prodSpec.thickness; // 門片厚度

    // 設定馬達廠商
    if (defaultMotorBox) {
      if (defaultMotorBox.東元) {
        this.motorVendor = '東元';
        this.boxB_noCall = defaultMotorBox.東元.boxB;
      } else if (defaultMotorBox.大同) {
        this.motorVendor = '大同';
        this.boxB_noCall = defaultMotorBox.大同.boxB;
      } else if (defaultMotorBox.default) {
        this.boxB_noCall = defaultMotorBox.default.boxB;
      }
    } else {
      this.boxB_noCall = boxB ?? 0;
    }

    this.findBoxBoptions();
    this.options_boxB?.unshift({
      value: 'auto',
      label: '自動計算',
    });

    this.forceUpdate();

    //
    //
  }

  getInitData() {
    if (this.accessoriesOptionArr.length === 0) {
      this.getAccessoriesArr();
    }

    if (this._prodSpec === undefined) {
      this.getProdSpec();
    }
  }

  // ---------------------------------------------------------------------
  get productId() {
    return this._prod.productId;
  }

  get accessoriesOptionArr() {
    return this._accessoriesOptionArr;
  }
  get accessoriesOptionArr_easy() {
    return this._accessoriesOptionArr_easy;
  }

  get prodSpec() {
    return this._prodSpec;
  }

  // ---------------------------------------------------------------------

  // ---------------------------------------------------------------------

  get itemName() {
    return this._prod.itemName;
  }
  set itemName(str) {
    this._prod.itemName = str;
    this.forceUpdate();
  }

  get doorModelName() {
    return this._prod.doorModelName;
  }
  set doorModelName(str) {
    this._prod.doorModelName = str;
    this.forceUpdate();
  }

  get fullWidth() {
    return String(this._prod.fullWidth / 1000);
  }
  set fullWidth(str) {
    this._prod.fullWidth = Number(str) * 1000;
    this.calcArea();
    this.forceUpdate();
  }

  get WG() {
    return String(this._prod.WG / 1000);
  }

  get BD() {
    // TODO item裡沒有boxD，已回報給後端
    return new Decimal(this._prod.boxB).mul(this._prod.boxD ?? 0).toString();
  }

  get height() {
    return String(this._prod.height / 1000);
  }
  set height(str) {
    this._prod.height = Number(str);
    this.calcArea();
    this.forceUpdate();
  }

  get boxB() {
    return String(this._prod.boxB / 1000);
  }
  set boxB(str) {
    let num = Number(str) * 1000;

    if (str === 'auto') {
      num = this._defaultBoxB;
    }

    this._prod.boxB = num;
    const boxD = Number(lookup_boxBAndBoxD[this._prod.doorModelName]?.BtoD[str]) ?? 0;
    this._prod.boxD = boxD * 1000;
    this.calcArea();
    this.forceUpdate();
  }

  set boxB_noCall(num: number) {
    this._prod.boxB = Number(num);
    this._prod.boxD = Number(lookup_boxBAndBoxD[this._prod.doorModelName]?.BtoD[num]) ?? 0;
    this.calcArea();
    this.forceUpdate();
  }

  get quantity() {
    return String(this.itemIdArr.length);
  }
  // set quantity(str) {
  //   this._prod.quantity = Number(str);
  //   this.forceUpdate();
  // }

  get materialName() {
    return this._prod.materialName;
  }
  set materialName(str) {
    this._prod.materialName = str;
    this.forceUpdate();
  }

  get isAntiTyphoon() {
    return this._prod.isAntiTyphoon;
  }
  set isAntiTyphoon(str) {
    this._prod.isAntiTyphoon = str;
    this.forceUpdate();
  }

  // -------------------------------------------------------

  // | 'slat'
  // | 'bottomBar'
  // | 'guideRail'
  // | 'sidePlate'
  // | 'roller'
  // | 'motor'
  // | 'motorAccessories'
  // | 'headBox';

  // 捲軸

  // TODO 尺寸
  private _com_roller_size = '999';
  get com_roller_size() {
    // return this.comList.roller.size;
    return this._com_roller_size;
  }
  set com_roller_size(str) {
    this._com_roller_size = str;
    this.forceUpdate();
  }

  // private _com_roller_spec = false;
  get rollerSpec() {
    return this._prod.rollerSpec;
  }
  set rollerSpec(str) {
    this._prod.rollerSpec = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 捲箱

  // 材質
  get com_headBox_material() {
    return this.comList.headBox.material;
  }
  set com_headBox_material(str) {
    this.comList.headBox.material = str;
    this.forceUpdate();
  }

  // 厚度
  get headBoxThickness() {
    return String(this._prod.headBoxThickness);
  }
  set headBoxThickness(str) {
    this._prod.headBoxThickness = Number(str);
    this.forceUpdate();
  }

  // 表面
  get com_headBox_surface() {
    return this.comList.headBox.materialSurface;
  }
  set com_headBox_surface(str) {
    this.comList.headBox.materialSurface = str;
    this.forceUpdate();
  }

  // TODO 正面
  private _com_headBox_front = '無';
  get com_headBox_front() {
    // return this.comList.headBox.front;
    return this._com_headBox_front;
  }
  set com_headBox_front(str) {
    this._com_headBox_front = str;
    this.forceUpdate();
  }

  // TODO 有無凸
  private _com_headBox_spec = '無';
  get com_headBox_spec() {
    // return this.comList.headBox.spec;
    return this._com_headBox_spec;
  }
  set com_headBox_spec(str) {
    this._com_headBox_spec = str;
    this.forceUpdate();
  }

  // TODO 捲箱型式 在主產品是boolean
  private _com_headBox_type = '捲箱999';
  get com_headBox_type() {
    // return this.comList.headBox.type;
    return this._com_headBox_type;
  }
  set com_headBox_type(str) {
    this._com_headBox_type = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 底座

  // 材質
  get com_bottomBar_material() {
    return this.comList.bottomBar.material;
  }
  set com_bottomBar_material(str) {
    this.comList.bottomBar.material = str;
    this.forceUpdate();
  }

  // 角鐵材質
  get bottomBarAngleIron() {
    return this._prod.bottomBarAngleIron;
  }
  set bottomBarAngleIron(str) {
    this._prod.bottomBarAngleIron = str;
    this.forceUpdate();
  }

  // 底座板材質
  get bottomBarPlate() {
    return this._prod.bottomBarPlate;
  }
  set bottomBarPlate(str) {
    this._prod.bottomBarPlate = str;
    this.forceUpdate();
  }

  // 型式
  get bottomBar() {
    return this._prod.bottomBar;
  }
  set bottomBar(str) {
    this._prod.bottomBar = str;
    this.forceUpdate();
  }

  // TODO 表面
  private _com_bottomBar_surface = '無';
  get com_bottomBar_surface() {
    // return this.comList.bottomBar.surface;
    return this._com_bottomBar_surface;
  }
  set com_bottomBar_surface(str) {
    this._com_bottomBar_surface = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 支版
  get sidePlateTip() {
    return '馬達荷重(max:500,min:600),馬力數:2Hp';
  }

  // TODO 軸承
  private _com_sidePlate_bearing = '9999#';
  get com_sidePlate_bearing() {
    // return this.comList.sidePlate.bearing;
    return this._com_sidePlate_bearing;
  }
  set com_sidePlate_bearing(str) {
    this._com_sidePlate_bearing = str;
    this.forceUpdate();
  }

  // TODO 鍊條
  private _com_sidePlate_chain = '999#';
  get com_sidePlate_chain() {
    // return this.comList.sidePlate.chain;
    return this._com_sidePlate_chain;
  }
  set com_sidePlate_chain(str) {
    this._com_sidePlate_chain = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 門片 slat

  // 材質
  get com_slat_material() {
    return this.comList.slat.material;
  }
  set com_slat_material(str) {
    this.comList.slat.material = str;
    this.forceUpdate();
  }

  // 表面
  get com_slat_surface() {
    return this.comList.slat.materialSurface;
  }
  set com_slat_surface(str) {
    this.comList.slat.materialSurface = str;
    this.forceUpdate();
  }

  // 門片厚度
  get thickness() {
    return String(this._prod.thickness);
  }

  // --------------------------------------------------------------

  // 電動機 motor

  // 馬力數
  get horsepower() {
    return this._prod.horsepower;
  }
  set horsepower(str) {
    this._prod.horsepower = str;
    this.forceUpdate();
  }
  //廠商
  get motorVendor() {
    return this._prod.motorVendor;
  }
  set motorVendor(str) {
    this._prod.motorVendor = str;
    this.toSetDefaultBoxB();
    this.forceUpdate();
  }

  // 電供
  get motorPhase() {
    return String(this._prod.motorPhase);
  }
  set motorPhase(str) {
    this._prod.motorPhase = Number(str);
    this.forceUpdate();
  }

  // 電壓
  get motorVoltage() {
    return String(this._prod.motorVoltage);
  }
  set motorVoltage(str) {
    this._prod.motorVoltage = Number(str);
    this.forceUpdate();
  }

  // 支撐架
  get hasMotorSupportStand() {
    return this._prod.hasMotorSupportStand;
  }
  set hasMotorSupportStand(str) {
    this._prod.hasMotorSupportStand = str;
    this.forceUpdate();
  }

  // TODO 鍊條型式
  private _com_motor_chainType = '';
  get com_motor_chainType() {
    // return this.comList.motor.chain;
    return this._com_motor_chainType;
  }
  set com_motor_chainType(str) {
    this._com_motor_chainType = str;
    this.forceUpdate();
  }

  // 鎖盒
  get motorLockBox() {
    return this._prod.motorLockBox;
  }
  set motorLockBox(str) {
    this._prod.motorLockBox = str;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  // 門軌 guideRail

  // 材質
  get com_guideRail_material() {
    return this.comList.guideRail.material;
  }
  set com_guideRail_material(str) {
    this.comList.guideRail.material = str;
    this.forceUpdate();
  }

  // 厚度

  get guideRailThickness() {
    return String(this._prod.guideRailThickness);
  }
  set guideRailThickness(str) {
    this._prod.guideRailThickness = Number(str);
    this.forceUpdate();
  }

  // TODO 表面
  private _com_guideRail_surface = '無';
  get com_guideRail_surface() {
    // return this.comList.guideRail.surface;
    return this._com_guideRail_surface;
  }
  set com_guideRail_surface(str) {
    this._com_guideRail_surface = str;
    this.forceUpdate();
  }

  // 消音條
  get hasSilencingStrip() {
    return this._prod.hasSilencingStrip;
  }
  set hasSilencingStrip(str) {
    this._prod.hasSilencingStrip = str;
    this.forceUpdate();
  }

  // TODO 型式
  private _com_guideRail_type = '';
  get com_guideRail_type() {
    // return this.comList.guideRail.type;
    return this._com_guideRail_type;
  }
  set com_guideRail_type(str) {
    this._com_guideRail_type = str;
    this.forceUpdate();
  }

  // 型式02
  get guideRail() {
    return this._prod.guideRail;
  }
  set guideRail(str) {
    this._prod.guideRail = str;
    this.forceUpdate();
  }
  // ----------------------------------------------------
  // ----------------------------------------------------

  get acceNameArr() {
    return this._acceIdArr;
  }

  set acceNameArr(arr) {
    this._acceIdArr = arr;
    this.forceUpdate();
  }

  // --------------------------------------------------------------

  //
} // Class_workSheet close

export { Class_workSheet as Class_workSheet };

import _ from 'lodash';
import Decimal from 'decimal.js';
import { AxiosError } from 'axios';

// gear
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

// api
import { apiGetQuotationProducts } from 'js/api/api_quotation';
import {
  TpacParams,
  TdoorComponentListDto,
  TdoorModelInfoDto,
  TgenerateDoorProductBomDto,
  TdoorAccessoryDto,
  TdoorGeneralSpecsDto,
  apiGetProdAccessories,
  apiGetProdCalcGeneralSpec,
  apiPostProdGenerateDoorProductBom,
  apiGetProdCalcDetailSpec,
  apiGetProdAvailableComponents,
  // apiGetProdAvailableComponents,
} from 'js/api/api_product';

// type
import { TforceUpdate_workSheet } from './useSheet';
import {
  TquotationProductDto,
  TupdateWorkSheetItem,
  TquotationProductItemDto,
  TquotationProductComponentsDto,
} from 'js/api/dtoTypes';

// config
import { lookup_boxBAndBoxD } from 'config/product/lookup';

// utils
import { calcProductArea, calcProductVolume, calcProductWG, findBDoptions } from 'js/utils/product/calc';

// options
import { Toption, optionsCreator_componentMaterial_01 } from 'js/utils/options/productOptions';

// ======================================================================
class Class_workSheet {
  constructor({
    forceUpdate,
    prod,
    itemIdArr, // itemIdArr裝的是被這個class代表的item的id，
    // 未來若分堆需求，oldProd可能會要是未被修改的資料
    // 這樣可以取父prod的oldProd放進來，prod則是父prod的資料
    oldProd,
    identifyKey_p,
    identifyKey_c,
    addSheet,
    deleteSheet,
    clearSheet,
  }: {
    //
    // forceUpdate: (props?: { isNoChange?: boolean }) => void;
    forceUpdate: TforceUpdate_workSheet;
    prod: TquotationProductItemDto | TupdateWorkSheetItem;
    itemIdArr: string[];
    oldProd: TquotationProductItemDto;
    identifyKey_p: string;
    identifyKey_c: string;
    //
    addSheet: (params: {
      item: TquotationProductItemDto | TupdateWorkSheetItem;
      oldItem: TquotationProductItemDto;
      pKey: string;
      cKey: string;
      itemIdArr: string[];
    }) => void;
    deleteSheet: () => void;
    clearSheet: () => void;
  }) {
    this.forceUpdate = forceUpdate;
    this._prod = _.cloneDeep(prod);
    this.oldProd = oldProd;
    this._itemIdArr = itemIdArr;
    this.identifyKey_p = identifyKey_p;
    this.identifyKey_c = identifyKey_c;
    this._addSheet = addSheet;
    this._deleteSheet = deleteSheet;
    this._clearSheet = clearSheet;

    if (this.identifyKey_p === this.identifyKey_c) {
      this._originalIdArr = _.cloneDeep(this._itemIdArr);
    }

    this._fullWidth_str = String(this._prod.fullWidth / 1000);
    this._height_str = String(this._prod.height / 1000);

    //
    const comKeyArr: TquotationProductComponentsDto['type'][] = [
      'slat',
      'bottomBar',
      'guideRail',
      'sidePlate',
      'roller',
      'motor',
      'motorAccessories',
      'headBox',
    ];
    // const comList: { [key: string]: TquotationProductComponentsDto } = {};
    const comList: { [key in TquotationProductComponentsDto['type']]?: TquotationProductComponentsDto } = {};

    this._prod.components.forEach((com) => {
      comList[com.type] = com;
    });

    comKeyArr.forEach((key) => {
      if (!comList[key]) {
        comList[key] = creEmptyCom(key);
      }
    });

    this.comList = comList as { [key in TquotationProductComponentsDto['type']]: TquotationProductComponentsDto };

    // 暫時先放進name，在getAccessoriesArr會改成放進id
    this._acceIdArr = this._prod.accessories.map((item) => item.name);

    this.findBoxBoptions();
  } //  constructor close

  // ---------------------------------------------------------------------

  private _prod: TquotationProductItemDto | TupdateWorkSheetItem;
  readonly oldProd: TquotationProductItemDto;
  private forceUpdate: TforceUpdate_workSheet;
  private _itemIdArr: string[];
  readonly identifyKey_p: string;
  readonly identifyKey_c: string;
  private _addSheet;
  private _deleteSheet;
  private _clearSheet;

  private _originalIdArr: string[] | undefined = undefined;

  private _deleteIdList: { [key: string]: string[] } = {};

  // ---------------------------------------------------------------------

  private comList: { [key in TquotationProductComponentsDto['type']]: TquotationProductComponentsDto };
  private _acceIdArr: string[];

  private _accessoriesOptionArr: TdoorAccessoryDto[] = [];
  private _accessoriesOptionList: { [key: string]: TdoorAccessoryDto } = {};
  private _accessoriesOptionArr_easy: { value: string; label: string }[] = [];

  private _prodSpec: TdoorGeneralSpecsDto | undefined = undefined;
  private _prodDetailSpec: { slatCount: number } | undefined = undefined;

  private _availableComponents: TdoorComponentListDto | undefined = undefined;

  // ---------------------------------------------------------------------
  options_com = optionsCreator_componentMaterial_01();
  options_com_valueArr = Object.values(this.options_com).map((item) => item.value);
  options_boxB: { value: string; label: string }[] = [];
  // 下面這六個會經由執行retrieveOptions()來設定
  options_horsepower: Toption[] | undefined = undefined;
  options_motor: Toption[] | undefined = undefined;
  options_phase: Toption[] | undefined = undefined;
  options_voltage: Toption[] | undefined = undefined;
  options_rollUpBoxThick: Toption[] | undefined = undefined;
  options_doorTrackThick: Toption[] | undefined = undefined;
  //
  // options_boxB: Toption[] | undefined = undefined;
  // options_boxD: Toption[] | undefined = undefined;
  // ---------------------------------------------------------------------
  private _defaultBoxB = 0;
  private _fullWidth_str = '';
  private _height_str = '';
  // ---------------------------------------------------------------------

  async getAccessoriesArr() {
    this._accessoriesOptionArr = [];

    let res: TdoorAccessoryDto[] | undefined = undefined;

    try {
      res = await apiGetProdAccessories({ modelName: this.doorModelName });
    } catch (error) {
      const err = error as { response: { data: { message: string; statusCode: number } } };
      const { message, statusCode } = err.response.data;
      myAlert.err({ title: '取得選配列表失敗', content: statusCode + ' ' + message });
    }

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

      this._accessoriesOptionList = list;
      this._acceIdArr = arr;
    }

    this.forceUpdate({ isNoChange: true });
  }

  async getProdSpec() {
    if (!this._prod.fullWidth) {
      myAlert.info({ title: '全寬不可為0' });

      return undefined;
    }

    try {
      const res = await apiGetProdCalcGeneralSpec({
        modelName: this.doorModelName as TdoorModelInfoDto['name'],
        height: this._prod.height,
        isAntiTyphoon: this.isAntiTyphoon,
        fullWidth: this._prod.fullWidth,
      });

      if (res) {
        this._prodSpec = res;
        this._prod.sprocketWheelModel = res.sprocketWheelModel;
        this._prod.sprocketWheelTeethNumber = res.sprocketWheelTeethNumber;
        this._prod.bearingInnerDiameter = res.bearingInnerDiameter;
        this._prod.diameter = String(res.diameter);
        this._prod.bearingHousingTotalLength = String(res.bearingHousingTotalLength);

        return res;
      }
    } catch (error) {
      const err = error as { response: { data: { message: string; statusCode: number } } };
      const { message, statusCode } = err.response.data;
      myAlert.err({ title: '取得產品規格失敗', content: statusCode + ' ' + message });
    }
  }

  async getProdDetailSepc() {
    try {
      const res = await apiGetProdCalcDetailSpec({
        modelName: this.doorModelName as TdoorModelInfoDto['name'],
        height: this._prod.height,
        B: this._prod.boxB,
      });

      if (res) {
        this._prodDetailSpec = res;
        this._prod.slatCount = String(res.slatCount);

        return res;
      }
    } catch (error) {
      const err = error as { response: { data: { message: string; statusCode: number } } };
      const { message, statusCode } = err.response.data;
      myAlert.err({ title: '取得產品細節規格失敗', content: statusCode + ' ' + message });
    }
  }

  async getProdAvailableComponents() {
    const rollerDiameter = this._prodSpec?.diameter;

    if (!this.doorModelName || !this._prodSpec?.weight || !rollerDiameter) {
      return false;
    }

    try {
      const res = await apiGetProdAvailableComponents({
        modelName: this.doorModelName as TpacParams['modelName'],
        weight: this._prodSpec.weight,
        isAntiTyphoon: this.isAntiTyphoon,
        rollerDiameter: rollerDiameter,
      });
      this._availableComponents = res;

      this.retrieveOptions();

      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string; status: number }>;

      const { message, status } = err.response?.data ?? {};

      myAlert.err({ title: '取得材料配件失敗', content: status + ' ' + message });

      return false;
    }
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

  changeComMaterial() {
    let material = this.options_com[1].value;

    if (this.options_com_valueArr.includes(this._prod.materialName)) {
      material = this._prod.materialName;
    }

    this.comList.guideRail.material = material;
    this.comList.headBox.material = material;
    this.comList.bottomBar.material = material;
    this.comList.slat.material = material;
  }

  // -------------------------

  // 從_availableComponents撈出主產品下拉式選單的選項
  private retrieveOptions() {
    if (!this._availableComponents) {
      return;
    }

    const { guideRails, motors, headBoxes } = this._availableComponents;

    const horsePowerList: { [key: string]: Toption } = {};
    const motorVendorList: { [key: string]: Toption } = {};
    const phaseList: { [key: string]: Toption } = {};
    const voltageList: { [key: string]: Toption } = {};
    const headBoxThickList: { [key: string]: Toption } = {};
    const railThickList: { [key: string]: Toption } = {};

    motors.forEach((item) => {
      const { horsePower, motorVendor, phase, voltage } = item;

      if (horsePower) {
        horsePowerList[horsePower] = {
          value: horsePower,
          label: horsePower,
        };
      }

      if (motorVendor) {
        motorVendorList[motorVendor] = {
          value: motorVendor,
          label: motorVendor,
        };
      }

      if (phase) {
        phaseList[phase] = {
          value: String(phase),
          // label: phase === 1 ? '單相' : phase === 3 ? '三相' : '未知資料',
          label: phase === 1 ? '1' : phase === 3 ? '3' : '未知資料',
        };
      }

      if (voltage) {
        voltageList[voltage] = {
          value: String(voltage),
          label: voltage === 220 ? '220V' : voltage === 380 ? '380V' : '未知資料',
        };
      }
    });

    headBoxes.forEach((item) => {
      const { thickness } = item;

      if (thickness) {
        headBoxThickList[thickness] = {
          value: String(thickness),
          label: String(thickness),
        };
      }
    });

    guideRails.forEach((item) => {
      const { thickness } = item;

      if (thickness) {
        railThickList[thickness] = {
          value: String(thickness),
          label: String(thickness),
        };
      }
    });

    if (Object.keys(horsePowerList).length > 0) {
      this.options_horsepower = Object.values(horsePowerList);
    } else {
      this.options_horsepower = undefined;
    }

    if (Object.keys(motorVendorList).length > 0) {
      this.options_motor = Object.values(motorVendorList);
    } else {
      this.options_motor = undefined;
    }

    if (Object.keys(phaseList).length > 0) {
      this.options_phase = Object.values(phaseList);
    } else {
      this.options_phase = undefined;
    }

    if (Object.keys(voltageList).length > 0) {
      this.options_voltage = Object.values(voltageList);
    } else {
      this.options_voltage = undefined;
    }

    if (Object.keys(headBoxThickList).length > 0) {
      this.options_rollUpBoxThick = Object.values(headBoxThickList);
    } else {
      this.options_rollUpBoxThick = undefined;
    }

    if (Object.keys(railThickList).length > 0) {
      this.options_doorTrackThick = Object.values(railThickList);
    }
  } // retrieveOptions

  // -------------------------

  async calcProd() {
    const prodSpec = await this.getProdSpec();

    if (!prodSpec) {
      return;
    }

    // 計算出WG
    this._prod.WG = calcProductWG({
      fullWidth: this._prod.fullWidth,
      gapA: prodSpec.gapA,
      gapC: prodSpec.gapC,
    });

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

    this.changeComMaterial();
    this.getProdDetailSepc();
    this.getProdAvailableComponents();
    this.forceUpdate();

    //
    //
  }

  async getInitData() {
    if (this.accessoriesOptionArr.length === 0) {
      this.getAccessoriesArr();
    }

    if (this._prodDetailSpec === undefined) {
      this.getProdDetailSepc();
    }

    if (this._prodSpec === undefined) {
      await this.getProdSpec();
    }

    if (this._availableComponents === undefined) {
      this.getProdAvailableComponents();
    }

    this.forceUpdate({ isNoChange: true });
  }

  // ---------------------------------------------------------------------

  get isOriginal() {
    return this.identifyKey_p === this.identifyKey_c;
  }

  get productId() {
    return this._prod.productId;
  }
  get adjustedItemId() {
    return this._prod.adjustedItemId;
  }

  get itemIdArr() {
    return this._itemIdArr;
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

  get prodDetailSpec() {
    return this._prodDetailSpec;
  }

  get adjustedId() {
    return this._prod.adjustedItemId;
  }

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
    return this._fullWidth_str;
  }
  set fullWidth(str) {
    this._fullWidth_str = str;
    this._prod.fullWidth = Number(this._fullWidth_str) * 1000;
    this.calcArea();
    this.forceUpdate();
  }

  get fullWidth_mm() {
    return String(this._prod.fullWidth);
  }

  get WG() {
    return String(this._prod.WG / 1000);
  }
  get WG_mm() {
    return String(this._prod.WG);
  }

  get BD() {
    return new Decimal(this._prod.boxB).mul(this._prod.boxD ?? 0).toString();
  }

  get height() {
    return this._height_str;
  }
  set height(str) {
    this._height_str = str;
    this._prod.height = Number(this._height_str) * 1000;
    this.calcArea();
    this.forceUpdate();
  }

  get height_mm() {
    return String(this._prod.height);
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

  get boxB_mm() {
    return String(this._prod.boxB);
  }

  get boxD_mm() {
    return String(this._prod.boxD);
  }

  get quantity() {
    return String(this._itemIdArr.length);
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
    // this.changeComMaterial();
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

  get fullHeight() {
    return String(this._prod.height + this._prod.boxB);
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

  // 電相
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

  // 電供
  get motorPhaseVoltage() {
    let phaseStr = '';

    if (this._prod.motorPhase === 1) {
      phaseStr = '單相';
    } else if (this._prod.motorPhase === 3) {
      phaseStr = '三相';
    }

    return `${phaseStr} ${this._prod.motorVoltage}V`;
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
  // get guideRail() {
  //   return this._prod.guideRail;
  // }
  set guideRail(option: Toption | null) {
    const str = option?.value ?? '';
    const opening = option?.opening ?? '';

    this._prod.guideRail = str;
    this._prod.guideRailsOpening = opening;
    this.forceUpdate();
  }

  get guideRailName() {
    return this._prod.guideRail;
  }
  // ----------------------------------------------------

  get slatCount() {
    return this._prod.slatCount;
  }
  get sprocketWheelModel() {
    return this._prod.sprocketWheelModel;
  }
  get sprocketWheelTeethNumber() {
    return this._prod.sprocketWheelTeethNumber;
  }
  get bearingInnerDiameter() {
    return this._prod.bearingInnerDiameter;
  }
  get diameter() {
    return this._prod.diameter;
  }
  get bearingHousingTotalLength() {
    return this._prod.bearingHousingTotalLength;
  }
  get guideRailsOpening() {
    return this._prod.guideRailsOpening;
  }

  get isAccessoriesReady() {
    const arr = Object.keys(this._accessoriesOptionList);

    return arr.length > 0;
  }

  // ----------------------------------------------------
  // ----------------------------------------------------

  get acceIdArr() {
    return this._acceIdArr;
  }

  set acceIdArr(arr) {
    this._acceIdArr = arr;
    this.forceUpdate();
  }

  get acceNameArr() {
    if (Object.keys(this._accessoriesOptionList).length === 0) {
      return this._acceIdArr;
    }

    return this._acceIdArr.map((id) => {
      return this._accessoriesOptionList[id]?.name ?? '';
    });
  }

  // --------------------------------------------------------------

  /**將這個items分堆 */
  divideItem(qty: number) {
    if (qty < 1) {
      return myAlert.info({ title: '分堆數量不可小於1' });
    }

    if (qty > Number(this.quantity)) {
      return myAlert.info({ title: '分堆數量大於原本數量' });
    }

    const theItem = this.bodyItemArr[0];
    theItem.itemName = `${theItem.itemName}-new`;

    const itemIdArr = this._itemIdArr.reverse().splice(0, qty);

    this._addSheet({
      item: theItem,
      oldItem: this.oldProd,
      pKey: this.identifyKey_p,
      cKey: itemIdArr[0],
      itemIdArr: itemIdArr,
    });

    if (this._itemIdArr.length <= 0 && !this.isOriginal) {
      this._deleteSheet();
    }

    this.forceUpdate({ isNoChange: true });
  }

  clearSheet() {
    if (this.isOriginal) {
      alert('原始item不應該清除');
    }

    this._clearSheet();
    this._itemIdArr = [];
    this.forceUpdate({ isNoChange: true });
  }

  gatherBack({ itemIdArr, adjustedItemId }: { itemIdArr: string[]; adjustedItemId?: string | null }) {
    this._itemIdArr = [...this._itemIdArr, ...itemIdArr];

    if (adjustedItemId) {
      if (!this._deleteIdList[adjustedItemId]) {
        this._deleteIdList[adjustedItemId] = [];
      }

      this._deleteIdList[adjustedItemId] = [...this._deleteIdList[adjustedItemId], ...itemIdArr];
    }

    this.forceUpdate();
  }

  get idListShouldDelete() {
    this._originalIdArr;
    this._itemIdArr;

    const arr = _.difference(this._itemIdArr, this._originalIdArr ?? []);

    Object.keys(this._deleteIdList).forEach((pKey) => {
      const delIdArr = this._deleteIdList[pKey];

      delIdArr.forEach((delId, index) => {
        if (!arr.includes(delId)) {
          // delete this._deleteIdList[pKey][cKey];
          // delete this._deleteIdList[pKey][cKey];
          this._deleteIdList[pKey].splice(index, 1);
        }
      });
    });

    return this._deleteIdList;
  }

  // --------------------------------------------------------------

  get bodyItemArr(): TupdateWorkSheetItem[] {
    const componentArr = Object.values(this.comList);

    const accessories: TupdateWorkSheetItem['accessories'] = this._acceIdArr.map((id) => {
      const acce = this._accessoriesOptionList[id] ?? {};

      const acceBody: TupdateWorkSheetItem['accessories'][number] = {
        codeName: '', //代號
        name: acce.name, //名稱
        unit: acce.unit ?? '', // 單位
        quantity: 0, // 數量
        price: acce.price ?? 0, // 牌價
        unitPrice: acce.price ?? 0, // 單價
        totalPrice: 0, // 複價
        dualPrice: 0, // 牌價複價
        order: 0,
        referenceSpec: acce.referenceSpec,
        originalPrice: acce.price ?? 0,
      };

      return acceBody;
    });

    // contractProductItems
    return this._itemIdArr.map((id) => {
      const item: TupdateWorkSheetItem = {
        // ...this._prod,
        // id: id,
        // guideRailThickness: this.guideRailThickness,
        // headBoxThickness: this.headBoxThickness,
        // components: componentArr,
        // accessories,
        // adjustedItem: undefined,
        // adjustedItemId: undefined,
        id: id,
        itemNumber: this._prod.itemNumber,
        itemName: this._prod.itemName,
        discount: this._prod.discount,
        quoteType: this._prod.quoteType,
        doorModelName: this._prod.doorModelName,
        fullWidth: this._prod.fullWidth,
        WG: this._prod.WG,
        height: this._prod.height,
        boxB: this._prod.boxB,
        area: this._prod.area,
        volume: this._prod.volume,
        materialName: this._prod.materialName,
        materialSurface: this._prod.materialSurface,
        guideRail: this._prod.guideRail,
        horsepower: this._prod.horsepower,
        motorVendor: this._prod.motorVendor,
        motorVoltage: this._prod.motorVoltage,
        hasMotorSupportStand: this._prod.hasMotorSupportStand,
        bottomBar: this._prod.bottomBar,
        motorLockBox: this._prod.motorLockBox,
        guideRailThickness: this.guideRailThickness,
        rollerSpec: this._prod.rollerSpec,
        hasSilencingStrip: this._prod.hasSilencingStrip,
        isIntegratedHeadBox: this._prod.isIntegratedHeadBox,
        headBoxThickness: this.headBoxThickness,
        unitPrice: this._prod.unitPrice,
        totalPrice: this._prod.totalPrice,
        price: this._prod.price,
        dualPrice: this._prod.dualPrice,
        isAntiTyphoon: this._prod.isAntiTyphoon,
        bounceDoor: this._prod.bounceDoor,
        closingType: this._prod.closingType,
        notes: this._prod.notes,
        motorPhase: this._prod.motorPhase,
        bottomBarAngleIron: this._prod.bottomBarAngleIron,
        bottomBarPlate: this._prod.bottomBarPlate,
        productId: this._prod.productId,
        worksheetId: this._prod.worksheetId,
        others: this._prod.others,
        components: componentArr,
        accessories: accessories,
        adjustedItem: undefined,
        adjustedItemId: undefined,
        //
        slatCount: this._prod.slatCount,
        sprocketWheelModel: this._prod.sprocketWheelModel,
        sprocketWheelTeethNumber: this._prod.sprocketWheelTeethNumber,
        bearingInnerDiameter: this._prod.bearingInnerDiameter,
        diameter: this._prod.diameter,
        bearingHousingTotalLength: this._prod.bearingHousingTotalLength,
        guideRailsOpening: this._prod.guideRailsOpening,
        //
        thickness: this._prod.thickness,
        boxD: this._prod.boxD,
      };

      return item;
    });
  }

  //
} // Class_workSheet close

export { Class_workSheet as Class_workSheet };

// ======================================================================

const creEmptyCom = (type: TquotationProductComponentsDto['type']): TquotationProductComponentsDto => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  type: type,
  number: '',
  componentId: '',
  rawData: {},
  bom: undefined,
  material: '',
  materialSurface: undefined,
  isPainted: false,
  price: 0,
  quantity: '0',
  order: 0,
  desc: null,
  density: null,
});

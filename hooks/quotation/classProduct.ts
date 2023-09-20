import _, { set } from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { optionsCre_doorTrack_normal, optionsCre_doorTrack_typhoonProtection } from 'js/utils/options/doorTrackOptions';
import { optionsCreator_doorModel, optionsCreator_quoteType } from 'js/utils/options/productOptions';

const options_doorTrack_normal = optionsCre_doorTrack_normal();
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection();

// ===========================================================
// child class
import { Class_accessory, Taccessory } from './classAccessory';
// =============================================================================
// api
import { apiGetProdCalcGeneralSpec, apiGetProdAvailableComponents } from 'js/api/api_product';
// =============================================================================
// type
import type {
  TlegacyContractProductDto,
  TcreateLegacyContractProductDto,
  TdoorComponentListDto,
} from 'js/api/dtoTypes';
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';
import type { TdoorModelInfoDto } from 'js/api/api_product';
import type { TpcgsPrams, TpacParams, TdoorGeneralSpecsDto } from 'js/api/api_product';

// =============================================================================
class Class_product {
  constructor({
    reRender,
    prodData = emptyProdOri(),
    accessoryDataArr = [],
    delSelf,
    copySelf,
    //
    calcProdSubTotalPrice,
    // from api
    doorModelList,
  }: {
    reRender: TreRender;
    prodData?: Tprod;
    accessoryDataArr?: Taccessory[];
    delSelf: () => void;
    copySelf: () => void;
    //
    calcProdSubTotalPrice: () => void;
    // from api
    doorModelList: { [key: string]: TdoorModelInfoDto };
  }) {
    this.reRender = reRender;
    this._prodData = _.cloneDeep(prodData);
    this.delSelf = delSelf;
    this.copySelf = copySelf;
    //
    this._calcProdSubTotalPrice = calcProdSubTotalPrice;
    // from api
    this._doorModelList = doorModelList;
    //
    this._quantity = String(this._prodData.quantity);
    this._listPrice = String(this._prodData.listPrice);
    this._listPriceTotal = String(this._prodData.listPriceTotal);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);

    // ----------------------------------------------------
    /**
     * 這些都要從TdoorComponentListDto抽出資料作為下拉式選單的選項
     * gearNumber
     * 捲箱厚度
     * 門軌厚度
     *
     * 這些可能也要
     * phase
     * voltage
     * motorVendor
     *
     */
    // ----------------------------------------------------

    //
    // ___________________________________________________________
    // accessoryDataArr.forEach((data, index) => {
    // const id = index;
    // this._acceList[`${id}`] = new Class_accessory({
    //   reRender,
    //   delSelf,
    //   // copySelf,
    // });
    // });
    // ___________________________________________________________
  } //  constructor close

  private reRender;
  readonly delSelf;
  readonly copySelf;
  //
  readonly _calcProdSubTotalPrice;
  // from api
  // 門型資料
  private _doorModelList;
  private _doorGeneralSpecs: TdoorGeneralSpecsDto | undefined;
  private _availableComponents: TdoorComponentListDto | undefined;
  // private _boxB: number | undefined;
  //
  private _prodData;
  private _quantity;
  private _listPrice;
  private _listPriceTotal;
  private _unitPrice;
  private _totalPrice;

  readonly options_doorTrack_normal = options_doorTrack_normal;
  readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;
  // ---------------------------------------------------------
  // _acceList: { [key: string]: Taccessory } = {};
  // get acceList() {
  //   return this._acceList;
  // }

  AcceList: { [key in keyof TdoorComponentListDto]: Class_accessory | null } | undefined;

  creAcceList(dataList: { [key in keyof TdoorComponentListDto]: Taccessory | undefined | null }) {
    const keyArr = Object.keys(dataList) as (keyof TdoorComponentListDto)[];

    const list: { [key: string]: Class_accessory } = {};

    keyArr.forEach((key) => {
      const acce = dataList[key];

      if (!acce) {
        return null;
      }

      const theClass = new Class_accessory({
        reRender: this.reRender,
        data: acce,
      });

      return theClass;
    });

    this.AcceList = list as { [key in keyof TdoorComponentListDto]: Class_accessory | null };
    this.reRender();
  }

  // ---------------------------------------------------------

  // 防抖
  cgsTimeout: NodeJS.Timeout | null = null;
  pacTimeout: NodeJS.Timeout | null = null;

  req_calcGeneralSpec() {
    const req = async () => {
      if (!this.doorModel || !this.height) {
        return;
      }

      if (!this.length && !this.width) {
        return;
      }

      const body = (() => {
        let fullWidth: number | undefined;
        let WG: number | undefined;

        if (Number(this.length)) {
          fullWidth = Number(this.length) * 1000;
        } else if (Number(this.width)) {
          WG = Number(this.width) * 1000;
        }

        return {
          modelName: this.doorModel as TpcgsPrams['modelName'],
          fullHeight: Number(this.height) * 1000,
          fullWidth,
          WG,
        };
      })();

      if (!body.fullWidth && !body.WG) {
        return;
      }

      const res = await apiGetProdCalcGeneralSpec(body as TpcgsPrams);

      if (!res) {
        return;
      }

      //
      const defaultMotorIndex = res.defaultMotorIndex;
      const defaultMotor = res.motors[defaultMotorIndex];
      const defaultMotorBox = defaultMotor.box;
      // ________________________
      // 設定馬力
      this.horsepower = defaultMotor.hp;

      // ________________________
      // 設定boxB與thickness
      // 後端說boxB只會在defaultMotorIndex指定的motors裡面會有
      // !!!!!!! 跟經理確認thickness跟B(m)是什麼 !!!!!!!!!
      const boxB = defaultMotorBox?.default?.boxB || defaultMotorBox?.東元?.boxB || defaultMotorBox?.大同?.boxB;
      this.B = String(boxB);
      this.thickness = res.thickness;

      // ________________________
      // 設定馬達廠商
      if (defaultMotorBox) {
        if (defaultMotorBox.東元) {
          this.motorVendor = '東元';
          this.B = String(defaultMotorBox.東元.boxB);
        } else if (defaultMotorBox.大同) {
          this.motorVendor = '大同';
          this.B = String(defaultMotorBox.大同.boxB);
        } else if (defaultMotorBox.default) {
          this.B = String(defaultMotorBox.default.boxB);
        }
      }

      // ________________________

      // getProdAvailableComponent用的weight與rollerDiameter來自doorGeneralSpecs
      if (
        //
        this._doorGeneralSpecs?.weight !== res.weight ||
        this._doorGeneralSpecs?.diameter !== res.diameter
      ) {
        this._doorGeneralSpecs = res;
        this.req_getProdAvailableComponents();
      } else {
        this._doorGeneralSpecs = res;
      }

      this.reRender();
    }; // req

    if (this.cgsTimeout) {
      clearTimeout(this.cgsTimeout);
    }

    this.cgsTimeout = setTimeout(() => {
      req();
    }, 500);
  } // calcGeneralSpec

  // ________________________
  req_getProdAvailableComponents() {
    const req = async () => {
      const rollerDiameter = this._doorGeneralSpecs?.diameter;

      if (!this.doorModel || !this.weight || !rollerDiameter) {
        return;
      }

      const res = await apiGetProdAvailableComponents({
        modelName: this.doorModel as TpacParams['modelName'],
        weight: this.weight,
        isAntiTyphoon: this.typhoonProtection,
        rollerDiameter: rollerDiameter,
      });

      if (!res) {
        return;
      }

      this._availableComponents = res;
      this.retrieveOptions();

      this.reRender();
    }; // req

    if (this.pacTimeout) {
      clearTimeout(this.pacTimeout);
    }

    setTimeout(() => {
      req();
    }, 500);
  } //  req_getProdAvailableComponents

  // ---------------------------------------------------------

  retrieveCreProdAcce() {
    if (!this._availableComponents || !this.weight) {
      return;
    }

    const availableComponents = this._availableComponents;

    const slats = filter_slats({
      //
      dataArr: availableComponents.slats,
      filterParams: { isAntiTyphoon: this.typhoonProtection },
    });

    const bottomBars: Taccessory | null = filter_bottomBars({
      dataArr: availableComponents.bottomBars,
      filterParams: {
        isAntiTyphoon: this.typhoonProtection,
        isWaterProof: this.bottomBar === '止水型',
        hasAluminumBarrier: this.bottomBar === '鋁障感型',
      },
    });

    const guideRails: Taccessory | null = filter_guideRails({
      dataArr: availableComponents.guideRails,
      filterParams: {
        isAntiTyphoon: this.typhoonProtection,
        thickness: this.thickness,
        hasSilencingStrip: this.hasSilencingStrip,
      },
    });

    const motors: Taccessory | null = filter_motors({
      dataArr: availableComponents.motors,
      filterParams: {
        horsePower: this.horsepower,
        // gearNumber: this., // DuST說先略過
        motorVendor: this.motorVendor,
        phase: Number(this.phase),
        voltage: Number(this.voltage),
        loadWeight: this.weight,
        hasSupportStand: this.hasSupportStand,
      },
    });

    const sidePlates: Taccessory | null = filter_sidePlates({
      dataArr: availableComponents.sidePlates,
      filterParams: {
        bearingType: this._doorGeneralSpecs?.bearingName, // 從doorGeneralSpecs取得
        gearNumber: motors?.gearNumber, // 從上面的motor取得
        isIntegrated: this.isIntegrated,
        motorVendor: this.motorVendor,
        weight: this.weight,
      },
    });

    const rollers: Taccessory | null = filter_rollers({
      dataArr: availableComponents.rollers,
      filterParams: {
        diameter: String(this._doorGeneralSpecs?.diameter ?? ''),
      },
    });

    const motorAccessories: Taccessory | null = filter_motorAccessories({
      dataArr: availableComponents.motorAccessories,
      filterParams: {
        /**鍊條排數 */
        // chains: 0, // 鍊條排數 // 不知道從哪裡取得這個資料
        /**軸承 */ // 從doorGeneralSpecs取資料
        bearingType: this._doorGeneralSpecs?.bearingName || '',
      },
    });

    const headBoxes: Taccessory | null = filter_headBoxes({
      dataArr: availableComponents.headBoxes,
      filterParams: {
        thickness: this.thickness, // 厚度
        /**一體式捲箱 */
        isIntegrated: this.isIntegrated, // 一體式捲箱
      },
    });

    this.creAcceList({
      slats,
      bottomBars,
      guideRails,
      motors,
      sidePlates,
      rollers,
      motorAccessories,
      headBoxes,
    });
  } // retrieveProdComponent

  // ---------------------------------------------------------

  private toSetDefaultBoxB() {
    if (!this._doorGeneralSpecs) {
      return;
    }

    const motorArr = this._doorGeneralSpecs.motors;
    const hp = this.horsepower;
    const vendor = this.motorVendor as '東元' | '大同' | '';
    const defaultMotor = motorArr[this._doorGeneralSpecs.defaultMotorIndex];
    const defaultHP = defaultMotor.hp;
    const box = defaultMotor.box;

    if (hp !== defaultHP || !vendor || !box) {
      return;
    }

    const boxB = box[vendor]?.boxB || box.default?.boxB;

    if (boxB) {
      this.B = String(boxB);
    }
  }

  private countListPriceTotal() {
    const listPriceTotal = Decimal.mul(this._prodData.listPrice, this.quantity).toString();
    this._listPriceTotal = listPriceTotal;
    this._prodData.listPriceTotal = Number(listPriceTotal);
  }

  private countPrice() {
    const listPrice = this.listPrice.replace(/,/g, '') || '0';
    const discountRate = this.discountRate || '0';

    this.unitPrice = Decimal.mul(listPrice, Decimal.div(discountRate, 100)).toString();
  }

  private countTotalPrice() {
    const quantity = this.quantity.replace(/,/g, '') || 0;
    const unitPrice = this.unitPrice.replace(/,/g, '') || 0;
    const total = Decimal.mul(quantity, unitPrice).toString();
    this.totalPrice = total;
  }

  private calcArea = () => {
    const area = Decimal.add(this._prodData.height || '0', this._prodData.thickness || '0') // h+b
      /** "0"被視為true，所以用型別為number的值來計算 */
      .mul(this._prodData.width || this._prodData.length || '0') // *w or *h
      .toFixed(2)
      .toString();

    return area;
  };

  /**計算才數 */
  private calcVolume = () => {
    return Decimal.mul(this.area || 0, 10.89)
      .toFixed(2)
      .toString();
  };

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // 從_availableComponents撈出主產品下拉式選單的選項
  private retrieveOptions() {
    if (!this._availableComponents) {
      return;
    }

    const {
      //
      // slats,
      // bottomBars,
      // guideRails,
      // sidePlates,
      // rollers,
      motors,
      // motorAccessories,
      // headBoxes,
    } = this._availableComponents;

    const horsePowerList: { [key: string]: Toption } = {};
    const motorVendorList: { [key: string]: Toption } = {};
    const phaseList: { [key: string]: Toption } = {};
    const voltageList: { [key: string]: Toption } = {};

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
          label: phase === 1 ? '單相' : phase === 3 ? '三相' : '未知資料',
        };
      }

      if (voltage) {
        voltageList[voltage] = {
          value: String(voltage),
          label: voltage === 220 ? '220V' : voltage === 380 ? '380V' : '未知資料',
        };
      }
    });

    if (Object.keys(horsePowerList).length > 0) {
      this.options_horsepower = Object.values(horsePowerList);
    } else {
      this.options_horsepower = undefined;
    }

    if (Object.keys(motorVendorList).length > 0) {
      this.options_motorVendor = Object.values(motorVendorList);
    } else {
      this.options_motorVendor = undefined;
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
  } // retrieveOptions
  // ---------------------------------------------------------
  // 下拉式選單的選項

  // 這幾個會經由執行retrieveOptions()來設定
  options_horsepower: Toption[] | undefined = undefined;
  options_motorVendor: Toption[] | undefined = undefined;
  options_phase: Toption[] | undefined = undefined;
  options_voltage: Toption[] | undefined = undefined;

  /**門型 options */
  get options_doorModel() {
    return Object.values(this._doorModelList).map((item) => {
      return {
        value: item.name,
        label: item.name,
      };
    });
  }

  /**門片材質 主產品設定的材質 */
  get options_material() {
    const doorModel = this._doorModelList[this.doorModel];

    if (!doorModel) {
      return undefined;
    }

    const arr = doorModel.slatMaterials.map((item) => {
      return {
        value: item.id,
        label: item.name,
      };
    });

    return arr;
  }

  /**門軌 options */
  get options_doorTrack() {
    const doorModel = this._doorModelList[this.doorModel];

    if (!doorModel) {
      return undefined;
    }

    const arr = doorModel.guideRails.map((item) => {
      const imgSrc = item.imgSrc;
      const withHook = item.withHook;

      const option = {
        value: imgSrc,
        label: imgSrc,
        icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
      };

      if (withHook === null || withHook === this.typhoonProtection) {
        return option;
      }

      return undefined;
    });

    _.pull(arr, undefined);

    return arr;
  } // options_doorTrack
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // 來自_doorGeneralSpecs
  get weight() {
    return this._doorGeneralSpecs?.weight;
  }
  // ---------------------------------------------------------

  get discountRate() {
    return this._prodData.discountRate;
  }
  set discountRate(v) {
    if ((v as string) === '') {
      v = '0';
    }

    if (Number(v) > 100) {
      v = '100';
    }

    if (v.split('.')[1]?.length > 2) {
      return;
    }

    this._prodData.discountRate = `${Number(v)}`;
    this.countPrice();
    this.reRender();
  }
  // set discountRate_noLoop(v) {}
  //
  get itemName() {
    return this._prodData.itemName;
  }
  set itemName(v) {
    if (v.length >= 11) {
      v = v.slice(0, 10);
    }

    this._prodData.itemName = v;
    this.reRender();
  }
  //
  get quoteType() {
    return this._prodData.quoteType;
  }
  set quoteType(v) {
    this._prodData.quoteType = v;
    this.reRender();
  }
  //
  get doorModel() {
    return this._prodData.doorModel;
  }

  set doorModel(v) {
    this._prodData.doorModel = v;
    this.req_calcGeneralSpec();
    this.req_getProdAvailableComponents();
    this.reRender();
  }
  /**全寬 */
  get length() {
    return this._prodData.length;
  }
  set length(v) {
    this._prodData.length = v;
    this._prodData.width = '0';
    this.area = this.calcArea();
    this.req_calcGeneralSpec();
    this.reRender();
  }
  /**WG */
  get width() {
    return this._prodData.width;
  }
  set width(v) {
    this._prodData.width = v;
    this._prodData.length = '0';
    this.area = this.calcArea();
    this.req_calcGeneralSpec();
    this.reRender();
  }
  //
  get height() {
    return this._prodData.height;
  }
  set height(v) {
    this._prodData.height = v;
    this.area = this.calcArea();
    this.req_calcGeneralSpec();
    this.reRender();
  }
  //
  // !!!!!!! 跟經理確認thickness跟B(m)是什麼 !!!!!!!!!
  /**B(m) */
  get B() {
    return this._prodData.B;
  }
  set B(v) {
    this._prodData.B = v;
    this.area = this.calcArea();
    this.reRender();
  }
  /**門片厚度 */
  get thickness() {
    return this._prodData.thickness;
  }
  set thickness(v) {
    this._prodData.thickness = v;
    // this.area = this.calcArea();
    this.reRender();
  }

  // !!!!!!! 跟經理確認thickness跟B(m)是什麼 !!!!!!!!!

  //
  get area() {
    return this._prodData.area;
  }
  set area(v) {
    this._prodData.area = v;
    this.volume = this.calcVolume();
    this.reRender();
  }
  //
  /** 才數*/
  get volume() {
    return this._prodData.volume;
  }
  set volume(v) {
    this._prodData.volume = v;
    this.reRender();
  }
  //
  get material() {
    return this._prodData.material;
  }
  set material(v) {
    this._prodData.material = v;
    this.reRender();
  }
  //
  get surface() {
    return this._prodData.surface;
  }
  set surface(v) {
    this._prodData.surface = v;
    this.reRender();
  }

  get doorTrack() {
    return this._prodData.doorTrack;
  }
  set doorTrack(v) {
    this._prodData.doorTrack = v;
    this.reRender();
  }

  get horsepower() {
    return this._prodData.horsepower;
  }
  set horsepower(v) {
    this._prodData.horsepower = v;
    this.toSetDefaultBoxB();
    this.reRender();
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(v) {
    this._prodData.quantity = Number(v);
    this._quantity = v;
    this.countListPriceTotal();
    this.countTotalPrice();
    this.reRender();
  }

  get listPrice() {
    if (!this._listPrice) {
      return '';
    }

    return Number(this._listPrice).toLocaleString();
  }
  set listPrice(v) {
    v = v.replace(/,/g, '');
    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._prodData.listPrice = Number(v);
    this._listPrice = v;
    this.countListPriceTotal();
    this.countPrice();
    this.reRender();
  }

  get listPriceTotal() {
    if (!this._listPriceTotal) {
      return '';
    }

    return Number(this._listPriceTotal).toLocaleString();
  }
  set listPriceTotal(v) {
    // v = v.replace(/,/g, '');
    // const numberRegex = /^(\d+(\.\d+)?|)$/;

    // if (!numberRegex.test(v)) {
    //   return;
    // }

    this._prodData.listPriceTotal = Number(v);
    this._listPriceTotal = v;
    this.countPrice();
    this.reRender();
  }

  get unitPrice() {
    if (!this._unitPrice) {
      return '';
    }

    return Number(this._unitPrice).toLocaleString();
  }
  set unitPrice(v) {
    v = v.replace(/,/g, '');
    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._prodData.unitPrice = Number(v);
    this._unitPrice = v;
    this.countTotalPrice();
    this.reRender();
  }

  get totalPrice() {
    if (!this._totalPrice) {
      return '';
    }

    return Number(this._totalPrice).toLocaleString();
  }

  set totalPrice(v) {
    v = v.replace(/,/g, '');
    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._prodData.totalPrice = Number(v);
    this._totalPrice = v;
    this._calcProdSubTotalPrice();
    this.reRender();
  }

  // 計算總小計用的
  get totalPrice_num() {
    return Number(this._totalPrice);
  }

  get typhoonProtection() {
    return this._prodData.typhoonProtection;
  }
  set typhoonProtection(v) {
    this._prodData.typhoonProtection = v;
    this._prodData.doorTrack = '';
    this.req_getProdAvailableComponents();
    this.reRender();
  }

  get bounceDoor() {
    return this._prodData.bounceDoor;
  }
  set bounceDoor(v) {
    this._prodData.bounceDoor = v;
    this.reRender();
  }

  get notes() {
    return this._prodData.notes;
  }
  set notes(v) {
    this._prodData.notes = v;
    this.reRender();
  }

  //----------------------------------------------------------
  //----------------------------------------------------------
  //----------------------------------------------------------

  get motorVendor() {
    return this._prodData.motorVendor;
  }
  set motorVendor(v) {
    this._prodData.motorVendor = v;
    this.toSetDefaultBoxB();
    this.reRender();
  }
  //
  get voltage() {
    return this._prodData.voltage;
  }
  set voltage(v) {
    this._prodData.voltage = v;
    this.reRender();
  }
  //

  get phase() {
    return this._prodData.phase;
  }
  set phase(v) {
    this._prodData.phase = v;
    this.reRender();
  }

  //
  get hasSupportStand() {
    return this._prodData.hasSupportStand;
  }
  set hasSupportStand(v) {
    this._prodData.hasSupportStand = v;
    this.reRender();
  }
  //
  get bottomBar() {
    return this._prodData.bottomBar;
  }
  set bottomBar(v) {
    this._prodData.bottomBar = v;
    this.reRender();
  }
  //
  get lockBox() {
    return this._prodData.lockBox;
  }
  set lockBox(v) {
    this._prodData.lockBox = v;
    this.reRender();
  }
  //
  get railThick() {
    return this._prodData.railThick;
  }
  set railThick(v) {
    this._prodData.railThick = v;
    this.reRender();
  }
  //
  get rollerType() {
    return this._prodData.rollerType;
  }
  set rollerType(v) {
    this._prodData.rollerType = v;
    this.reRender();
  }
  //
  get hasSilencingStrip() {
    return this._prodData.hasSilencingStrip;
  }
  set hasSilencingStrip(v) {
    this._prodData.hasSilencingStrip = v;
    this.reRender();
  }
  //
  get isIntegrated() {
    return this._prodData.isIntegrated;
  }
  set isIntegrated(v) {
    this._prodData.isIntegrated = v;
    this.reRender();
  }
  //
  get headBoxThick() {
    return this._prodData.headBoxThick;
  }
  set headBoxThick(v) {
    this._prodData.headBoxThick = v;
    this.reRender();
  }
  //
  get openWay() {
    return this._prodData.openWay;
  }
  set openWay(v) {
    this._prodData.openWay = v;
    this.reRender();
  }
  //

  //-----------------------------------------
} // Class_product close

// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================

type Tprod = {
  id?: string;
  order?: string;
  discountRate: `${number}`;
  itemName: string;
  quoteType: string;
  doorModel: string;
  length: string; // L(m)
  width: string; // W(m)
  height: string; //h(m)
  B: string; // B(m)
  thickness: string; // B(m)? 門片厚度?
  area: string; // 面積
  volume: string; // 才數
  material: string;
  surface: string;
  doorTrack: string;
  horsepower: string;
  quantity: number;
  listPrice: number;
  listPriceTotal: number;
  unitPrice: number;
  totalPrice: number;
  typhoonProtection: boolean;
  bounceDoor: boolean;
  notes: string;
  //
  motorVendor: string; // 馬達廠商
  voltage: string; // 電壓
  phase: string; // 相數
  hasSupportStand: boolean; // 馬達支撐架
  bottomBar: string; // 底座類型
  lockBox: string; // 馬達鎖盒
  railThick: string; // 門軌厚度
  rollerType: string; // 捲軸規格
  hasSilencingStrip: boolean; // 門軌消音條
  isIntegrated: boolean; // 一體式捲箱
  headBoxThick: string; // 捲箱厚度
  openWay: string; // 開閉方式
};

type TprodKey = Exclude<keyof Tprod, 'id' | 'order'>;

const prodkeyArrOri: () => TprodKey[] = () => {
  return [
    'discountRate',
    'itemName',
    'quoteType',
    'doorModel',
    'length',
    'width',
    'height',
    'B',
    'thickness',
    'area',
    'volume',
    'material',
    'surface',
    'doorTrack',
    'horsepower',
    'quantity',
    'listPrice',
    'listPriceTotal',
    'unitPrice',
    'totalPrice',
    'typhoonProtection',
    'bounceDoor',
    'notes',
    //
    'motorVendor', // 馬達廠商
    'voltage', // 電壓
    'phase', // 相數
    'hasSupportStand', // 馬達支撐架
    'bottomBar', // 底座類型
    'lockBox', // 馬達鎖盒
    'railThick', // 門軌厚度
    'rollerType', // 捲軸規格
    'hasSilencingStrip', // 門軌消音條
    'isIntegrated', // 一體式捲箱
    'headBoxThick', // 捲箱厚度
    'openWay', // 開閉方式
  ];
};

// type TprodCellConfig = {
//   [key in string]: {
//     label: string;
//     theadItemClassName?: string;
//     inputSelProps: TinputSelProps;
//   };
// };

const prodCellConfig: TcellConfig = {
  discountRate: {
    label: '折數',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  itemName: {
    label: '項目',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      inputProps: {
        props: {},
      },
    },
  },
  quoteType: {
    label: '報價別',
    inputSelProps: {
      wrapperStyle: { width: '105px' },
      selectProps: {
        props: {
          options: optionsCreator_quoteType(),
        },
      },
    },
  },
  doorModel: {
    label: '門型',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      selectProps: {
        props: {
          // options: optionsCreator_doorModel(),
        },
      },
    },
  },
  length: {
    label: 'L(m)', // 全寬
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  width: {
    label: 'W(m)', // WG
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  height: {
    label: 'h(m)',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },

  // 後端說B(m)是boxB
  B: {
    label: 'B(m)',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },
  // 那thickness是什麼? 門片厚度?
  thickness: {
    // label: 'B(m)', 不確定
    label: '門片厚度',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
          type: 'number',
          className: 'text-center',
        },
      },
    },
  },

  area: {
    label: '面積',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  volume: {
    label: '才數',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  material: {
    label: '材料',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      selectProps: {
        props: {},
      },
    },
  },
  surface: {
    label: '表面',
    inputSelProps: {
      wrapperStyle: { width: '55px' },
      inputProps: {
        props: {},
      },
    },
  },
  doorTrack: {
    label: '門軌',
    inputSelProps: {
      wrapperStyle: { width: '300px' },
      selectProps: {
        withIcon: true,
        creOptionWithIconProps: {
          imgProps: {
            style: { height: '40px' },
          },
        },
        creSingleValueWithIconProps: {
          imgProps: {
            style: { height: '40px' },
          },
        },
        props: {},
        // dynaOptionsList: {
        //   normal: optionsCre_doorTrack_normal(),
        //   typhoonProtection: optionsCre_doorTrack_typhoonProtection(),
        // },
      },
    },
  },
  horsepower: {
    label: '馬力',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {},
      },
    },
  },
  quantity: {
    label: '數量',
    inputSelProps: {
      wrapperStyle: { width: '55px' },
      inputProps: {
        props: { type: 'number' },
      },
    },
  },
  listPrice: {
    label: '牌價',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {},
      },
    },
  },
  listPriceTotal: {
    label: '牌價複價',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  unitPrice: {
    label: '單價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  totalPrice: {
    label: '複價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '140px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  typhoonProtection: {
    label: '防颱',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'typhoonProtection' }],
      },
    },
  },
  bounceDoor: {
    label: '彈射門',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'bounceDoor' }],
      },
    },
  },
  notes: {
    label: '備註',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      inputProps: {
        props: {},
      },
    },
  },
  //
  //
  //
  motorVendor: {
    label: '馬達廠商',
    // isOptionValue: true,
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options: [
          //   { value: '東元', label: '東元' },
          //   { value: '大同', label: '大同' },
          // ],
        },
      },
    },
  },
  voltage: {
    label: '電壓',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options: [
          //   { value: '220V', label: '220V' },
          //   { value: '380V', label: '380V' },
          // ],
        },
      },
    },
  },
  phase: {
    label: '相數',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          // options: [
          //   { value: '單相', label: '單相' },
          //   { value: '雙相', label: '雙相' },
          // ],
        },
      },
    },
  },
  hasSupportStand: {
    label: '馬達支撐架',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'hasSupportStand' }],
      },
    },
  },
  bottomBar: {
    label: '底座類型',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: 'none', label: '無' },
            { value: '鋁障感型', label: '鋁障感型' },
            { value: '止水型', label: '止水型' },
          ],
        },
      },
    },
  },
  lockBox: {
    label: '馬達鎖盒',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '外露', label: '外露' },
            { value: '防盜', label: '防盜' },
          ],
        },
      },
    },
  },
  railThick: {
    label: '門軌厚度',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            // { value: '1.0T', label: '1.0T' },
            // { value: '3.0T', label: '3.0T' },
            // { value: '4.5T', label: '4.5T' },
            { value: 'api給', label: 'api給' },
          ],
        },
      },
    },
  },
  rollerType: {
    label: '捲軸規格',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '無凸', label: '無凸' },
            { value: '雙凸', label: '雙凸' },
          ],
        },
      },
    },
  },
  hasSilencingStrip: {
    label: '門軌消音條',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'hasSilencingStrip' }],
      },
    },
  },
  isIntegrated: {
    label: '一體式捲箱',
    theadItemClassName: 'text-center',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'isIntegrated' }],
      },
    },
  },
  headBoxThick: {
    label: '捲箱厚度',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            // { value: '0.8T', label: '0.8T' },
            { value: 'api給', label: 'api給' },
          ],
        },
      },
    },
  },
  openWay: {
    label: '開閉方式',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [{ value: '電動', label: '電動' }],
        },
      },
    },
  },
}; // prodCellConfig close

const emptyProdOri: () => Tprod = () => {
  return {
    discountRate: '100',
    itemName: '',
    quoteType: '',
    doorModel: '',
    length: '',
    width: '',
    height: '',
    B: '',
    thickness: '',
    area: '',
    volume: '',
    material: '',
    surface: '',
    doorTrack: '',
    horsepower: '',
    quantity: 0,
    listPrice: 0,
    listPriceTotal: 0,
    unitPrice: 0,
    totalPrice: 0,
    typhoonProtection: false,
    bounceDoor: false,
    notes: '',
    //
    motorVendor: '',
    voltage: '',
    phase: '',
    hasSupportStand: false,
    bottomBar: '',
    lockBox: '',
    railThick: '',
    rollerType: '',
    hasSilencingStrip: false,
    isIntegrated: false,
    headBoxThick: '',
    openWay: '',
  };
};

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================
// slats
// bottomBars
// guideRails
// sidePlates
// rollers
// motors
// motorAccessories
// headBoxes

const filter_slats = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['slats'];
  filterParams: {
    isAntiTyphoon: boolean;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    return data.isAntiTyphoon === filterParams.isAntiTyphoon;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

const filter_bottomBars = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['bottomBars'];
  filterParams: {
    isAntiTyphoon: boolean;
    isWaterProof: boolean;
    hasAluminumBarrier: boolean;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let isPass = true;

    if (data.isAntiTyphoon !== filterParams.isAntiTyphoon) {
      isPass = false;
    } else if (data.isWaterProof !== filterParams.isWaterProof) {
      isPass = false;
    } else if (data.hasAluminumBarrier !== filterParams.hasAluminumBarrier) {
      isPass = false;
    }

    return isPass;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

const filter_guideRails = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['guideRails'];
  filterParams: {
    thickness: string; // 要怎麼判斷? 大於小於等於? 主產品的thickness是不是應該固定?
    isAntiTyphoon: boolean;
    /**消音條 */
    hasSilencingStrip: boolean; // 消音條
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let isPass = true;

    if (data.thickness && data.thickness !== filterParams.thickness) {
      isPass = false;
    } else if (data.isAntiTyphoon !== filterParams.isAntiTyphoon) {
      isPass = false;
    } else if (data.hasSilencingStrip !== filterParams.hasSilencingStrip) {
      isPass = false;
    }

    return isPass;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

const filter_sidePlates = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['sidePlates'];
  filterParams: {
    bearingType?: string; // 軸承
    gearNumber?: string | null; // 鍊齒輪番號
    /**一體式捲箱 */
    isIntegrated: boolean; // 一體式捲箱
    motorVendor: string; // 馬達廠商
    weight: number;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let isPass = true;

    if (data.bearingType !== filterParams.bearingType) {
      isPass = false;
    } else if (data.gearNumber && data.gearNumber !== filterParams.gearNumber) {
      isPass = false;
    } else if (data.isIntegrated && data.isIntegrated !== filterParams.isIntegrated) {
      isPass = false;
    } else if (data.motorVendor && data.motorVendor !== filterParams.motorVendor) {
      isPass = false;
    } else if (data.maxDoorWeight && data.maxDoorWeight < filterParams.weight) {
      isPass = false;
    } else if (data.minDoorWeight && data.minDoorWeight > filterParams.weight) {
      isPass = false;
    }

    return isPass;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

const filter_rollers = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['rollers'];
  filterParams: {
    diameter: string;
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let isPass = true;

    if (data.diameter !== filterParams.diameter) {
      isPass = false;
    }

    return isPass;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

const filter_motors = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['motors'];
  filterParams: {
    horsePower: string; // 馬力數
    // gearNumber: string; // 鍊齒輪番號 // DuST說先略過
    motorVendor: string; // 馬達廠商
    phase: number; // 相位
    /**電壓(V) */
    voltage: number; // 電壓(V)
    /**荷重(kg) */
    loadWeight: number; // 荷重(kg)
    hasSupportStand: boolean; // 有腳 // 馬達支撐架
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let isPass = true;

    if (data.horsePower !== filterParams.horsePower) {
      isPass = false;
    }
    // else if (data.gearNumber !== filterParams.gearNumber) {
    //   isPass = false;
    // }
    else if (data.motorVendor && data.motorVendor !== filterParams.motorVendor) {
      isPass = false;
    } else if (data.phase && data.phase !== filterParams.phase) {
      isPass = false;
    } else if (data.voltage && data.voltage !== filterParams.voltage) {
      isPass = false;
    } else if (data.loadWeight && data.loadWeight !== filterParams.loadWeight) {
      isPass = false;
    } else if (data.hasSupportStand && data.hasSupportStand !== filterParams.hasSupportStand) {
      isPass = false;
    }

    return isPass;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

const filter_motorAccessories = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['motorAccessories'];
  filterParams: {
    /**鍊條排數 */
    // chains: number; // 鍊條排數 // 不知道從哪裡取得這個資料 // 先略過
    /**軸承 */
    bearingType: string; // 軸承
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let isPass = true;

    // if (data.chains !== filterParams.chains) {
    //   isPass = false;
    // } else
    if (data.bearingType !== filterParams.bearingType) {
      isPass = false;
    }

    return isPass;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

const filter_headBoxes = ({
  dataArr,
  filterParams,
}: {
  dataArr: TdoorComponentListDto['headBoxes'];
  filterParams: {
    thickness: string; // 厚度
    /**一體式捲箱 */
    isIntegrated: boolean; // 一體式捲箱
  };
}) => {
  const filteredArr = dataArr.filter((data) => {
    let isPass = true;

    if (data.thickness !== filterParams.thickness) {
      isPass = false;
    } else if (data.isIntegrated !== filterParams.isIntegrated) {
      isPass = false;
    }

    return isPass;
  });

  if (filteredArr[0]) {
    return filteredArr[0];
  } else {
    return null;
  }
};

// ===========================================================
// ===========================================================
// ===========================================================
export { Class_product, prodkeyArrOri, prodCellConfig };
export type { Tprod, TprodKey, TcellConfig };

// 折數
// 牌價 就是原價格
// 單價 === 折數*牌價
// 複價 === 單價*數量
// 小計 ===所有主產品複價的總和
// 營業稅=== 小計 * 0.05
// 總計 === 小計 + 營業稅

// 每個主產品的折數都不會總折數
// 是獨立的

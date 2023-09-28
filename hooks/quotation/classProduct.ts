/**creAcceList
 *
 * retrieveOptions 下拉式選單產生器
 * Class_product
 * AcceList
 * retrieveCreProdAcce
 * createOptionsList
 * creAcceList
 * accessoriesList
 * takeDefaultDynaValue
 *
 * 下拉式選單的選項
 *
 * req_calcGeneralSpec
 * req_getProdAvailableComponents
 * reqProdGenerateDoorProductBom
 */

import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { optionsCre_doorTrack_normal, optionsCre_doorTrack_typhoonProtection } from 'js/utils/options/doorTrackOptions';

const options_doorTrack_normal = optionsCre_doorTrack_normal();
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection();

// ===========================================================
// child class
import { Class_component, Tcomponent, creEmptyCom, comTypeLookUp } from './classComponent';
import { Class_accessories, Taccessories } from './classAccessories';
// =============================================================================
// api
import { apiGetProdCalcGeneralSpec, apiGetProdAvailableComponents } from 'js/api/api_product';
import { apiPostProdGenerateDoorProductBom, TgenerateDoorProductBomDto } from 'js/api/api_product';
// =============================================================================
// utils
import {
  filter_slats,
  filter_bottomBars,
  filter_guideRails,
  filter_sidePlates,
  filter_rollers,
  filter_motors,
  filter_motorAccessories,
  filter_headBoxes,
} from './componentFilters';

import { prodCellConfig } from './prodCellConfig';

// =============================================================================
// type
import type {
  TlegacyContractProductDto,
  TcreateLegacyContractProductDto,
  TdoorComponentListDto,
  TquotationProductAccessoriesDto,
  TgenerateDoorProductBomDto_DoorSpec,
  TgenerateDoorProductBomDto_ComponentInfo,
  TcreateQuotationProductAccessoriesDto,
  TcreateQuotationProductComponentDto,
  TquotationProductComponentsDto,
  TquotationProductDto,
  TdoorAccessoryDto,
} from 'js/api/dtoTypes';

import type { TreRender, TcomponentKey } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';
import type { TdoorModelInfoDto } from 'js/api/api_product';
import type { TpcgsPrams, TpacParams, TdoorGeneralSpecsDto } from 'js/api/api_product';

// =============================================================================
class Class_product {
  constructor({
    reRender,
    // setIsLoading,
    prodData = emptyProdOri(),
    // accessoryDataArr = [],
    delSelf,
    copySelf,
    //
    calcSubTotalPrice: calcProdSubTotalPrice,
    // from api
    doorModelList,
    //
    originProd,
  }: {
    reRender: TreRender;
    // setIsLoading: (isLoading: boolean) => void;
    prodData?: Tprod;
    // accessoryDataArr?: Taccessory[];
    // optionDataArr?: Toptions[];
    delSelf: () => void;
    copySelf: () => void;
    //
    calcSubTotalPrice: () => void;
    // from api
    doorModelList: { [key: string]: TdoorModelInfoDto };
    originProd?: TquotationProductDto;
  }) {
    this.reRender = reRender;
    // this.setIsLoading = setIsLoading;
    this._prodData = _.cloneDeep(prodData);
    this.delSelf = delSelf;
    this.copySelf = copySelf;

    this.originProd = originProd;

    //
    this._calcProdSubTotalPrice = calcProdSubTotalPrice;
    // from api
    // 來自/products/door/models // 在useProduct取得 // 目前只有用來生成下拉式選單的樣子
    this._doorModelList = doorModelList;
    //
    this._quantity = String(this._prodData.quantity);
    this._price = String(this._prodData.price);
    this._dualPrice = String(this._prodData.dualPrice);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);

    this.findBDoptions();

    // __________________________________________________________;

    // 建立材料配件

    const comPreList: Partial<{ [key in TcomponentKey]: Tcomponent }> = {};
    this._prodData.components.forEach((item) => {
      const key = comTypeLookUp[item.type];
      comPreList[key] = {
        ...item,
        doorModelName: key,
        code: '',
        specialSpec: '',
        materialSurface: item.materialSurface || '',
        quantity: String(item.quantity || 0),
      };
    });

    this.creComList(comPreList as { [key in TcomponentKey]: Tcomponent });

    // ___________________________________________________________
    // 建立選配設定
    this.creAcceList();

    // ___________________________________________________________
  } //  constructor close

  private reRender;
  // readonly setIsLoading;
  delSelf;
  copySelf;
  //
  // !!!!!
  readonly originProd;
  // !!!!!
  //
  isLoading = false;
  //
  readonly _calcProdSubTotalPrice;
  // from api
  // 門型資料
  private _doorModelList;
  _doorGeneralSpecs: TdoorGeneralSpecsDto | undefined;
  private _availableComponents: TdoorComponentListDto | undefined;
  private _thickness = '';
  private _defaultBoxB = '';
  // private _boxB: number | undefined;
  //
  private _prodData;
  private _quantity;
  private _price;
  private _dualPrice;
  private _unitPrice;
  private _totalPrice;

  // private _boxD = '';

  readonly options_doorTrack_normal = options_doorTrack_normal;
  readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;
  // ---------------------------------------------------------
  // req呼叫控制
  // 防抖
  callAllTimeoutId: NodeJS.Timeout | null = null;

  shouldCall_cgs = false; //req_calcGeneralSpec
  shouldCall_pac = false; //req_getProdAvailableComponents
  shouldCall_pgpb = false; //reqProdGenerateDoorProductBom

  // 其他防抖
  timeoutId_retrieveCreProdCom: NodeJS.Timeout | null = null;

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  comList: { [key in TcomponentKey]: Class_component } | undefined;

  creComList(dataList: { [key in TcomponentKey]: Tcomponent }) {
    const keyArr = Object.keys(dataList) as TcomponentKey[];

    const list: { [key: string]: Class_component } = {};

    keyArr.forEach((key) => {
      const com = dataList[key];

      if (!com) {
        return null;
      }

      const theClass = new Class_component({
        reRender: this.reRender,
        data: _.cloneDeep(com),
        key: key,
        prod: this,
        callReqGetCodeNumber: () => {
          this.shouldCall_pgpb = true;
          this.callAllReq();
        },
      });
      list[key] = theClass;
    });

    this.comList = list as { [key in TcomponentKey]: Class_component };

    this.reRender();
  }

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // 選配設定

  accessoriesList: { [key: string]: Class_accessories } = {};

  delAcce(key: string) {
    delete this.accessoriesList[key];
    this.calcAccessoriesAllprice();
    this.reRender();
  }

  copyAcce(copyKey: string) {
    const newKey = `new-${nanoid()}`;
    const copyData = _.cloneDeep(this.accessoriesList[copyKey].body);

    this.accessoriesList[newKey] = new Class_accessories({
      reRender: this.reRender,
      data: copyData,
      delSelf: () => this.delAcce(newKey),
      copySelf: () => this.copyAcce(newKey),
      prod: this,
    });

    this.calcAccessoriesAllprice();
    this.reRender();
  }

  /**acceDataArr會來自選擇器 */
  addAcce(acceDataArr: TdoorAccessoryDto[]) {
    acceDataArr.forEach((acceData) => {
      const newKey = `new-${nanoid()}`;
      const acceClassData: Taccessories = {
        codeName: '',
        name: acceData.name,
        unit: acceData.unit ?? '',
        quantity: 1,
        price: acceData.price ?? 0,
        totalPrice: 0,
        unitPrice: 0,
        dualPrice: 0,
        //
        referenceSpec: acceData.referenceSpec,
        originalPrice: acceData.price ?? 0,
      };

      this.accessoriesList[newKey] = new Class_accessories({
        reRender: this.reRender,
        data: acceClassData,
        delSelf: () => this.delAcce(newKey),
        copySelf: () => this.copyAcce(newKey),
        // calcOptionsAllprice: this.calcOptionsAllprice,
        prod: this,
      });
    });

    this.calcAccessoriesAllprice();
    this.reRender();
  }

  accessoriesVKeyArr: string[] | undefined;

  creAcceList() {
    // const optionArr = this._prodData.options;
    const optionArr = _.sortBy(this._prodData.accessories, 'order');
    const list: { [key: string]: Class_accessories } = {};

    optionArr?.forEach((item) => {
      let key = item.order !== undefined ? `${item.order}` : nanoid();

      if (key in list) {
        key = nanoid();
      }

      list[key] = new Class_accessories({
        reRender: this.reRender,
        // data: item,
        data: _.cloneDeep(item),
        delSelf: () => this.delAcce(key),
        copySelf: () => this.copyAcce(key),
        // calcOptionsAllprice: this.calcOptionsAllprice,
        prod: this,
      });
    });
    this.accessoriesList = list;
    this.reRender();
  }

  clearProd() {
    const empty = emptyProdOri();

    const prod: Tprod = {
      ...empty,
      doorType: this.doorType,
      length: this.length,
      width: this.width,
      height: this.height,
      area: this.area,
      quantity: this._prodData.quantity,
      price: this._prodData.price,
      dualPrice: this._prodData.dualPrice,
      unitPrice: this._prodData.unitPrice,
      totalPrice: this._prodData.totalPrice,
      discount: this._prodData.discount,
    };

    this._quantity = String(this._prodData.quantity);
    this._price = String(this._prodData.price);
    this._dualPrice = String(this._prodData.dualPrice);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);

    this._prodData = prod;

    this.comList = undefined;
    this._doorGeneralSpecs = undefined;
    this._availableComponents = undefined;

    this._prodData.boxB = '';
    this._defaultBoxB = '';
    this._thickness = '';

    this.options_boxB = undefined;
    this.options_boxD = undefined;

    // this.takeDefaultDynaValue();
    // this.findBDoptions();
  } // resetProd

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // api請求
  // this.shouldCall_cgs
  async req_calcGeneralSpec() {
    if (!this.doorType || !this.height) {
      return false;
    }

    if (!this.length && !this.width) {
      return false;
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
        modelName: this.doorType as TpcgsPrams['modelName'],
        height: Number(this.height) * 1000,
        isAntiTyphoon: this.typhoonProtection,
        fullWidth,
        WG,
      };
    })();

    if (!body.fullWidth && !body.WG) {
      return false;
    }

    const res = await apiGetProdCalcGeneralSpec(body as TpcgsPrams);

    if (!res) {
      return false;
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
    const boxB = defaultMotorBox?.default?.boxB || defaultMotorBox?.東元?.boxB || defaultMotorBox?.大同?.boxB;
    this.thickness = res.thickness;

    // ________________________
    // 設定馬達廠商
    if (defaultMotorBox) {
      if (defaultMotorBox.東元) {
        this.motor = '東元';
        this.boxB_noCall = String(defaultMotorBox.東元.boxB / 1000);
      } else if (defaultMotorBox.大同) {
        this.motor = '大同';
        this.boxB_noCall = String(defaultMotorBox.大同.boxB / 1000);
      } else if (defaultMotorBox.default) {
        this.boxB_noCall = String(defaultMotorBox.default.boxB / 1000);
      }
    } else {
      this.boxB_noCall = boxB ? String(boxB / 1000) : '';
    }

    this._defaultBoxB = this.boxB;

    this.findBDoptions();
    this.options_boxB?.unshift({
      value: 'auto',
      label: '自動計算',
    });

    // 先判斷跟原本的是否一樣
    if (
      this._doorGeneralSpecs?.weight !== res.weight ||
      this._doorGeneralSpecs?.diameter !== res.diameter
      //
    ) {
      this.shouldCall_pac = true;
    }

    if (
      this._doorGeneralSpecs?.diameter !== res.diameter ||
      this._doorGeneralSpecs?.slatLength !== res.slatLength ||
      this._doorGeneralSpecs?.guideRailLength !== res.guideRailLength ||
      this._doorGeneralSpecs?.bearingHousingTotalLength !== res.bearingHousingTotalLength ||
      this._doorGeneralSpecs?.headBoxLength !== res.headBoxLength ||
      this._doorGeneralSpecs?.bearingName !== res.bearingName ||
      this._doorGeneralSpecs?.sprocketWheelChains !== res.sprocketWheelChains
    ) {
      this.shouldCall_pgpb = true;
    }

    this._doorGeneralSpecs = res;
  } // calcGeneralSpec

  // ________________________
  // this.shouldCall_pac
  async req_getProdAvailableComponents() {
    const rollerDiameter = this._doorGeneralSpecs?.diameter;

    if (!this.doorType || !this.weight || !rollerDiameter) {
      return false;
    }

    const res = await apiGetProdAvailableComponents({
      modelName: this.doorType as TpacParams['modelName'],
      weight: this.weight,
      isAntiTyphoon: this.typhoonProtection,
      rollerDiameter: rollerDiameter,
    });

    if (!res) {
      return false;
    }

    this._availableComponents = res;

    this.retrieveOptions();
    this.callRetrieveCreProdCom();
  } //  req_getProdAvailableComponents

  // this.shouldCall_pgpb
  /**取得材料配件 */
  async reqProdGenerateDoorProductBom() {
    const comList = this.comList;

    if (!comList || !this._doorGeneralSpecs || !comList.motor.gearNumber) {
      return;
    }

    const doorSpec: TgenerateDoorProductBomDto_DoorSpec = {
      modelName: this.doorType as TgenerateDoorProductBomDto_DoorSpec['modelName'],
      weight: this.weight ?? -1,
      height: Number(this.height) * 1000,
      B: Number(this.boxB) * 1000,
      D: Number(this._prodData.boxD) * 1000,
      slatLength: this._doorGeneralSpecs.slatLength,
      guideRailLength: this._doorGeneralSpecs.guideRailLength,
      rollerLength: this._doorGeneralSpecs.bearingHousingTotalLength,
      headBoxLength: this._doorGeneralSpecs.headBoxLength,
      isAntiTyphoon: this.typhoonProtection,
      rollerDiameter: this._doorGeneralSpecs.diameter,
      bearingType: this._doorGeneralSpecs.bearingName,

      gearNumber: comList.motor?.gearNumber,
      chains: this._doorGeneralSpecs.sprocketWheelChains,
    };

    const generateBomObj_empty: Partial<TgenerateDoorProductBomDto> = { doorSpec };

    let haveNull = false;

    Object.values(comList).forEach((item) => {
      if (!item) {
        return (haveNull = true);
      }

      const key = item.key;
      const { id, material, materialSurface, isPainted } = item.componentInfo;

      if (!material || !id) {
        haveNull = true;
      }

      generateBomObj_empty[key] = {
        id,
        material,
        materialSurface: materialSurface || undefined,
        isPainted,
      };
    });

    if (haveNull) {
      return;
    }

    const generateBomObj = generateBomObj_empty as TgenerateDoorProductBomDto;

    const res = await apiPostProdGenerateDoorProductBom(generateBomObj);

    if (res) {
      const keyArr = Object.keys(res) as (keyof typeof res)[];
      keyArr.forEach((key) => {
        const item = res[key];
        comList[key].codeNumber = item.number;
        comList[key].componentId = item.id;
      });
    }
  } // reqProdGenerateDoorProductBom

  async reqChain() {
    try {
      this.isLoading = true;

      if (this.shouldCall_cgs) {
        await this.req_calcGeneralSpec();
      }

      if (this.shouldCall_cgs) {
        await this.req_getProdAvailableComponents();
      }

      if (this.shouldCall_pgpb) {
        await this.reqProdGenerateDoorProductBom();
      }
    } catch (error) {
    } finally {
      this.isLoading = false;
      this.takeDefaultDynaValue();
    }

    this.shouldCall_cgs = false;
    this.shouldCall_pac = false;
    this.shouldCall_pgpb = false;

    this.reRender();
  }

  // 注意 retrieveProdComponent裡面也有呼叫 callAllReq
  callAllReq() {
    if (this.callAllTimeoutId) {
      clearTimeout(this.callAllTimeoutId);
    }

    this.callAllTimeoutId = setTimeout(() => {
      this.reqChain();
    }, 300);
  }

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------

  // 裡面有呼叫callAllReq的機制
  // 裡面有呼叫callAllReq的機制
  // 裡面有呼叫callAllReq的機制
  retrieveCreProdCom() {
    if (!this._availableComponents || !this.weight) {
      return;
    }

    const availableComponents = this._availableComponents;

    const slat: Tcomponent | null = filter_slats({
      //
      dataArr: availableComponents.slats,
      filterParams: { isAntiTyphoon: this.typhoonProtection },
    });

    const bottomBar: Tcomponent | null = filter_bottomBars({
      dataArr: availableComponents.bottomBars,
      filterParams: {
        isAntiTyphoon: this.typhoonProtection,
        isWaterProof: this.bottomBar === '止水型',
        hasAluminumBarrier: this.bottomBar === '鋁障感型',
      },
    });

    const guideRail: Tcomponent | null = filter_guideRails({
      dataArr: availableComponents.guideRails,
      filterParams: {
        // thickness: String(this.doorTrackThick),
        isAntiTyphoon: this.typhoonProtection,
        hasSilencingStrip: this.doorTrackSilencerStrip,
      },
    });

    const motor: Tcomponent | null = filter_motors({
      dataArr: availableComponents.motors,
      filterParams: {
        horsePower: this.horsepower,
        // gearNumber: this., // DuST說先略過
        motorVendor: this.motor,
        phase: Number(this.phase),
        voltage: Number(this.voltage),
        weight: this.weight,
        hasSupportStand: this.motorSupport,
      },
    });

    const sidePlate: Tcomponent | null = filter_sidePlates({
      dataArr: availableComponents.sidePlates,
      filterParams: {
        bearingType: this._doorGeneralSpecs?.bearingName ?? 'undefined', // 從doorGeneralSpecs取得
        gearNumber: motor?.gearNumber ?? '', // 從上面的motor取得
        isIntegrated: this.onePieceRollUpBox,
        motorVendor: this.motor,
        weight: this.weight,
      },
    });

    const roller: Tcomponent | null = filter_rollers({
      dataArr: availableComponents.rollers,
      filterParams: {
        diameter: String(this._doorGeneralSpecs?.diameter ?? ''),
      },
    });

    const motorAccessories: Tcomponent | null = filter_motorAccessories({
      dataArr: availableComponents.motorAccessories,
      filterParams: {
        /**鍊條排數 */
        chains: this._doorGeneralSpecs?.sprocketWheelChains ?? 0,
        /**軸承 */ // 從doorGeneralSpecs取資料
        bearingType: this._doorGeneralSpecs?.bearingName || '',
      },
    });

    const headBox: Tcomponent | null = filter_headBoxes({
      dataArr: availableComponents.headBoxes,
      filterParams: {
        thickness: this.rollUpBoxThick, // 捲箱厚度
        /**一體式捲箱 */
        isIntegrated: this.onePieceRollUpBox, // 一體式捲箱
      },
    });

    const isGearNumberChanged = this.comList?.motor?.gearNumber !== motor?.gearNumber;
    // TODO get /products/door/available-components取得的金額不是正確的金額
    // 正確的金額之後會補在 post /products/door/generate-door-product-bom
    this.creComList({
      slat: slat || creEmptyCom(),
      bottomBar: bottomBar || creEmptyCom(),
      guideRail: guideRail || creEmptyCom(),
      motor: motor || creEmptyCom(),
      sidePlate: sidePlate || creEmptyCom(),
      roller: roller || creEmptyCom(),
      motorAccessories: motorAccessories || creEmptyCom(),
      headBox: headBox || creEmptyCom(),
    });

    this.shouldCall_pgpb = true;
    this.callAllReq();

    this.calcComAllPrice();
    this.calcProdAllprice();

    this.reRender();

    return { isGearNumberChanged };
  } // retrieveProdComponent

  callRetrieveCreProdCom() {
    if (this.timeoutId_retrieveCreProdCom) {
      clearTimeout(this.timeoutId_retrieveCreProdCom);
    }

    this.timeoutId_retrieveCreProdCom = setTimeout(() => {
      this.retrieveCreProdCom();
    }, 100);
  }

  takeDefaultDynaValue() {
    const call = () => {
      this._prodData.doorTrackThick = this.options_doorTrackThick?.[0].value ?? '';
      this._prodData.rollUpBoxThick = this.options_rollUpBoxThick?.[0].value ?? '';
      this._prodData.motor = this.options_motor?.[0].value ?? '';
      this._prodData.horsepower = this.options_horsepower?.[0].value ?? '';
      this._prodData.phase = Number(this.options_phase?.[0].value ?? '1');
      this._prodData.voltage = this.options_voltage?.[0].value ?? '';
      this.callRetrieveCreProdCom();
    };

    // 做比對，如果值都一樣就不執行call
    if (
      this._prodData.doorTrackThick !== this.options_doorTrackThick?.[0].value ||
      this._prodData.rollUpBoxThick !== this.options_rollUpBoxThick?.[0].value ||
      this._prodData.motor !== this.options_motor?.[0].value ||
      this._prodData.horsepower !== this.options_horsepower?.[0].value ||
      this._prodData.phase !== Number(this.options_phase?.[0].value) ||
      this._prodData.voltage !== this.options_voltage?.[0].value
    ) {
      call();
    }
  }

  // ---------------------------------------------------------

  private toSetDefaultBoxB() {
    if (!this._doorGeneralSpecs) {
      return;
    }

    const motorArr = this._doorGeneralSpecs.motors;
    const hp = this.horsepower;
    const vendor = this.motor as '東元' | '大同' | '';
    const defaultMotor = motorArr[this._doorGeneralSpecs.defaultMotorIndex];
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

  // 選配 金額總和
  private AcceAllPrice = {
    price: 0,
    dualPrice: 0,
    unitPrice: 0,
    totalPrice: 0,
  };

  // 材料配件 金額總和
  private comAllPrice = {
    price: 0,
    dualPrice: 0,
    unitPrice: 0,
    totalPrice: 0,
  };

  /**計算prod所有的價格 */
  private calcProdAllprice() {
    // 牌價 為材料配件設定與選配設定的 牌價複價 總和
    const price = new Decimal(this.comAllPrice.dualPrice || 0).add(this.AcceAllPrice.dualPrice || 0);
    // 單價 為材料配件設定與選配設定的 複價 總和
    const unitPrice = new Decimal(this.comAllPrice.totalPrice || 0).add(this.AcceAllPrice.totalPrice || 0);

    const dualPrice = price.mul(this.quantity || 0).toNumber();
    const totalPrice = unitPrice.mul(this.quantity || 0).toNumber();

    this.price = price.ceil().toString();
    this.dualPrice = Math.ceil(dualPrice).toString();
    this.unitPrice = unitPrice.ceil().toString();
    this.totalPrice = Math.ceil(totalPrice).toString();
    this._calcProdSubTotalPrice();
    this.reRender();
  }

  /**計算options所有的價格 */
  calcAccessoriesAllprice() {
    let d_price = new Decimal(0);
    let d_dualPrice = new Decimal(0);
    let d_unitPrice = new Decimal(0);
    let d_totalPrice = new Decimal(0);

    const acceArr = Object.values(this.accessoriesList ?? {});

    acceArr?.forEach((item) => {
      const { price, dualPrice, unitPrice, totalPrice } = item;

      d_price = d_price.add(price || 0);
      d_dualPrice = d_dualPrice.add(dualPrice || 0);
      d_unitPrice = d_unitPrice.add(unitPrice || 0);
      d_totalPrice = d_totalPrice.add(totalPrice || 0);

      this.AcceAllPrice = {
        price: d_price.ceil().toNumber(),
        dualPrice: d_dualPrice.ceil().toNumber(),
        unitPrice: d_unitPrice.ceil().toNumber(),
        totalPrice: d_totalPrice.ceil().toNumber(),
      };
    });

    this.calcProdAllprice();
  } // calcAccessoriesAllprice

  calcComAllPrice() {
    let d_price = new Decimal(0);
    let d_dualPrice = new Decimal(0);
    let d_unitPrice = new Decimal(0);
    let d_totalPrice = new Decimal(0);

    const comListArr = Object.values(this.comList ?? {});

    comListArr.forEach((item) => {
      if (!item) {
        return;
      }

      const { price, dualPrice, unitPrice, totalPrice } = item;

      d_price = d_price.add(price || 0);
      d_dualPrice = d_dualPrice.add(dualPrice || 0);
      d_unitPrice = d_unitPrice.add(unitPrice || 0);
      d_totalPrice = d_totalPrice.add(totalPrice || 0);

      this.comAllPrice = {
        price: d_price.ceil().toNumber(),
        dualPrice: d_dualPrice.ceil().toNumber(),
        unitPrice: d_unitPrice.ceil().toNumber(),
        totalPrice: d_totalPrice.ceil().toNumber(),
      };
    });
    this.calcProdAllprice();
  } // calcComAllPrice

  private calcArea = () => {
    const h = Number(this._prodData.height || 0);
    const b = Number(this._prodData.boxB || 0);
    const w = Number(this._prodData.width || 0);
    const l = Number(this._prodData.length || 0);

    const area = Decimal.add(h, b) // h+b
      .mul(w || l)
      .toFixed(2)
      .toString();

    return area;
  };

  /**所有acce執行calcPrice */
  calcChangeAccePrice() {
    Object.values(this.accessoriesList)?.forEach((acce) => {
      acce.calcPrice();
    });
    // acce裡有機制會呼叫prod的calcAccessoriesAllprice
    // 接著就會呼叫calcProdAllprice
    // this.calcProdAllprice();
  }

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

  findBDoptions() {
    if (this._prodData.doorType) {
      const BDList = pairBD[this._prodData.doorType]?.BtoD;
      const DBList = pairBD[this._prodData.doorType]?.DtoB;

      if (BDList) {
        this.options_boxB = Object.keys(BDList).map((key) => {
          return {
            value: key,
            label: key,
          };
        });
      }

      if (DBList) {
        this.options_boxD = Object.keys(DBList).map((key) => {
          return {
            value: key,
            label: key,
          };
        });
      }
    }
  }

  // ---------------------------------------------------------
  // 下拉式選單的選項

  // !!! options_xxx 後綴很重要 !!!
  // 這個xxx要與key吻合，在tbody才能取得options_xxx

  // 這幾個會經由執行retrieveOptions()來設定
  options_horsepower: Toption[] | undefined = undefined;
  options_motor: Toption[] | undefined = undefined;
  options_phase: Toption[] | undefined = undefined;
  options_voltage: Toption[] | undefined = undefined;
  options_rollUpBoxThick: Toption[] | undefined = undefined;
  options_doorTrackThick: Toption[] | undefined = undefined;
  //
  options_boxB: Toption[] | undefined = undefined;
  options_boxD: Toption[] | undefined = undefined;

  /**門型 options */
  get options_doorType() {
    return Object.values(this._doorModelList).map((item) => {
      return {
        value: item.name,
        label: item.name,
      };
    });
  }

  /**門片材質 主產品設定的材質 */
  get options_material() {
    const doorModel = this._doorModelList[this.doorType];

    if (!doorModel) {
      return undefined;
    }

    const slatMaterials = doorModel.slatMaterials;
    const order = ['鍍鋅鋼板', 'SST#304', 'SST#316', '樹脂鋼板', '高耐鍍鋅鋼板'];
    const orderedArr = _.orderBy(slatMaterials, (item) => order.indexOf(item.name));

    const arr = orderedArr.map((item) => {
      return {
        value: item.name,
        label: item.name,
      };
    });

    return arr;
  }

  /**門軌 options */
  get options_doorTrack() {
    const doorModel = this._doorModelList[this.doorType];

    if (!doorModel) {
      return undefined;
    }

    const arr = doorModel.guideRails.map((item) => {
      const imgSrc = item.imgSrc;
      const withHook = item.withHook;

      const option = {
        value: imgSrc,
        label: imgSrc,
        // 在後端那邊會多出一個 / 符號，暫時先把這邊的/拿掉處理
        icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
        // icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
      };

      if (withHook === null || withHook === this.typhoonProtection) {
        return option;
      }

      return undefined;
    });

    _.pull(arr, undefined);

    return arr;
  } // options_doorTrack

  /**表面 */
  get options_surface() {
    const isSST = checkIsSST(this.material);

    if (isSST) {
      return [
        { value: '2B', label: '2B' },
        { value: 'HL', label: 'HL' },
        { value: 'BA', label: 'BA' },
        { value: 'NO.4', label: 'NO.4' },
      ];
    }

    return undefined;
  }

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // 來自_doorGeneralSpecs
  get weight() {
    return this._doorGeneralSpecs?.weight;
  }
  // ---------------------------------------------------------

  get discount() {
    return this._prodData.discount;
  }
  set discount(v) {
    if ((v as string) === '') {
      v = '0';
    }

    if (Number(v) > 100) {
      v = '100';
    }

    if (v.split('.')[1]?.length > 2) {
      return;
    }

    this._prodData.discount = `${Number(v)}`;

    // 因為折數改變了，所以選配設定的價格要重新計算
    Object.values(this.accessoriesList).forEach((item, index, arr) => {
      item.calcAllPrice({
        toCalcAccessoriesAllprice: arr.length - 1 === index,
      });
    });
    Object.values(this.comList ?? {}).forEach((item, index, arr) => {
      if (item) {
        item.calcAllPrice({
          toCalcComAllprice: arr.length - 1 === index,
        });
      }
    });

    //
    this.reRender();
  }

  clearId() {
    this._prodData.id = undefined;
  }
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------

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
  get doorType() {
    return this._prodData.doorType;
  }

  set doorType(v) {
    this._prodData.doorType = v;
    this.clearProd();

    this.shouldCall_cgs = true;
    this.shouldCall_pac = true;
    this.shouldCall_pgpb = true;
    this.callAllReq();

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

    this.clearProd();

    this.calcChangeAccePrice();

    this.shouldCall_cgs = true;
    this.callAllReq();

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

    this.calcChangeAccePrice();

    this.clearProd();

    this.shouldCall_cgs = true;
    this.callAllReq();

    this.reRender();
  }

  //
  get height() {
    return this._prodData.height;
  }
  set height(v) {
    this._prodData.height = v;
    this.area = this.calcArea();
    this.clearProd();

    this.shouldCall_cgs = true;
    this.shouldCall_pgpb = true;
    this.callAllReq();

    this.reRender();
  }

  /**B(m) */
  get boxB() {
    return this._prodData.boxB;
  }
  set boxB(v) {
    if (v === 'auto') {
      v = this._defaultBoxB;
    }

    this._prodData.boxB = v;

    this._prodData.boxD = pairBD[this._prodData.doorType]?.BtoD[v] ?? '';
    this.area = this.calcArea();

    this.shouldCall_pgpb = true;
    this.callAllReq();

    this.reRender();
  }

  set boxB_noCall(v: string) {
    this._prodData.boxB = v;

    this._prodData.boxD = pairBD[this._prodData.doorType]?.BtoD[v] ?? '';
    this.area = this.calcArea();
    this.reRender();
  }

  /**D(m) */
  get boxD() {
    return this._prodData.boxD;
  }
  set boxD(v) {
    this._prodData.boxD = v;
    this._prodData.boxB = pairBD[this._prodData.doorType]?.DtoB[v] ?? '';
    this.area = this.calcArea();

    this.shouldCall_pgpb = true;
    this.callAllReq();

    this.reRender();
  }

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
    const isSST = checkIsSST(v);

    if (!isSST) {
      this.surface = '';
    }

    Object.values(this.comList || {}).forEach((com) => {
      if (com) {
        com.changeFindedMaterial(v);
      }
    });

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
    this.callRetrieveCreProdCom();
    this.reRender();
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(v) {
    this._prodData.quantity = Number(v);
    this._quantity = v;
    // this.countDualPrice();
    // this.countTotalPrice();
    this.calcProdAllprice();
    this.reRender();
  }

  // 牌價
  get price() {
    if (!this._price) {
      return '';
    }

    return Number(this._price).toLocaleString();
  }

  set price(v) {
    v = v.replace(/,/g, '');
    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._prodData.price = Number(v);
    this._price = v;
    // this.countDualPrice();
    // this.countPrice();
    this.reRender();
  }

  // 牌價複價
  get dualPrice() {
    if (!this._dualPrice) {
      return '';
    }

    return Number(this._dualPrice).toLocaleString();
  }
  set dualPrice(v) {
    // v = v.replace(/,/g, '');
    // const numberRegex = /^(\d+(\.\d+)?|)$/;

    // if (!numberRegex.test(v)) {
    //   return;
    // }

    this._prodData.dualPrice = Number(v);
    this._dualPrice = v;
    // this.countPrice();
    this.reRender();
  }

  // 單價
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
    // this.countTotalPrice();
    this.reRender();
  }

  // 複價
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
    // this._calcProdSubTotalPrice();
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

    this.shouldCall_cgs = true;
    this.shouldCall_pac = true;
    this.shouldCall_pgpb = true;
    this.callAllReq();

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

  get motor() {
    return this._prodData.motor;
  }
  set motor(v) {
    this._prodData.motor = v;
    this.toSetDefaultBoxB();
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get voltage() {
    return this._prodData.voltage;
  }
  set voltage(str) {
    this._prodData.voltage = str;
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //

  get phase() {
    return String(this._prodData.phase);
  }
  set phase(str) {
    this._prodData.phase = Number(str);
    this.callRetrieveCreProdCom();
    this.reRender();
  }

  //
  get motorSupport() {
    return this._prodData.motorSupport;
  }
  set motorSupport(v) {
    this._prodData.motorSupport = v;
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get bottomBar() {
    return this._prodData.bottomBar;
  }
  set bottomBar(v) {
    this._prodData.bottomBar = v;
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get motorLockBox() {
    return this._prodData.motorLockBox;
  }
  set motorLockBox(v) {
    this._prodData.motorLockBox = v;
    this.reRender();
  }
  //
  get doorTrackThick() {
    return this._prodData.doorTrackThick;
  }
  set doorTrackThick(str) {
    this._prodData.doorTrackThick = str;
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get rollerSpec() {
    return this._prodData.rollerSpec;
  }
  set rollerSpec(v) {
    this._prodData.rollerSpec = v;
    this.reRender();
  }
  //
  get doorTrackSilencerStrip() {
    return this._prodData.doorTrackSilencerStrip;
  }
  set doorTrackSilencerStrip(v) {
    this._prodData.doorTrackSilencerStrip = v;
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get onePieceRollUpBox() {
    return this._prodData.onePieceRollUpBox;
  }
  set onePieceRollUpBox(v) {
    this._prodData.onePieceRollUpBox = v;
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get rollUpBoxThick() {
    return this._prodData.rollUpBoxThick;
  }
  set rollUpBoxThick(v) {
    this._prodData.rollUpBoxThick = v;
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get close() {
    return this._prodData.close;
  }
  set close(v) {
    this._prodData.close = v;
    this.reRender();
  }
  //

  /**門片厚度 */ // api 沒有
  get thickness() {
    return this._thickness;
  }
  set thickness(v) {
    this._thickness = v;
    this.reRender();
  }

  get body() {
    //
    if (!this.accessoriesVKeyArr) {
      this.accessoriesVKeyArr = [];
    }

    const checkOptionsKey = Object.keys(this.accessoriesList).every((key) => this.accessoriesVKeyArr!.includes(key));
    const arrForCreate = checkOptionsKey ? this.accessoriesVKeyArr : Object.keys(this.accessoriesList);

    const accessories: TcreateQuotationProductAccessoriesDto[] =
      arrForCreate?.map((key, index) => {
        const item = this.accessoriesList[key];

        return { ...item.body, order: index };
      }) ?? [];
    //
    const components: TcreateQuotationProductComponentDto[] = Object.values(this.comList ?? {}).map((com, index) => {
      const body = com.body;

      return {
        ...body,
        order: index,
        type: body.type as TcreateQuotationProductComponentDto['type'],
      };
    });

    return {
      ...this._prodData,
      // 送去後端要轉為要從m轉為mm
      width: Number(this._prodData.width) * 1000,
      length: Number(this._prodData.length) * 1000,
      height: Number(this._prodData.height) * 1000,
      boxB: Number(this._prodData.boxB) * 1000,
      boxD: Number(this._prodData.boxD) * 1000,
      quantity: Number(this._prodData.quantity),
      //
      rollUpBoxThick: Number(this._prodData.rollUpBoxThick),
      voltage: Number(this._prodData.voltage),
      doorTrackThick: Number(this._prodData.doorTrackThick),
      // doorTrackThick: 1,
      motorSupport: this._prodData.motorSupport,
      //
      materialSurface: this._prodData.surface ?? '',
      isPainted: false,

      components,
      accessories: accessories,
    };
  }

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
  // order?: string;
  // discount: `${number}`;
  discount: string;
  itemName: string;
  quoteType: string;
  doorType: string;
  length: string; // L(m)
  width: string; // W(m)
  height: string; //h(m)
  boxB: string; // B(m)
  // thickness: string; // 門片厚度?
  area: string; // 面積
  volume: string; // 才數
  material: string;
  surface: string;
  doorTrack: string;
  horsepower: string;
  quantity: number;
  price: number;
  dualPrice: number;
  unitPrice: number;
  totalPrice: number;
  typhoonProtection: boolean;
  bounceDoor: boolean;
  notes: string;
  //
  motor: string; // 馬達廠商
  voltage: string; // 電壓
  phase: number; // 相數
  motorSupport: boolean; // 馬達支撐架
  bottomBar: string; // 底座類型
  motorLockBox: string; // 馬達鎖盒
  doorTrackThick: string; // 門軌厚度
  rollerSpec: string; // 捲軸規格
  doorTrackSilencerStrip: boolean; // 門軌消音條
  onePieceRollUpBox: boolean; // 一體式捲箱
  rollUpBoxThick: string; // 捲箱厚度
  close: string; // 開閉方式
  //
  accessories: TquotationProductAccessoriesDto[];
  components: TquotationProductComponentsDto[];
  boxD: string;
};

// type TprodKey = Exclude<keyof Tprod, 'id' | 'order'>;
type TprodKey = string;

const prodkeyArrOri: () => TprodKey[] = () => {
  return [
    'discount',
    'itemName',
    'quoteType',
    'doorType',
    'length',
    'width',
    'height',
    'boxB',
    // 'boxD',
    'thickness',
    'area',
    'volume',
    'material',
    'surface',
    'doorTrack',
    'horsepower',
    'quantity',
    'price', // 牌價
    'dualPrice', // 牌價複價
    'unitPrice', //單價
    'totalPrice', // 複價
    'typhoonProtection',
    'bounceDoor',
    'notes',
    //
    'motor', // 馬達廠商
    'voltage', // 電壓
    'phase', // 相數
    'motorSupport', // 馬達支撐架
    'bottomBar', // 底座類型
    'motorLockBox', // 馬達鎖盒
    'doorTrackThick', // 門軌厚度
    'rollerSpec', // 捲軸規格
    'doorTrackSilencerStrip', // 門軌消音條
    'onePieceRollUpBox', // 一體式捲箱
    'rollUpBoxThick', // 捲箱厚度
    'close', // 開閉方式
  ];
};

const emptyProdOri = (): Tprod => {
  return {
    discount: '100',
    itemName: '',
    quoteType: '',
    doorType: '',
    length: '',
    width: '',
    height: '',
    boxB: '',
    // thickness: '',
    area: '',
    volume: '',
    material: '',
    surface: '',
    doorTrack: '',
    horsepower: '',
    quantity: 1,
    price: 0,
    dualPrice: 0,
    unitPrice: 0,
    totalPrice: 0,
    typhoonProtection: false,
    bounceDoor: false,
    notes: '',
    //
    motor: '',
    voltage: '',
    phase: 1,
    motorSupport: false,
    bottomBar: '',
    motorLockBox: '外露',
    doorTrackThick: '', // 門軌厚度
    rollerSpec: '無凸',
    doorTrackSilencerStrip: false,
    onePieceRollUpBox: false,
    rollUpBoxThick: '', // 捲箱厚度
    close: '',
    //
    accessories: [],
    components: [],
    boxD: '',
  };
};

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

// ===========================================================

const checkIsSST = (material: string) => {
  return material.startsWith('SST#');
};

const creOptions_surface: () => Toption[] = () => [
  { value: '2B', label: '2B' },
  { value: 'HL', label: 'HL' },
  { value: 'BA', label: 'BA' },
  { value: 'NO.4', label: 'NO.4' },
];

// 理論上不會有undefined，但現在情況混亂，先加上去吧
type TpariBD = {
  [key: string]:
    | {
        BtoD: {
          [key: string]: string | undefined;
        };
        DtoB: {
          [key: string]: string | undefined;
        };
      }
    | undefined;
};
// 單位為m
const pairBD: TpariBD = {
  'SJ-302': {
    BtoD: {
      '0.35': '0.56',
      '0.40': '0.60',
      '0.45': '0.65',
      '0.50': '0.75',
      '0.55': '0.80',
      '0.60': '0.90',
    },
    DtoB: {
      '0.56': '0.35',
      '0.60': '0.40',
      '0.65': '0.45',
      '0.75': '0.50',
      '0.80': '0.55',
      '0.90': '0.60',
    },
  },
};

// ===========================================================
// ===========================================================
// ===========================================================
export { Class_product, prodkeyArrOri, prodCellConfig, checkIsSST, creOptions_surface };
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

/**
 
不鏽鋼材質表面：
2B
HL
BA
NO.4
 
非不鏽鋼材質就不能選表面


只有門片有重量
資料來自/products/door/calc-general-spec


材料配件設定
第一個代號不需要，拿掉

主產品設定裡的材質應該是指門片材質

送給後端，從後端收到的 長度相關的單位 都是mm
包過 L W h B
所以要再自己換算


過濾材料配件時，如果條件是null就表示不限制

要有烤漆欄位
除了馬達跟配件都要有
用checkBox表示


主產品設定的材質是指門片材質
變更主產品的材質時，材料配件設定裡面的材質也要跟著變
如果沒有對應的材質，就用SST#304
支板 捲軸 馬達 馬達配件 的材質是固定

主產品設定裡的表面更動時，連帶更動材料配件設定的表面
材料配件設定的材質選項來自 /products/door/models


 */

// ## 材質規則

// - 底座: 鍍鋅鋼板, 高耐鍍鋅鋼板, SST#304, SST#316
// - 門軌: 鍍鋅鋼板, 高耐鍍鋅鋼板, SST#304, SST#316
// - 機械箱: 鍍鋅鋼板, 高耐鍍鋅鋼板, SST#304, SST#316
// - 支板: 黑鐵
// - 捲軸: 黑鐵
// - 馬達: 黑鐵
// - 馬達配件: 其他

/**

主產品的材料改變後 下面沒有相應的材料話就帶入SST304


 */

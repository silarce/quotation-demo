/**
 *prodCellConfig

 * callRetrieveCreProdCom
 * retrieveOptions 下拉式選單產生器
 * Class_product
 * AcceList
 * retrieveCreProdAcce
 * createOptionsList
 * creAcceList
 * accessoriesList
 * takeDefaultDynaValue
 * calcProdAllprice_timeout
 *
 * 下拉式選單的選項
 *
 * req_calcGeneralSpec
 * req_getProdAvailableComponents
 * reqProdGenerateDoorProductBom
 * 

  WG === fullWidth-gapA-gapC

 */

import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';
import { AxiosError } from 'axios';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  optionsCreator_surface,
  optionsCreator_doorModel,
  optionsCreator_bottomBarAngleIron,
  optionsCreator_bottomBarPlate,
  optionsCreator_bottomBarAngleIron_303A,
  optionsCreator_bottomBarPlate_303A,
  optionsCreator_bottomBarAngleIron_303AS,
  optionsCreator_bottomBarPlate_303AS,
  optionsCreator_boxB_SJ302,
  optionsCreator_boxB_SJ303A,
} from 'js/utils/options/productOptions';

const options_surface = optionsCreator_surface();
const options_doorModel = optionsCreator_doorModel();

// ===========================================================
// child class
import { Class_component, Tcomponent, creEmptyCom, comTypeLookUp } from './classComponent';
import { Class_accessories, Taccessories } from './classAccessories';
import { Class_SubCom, TSubCom } from './classSubCom';
// =============================================================================
// api
import {
  TgetBoxDParams,
  TgenerateDoorProductBomDto,
  apiGetProdCalcGeneralSpec,
  apiGetProdAvailableComponents,
  apiPostProdGenerateDoorProductBom,
  apiGetProdCalcDetailSpec,
  apiGetboxD,
} from 'js/api/api_product';

import { apiGetQuotationProducts } from 'js/api/api_quotation';

// =============================================================================

import { prodCellConfig, getInstallationFee } from './prodCellConfig';

import { lookup_boxBAndBoxD } from 'config/product/lookup';

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

import {
  calcProductArea,
  calcProductVolume,
  calcProductWG,
  calcProductFullWidth,
  findBDoptions,
} from 'js/utils/product/calc';

// =============================================================================
// type
import type {
  // TlegacyContractProductDto,
  // TcreateLegacyContractProductDto,
  TdoorComponentListDto,
  TquotationProductAccessoriesDto,
  TgenerateDoorProductBomDto_DoorSpec,
  // TgenerateDoorProductBomDto_ComponentInfo,
  TcreateQuotationProductAccessoriesDto,
  TcreateQuotationProductComponentDto,
  TquotationProductComponentsDto,
  TquotationProductDto,
  TdoorAccessoryDto,
  TcreateQuotationProductDto,
  TdoorGeneralSpecsMotorDto,
} from 'js/api/dtoTypes';

import type { TreRender, TcomponentKey } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
// import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';
import type { TdoorModelInfoDto } from 'js/api/api_product';
import type { TpcgsPrams, TpacParams, TdoorGeneralSpecsDto } from 'js/api/api_product';

// =============================================================================
class Class_product {
  constructor({
    reRender,
    prodData = emptyProdOri(),
    delSelf,
    copySelf,
    callCalcSubTotal,
    // from api
    doorModelList,
    originProd,
    //
    parentProd,
    //
    onDoorTypeChange,
    disabled_quantity,
  }: {
    reRender: TreRender;
    prodData?: Tprod;
    delSelf: () => void;
    copySelf: () => void;
    callCalcSubTotal: () => void;
    // from api
    doorModelList: { [key: string]: TdoorModelInfoDto };
    originProd?: TquotationProductDto;
    //
    parentProd?: Class_product;
    //
    onDoorTypeChange?: (obj: { newDoorType: string; newIsAntiTyphoon: boolean }) => void;
    disabled_quantity?: boolean;
  }) {
    this.reRender = reRender;
    // this.setIsLoading = setIsLoading;
    this._prodData = _.cloneDeep(prodData);
    this.delSelf = delSelf;
    this.copySelf = copySelf;
    this.callCalcSubTotal = callCalcSubTotal;
    this.onDoorTypeChange = onDoorTypeChange;

    this.originProd = originProd;

    // from api
    // 來自/products/door/models // 在useProduct取得 // 目前只有用來生成下拉式選單的樣子
    this._doorModelList = doorModelList;
    //
    this._quantity = String(this._prodData.quantity);

    this._price = String(this._prodData.price);
    this._dualPrice = String(this._prodData.dualPrice);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);

    this.parentProd = parentProd;

    this.findBDoptions();

    this.disabled_quantity = disabled_quantity;

    // __________________________________________________________;

    // 建立材料配件
    const sortedComList = sortComponent(this._prodData.components);
    this.creComList({
      dataList: sortedComList as { [key in TcomponentKey]: Tcomponent },
      isNew: false,
    });

    // ___________________________________________________________
    // 建立選配設定
    this.creAcceList();
    //建立 配電箱與按裝費
    this.creSubComList({ isNew: false });

    // ___________________________________________________________
    if (this._prodData.reduceQty) {
      this.reduceQty = String(this._prodData.reduceQty);
    }
    // ___________________________________________________________

    this._doorGeneralSpecs = {
      bearingHousingSize: this._prodData.bearingHousingSize ?? 0,
      bearingHousingTotalLength: Number(this._prodData.bearingHousingTotalLength) ?? 0,
      bearingInnerDiameter: this._prodData.bearingInnerDiameter ?? '',
      bearingName: this._prodData.bearingName ?? '',
      defaultMotorIndex: -1,
      density: 0,
      diameter: Number(this._prodData.diameter) ?? 0,
      gapA: Number(this._prodData.gapA) ?? 0,
      gapC: Number(this._prodData.gapC) ?? 0,
      motors: [],
      gearNumber: this._prodData.gearNumber ?? '',
      sprocketWheelModel: this._prodData.sprocketWheelModel ?? '',
      sprocketWheelTeethNumber: this._prodData.sprocketWheelTeethNumber ?? '',
      sprocketWheelChains: Number(this._prodData.sprocketWheelChains) ?? 0,
      weight: Number(this._prodData.weight) ?? 0,
      slatLength: Number(this._prodData.slatLength) ?? 0,
      guideRailLength: Number(this._prodData.guideRailLength) ?? 0,
      headBoxLength: Number(this._prodData.headBoxLength) ?? 0,
      thickness: this._prodData.thickness,
    };
  } // = constructor close ===========================================================

  private reRender;
  // readonly setIsLoading;
  delSelf;
  copySelf;
  readonly callCalcSubTotal;
  readonly onDoorTypeChange;

  //  用來比對是否有變動用的
  readonly originProd;
  //  用來比對是否有變動用的
  readonly disabled_quantity;

  isLoading = false;
  isLoading_getProd = false;

  //
  // from api
  // 門型資料
  private _doorModelList;
  _doorGeneralSpecs: TdoorGeneralSpecsDto | undefined;
  private _detailSpecs: { slatCount: number } | undefined;

  private _availableComponents: TdoorComponentListDto | undefined;

  private _defaultBoxB = '';
  // private _boxB: number | undefined;
  //
  private _prodData;
  private _quantity;
  private _price;
  private _dualPrice;
  private _unitPrice;
  private _totalPrice;

  private defaultMotor: TdoorGeneralSpecsMotorDto | undefined = undefined;

  // readonly options_doorTrack_normal = options_doorTrack_normal;
  // readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;

  // ---------------------------------------------------------
  // 追加追減用的
  private parentProd: Class_product | undefined = undefined;

  private _reduceQty = '0';
  private _exchangeProdList: {
    [key in string]: Class_product;
  } = {};

  get hasParent() {
    return !!this.parentProd;
  }

  // ---------------------------------------------------------

  async getComAndAcce() {
    if (this.comList?.slat) {
      return;
    }

    this.isLoading_getProd = true;
    const { components, accessories } = await reqGetComAndAcce(this.id);
    this.isLoading_getProd = false;

    if (components) {
      this.creComList_dyna({ componentsArr: components });
    }

    if (accessories) {
      this.creAcceList_dyna({ acceArr: accessories });
    }
  }

  // ---------------------------------------------------------

  // 材料配件 金額總和
  private comAllPrice = {
    price: 0,
    dualPrice: 0,
    unitPrice: 0,
    totalPrice: 0,
  };

  // 選配 金額總和
  private AcceAllPrice = {
    price: 0,
    dualPrice: 0,
    unitPrice: 0,
    totalPrice: 0,
  };

  // ---------------------------------------------------------
  // req呼叫控制
  // 防抖
  callAllTimeoutId: NodeJS.Timeout | null = null;

  shouldCall_cgs = false; //req_calcGeneralSpec
  shouldCall_pac = false; //req_getProdAvailableComponents
  shouldCall_pgpb = false; //reqProdGenerateDoorProductBom

  // 其他防抖
  timeoutId_retrieveCreProdCom: NodeJS.Timeout | null = null;
  timeoutId_calcFullWidth: NodeJS.Timeout | null = null;

  // ---------------------------------------------------------

  comList: { [key in TcomponentKey]: Class_component } | undefined;

  creComList({ dataList, isNew = true }: { dataList: { [key in TcomponentKey]: Tcomponent }; isNew?: boolean }) {
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
        isNew: isNew,
      });
      list[key] = theClass;
    });

    this.comList = list as { [key in TcomponentKey]: Class_component };

    // this.calcComAllPrice({
    //   toCalcProdAllprice: false,
    // });
    this.reRender();
  }
  /**配合apiGetQuotationProducts使用 */
  creComList_dyna({ componentsArr }: { componentsArr: TquotationProductComponentsDto[] }) {
    const comPreList: Partial<{ [key in TcomponentKey]: Tcomponent }> = {};
    componentsArr.forEach((item) => {
      const key = comTypeLookUp[item.type];
      comPreList[key] = {
        ...item,
        doorModelName: key,
        code: '',
        specialSpec: '',
        materialSurface: item.materialSurface || '',
        quantity: String(item.quantity || 0),
        desc: item.desc || '',
        density: item.density || '0',
      };
    });

    this.creComList({
      dataList: comPreList as { [key in TcomponentKey]: Tcomponent },
      isNew: false,
    });
  }

  // ---------------------------------------------------------

  // 選配設定

  accessoriesList: { [key: string]: Class_accessories } = {};

  delAcce(targetKey: string) {
    delete this.accessoriesList[targetKey];
    this.calcProdAllprice_timeout();
    this.reRender();
  }

  copyAcce(targetKey: string) {
    const newKey = `new-${nanoid()}`;
    const copyData = _.cloneDeep(this.accessoriesList[targetKey].body);

    this.accessoriesList[newKey] = new Class_accessories({
      reRender: this.reRender,
      data: copyData,
      prod: this,
      key: newKey,
    });

    this.reRender();
  }

  /**acceDataArr會來自acce選擇器 */
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
        prod: this,
        key: newKey,
      });
    });

    this.reRender();
  }

  accessoriesVKeyArr: string[] | undefined;

  creAcceList() {
    const optionArr = _.sortBy(this._prodData.accessories, 'order');
    const list: { [key: string]: Class_accessories } = {};

    optionArr?.forEach((item) => {
      let key = item.order !== undefined ? `${item.order}` : nanoid();

      if (key in list) {
        key = nanoid();
      }

      list[key] = new Class_accessories({
        reRender: this.reRender,
        data: _.cloneDeep(item),
        prod: this,
        isNew: false,
        key: key,
      });
    });
    this.accessoriesList = list;
    this.reRender();
  }
  /**配合apiGetQuotationProducts使用 */
  creAcceList_dyna({ acceArr }: { acceArr: TquotationProductAccessoriesDto[] }) {
    // const optionArr = _.sortBy(this._prodData.accessories, 'order');
    const list: { [key: string]: Class_accessories } = {};

    acceArr?.forEach((item) => {
      let key = nanoid();

      if (key in list) {
        key = nanoid();
      }

      list[key] = new Class_accessories({
        reRender: this.reRender,
        data: _.cloneDeep(item),
        prod: this,
        isNew: false,
        key: key,
      });
    });
    this.accessoriesList = list;
    this.reRender();
  }
  //

  subComList: { [key: string]: Class_SubCom } = {};

  creSubComList({ isNew = true }: { isNew?: boolean } = {}) {
    // 配電箱
    const distributionBox = new Class_SubCom({
      reRender: this.reRender,
      data: {
        price: this._prodData.distributionBoxPrice,
        unitPrice: this._prodData.distributionBoxUnitPrice,
        dualPrice: this._prodData.distributionBoxPrice,
        totalPrice: this._prodData.distributionBoxUnitPrice,
        quantity: 1,
        comName: '配電箱及按鈕開關',
        unit: '組',
        desc: '',
      },
      prod: this,
      isNew,
    });

    // 安裝費
    const installationFee = new Class_SubCom({
      reRender: this.reRender,
      data: {
        price: this._prodData.installationFeePrice,
        unitPrice: this._prodData.installationFeeUnitPrice,
        dualPrice: this._prodData.installationFeeDualPrice,
        totalPrice: this._prodData.installationFeeTotalPrice,
        quantity: this._prodData.installationFeeQuantity,
        comName: '按裝及製造費用',
        // unit: 'M',
        unit: (
          <span>
            m<sup>2</sup>
          </span>
        ),
        desc: '(含送電及試車)',
      },
      prod: this,
      isNew,
    });

    this.subComList = { distributionBox, installationFee };
    this.reRender();
  } // creSubComList

  // ---------------------

  clearProd() {
    const empty = emptyProdOri();

    const prod: Tprod = {
      ...empty,
      doorType: this.doorType,
      fullWidth: this.fullWidth,
      WG: this.WG,
      height: this.height,
      area: this.area,
      quantity: this._prodData.quantity,
      price: this._prodData.price,
      dualPrice: this._prodData.dualPrice,
      unitPrice: this._prodData.unitPrice,
      totalPrice: this._prodData.totalPrice,
      discount: this._prodData.discount,
      itemName: this._prodData.itemName,
      quoteType: this._prodData.quoteType,
      //
      material: this._prodData.material,
      surface: this._prodData.surface,
      doorTrack: this._prodData.doorTrack,
      typhoonProtection: this._prodData.typhoonProtection,
      notes: this._prodData.notes,
    };

    this._quantity = String(this._prodData.quantity);
    this._price = String(this._prodData.price);
    this._dualPrice = String(this._prodData.dualPrice);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);

    this._prodData = prod;

    this.comList = undefined;
    this._doorGeneralSpecs = undefined;
    this._detailSpecs = undefined;
    this._availableComponents = undefined;

    this._prodData.boxB = '';
    this._defaultBoxB = '';
    this._prodData.thickness = '';

    this.options_boxB = undefined;
    this.options_boxD = undefined;

    // this.takeDefaultDynaValue();
    // this.findBDoptions();
  } // resetProd

  clearProd_all() {
    const empty = emptyProdOri();

    const prod: Tprod = {
      ...empty,
      doorType: this.doorType,
      quoteType: this._prodData.quoteType,
      itemName: this._prodData.itemName,
    };

    this._prodData = prod;

    this._quantity = String(this._prodData.quantity);
    this._price = String(this._prodData.price);
    this._dualPrice = String(this._prodData.dualPrice);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);

    this.comList = undefined;
    this.accessoriesList = {};
    this._doorGeneralSpecs = undefined;
    this._detailSpecs = undefined;
    this._availableComponents = undefined;

    this._prodData.boxB = '';
    this._defaultBoxB = '';
    this._prodData.thickness = '';

    this.options_boxB = undefined;
    this.options_boxD = undefined;

    this.creSubComList();
  }

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // api請求
  // this.shouldCall_cgs
  async req_calcGeneralSpec() {
    if (!this.doorType || !this.height) {
      return false;
    }

    if (
      !this.fullWidth
      // && !this.WG
    ) {
      return false;
    }

    const body = (() => {
      const fullWidth = Number(this.fullWidth || 0) * 1000;

      return {
        modelName: this.doorType as TpcgsPrams['modelName'],
        height: Number(this.height) * 1000,
        isAntiTyphoon: this.typhoonProtection,
        fullWidth,
        WG: undefined,
      };
    })();

    if (!body.fullWidth && !body.WG) {
      return false;
    }

    const res = await reqGetCalcGeneralSpec(body);

    if (!res) {
      return false;
    }

    this._prodData.WG = String(
      calcProductWG({
        fullWidth: Number(this._prodData.fullWidth || 0) * 1000,
        gapA: res.gapA,
        gapC: res.gapC,
      }) / 1000
    );

    //

    const defaultMotorIndex = res.defaultMotorIndex;
    const defaultMotor = res.motors[defaultMotorIndex];
    const defaultMotorBox = defaultMotor.box;

    this.defaultMotor = defaultMotor;

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
        this.changeBoxBNoCall({
          str: String(defaultMotorBox.東元.boxB / 1000),
          diameter: res.diameter,
        });
      } else if (defaultMotorBox.大同) {
        this.motor = '大同';
        this.changeBoxBNoCall({
          str: String(defaultMotorBox.大同.boxB / 1000),
          diameter: res.diameter,
        });
      } else if (defaultMotorBox.default) {
        this.changeBoxBNoCall({
          str: String(defaultMotorBox.default.boxB / 1000),
          diameter: res.diameter,
        });
      }
    } else {
      this.changeBoxBNoCall({
        str: boxB ? String(boxB / 1000) : '',
        diameter: res.diameter,
      });
    }

    this._defaultBoxB = this.boxB;

    this.findBDoptions();

    // this.options_boxB?.unshift({
    //   value: 'auto',
    //   label: '自動計算',
    // });

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

    return true;
  } // calcGeneralSpec

  // ________________________
  // this.shouldCall_pac
  async req_getProdAvailableComponents() {
    const rollerDiameter = this._doorGeneralSpecs?.diameter;

    if (!this.doorType || !this.weight || !rollerDiameter) {
      return false;
    }

    const res = await reqGetProdAvailableComponents({
      modelName: this.doorType as TpacParams['modelName'],
      weight: this.weight,
      isAntiTyphoon: this.typhoonProtection,
      rollerDiameter: rollerDiameter,
    });

    if (res) {
      this._availableComponents = res;
      this.retrieveOptions();
      this.callRetrieveCreProdCom();

      return true;
    } else {
      return false;
    }

    // try {
    //   const res = await apiGetProdAvailableComponents({
    //     modelName: this.doorType as TpacParams['modelName'],
    //     weight: this.weight,
    //     isAntiTyphoon: this.typhoonProtection,
    //     rollerDiameter: rollerDiameter,
    //   });
    //   this._availableComponents = res;

    //   this.retrieveOptions();
    //   this.callRetrieveCreProdCom();

    //   return true;
    // } catch (error) {
    //   const err = error as AxiosError<{ message: string }>;
    //   myAlert.err({ title: '取得材料配件失敗', content: err.response?.data.message });

    //   return false;
    // }
  } //  req_getProdAvailableComponents

  // this.shouldCall_pgpb
  /**取得材料配件 */
  async reqProdGenerateDoorProductBom() {
    const comList = this.comList;

    // if (!comList || !this._doorGeneralSpecs || !comList.motor.gearNumber) {
    //   return false;
    // }

    if (!comList || !this._doorGeneralSpecs) {
      return false;
    }

    // const fullWidth = Number(this.fullWidth || 0) * 1000 + this._doorGeneralSpecs.gapA + this._doorGeneralSpecs.gapC;
    const fullWidth = Number(this.fullWidth || 0) * 1000;

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
      gearNumber: this._doorGeneralSpecs.gearNumber,
      chains: this._doorGeneralSpecs.sprocketWheelChains,
      fullWidth: fullWidth,

      bottomBarAngleIron: this.bottomBarAngleIron,
      bottomBarPlate: this.bottomBarPlate,
    };

    const generateBomObj_empty: Partial<TgenerateDoorProductBomDto> = { doorSpec };

    let haveNull = false;

    Object.values(comList).forEach((item) => {
      if (!item) {
        haveNull = true;

        return false;
      }

      const key = item.key;
      const {
        // id,
        material,
        materialSurface,
        isPainted,
        componentId,
      } = item.componentInfo;

      if (!componentId || !material) {
        console.log('reqProdGenerateDoorProductBom中斷，componentId或material為空');
        haveNull = true;
      }

      generateBomObj_empty[key] = {
        id: componentId,
        material,
        materialSurface: materialSurface || undefined,
        isPainted,
      };
    });

    if (haveNull) {
      return false;
    }

    const generateBomObj = generateBomObj_empty as TgenerateDoorProductBomDto;

    try {
      const res = await apiPostProdGenerateDoorProductBom(generateBomObj);

      if (res) {
        const keyArr = Object.keys(res) as (keyof typeof res)[];
        keyArr.forEach((key) => {
          const item = res[key];
          comList[key].codeNumber = item.number;
          comList[key].componentId = item.id;
          comList[key].price = item.unitPrice; // 這是牌價，不是單價
          comList[key].bom = item.bom;
          comList[key].quantity = String(item.quantity);
          comList[key].calcAllPrice();
          comList[key].renewDescDensity();
        });
      }

      return true;
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      myAlert.err({ title: '取得bom資料失敗', content: err.response?.data.message });
    }
  } // reqProdGenerateDoorProductBom

  /**取得細部規格(取得slatCount) */
  async reqGetDetailSpec() {
    const res = await reqGetProdCalcDetailSpec({
      modelName: this.doorType as TpcgsPrams['modelName'],
      height: Number(this.height_mm),
      B: Number(this.boxB_mm),
    });

    this._detailSpecs = res || undefined;
    this._prodData.slatCount = String(this._detailSpecs?.slatCount ?? 0);
  }

  async reqChain() {
    let res1: boolean | undefined;
    let res2: boolean | undefined;
    let res3: boolean | undefined;

    try {
      this.isLoading = true;
      this.reRender();

      // 預期_availableComponents會更新，在_availableComponents更新前
      // 不應該呼叫會用到_availableComponents或this.comList的方法
      // 因此在這邊設為undefined，避免呼叫相關方法
      // 在下面呼叫this.req_getProdAvailableComponents而更新_availableComponents後
      // 會使用_availableComponents的方法應該就會被呼叫了(包括建立comList的方法)
      if (this.shouldCall_pac) {
        this._availableComponents = undefined;
        this.comList = undefined;
      }

      if (this.shouldCall_cgs) {
        res1 = await this.req_calcGeneralSpec();
      }

      if (this.shouldCall_pac) {
        res2 = await this.req_getProdAvailableComponents();
      }

      if (this.shouldCall_pgpb) {
        res3 = await this.reqProdGenerateDoorProductBom();
      }
    } catch (error) {
    } finally {
      this.isLoading = false;

      //如果res1或res2呼叫了，就呼叫takeDefaultDynaValue
      if (res1 || res2) {
        this.takeDefaultDynaValue();
      }
      // 呼叫reqProdGenerateDoorProductBom後取得的資料
      // 只有comList(材料配件)會用到
      // 那就根本不需要呼叫takeDefaultDynaValue
      // 那麼dontGetDefaultValue這個變數也不再需要了
      // 確定都沒問題後就把dontGetDefaultValue刪掉

      // else if (res3) {
      //   // 如果dontGetDefaultValue為true
      //   // 代表其中一個會被takeDefaultDynaValue改變的值不應該被改變
      //   // 所以不要呼叫takeDefaultDynaValue
      //   // 例如rollUpBoxThick，現在也只有set rollUpBoxThick會使takeDefaultDynaValue=true
      //   // 會使takeDefaultDynaValue=true的有 set rollUpBoxThick與set doorTrackThick

      //   if (this.dontGetDefaultValue) {
      //     this.dontGetDefaultValue = false;
      //     // this.shouldCall_cgs = false;
      //     // this.shouldCall_pac = false;
      //     // this.shouldCall_pgpb = false;
      //     // this.retrieveCreProdCom();
      //   } else {
      //     this.takeDefaultDynaValue();
      //   }
      // }
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
    }, 800);
  }

  // ---------------------------------------------------------

  // 在一開始取得下拉式選單的選項
  async callApiAndGetOptions() {
    if (this._availableComponents) {
      return;
    }

    if (!this.doorType || !this.height || !this.fullWidth) {
      return;
    }

    this.isLoading = true;
    this.reRender();

    const res_spec = await reqGetCalcGeneralSpec({
      modelName: this.doorType as TpcgsPrams['modelName'],
      height: Number(this.height) * 1000,
      isAntiTyphoon: this.typhoonProtection,
      fullWidth: Number(this.fullWidth || 0) * 1000,
      WG: undefined,
    });

    if (!res_spec) {
      this.isLoading = false;
      this.reRender();

      return;
    }

    this._doorGeneralSpecs = res_spec;

    // const rollerDiameter = res_spec?.diameter;
    const rollerDiameter = this._doorGeneralSpecs?.diameter;

    if (!this.doorType || !this.weight || !rollerDiameter) {
      this.isLoading = false;
      this.reRender();

      return false;
    }

    const res_availableCom = await reqGetProdAvailableComponents({
      modelName: this.doorType as TpacParams['modelName'],
      weight: this.weight,
      isAntiTyphoon: this.typhoonProtection,
      rollerDiameter: rollerDiameter,
    });

    if (res_availableCom) {
      this._availableComponents = res_availableCom;
      this.retrieveOptions();
      this.isLoading = false;
      this.reRender();
    }
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

    let slat: Tcomponent | null = filter_slats({
      //
      dataArr: availableComponents.slats,
      filterParams: { isAntiTyphoon: this.typhoonProtection },
    });

    let bottomBar: Tcomponent | null = filter_bottomBars({
      dataArr: availableComponents.bottomBars,
      filterParams: {
        isAntiTyphoon: this.typhoonProtection,
        isWaterProof: this.bottomBar === '止水型',
        hasAluminumBarrier: this.bottomBar === '鋁障感型',
      },
    });

    let guideRail: Tcomponent | null = filter_guideRails({
      dataArr: availableComponents.guideRails,
      filterParams: {
        thickness: String(this.doorTrackThick),
        isAntiTyphoon: this.typhoonProtection,
        hasSilencingStrip: this.doorTrackSilencerStrip,
        imageName: this.doorTrack,
      },
    });

    let motor: Tcomponent | null = filter_motors({
      dataArr: availableComponents.motors,
      filterParams: {
        horsePower: this.horsepower,
        gearNumber: this._doorGeneralSpecs?.gearNumber ?? 'undefined', // 那時好像是因為沒有鍊齒輪番號的資料所以才先略過
        motorVendor: this.motor,
        phase: Number(this.phase),
        voltage: Number(this.voltage),
        weight: this.weight,
        hasSupportStand: this.motorSupport,
      },
    });

    if (!motor) {
      // ! 現在馬達欄位隱藏，不會給使用者操作，所以可以直接在這邊自動變更
      // ! 以後若讓使用者操作馬達，就不能這樣直接變更
      this._prodData.motor = this.options_motor?.[1].value ?? '';
      motor = filter_motors({
        dataArr: availableComponents.motors,
        filterParams: {
          horsePower: this.horsepower,
          gearNumber: this._doorGeneralSpecs?.gearNumber ?? 'undefined', // 那時好像是因為沒有鍊齒輪番號的資料所以才先略過
          motorVendor: this.motor,
          phase: Number(this.phase),
          voltage: Number(this.voltage),
          weight: this.weight,
          hasSupportStand: this.motorSupport,
        },
      });
    }

    console.log(this.boxB_mm);

    let sidePlate: Tcomponent | null = filter_sidePlates({
      dataArr: availableComponents.sidePlates,
      filterParams: {
        bearingType: this._doorGeneralSpecs?.bearingName ?? 'undefined', // 從doorGeneralSpecs取得
        gearNumber: this._doorGeneralSpecs?.gearNumber ?? 'undefined',
        isIntegrated: this.onePieceRollUpBox,
        motorVendor: this.motor,
        weight: this.weight,
        // sizeB: this.boxB,
        sizeB: Number(this.boxB_mm),
      },
    });

    let roller: Tcomponent | null = filter_rollers({
      dataArr: availableComponents.rollers,
      filterParams: {
        diameter: String(this._doorGeneralSpecs?.diameter ?? ''),
      },
    });

    let motorAccessories: Tcomponent | null = filter_motorAccessories({
      dataArr: availableComponents.motorAccessories,
      filterParams: {
        /**鍊條排數 */
        chains: this._doorGeneralSpecs?.sprocketWheelChains ?? 0,
        /**軸承 */ // 從doorGeneralSpecs取資料
        bearingType: this._doorGeneralSpecs?.bearingName || '',
        gearNumber: this._doorGeneralSpecs?.gearNumber || '',
      },
    });

    let headBox: Tcomponent | null = filter_headBoxes({
      dataArr: availableComponents.headBoxes,
      filterParams: {
        thickness: this.rollUpBoxThick, // 捲箱厚度
        /**一體式捲箱 */
        isIntegrated: this.onePieceRollUpBox, // 一體式捲箱
      },
    });

    const isGearNumberChanged = this.comList?.motor?.gearNumber !== motor?.gearNumber;
    // TODO get /products/door/available-components取得的金額不是正確的金額
    // 正的金額之後會補在 post /products/door/generate-door-product-bom

    slat = _.cloneDeep(slat);
    roller = _.cloneDeep(roller);
    headBox = _.cloneDeep(headBox);
    bottomBar = _.cloneDeep(bottomBar);
    guideRail = _.cloneDeep(guideRail);
    motor = _.cloneDeep(motor);
    motorAccessories = _.cloneDeep(motorAccessories);
    sidePlate = _.cloneDeep(sidePlate);

    [slat, roller, headBox, bottomBar, guideRail, motor, motorAccessories, sidePlate].forEach((item) => {
      if (item) {
        item.componentId = item.id;
        item.id = '';
      }
    });

    if (!slat) {
      myAlert.info({ title: '沒有符合規格的捲門片' });
    }

    if (!roller) {
      myAlert.info({ title: '沒有符合規格的捲軸' });
    }

    if (!headBox) {
      myAlert.info({ title: '沒有符合規格的門箱' });
    }

    if (!bottomBar) {
      myAlert.info({ title: '沒有符合規格的底座' });
    }

    if (!guideRail) {
      myAlert.info({ title: '沒有符合規格的門軌' });
    }

    if (!motor) {
      myAlert.info({ title: '沒有符合規格的馬達' });
    }

    if (!motorAccessories) {
      myAlert.info({ title: '沒有符合規格的馬達配件' });
    }

    if (!sidePlate) {
      myAlert.info({ title: '沒有符合規格的支板' });
    }

    const dataList = {
      slat: slat || creEmptyCom(),
      roller: roller || creEmptyCom(),
      headBox: headBox || creEmptyCom(),
      bottomBar: bottomBar || creEmptyCom(),
      guideRail: guideRail || creEmptyCom(),
      motor: motor || creEmptyCom(),
      motorAccessories: motorAccessories || creEmptyCom(),
      sidePlate: sidePlate || creEmptyCom(),
    };
    Object.values(dataList).forEach((item) => {
      item.price = 0;
    });

    // 主產品的厚度就是門片厚度
    dataList.slat.thickness = this.thickness;

    this.creComList({
      dataList,
    });
    this.material = this.material;

    this.shouldCall_pgpb = true;
    this.callAllReq();

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
    // const defaultMotorIndex = this._doorGeneralSpecs?.defaultMotorIndex ?? 0;
    const defaultMotor = this.defaultMotor;

    // console.log(defaultMotor);
    // console.log(this.options_motor);

    const call = () => {
      this._prodData.doorTrackThick = this.options_doorTrackThick?.[0].value ?? '';
      this._prodData.rollUpBoxThick = this.options_rollUpBoxThick?.[0].value ?? '';
      this._prodData.motor = this.options_motor?.[0].value ?? '';
      // this._prodData.horsepower = this.options_horsepower?.[defaultMotorIndex].value ?? '';
      this._prodData.horsepower = defaultMotor?.hp ?? '';
      this._prodData.phase = Number(this.options_phase?.[0].value ?? '1');
      this._prodData.voltage = this.options_voltage?.[0].value ?? '';
      this.callRetrieveCreProdCom();
    };

    // 做比對，如果值都一樣就不執行call
    if (
      this._prodData.doorTrackThick !== this.options_doorTrackThick?.[0].value ||
      this._prodData.rollUpBoxThick !== this.options_rollUpBoxThick?.[0].value ||
      this._prodData.motor !== this.options_motor?.[0].value ||
      // this._prodData.horsepower !== this.options_horsepower?.[defaultMotorIndex].value ||
      this._prodData.horsepower !== defaultMotor?.hp ||
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

  private timeoutId_calcProdAllprice: NodeJS.Timeout | null = null;

  /**計算prod所有的價格 防抖*/
  calcProdAllprice_timeout() {
    if (this.timeoutId_calcProdAllprice) {
      clearTimeout(this.timeoutId_calcProdAllprice);
    }

    this.timeoutId_calcProdAllprice = setTimeout(() => {
      this.calcProdAllprice();
    }, 100);
  }

  calcProdAllprice_simple() {
    const price = new Decimal(this._prodData.price);
    const qty = this._prodData.quantity;
    const discount = Number(this._prodData.discount || '0');

    this.dualPrice = price.mul(qty).toString();
    this.unitPrice = price.mul(discount).div(100).toString();
    this.totalPrice = price.mul(qty).mul(discount).div(100).toString();
  }

  /**計算prod所有的價格 */
  private calcProdAllprice() {
    this.calcAccessoriesAllprice();
    this.calcComAllPrice();

    // ________________________________________________
    const quantity = Number(this._quantity);

    // 牌價 為材料配件設定與選配設定的 牌價複價 總和
    const price = new Decimal(this.comAllPrice.dualPrice || 0).add(this.AcceAllPrice.dualPrice || 0);

    // 單價 為材料配件設定與選配設定的 複價 總和
    const unitPrice = new Decimal(this.comAllPrice.totalPrice || 0).add(this.AcceAllPrice.totalPrice || 0);

    const dualPrice = price.mul(quantity || 0).toNumber();

    this.price = price.toFixed(0).toString();
    this.dualPrice = dualPrice.toFixed(0).toString();

    // 複價===四捨五入後的單價*數量
    const fiexedUnitPrice = unitPrice.toFixed(0);
    this.unitPrice = fiexedUnitPrice;
    // const totalPrice = unitPrice.mul(quantity || 0).toNumber();
    const totalPrice = new Decimal(fiexedUnitPrice).mul(quantity || 0).toNumber();
    this.totalPrice = totalPrice.toFixed(0).toString();

    this.callCalcSubTotal();
    this.reRender();
  }

  /**計算Accessories所有的價格 */
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
    });

    this.AcceAllPrice = {
      price: Number(d_price.toFixed(0)),
      dualPrice: Number(d_dualPrice.toFixed(0)),
      unitPrice: Number(d_unitPrice.toFixed(0)),
      totalPrice: Number(d_totalPrice.toFixed(0)),
    };
  } // calcAccessoriesAllprice

  calcComAllPrice() {
    let d_price = new Decimal(0);
    let d_dualPrice = new Decimal(0);
    let d_unitPrice = new Decimal(0);
    let d_totalPrice = new Decimal(0);

    const comListArr = Object.values(this.comList ?? {});
    const subComListArr = Object.values(this.subComList ?? {});
    const arr = [...comListArr, ...subComListArr];

    arr.forEach((item) => {
      if (!item) {
        return;
      }

      const { price, dualPrice, unitPrice, totalPrice } = item;

      d_price = d_price.add(price || 0);
      d_dualPrice = d_dualPrice.add(dualPrice || 0);
      d_unitPrice = d_unitPrice.add(unitPrice || 0);
      d_totalPrice = d_totalPrice.add(totalPrice || 0);
    });

    this.comAllPrice = {
      price: Number(d_price.toFixed(0)),
      dualPrice: Number(d_dualPrice.toFixed(0)),
      unitPrice: Number(d_unitPrice.toFixed(0)),
      totalPrice: Number(d_totalPrice.toFixed(0)),
    };
  } // calcComAllPrice

  calcSubComAllPrice() {
    let d_price = new Decimal(0);
    let d_dualPrice = new Decimal(0);
    let d_unitPrice = new Decimal(0);
    let d_totalPrice = new Decimal(0);

    const subComListArr = Object.values(this.subComList ?? {});

    subComListArr.forEach((item) => {
      if (!item) {
        return;
      }

      const { price, dualPrice, unitPrice, totalPrice } = item;

      d_price = d_price.add(price || 0);
      d_dualPrice = d_dualPrice.add(dualPrice || 0);
      d_unitPrice = d_unitPrice.add(unitPrice || 0);
      d_totalPrice = d_totalPrice.add(totalPrice || 0);
    });

    this.comAllPrice = {
      price: Number(d_price.toFixed(0)),
      dualPrice: Number(d_dualPrice.toFixed(0)),
      unitPrice: Number(d_unitPrice.toFixed(0)),
      totalPrice: Number(d_totalPrice.toFixed(0)),
    };
  } // calcComAllPrice

  private calcArea() {
    const h = Number(this._prodData.height || 0);
    const b = Number(this._prodData.boxB || 0);
    // const w = Number(this._prodData.WG || 0);
    const w = 0;
    const l = Number(this._prodData.fullWidth || 0);

    const area = calcProductArea({
      height: h,
      boxb: b,
      fullWidth: l,
      WG: w,
    });

    // const area = Decimal.add(h, b) // h+b
    //   .mul(w || l)
    //   .toFixed(2)
    //   .toString();

    return area;
  }

  /**所有acce執行calcPrice */
  calcChangeAccePrice() {
    Object.values(this.accessoriesList)?.forEach((acce) => {
      acce.calcPrice();
    });
  }

  /**計算才數 */
  private calcVolume() {
    return calcProductVolume(Number(this.area || 0));
    // return Decimal.mul(this.area || 0, 10.89)
    //   .toFixed(2)
    //   .toString();
  }

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
      // console.log(motorVendorList);
      // // 只留東元
      // // delete motorVendorList.大同;

      this.options_motor = Object.values(motorVendorList).reverse();
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
      this.options_boxB = undefined;

      if (this.doorType === 'SJ-302') {
        this.options_boxB = _.cloneDeep(optionsCreator_boxB_SJ302());
      } else if (this.doorType === 'SJ-303A' || this.doorType === 'SJ-303AS') {
        this.options_boxB = _.cloneDeep(optionsCreator_boxB_SJ303A());
      }

      if (this.options_boxB) {
        this.options_boxB.unshift({
          value: 'auto',
          label: '自動計算',
        });
      }
    }
  }

  /**變更角鐵與底座版 */
  // getBottomBarAngleIronAndBottomBarPlate(v: '鍍鋅鋼板' | '高耐鍍鋅鋼板' | '不鏽鋼#304' | '不鏽鋼#316') {
  getBottomBarAngleIronAndBottomBarPlate(
    // v: '鍍鋅鋼板' | '高耐鍍鋅鋼板' | '不鏽鋼#304' | '不鏽鋼#316'
    v: string
  ) {
    if (v === '鍍鋅鋼板') {
      this.bottomBarAngleIron = this.options_bottomBarAngleIron[0].value;
      this.bottomBarPlate = this.options_bottomBarPlate[0].value;
    } else if (v.includes('高耐鍍鋅鋼板')) {
      this.bottomBarAngleIron = this.options_bottomBarAngleIron[1].value;
      this.bottomBarPlate = this.options_bottomBarPlate[1].value;
    } else if (v.includes('304')) {
      this.bottomBarAngleIron = this.options_bottomBarAngleIron[2].value;
      this.bottomBarPlate = this.options_bottomBarPlate[2].value;
    } else if (v.includes('316')) {
      this.bottomBarAngleIron = this.options_bottomBarAngleIron[3].value;
      this.bottomBarPlate = this.options_bottomBarPlate[3].value;
    } else {
      this.bottomBarAngleIron = this.options_bottomBarAngleIron[2].value;
      this.bottomBarPlate = this.options_bottomBarPlate[2].value;
    }
  }

  toGetInstallationFee() {
    const m2 = Number(this.area);
    const doorType = this.doorType;

    const installationFee_class = this.subComList.installationFee;

    const fee = getInstallationFee({
      doorModel: doorType,
      m2,
    });

    installationFee_class.price_locale = String(fee);
  }

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
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

  // options_bottomBarAngleIron: Toption[] | undefined = undefined;
  // options_bottomBarPlate: Toption[] | undefined = undefined;

  /**門型 options */
  get options_doorType() {
    return Object.values(this._doorModelList).map((item) => {
      const theIndex = options_doorModel.findIndex((model) => {
        return item.name === model.value;
      });

      if (options_doorModel[theIndex]) {
        return options_doorModel[theIndex];
      } else {
        return {
          value: item.name,
          label: item.name,
        };
      }
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
        guideRailsOpening: item.opening,
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
      // return [
      //   { value: '2B', label: '2B' },
      //   { value: 'HL', label: 'HL' },
      //   { value: 'BA', label: 'BA' },
      //   { value: 'NO.4', label: 'NO.4' },
      // ];
      return options_surface;
    }

    return undefined;
  }

  /**底座角鐵 */
  get options_bottomBarAngleIron() {
    if (this._prodData.doorType === 'SJ-302') {
      return optionsCreator_bottomBarAngleIron();
    }

    if (this._prodData.doorType === 'SJ-303A') {
      return optionsCreator_bottomBarAngleIron_303A();
    }

    if (this._prodData.doorType === 'SJ-303AS') {
      return optionsCreator_bottomBarAngleIron_303AS();
    }

    return [];
  }
  get options_bottomBarPlate() {
    if (this._prodData.doorType === 'SJ-302') {
      return optionsCreator_bottomBarPlate();
    }

    if (this._prodData.doorType === 'SJ-303A') {
      return optionsCreator_bottomBarPlate_303A();
    }

    if (this._prodData.doorType === 'SJ-303AS') {
      return optionsCreator_bottomBarPlate_303AS();
    }

    return [];
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

    // TODO 這個地方要做防抖
    // 因為折數改變了，所以選配設定的價格要重新計算
    Object.values(this.comList ?? {}).forEach((item, index, arr) => {
      if (item) {
        item.calcAllPrice();
      }
    });
    Object.values(this.subComList ?? {}).forEach((item, index, arr) => {
      if (item) {
        item.calcAllPrice();
      }
    });

    Object.values(this.accessoriesList).forEach((item, index, arr) => {
      item.calcAllPrice();
    });

    this.reRender();
  }

  clearId() {
    this._prodData.id = undefined;
    this._prodData.rootProductId = undefined;
  }
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------
  // ---------------------------------------------------------------------

  get id() {
    return this._prodData.id;
  }

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
    this.clearProd_all();

    if (!this.doorTrack) {
      this.doorTrack = this.options_doorTrack?.[0]?.value ?? '';
    }

    this.toGetInstallationFee();

    this.shouldCall_cgs = true;
    this.shouldCall_pac = true;
    this.shouldCall_pgpb = true;
    this.callAllReq();
    // onDoorTypeChange必須放在賦值之後再執行
    this.onDoorTypeChange?.({ newDoorType: this.doorType, newIsAntiTyphoon: this.typhoonProtection });

    this.reRender();
  }
  /**全寬 */
  get fullWidth() {
    return this._prodData.fullWidth;
  }
  set fullWidth(v) {
    this._prodData.fullWidth = v;
    // this._prodData.WG = '0';
    this.area = this.calcArea();
    this.clearProd();
    this.calcChangeAccePrice();
    this.shouldCall_cgs = true;
    this.callAllReq();

    this.reRender();
  }

  /**WG */
  get WG() {
    return this._prodData.WG;
  }

  set WG(v) {
    /**
  20231006
  業主說fullWidth與WG不再互斥，可以同時存在
  經理說所有用fullWidth或WG計算的地方，都改成只用fullWidth計算
  為了避免未來又要改回來，把被改動的地方記錄了下來
  
  原本會用到WG的地方
  req_calcGeneralSpec
  reqProdGenerateDoorProductBom
  calcArea
  
  Class_component 的calcDefaultQuantity
  Class_accessories的calcPrice

  quotationPdf_new的productArr

  pages\domestic\quotationList\quotation\index.tsx
  的pdfPartProps
   */

    // this._prodData.fullWidth = '0';
    // this.area = this.calcArea();

    // this.calcChangeAccePrice();

    // this.clearProd();

    // this.shouldCall_cgs = true;
    // this.callAllReq();
    this._prodData.WG = v;

    const callReq = async () => {
      const fullWidth = await calcFullwidthWithWG({
        body: {
          modelName: this.doorType as TpcgsPrams['modelName'],
          height: Number(this.height) * 1000,
          isAntiTyphoon: this.typhoonProtection,
          WG: Number(this.WG) * 1000,
        },
      });

      this._prodData.fullWidth = String(fullWidth / 1000);

      this.area = this.calcArea();
      this.clearProd();
      this.calcChangeAccePrice();
      this.shouldCall_cgs = true;
      this.callAllReq();
    };

    if (this.timeoutId_calcFullWidth) {
      clearTimeout(this.timeoutId_calcFullWidth);
    }

    this.timeoutId_calcFullWidth = setTimeout(async () => {
      await callReq();
      this.reRender();
    }, 800);

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
  get height_mm() {
    return String(Number(this._prodData.height) * 1000);
  }

  /**B(m) */
  get boxB() {
    return this._prodData.boxB;
  }
  set boxB(v) {
    const setBoxB = async () => {
      if (v === 'auto') {
        v = this._defaultBoxB;
      }

      this._prodData.boxB = v;

      const reqBody: TgetBoxDParams = {
        modelName: this.doorType,
        rollerDiameter: this._doorGeneralSpecs?.diameter ?? 0,
        sidePlateSizeB: Number(this.boxB_mm),
        hp: this.horsepower,
        motorVendor: this.motor,
      };

      try {
        this.isLoading = true;
        const res = await apiGetboxD(reqBody);

        if (res) {
          const sidePlateSizeD = res?.sidePlateSizeD;
          this._prodData.boxD = new Decimal(sidePlateSizeD).div(1000).toString();
        }
      } catch (error) {
        // const err = error as Error;
        // myAlert.err({ title: '取得boxD失敗', content: err.message });
        this._prodData.boxD = '0';
      } finally {
        this.isLoading = false;
      }

      this.area = this.calcArea();

      this.callRetrieveCreProdCom();

      this.shouldCall_pgpb = true;
      this.callAllReq();

      this.reRender();
    };

    setBoxB();
  }

  set boxB_noCall(v: string) {
    const setBoxB = async () => {
      this._prodData.boxB = v;

      const reqBody: TgetBoxDParams = {
        modelName: this.doorType,
        rollerDiameter: this._doorGeneralSpecs?.diameter ?? 0,
        sidePlateSizeB: Number(this.boxB_mm),
        hp: this.horsepower,
        motorVendor: this.motor,
      };

      try {
        this.isLoading = true;
        const res = await apiGetboxD(reqBody);

        if (res) {
          const sidePlateSizeD = res?.sidePlateSizeD;
          this._prodData.boxD = new Decimal(sidePlateSizeD).div(1000).toString();
        }
      } catch (error) {
        // const err = error as Error;
        // myAlert.err({ title: '取得boxD失敗', content: err.message });
        this._prodData.boxD = '0';
      } finally {
        this.isLoading = false;
      }

      this.area = this.calcArea();
      this.reRender();
    };

    setBoxB();
  }

  get boxB_mm() {
    return String(Number(this._prodData.boxB) * 1000);
  }

  async changeBoxBNoCall({ str, diameter }: { str: string; diameter: number }) {
    this._prodData.boxB = str;

    const reqBody: TgetBoxDParams = {
      modelName: this.doorType,
      rollerDiameter: this._doorGeneralSpecs?.diameter ?? diameter ?? 0,
      sidePlateSizeB: Number(this.boxB_mm),
      hp: this.horsepower,
      motorVendor: this.motor,
    };

    try {
      this.isLoading = true;
      const res = await apiGetboxD(reqBody);

      if (res) {
        const sidePlateSizeD = res?.sidePlateSizeD;
        this._prodData.boxD = new Decimal(sidePlateSizeD).div(1000).toString();
      }
    } catch (error) {
      // const err = error as Error;
      // myAlert.err({ title: '取得boxD失敗', content: err.message });
      this._prodData.boxD = '0';
    } finally {
      this.isLoading = false;
    }

    this.area = this.calcArea();
    this.reRender();
  }

  /**D(m) */
  get boxD() {
    return this._prodData.boxD;
  }
  set boxD(v) {
    // this._prodData.boxD = v;
    // this._prodData.boxB = lookup_boxBAndBoxD[this._prodData.doorType]?.DtoB[v] ?? '';
    // this.area = this.calcArea();

    // this.shouldCall_pgpb = true;
    // this.callAllReq();

    this.reRender();
  }

  //
  get area() {
    return this._prodData.area;
  }
  set area(v) {
    this._prodData.area = v;

    if (this.comList?.slat) {
      this.comList.slat.quantity = v;
    }

    if (this.subComList?.installationFee) {
      this.subComList.installationFee.quantity = v;
    }

    this.volume = this.calcVolume();
    this.toGetInstallationFee();
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

    const bottomBarAngleIron_options = this.options_bottomBarAngleIron;
    const bottomBarPlate_options = this.options_bottomBarPlate;

    if (v.includes('鍍鋅')) {
      this.bottomBarAngleIron = bottomBarAngleIron_options[0].value;
      this.bottomBarPlate = bottomBarPlate_options[0].value;
    } else if (v.includes('高耐鍍鋅鋼板')) {
      this.bottomBarAngleIron = bottomBarAngleIron_options[1].value;
      this.bottomBarPlate = bottomBarPlate_options[1].value;
    } else if (v.includes('304')) {
      this.bottomBarAngleIron = bottomBarAngleIron_options[2].value;
      this.bottomBarPlate = bottomBarPlate_options[2].value;
    } else if (v.includes('316')) {
      this.bottomBarAngleIron = bottomBarAngleIron_options[3].value;
      this.bottomBarPlate = bottomBarPlate_options[3].value;
    } else {
      this.bottomBarAngleIron = bottomBarAngleIron_options[2].value;
      this.bottomBarPlate = bottomBarPlate_options[2].value;
    }

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
    const theGuideRail = this.options_doorTrack?.find((item) => {
      return item?.value === v;
    });
    this._prodData.guideRailsOpening = theGuideRail?.guideRailsOpening ?? '';

    this.callRetrieveCreProdCom();

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
    if (this.parentProd) {
      const remain = this.parentProd.remainQty + Number(this._quantity);

      if (Number(v) > remain) {
        return;
      }
    }

    const originallyIsZero = this._quantity === '0';

    this._prodData.quantity = Number(v);
    this._quantity = v;

    this.calcProdAllprice_timeout();

    if (originallyIsZero) {
      // 呼叫callAllReq後就會再自動算金額了
      this.shouldCall_cgs = true;
      this.shouldCall_pac = true;
      this.shouldCall_pgpb = true;
      this.callAllReq();
    }

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

    this._prodData.price = Number(v);
    this._price = v;

    this.calcProdAllprice_simple();
    this.callCalcSubTotal();

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
    this._prodData.dualPrice = Number(v);
    this._dualPrice = v;
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
    // onDoorTypeChange必須放在賦值之後再執行
    this.onDoorTypeChange?.({ newDoorType: this.doorType, newIsAntiTyphoon: this.typhoonProtection });
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

  /**底座角鐵 */
  get bottomBarAngleIron() {
    return this._prodData.bottomBarAngleIron;
  }
  set bottomBarAngleIron(v) {
    this._prodData.bottomBarAngleIron = v;
    this.shouldCall_pgpb = true;
    this.callAllReq();
    this.reRender();
  }
  /**底座版 */
  get bottomBarPlate() {
    return this._prodData.bottomBarPlate;
  }
  set bottomBarPlate(v) {
    this._prodData.bottomBarPlate = v;
    this.shouldCall_pgpb = true;
    this.callAllReq();
    this.reRender();
  }

  //

  /**門片厚度 */ //TODO api 沒有門片厚度 //好像有了?待確認
  get thickness() {
    return this._prodData.thickness;
  }
  set thickness(v) {
    this._prodData.thickness = v;
    this.reRender();
  }

  get attachedToProductId() {
    return this._prodData.attachedToProductId;
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  // 追加追減

  attachId = 'attach-' + nanoid();

  // 因變更而新增的prod
  get exchangeProdList() {
    return this._exchangeProdList;
  }

  get remainQty() {
    return Number(this._quantity) - Number(this._reduceQty) - Number(this.exchangeQty);
  }

  // 追減數量
  get reduceQty() {
    return this._reduceQty;
  }
  set reduceQty(v) {
    const nv = Number(v);

    if (nv > this.remainQty + Number(this.reduceQty)) {
      return;
    }

    this._reduceQty = v;
    this.reRender();

    const asyncCall = async () => {
      await this.getComAndAcce();

      this.calcProdAllprice_timeout();
      this.reRender();
    };

    asyncCall();
  }

  // 變更數量
  get exchangeQty() {
    let qty = 0;
    Object.values(this._exchangeProdList).forEach((item) => {
      qty = qty + Number(item.quantity || 0);
    });

    return qty;
  }

  // 追減/變更金額
  get reduceExchangePrice() {
    const qty = Number(this.reduceQty || 0) + Number(this.exchangeQty || 0);
    const reducePrice = Decimal.mul(qty, this._unitPrice || 0).toString();

    return reducePrice;
  }

  // 新增變更的prod
  async addExchange(v: string) {
    if (Number(v) > this.remainQty) {
      return false;
    }

    if (this.isLoading_getProd) {
      return 'isLoading_getProd';
    }

    await this.getComAndAcce();

    const copy = _.cloneDeep(this.body_Tprod);
    // copy.id = undefined;
    copy.id = this.id;
    copy.quantity = Number(v);
    copy.dualPrice = new Decimal(copy.quantity).mul(copy.price).toNumber();
    copy.totalPrice = new Decimal(copy.quantity).mul(copy.unitPrice).toNumber();

    const exId = 'ex-' + nanoid();

    const delSelf = () => {
      delete this._exchangeProdList[exId];
      this.reRender();
    };

    this._exchangeProdList[exId] = new Class_product({
      reRender: this.reRender,
      prodData: copy,
      delSelf,
      copySelf: () => {},
      callCalcSubTotal: () => {},
      doorModelList: this._doorModelList,
      parentProd: this,
      disabled_quantity: true,
    });

    this.reRender();

    return true;
    //
  }

  // 清空變更prod
  clearAttach() {
    this._exchangeProdList = {};
    this._reduceQty = '0';
    this.reRender();
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  get comBodyArr() {
    const components: TcreateQuotationProductComponentDto[] = Object.values(this.comList ?? {}).map((com, index) => {
      const body = com.body;

      return {
        ...body,
        order: index,
        type: body.type as TcreateQuotationProductComponentDto['type'],
        quantity: String(body.quantity),
        density: String(body.density),
        desc: body.desc || '',
      };
    });

    return components;
  }

  get acceBodyArr() {
    //
    if (!this.accessoriesVKeyArr) {
      this.accessoriesVKeyArr = [];
    }

    const checkOptionsKey = Object.keys(this.accessoriesList).every((key) => this.accessoriesVKeyArr!.includes(key));
    const arrForCreate = checkOptionsKey ? this.accessoriesVKeyArr : Object.keys(this.accessoriesList);

    const accessories: TcreateQuotationProductAccessoriesDto[] =
      arrForCreate?.map((key, index) => {
        const item = this.accessoriesList[key];

        return {
          ...item.body,
          order: index,
        };
      }) ?? [];

    return accessories;
  }

  get body() {
    const copy = _.cloneDeep(this._prodData);

    const body: TcreateQuotationProductDto & {
      id: string | undefined;
    } = {
      ...copy,
      id: copy.id,
      doorModelName: this.doorType,
      materialName: this.material,
      materialSurface: this.surface || null,
      guideRail: this.doorTrack,
      motorVendor: this.motor,
      guideRailThickness: Number(this.doorTrackThick),
      hasSilencingStrip: this.doorTrackSilencerStrip,
      isIntegratedHeadBox: this.onePieceRollUpBox,
      isAntiTyphoon: this.typhoonProtection,
      closingType: this.close,
      motorPhase: Number(this.phase),

      // 送去後端要轉為要從m轉為mm
      WG: Number(this._prodData.WG) * 1000,
      fullWidth: Number(this._prodData.fullWidth) * 1000,
      height: Number(this._prodData.height) * 1000,
      boxB: Number(this._prodData.boxB) * 1000,
      boxD: Number(this._prodData.boxD) * 1000,
      quantity: Number(this._prodData.quantity),

      headBoxThickness: Number(this._prodData.rollUpBoxThick),
      motorVoltage: Number(this._prodData.voltage),

      hasMotorSupportStand: this._prodData.motorSupport,

      isPainted: false,

      price: Number(this._price),
      dualPrice: Number(this._dualPrice),
      unitPrice: Number(this._unitPrice),
      totalPrice: Number(this._totalPrice),

      components: this.comBodyArr,
      accessories: this.acceBodyArr,
      order: 0,

      thickness: this.thickness || '',

      distributionBoxPrice: Number(this.subComList.distributionBox.price),
      distributionBoxUnitPrice: Number(this.subComList.distributionBox.unitPrice),
      installationFeePrice: Number(this.subComList.installationFee.price),
      installationFeeDualPrice: Number(this.subComList.installationFee.dualPrice),
      installationFeeQuantity: Number(this.subComList.installationFee.quantity),
      installationFeeUnitPrice: Number(this.subComList.installationFee.unitPrice),
      installationFeeTotalPrice: Number(this.subComList.installationFee.totalPrice),

      bottomBar: this._prodData.bottomBar === 'none' ? '' : this._prodData.bottomBar,

      bearingHousingSize: this._doorGeneralSpecs?.bearingHousingSize ?? 0,
      bearingHousingTotalLength: String(this._doorGeneralSpecs?.bearingHousingTotalLength ?? 0),
      bearingInnerDiameter: this._doorGeneralSpecs?.bearingInnerDiameter ?? '',
      bearingName: this._doorGeneralSpecs?.bearingName ?? '',
      diameter: String(this._doorGeneralSpecs?.diameter ?? 0),
      gapA: String(this._doorGeneralSpecs?.gapA ?? 0),
      gapC: String(this._doorGeneralSpecs?.gapC ?? 0),
      gearNumber: this._doorGeneralSpecs?.gearNumber ?? '',
      sprocketWheelModel: this._doorGeneralSpecs?.sprocketWheelModel ?? '',
      sprocketWheelTeethNumber: this._doorGeneralSpecs?.sprocketWheelTeethNumber ?? '',
      sprocketWheelChains: String(this._doorGeneralSpecs?.sprocketWheelChains ?? 0),
      weight: String(this._doorGeneralSpecs?.weight ?? 0),
      slatLength: this._doorGeneralSpecs?.slatLength ?? 0,
      guideRailLength: this._doorGeneralSpecs?.guideRailLength ?? 0,
      headBoxLength: this._doorGeneralSpecs?.headBoxLength ?? 0,
    };

    if ('items' in body) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      delete body.items;
    }

    return body;
  }

  get body_Tprod() {
    const copy = _.cloneDeep(this._prodData);
    const body: Tprod = {
      ...copy,
      id: copy.id,
      quantity: Number(this._prodData.quantity),
      price: Number(this._price),
      dualPrice: Number(this._dualPrice),
      unitPrice: Number(this._unitPrice),
      totalPrice: Number(this._totalPrice),

      components: this.comBodyArr,
      accessories: this.acceBodyArr,

      distributionBoxPrice: Number(this.subComList.distributionBox.price),
      distributionBoxUnitPrice: Number(this.subComList.distributionBox.unitPrice),
      installationFeePrice: Number(this.subComList.installationFee.price),
      installationFeeDualPrice: Number(this.subComList.installationFee.dualPrice),
      installationFeeQuantity: Number(this.subComList.installationFee.quantity),
      installationFeeUnitPrice: Number(this.subComList.installationFee.unitPrice),
      installationFeeTotalPrice: Number(this.subComList.installationFee.totalPrice),

      bearingHousingSize: this._doorGeneralSpecs?.bearingHousingSize ?? 0,
      bearingHousingTotalLength: String(this._doorGeneralSpecs?.bearingHousingTotalLength ?? 0),
      bearingInnerDiameter: this._doorGeneralSpecs?.bearingInnerDiameter ?? '',
      bearingName: this._doorGeneralSpecs?.bearingName ?? '',
      diameter: String(this._doorGeneralSpecs?.diameter ?? 0),
      gapA: String(this._doorGeneralSpecs?.gapA ?? 0),
      gapC: String(this._doorGeneralSpecs?.gapC ?? 0),
      gearNumber: this._doorGeneralSpecs?.gearNumber ?? '',
      sprocketWheelModel: this._doorGeneralSpecs?.sprocketWheelModel ?? '',
      sprocketWheelTeethNumber: this._doorGeneralSpecs?.sprocketWheelTeethNumber ?? '',
      sprocketWheelChains: String(this._doorGeneralSpecs?.sprocketWheelChains ?? 0),
      weight: String(this._doorGeneralSpecs?.weight ?? 0),
      slatLength: this._doorGeneralSpecs?.slatLength ?? 0,
      guideRailLength: this._doorGeneralSpecs?.guideRailLength ?? 0,
      headBoxLength: this._doorGeneralSpecs?.headBoxLength ?? 0,
    };

    return body;
  }

  get isAttachDiv() {
    if (Number(this.reduceQty) || this.exchangeQty) {
      return true;
    }

    return false;
  }

  get body_attachDiv() {
    // const body = this.body;
    const divQty = Number(this.reduceQty) + this.exchangeQty;
    const theBody = this.body;

    const quantity = theBody.quantity - divQty;

    const body = {
      ...this.body,
      quantity: quantity,
      dualPrice: new Decimal(quantity).mul(theBody.price).toNumber(),
      totalPrice: new Decimal(quantity).mul(theBody.unitPrice).toNumber(),
      attachedToProductId: this.id,
    };
    // body.quantity = body.quantity - divQty;
    // body.dualPrice = new Decimal(body.quantity).mul(body.price).toNumber();
    // body.totalPrice = new Decimal(body.quantity).mul(body.unitPrice).toNumber();
    // body.attachedToProductId = this.id;

    return body;
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

  fullWidth: string; // L(m)
  WG: string; // W(m)

  height: string; //h(m)
  boxB: string; // B(m)
  thickness: string; // 門片厚度?
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
  // accessories: TcreateQuotationProductAccessoriesDto[];
  // components: TcreateQuotationProductComponentDto[];
  // accessories: TquotationProductAccessoriesDto[];
  // components: TquotationProductComponentsDto[];
  accessories: (Omit<TquotationProductAccessoriesDto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string })[];
  components: (Omit<TquotationProductComponentsDto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string })[];
  boxD: string;
  //
  bottomBarAngleIron: string;
  bottomBarPlate: string;
  //
  // 用來辨識至追加追減
  attachedToProductId?: string | null;
  //
  distributionBoxPrice: number;
  // 配電箱單價;
  distributionBoxUnitPrice: number;
  // 安裝費牌價;
  installationFeePrice: number;
  // 安裝費牌價複價;
  installationFeeDualPrice: number;
  // 安裝費數量;
  installationFeeQuantity: number;
  // 安裝費單價;
  installationFeeUnitPrice: number;
  // 安裝費複價;
  installationFeeTotalPrice: number;

  slatCount: string | null; //門片 - 捲片支數
  sprocketWheelModel: string | null; //鏈齒輪 - 鏈齒輪番號
  sprocketWheelTeethNumber: string | null; //鏈齒輪 - 大鏈輪
  sprocketWheelChains: string | null; //
  bearingInnerDiameter: string | null; //鏈齒輪/捲軸 - 孔徑/軸徑
  diameter: string | null; //捲軸 - 尺寸
  bearingHousingTotalLength: string | null; //捲軸 - 總長
  guideRailsOpening: string | null; //底座 - 開口
  slatLength: number | null; //門片長度
  guideRailLength: number | null; //門軌長度
  headBoxLength: number | null; //捲箱長度
  bearingHousingSize: number | null; //軸承座寸法
  bearingName: string | null; //軸承
  gapA: string | null; //
  gapC: string | null; //
  gearNumber: string | null; //
  weight: string | null; //

  //
  reduceQty?: number;
  //
  rootProductId?: string;
};

// type TprodKey = Exclude<keyof Tprod, 'id' | 'order'>;
type TprodKey = string;

const prodkeyArrOri: () => TprodKey[] = () => {
  return [
    'discount',
    'itemName',
    'quoteType',
    'doorType',

    'fullWidth',
    'WG',

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

    // 經理說這些要隱藏，不要顯示出來
    // 'motor', // 馬達廠商
    // 'voltage', // 電壓
    // 'phase', // 相數
    // 'motorSupport', // 馬達支撐架
    // 'bottomBar', // 底座類型
    // 'motorLockBox', // 馬達鎖盒
    'doorTrackThick', // 門軌厚度
    // 'rollerSpec', // 捲軸規格
    'doorTrackSilencerStrip', // 門軌消音條
    // 'onePieceRollUpBox', // 一體式捲箱
    'rollUpBoxThick', // 捲箱厚度
    'close', // 開閉方式
    // 'bottomBarAngleIron', // 底座角鐵
    // 'bottomBarPlate', // 底座板
  ];
};

const emptyProdOri = (): Tprod => {
  return {
    discount: '100',
    itemName: '',
    quoteType: '',
    doorType: '',

    fullWidth: '',
    WG: '',

    height: '',
    boxB: '',
    thickness: '',
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
    bottomBar: 'none',
    motorLockBox: '外露',
    doorTrackThick: '', // 門軌厚度
    rollerSpec: '無凸',
    doorTrackSilencerStrip: false,
    onePieceRollUpBox: false,
    rollUpBoxThick: '', // 捲箱厚度
    close: (prodCellConfig.close.inputSelProps.selectProps!.props!.options![0] as Toption).value,
    //
    accessories: [],
    components: [],
    boxD: '',
    //
    bottomBarAngleIron: '不鏽鋼#304 50*50*3T', // 來自prodCellConfig
    bottomBarPlate: '不鏽鋼#304 1.5T', // 來自prodCellConfig
    //

    // 配電箱 牌價;
    distributionBoxPrice: 5940,
    // 配電箱 單價;
    distributionBoxUnitPrice: 5940,
    // 安裝費 牌價;
    installationFeePrice: 1800,
    // 安裝費 牌價複價;
    installationFeeDualPrice: 1800,
    // 安裝費 數量;
    installationFeeQuantity: 0,
    // 安裝費 單價;
    installationFeeUnitPrice: 1800,
    // 安裝費 複價;
    installationFeeTotalPrice: 1800,

    slatCount: '',
    sprocketWheelModel: '',
    sprocketWheelTeethNumber: '',
    sprocketWheelChains: '',
    bearingInnerDiameter: '',
    diameter: '',
    bearingHousingTotalLength: '',
    guideRailsOpening: '',
    slatLength: 0,
    guideRailLength: 0,
    headBoxLength: 0,
    bearingHousingSize: 0,
    bearingName: '',
    gapA: '',
    gapC: '',
    gearNumber: '',
    weight: '',
  };
};

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

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
// type TpariBD = {
//   [key: string]:
//     | {
//         BtoD: {
//           [key: string]: string | undefined;
//         };
//         DtoB: {
//           [key: string]: string | undefined;
//         };
//       }
//     | undefined;
// };
// // 單位為m
// const pairBD: TpariBD = {
//   'SJ-302': {
//     BtoD: {
//       '0.35': '0.56',
//       '0.40': '0.60',
//       '0.45': '0.65',
//       '0.50': '0.75',
//       '0.55': '0.80',
//       '0.60': '0.90',
//     },
//     DtoB: {
//       '0.56': '0.35',
//       '0.60': '0.40',
//       '0.65': '0.45',
//       '0.75': '0.50',
//       '0.80': '0.55',
//       '0.90': '0.60',
//     },
//   },
// };

const sortComponent = (comArr: TcreateQuotationProductComponentDto[]) => {
  const comPreList: Partial<{ [key in TcomponentKey]: Tcomponent }> = {};

  // 至邊改順序的話記得retrieveCreProdCom裡面的也要改
  const typeArr = [
    'slat',
    'roller',
    'headBox',
    'bottomBar',
    'guideRail',
    'motor',
    'motorAccessories',
    'sidePlate',
  ] as const;

  comArr.forEach((item) => {
    const key = comTypeLookUp[item.type];
    comPreList[key] = {
      ...item,
      doorModelName: key,
      code: '',
      specialSpec: '',
      materialSurface: item.materialSurface || '',
      quantity: String(item.quantity || 0),
      desc: item.desc || '',
      density: item.density || '0',
    };
  });

  const list: Partial<{ [key in TcomponentKey]: Tcomponent }> = {};

  typeArr.forEach((key) => {
    list[key] = comPreList[key];
  });

  return list;
};

const reqGetComAndAcce = async (id: string | undefined) => {
  if (!id) {
    return {};
  }

  const res = await apiGetQuotationProducts(id);

  if (res?.items) {
    const { components, accessories } = res.items[0];

    return { components, accessories };
  } else {
    return {};
  }
};

const calcFullwidthWithWG = async ({
  body,
}: {
  body: {
    modelName: TpcgsPrams['modelName'];
    height: number; // 單位為mm
    isAntiTyphoon: boolean;
    // fullWidth?:undefined
    WG: number; // 單位為mm
  };
}) => {
  try {
    const res = await apiGetProdCalcGeneralSpec(body);
    const { gapA, gapC } = res;

    // const fullWidth = gapA + gapC + body.WG;
    const fullWidth = calcProductFullWidth({
      gapA,
      gapC,
      WG: body.WG,
    });

    return fullWidth;
  } catch (error) {
    return 0;
  }
};

const reqGetCalcGeneralSpec = async ({
  //
  modelName,
  height,
  fullWidth,
  WG,
  isAntiTyphoon,
}: {
  modelName: string;
  height: number;
  fullWidth?: number;
  WG?: number;
  isAntiTyphoon: boolean;
}) => {
  const body = {
    modelName: modelName as TpcgsPrams['modelName'],
    height,
    isAntiTyphoon,
    fullWidth,
    WG: WG,
  };

  if (!body.fullWidth && !body.WG) {
    return false;
  }

  try {
    const res = await apiGetProdCalcGeneralSpec(body as TpcgsPrams);

    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    myAlert.err({ title: '計算規格失敗', content: err.response?.data.message });

    return false;
  }
};

const reqGetProdAvailableComponents = async (body: {
  modelName: TpacParams['modelName'];
  weight: number;
  isAntiTyphoon: boolean;
  rollerDiameter: number;
}) => {
  try {
    const res = await apiGetProdAvailableComponents(body);

    return res;
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    myAlert.err({ title: '取得材料配件失敗', content: err.response?.data.message });

    return false;
  }
};

const reqGetProdCalcDetailSpec = async (body: { modelName: TdoorModelInfoDto['name']; height: number; B: number }) => {
  try {
    const theBody = {
      ...body,
      modelName: body.modelName as TdoorModelInfoDto['name'],
    };

    const res = await apiGetProdCalcDetailSpec(theBody);

    if (res) {
      return res;
    }
  } catch (error) {
    const err = error as AxiosError<{ message: string }>;
    myAlert.err({ title: '取得細部規格失敗', content: err.response?.data.message });

    return false;
  }
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

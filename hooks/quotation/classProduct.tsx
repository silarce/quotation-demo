// 注意事項目錄 (用法:ctrl+f 搜尋關鍵字)
// warning01

// prodCellConfig

//  retrieveOptions 下拉式選單產生器
//  下拉式選單的選項

//  callRetrieveCreProdCom
//  Class_product
//  AcceList
//  retrieveCreProdAcce
//  createOptionsList
//  creAcceList
//  accessoriesList
//  takeDefaultDynaValue
//
//  calcProdAllprice_timeout
//
//  callAllReq
//  reqChain
//  req_calcGeneralSpec
//  req_getProdAvailableComponents
//  reqProdGenerateDoorProductBom
//  toGetInstallationFee // 計算材料配件的 按裝及製造費用 的金額
//

// WG = fullWidth-gapA-gapC
// G = guideRailG + guideRailG
// W = WG - guideRailG -guideRailG

// 關於馬達
// 營業部現行的做法是
// 以東元的單價計算
// 2HP以上的馬達自動取三相馬達
// 不管伏特數
//
// 因此取得預設馬達時要以東元優先
// 馬力1.5HP以上時要相數要自動改為三相
// 低於1.5HP時要相數要自動改為單相
// 馬達過濾器先以原本的伏特數過濾，沒有符合的馬達的話就改伏特數再過濾一次

import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';
import { AxiosError } from 'axios';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

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

const options_surface = optionsCreator_surface();
const options_surface_onlyPaint = optionsCreator_surface_onlyPaint();
// const options_doorModel = optionsCreator_doorModel();
const options_doorModelName = optionsCreator_doorModelName();
const options_quoteType = optionsCreator_quoteType();

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
  Thp,
  apiGetProdCalcGeneralSpec,
  apiGetProdAvailableComponents,
  apiPostProdGenerateDoorProductBom,
  apiGetProdCalcDetailSpec,
  apiGetboxD,
} from 'js/api/api_product';

import { apiGetQuotationProducts } from 'js/api/api_quotation';

// =============================================================================

import { prodCellConfig, getInstallationFee } from './prodCellConfig';

import { lookup_distributionBoxPrice, lookup_horsePowerToNumber, lookup_hpToGapAGapC } from 'config/product/lookup';

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
  calcW,
  calcW_2,
  calcProductWG_withWAndG,
  findBDoptions,
} from 'js/utils/product/calc';

import { checkIsFloat } from 'js/utils/checkValue';

// =============================================================================
// type
import type {
  // TlegacyContractProductDto,
  // TcreateLegacyContractProductDto,
  TdoorComponentListDto,
  TquotationProductAccessoryDto,
  TgenerateDoorProductBomDto_DoorSpec,
  // TgenerateDoorProductBomDto_ComponentInfo,
  TcreateQuotationProductAccessoryDto,
  TcreateQuotationProductComponentDto,
  TquotationProductComponentDto,
  TquotationProductDto,
  TdoorAccessoryDto,
  TcreateQuotationProductDto,
  TdoorGeneralSpecsMotorDto,
  TdoorGeneralSpecsMotorBoxDto,
  TmaterialSurface,
} from 'js/api/dtoTypes';

import type { TreRender, TcomponentKey } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
// import type { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import type { Toption } from 'js/utils/options/options';
import type { TdoorModelInfoDto } from 'js/api/api_product';
import type { TpcgsPrams, TpacParams, TdoorGeneralSpecsDto } from 'js/api/api_product';

// =============================================================================

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
  // 門軌G
  guideRailG: number;
  horsepower: string;
  quantity: number;
  price: number;
  dualPrice: number;
  unitPrice: number;
  totalPrice: number;
  typhoonProtection: boolean;
  bounceDoor: boolean;
  // 彈射門尺寸
  bounceDoorWidth: number;
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
  accessories: (Omit<TquotationProductAccessoryDto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string })[];
  components: (Omit<TquotationProductComponentDto, 'id' | 'createdAt' | 'updatedAt'> & { id?: string })[];
  boxD: string;
  //
  bottomBarAngleIron: string;
  bottomBarPlate: string;
  //
  // 用來辨識至追加追減
  attachedToProductId?: string | null;
  //
  // distributionBoxPrice: number;
  // // 配電箱單價;
  // distributionBoxUnitPrice: number;
  // 配電箱數量;
  distributionBoxQuantity: number;
  // 配電箱牌價;
  distributionBoxPrice: number;
  // 配電箱牌價複價;
  distributionBoxDualPrice: number;
  // 配電箱單價;
  distributionBoxUnitPrice: number;
  // 配電箱複價;
  distributionBoxTotalPrice: number;

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

  isULGuideRail: boolean;

  //
  reduceQty?: number;
  //
  rootProductId?: string;
};

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
    onDiscountChange,
    onQtyChange,
    disabled_quantity,
    quotationDiscount,
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
    onDiscountChange: () => void;
    onQtyChange: () => void;
    disabled_quantity?: boolean;
    //
    // 報價單折數，也就是TquotationContentDto[discount]
    quotationDiscount: number;
  }) {
    this.reRender_ori = reRender;

    // this.reRender = () => {
    //   this.renderCount++;
    //   reRender();
    // };
    this.reRender = function () {
      this.renderCount++;
      reRender();
    };

    // this.setIsLoading = setIsLoading;
    this._prodData = _.cloneDeep(prodData);
    this.delSelf = delSelf;
    this.copySelf = copySelf;
    this.callCalcSubTotal = callCalcSubTotal;
    this.onDoorTypeChange = onDoorTypeChange;
    this.onDiscountChange = onDiscountChange;
    this.onQtyChange = onQtyChange;

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

    this._bounceDoorWidth = new Decimal(this._prodData.bounceDoorWidth).div(1000).toString();

    this.parentProd = parentProd;

    // this.findBDoptions();

    this.disabled_quantity = disabled_quantity;

    // 報價單折數，也就是TquotationContentDto[discount]
    this._quotationDiscount = quotationDiscount;

    if (!this._prodData.material && !this.isSpecialProd) {
      this._prodData.material = 'SST#304';
      this._prodData.surface = '2B';
    }

    // __________________________________________________________;

    // 建立材料配件
    if (!this.isSpecialProd) {
      const sortedComList = sortComponent(this._prodData.components);
      this.creComList({
        dataList: sortedComList as { [key in TcomponentKey]: Tcomponent },
        isNew: false,
      });
    }

    // ___________________________________________________________
    // 建立選配設定
    this.creAcceList();

    //建立 配電箱與按裝費
    if (!this.isSpecialProd) {
      this.creSubComList({ isNew: false });
    }

    // ___________________________________________________________
    if (this._prodData.reduceQty) {
      this.reduceQty = String(this._prodData.reduceQty);
    }
    // ___________________________________________________________

    this.resetDoorGeneralSpacs();
  } //  constructor close ===========================================================

  private reRender_ori;
  private reRender;
  renderCount = 0;
  // readonly setIsLoading;
  delSelf;
  copySelf;
  readonly callCalcSubTotal;
  readonly onDoorTypeChange;
  readonly onDiscountChange;
  readonly onQtyChange;

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

  private _bounceDoorWidth;

  private defaultMotorSpecs: TdoorGeneralSpecsMotorDto | undefined = undefined;

  // readonly options_doorTrack_normal = options_doorTrack_normal;
  // readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;

  private _quotationDiscount = 100;

  private makeFormatValueDontTriggerTwice = false;

  private isWgChanged = false;
  private isDontClearProd = false;

  private isEditW_noGapA = false;

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
  callAllTimeoutId: NodeJS.Timeout | undefined = undefined;

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
      let com = dataList[key];

      if (!com) {
        return null;
      }

      if (com.rawData && isNew === false) {
        com = {
          ...com.rawData,
          ...com,
        };
      }

      const theClass = new Class_component({
        reRender: this.reRender_ori,
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
  // 配合apiGetQuotationProducts使用
  creComList_dyna({ componentsArr }: { componentsArr: TquotationProductComponentDto[] }) {
    const sortedComponent = sortComponent(componentsArr);

    const comPreList: Partial<{ [key in TcomponentKey]: Tcomponent }> = {};

    componentsArr.forEach((item) => {
      const key = comTypeLookUp[item.type];
      comPreList[key] = {
        code: '',
        specialSpec: '',
        ...(item.rawData ?? {}),
        ...item,
        doorModelName: key,
        materialSurface: item.materialSurface || '',
        quantity: String(item.quantity || 0),
        desc: item.desc || '',
        density: item.density || '0',
      };
    });

    this.creComList({
      dataList: sortedComponent as { [key in TcomponentKey]: Tcomponent },
      isNew: false,
    });
    //
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
      reRender: this.reRender_ori,
      data: copyData,
      prod: this,
      key: newKey,
    });

    this.reRender();
  }

  // acceDataArr會來自acce選擇器
  addAcce(acceDataArr: TdoorAccessoryDto[]) {
    acceDataArr.forEach((acceData) => {
      const newKey = `new-${nanoid()}`;
      const acceClassData: Taccessories = {
        codeName: acceData.id,
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
        reRender: this.reRender_ori,
        data: acceClassData,
        prod: this,
        key: newKey,
      });
    });

    this.reRender();
  }

  accessoriesVKeyArr: string[] | undefined;

  creAcceList() {
    const acceArr = _.sortBy(this._prodData.accessories, 'order');
    const list: { [key: string]: Class_accessories } = {};

    acceArr?.forEach((item) => {
      let key = item.order !== undefined ? `${item.order}` : nanoid();

      if (key in list) {
        key = nanoid();
      }

      list[key] = new Class_accessories({
        reRender: this.reRender_ori,
        data: _.cloneDeep(item),
        prod: this,
        isNew: false,
        key: key,
      });
    });
    this.accessoriesList = list;
    this.reRender();
  }
  // 配合apiGetQuotationProducts使用
  creAcceList_dyna({ acceArr }: { acceArr: TquotationProductAccessoryDto[] }) {
    // const optionArr = _.sortBy(this._prodData.accessories, 'order');
    const list: { [key: string]: Class_accessories } = {};

    acceArr?.forEach((item) => {
      let key = nanoid();

      if (key in list) {
        key = nanoid();
      }

      list[key] = new Class_accessories({
        reRender: this.reRender_ori,
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
      reRender: this.reRender_ori,
      data: {
        price: this._prodData.distributionBoxPrice,
        unitPrice: this._prodData.distributionBoxUnitPrice,
        dualPrice: this._prodData.distributionBoxDualPrice,
        totalPrice: this._prodData.distributionBoxTotalPrice,
        quantity: this._prodData.distributionBoxQuantity,
        comName: '配電箱及按鈕開關',
        unit: '組',
        desc: '',
      },
      prod: this,
      isNew,
    });

    // 安裝費
    const installationFee = new Class_SubCom({
      reRender: this.reRender_ori,
      data: {
        price: this._prodData.installationFeePrice,
        unitPrice: this._prodData.installationFeeUnitPrice,
        dualPrice: this._prodData.installationFeeDualPrice,
        totalPrice: this._prodData.installationFeeTotalPrice,
        quantity: this._prodData.installationFeeQuantity,
        comName: '按裝及製造費用',
        unit: 'm\u00B2', // m2 平方公尺
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
    // if(this.isWgChanged)

    const empty = emptyProdOri();

    const prod: Tprod = {
      ...empty,
      // 20240710
      // 變更追加需要送來源產品id給後端，所以把id留下來
      // 未仔細測試，不確定是否有問題
      id: this._prodData.id,
      //
      discount: this._prodData.discount,
      doorType: this.doorType,
      fullWidth: this.fullWidth,
      WG: this.WG,
      height: this.height,
      area: this.area,
      volume: this.volume,
      quantity: this._prodData.quantity,
      price: this._prodData.price,
      dualPrice: this._prodData.dualPrice,
      unitPrice: this._prodData.unitPrice,
      totalPrice: this._prodData.totalPrice,
      itemName: this._prodData.itemName,
      quoteType: this._prodData.quoteType,
      //
      material: this._prodData.material,
      surface: this._prodData.surface,
      //
      doorTrack: this._prodData.doorTrack,
      guideRailG: this.guildRailG_mm,
      guideRailsOpening: this._prodData.guideRailsOpening,
      doorTrackSilencerStrip: this._prodData.doorTrackSilencerStrip,
      //
      typhoonProtection: this._prodData.typhoonProtection,
      notes: this._prodData.notes,
    };

    this._quantity = String(this._prodData.quantity);
    this._price = String(this._prodData.price);
    this._dualPrice = String(this._prodData.dualPrice);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);

    // prod.boxB = '';
    // prod.thickness = '';

    if (this.isWgChanged) {
      prod.horsepower = this._prodData.horsepower;
      prod.motor = this._prodData.motor;
      prod.boxB = this._prodData.boxB;
      prod.boxD = this._prodData.boxD;
      // prod.gapA = this._prodData.gapA;
      // prod.gapC = this._prodData.gapC;
      // prod.gapA = this._doorGeneralSpecs?.gapA ?? 0;
      // prod.gapC = this._doorGeneralSpecs?.gapC ?? 0;
    }

    this._prodData = prod;

    this.comList = undefined;
    this._doorGeneralSpecs = undefined;
    this._detailSpecs = undefined;
    this._availableComponents = undefined;

    // this._prodData.boxB = '';
    // this._prodData.thickness = '';
    this._defaultBoxB = '';

    // this.options_boxB = undefined;
    // this.options_boxD = undefined;

    // this.takeDefaultDynaValue();
    // this.findBDoptions();
  } // resetProd

  clearProd_all() {
    const empty = emptyProdOri();

    const prod: Tprod = {
      ...empty,
      // 20240710
      // 變更追加需要送來源產品id給後端，所以把id留下來
      // 未仔細測試，不確定是否有問題
      id: this._prodData.id,
      doorType: this.doorType,
      quoteType: this._prodData.quoteType,
      itemName: this._prodData.itemName,
      material: this._prodData.material,
      surface: this._prodData.surface,
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

    // this.options_boxB = undefined;
    // this.options_boxD = undefined;

    this.creSubComList();
  }

  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // ---------------------------------------------------------
  // api請求
  // this.shouldCall_cgs
  async req_calcGeneralSpec() {
    // const hadHorsepower = !!this._prodData.horsepower;
    const wasWgChanged = this.isWgChanged;

    if (!this.isDontClearProd) {
      this.clearProd();
    }

    this.isDontClearProd = false;

    if (!this.doorType || !this.height) {
      // this.isWgChanged = false;

      return false;
    }

    if (
      !this.fullWidth
      // && !this.WG
    ) {
      // this.isWgChanged = false;

      return false;
    }

    const body = (() => {
      // const fullWidth = Number(this.fullWidth || 0) * 1000;
      const fullWidth = new Decimal(this.fullWidth || 0).mul(1000).toNumber();
      const modelName = this.doorType as TpcgsPrams['modelName'];
      // const height = Number(this.height) * 1000;
      const height = new Decimal(this.height).mul(1000).toNumber();
      const isAntiTyphoon = this.typhoonProtection;

      const hp = this.horsepower.replaceAll('HP', '') as Thp;

      return {
        modelName,
        height,
        isAntiTyphoon,
        fullWidth,
        WG: undefined,
        hp: this.isWgChanged ? hp : undefined,
      };
    })();

    if (body.fullWidth <= 0 && !body.WG) {
      // this.isWgChanged = false;

      return false;
    }

    const res = await reqGetCalcGeneralSpec(body);

    if (!res) {
      // this.isWgChanged = false;

      return false;
    }

    this._doorGeneralSpecs = res;

    const oldW = this.W;

    // this._prodData.WG = String(
    //   calcProductWG({
    //     fullWidth: new Decimal(this._prodData.fullWidth || 0).mul(1000).toNumber(),
    //     gapA: this._doorGeneralSpecs.gapA,
    //     gapC: this._doorGeneralSpecs.gapC,
    //   }) / 1000
    // );

    const theWG = calcProductWG({
      fullWidth: new Decimal(this._prodData.fullWidth || 0).mul(1000).toNumber(),
      gapA: this._doorGeneralSpecs.gapA,
      gapC: this._doorGeneralSpecs.gapC,
    });
    this._prodData.WG = new Decimal(theWG).div(1000).toString();

    if (!this.doorTrack) {
      // 必須要有門軌才會有guildRailG才能計算正確的W
      this.doorTrack = this.options_doorTrack?.[0]?.value ?? '';
    }

    this.thickness = this._doorGeneralSpecs.thickness;

    //

    const { defaultMotorSpecs, defaultMotorVendor, defaultBoxB, defaultMotorBox } = calcDefaultMotor({
      doorGeneralSpecs: this._doorGeneralSpecs,
    });

    // 內有預設boxB boxD 馬達廠商 馬力
    this.defaultMotorSpecs = defaultMotorSpecs;

    if (!wasWgChanged || !this._prodData.boxB || !this.horsepower) {
      this.horsepower = defaultMotorSpecs.hp;

      this.motor = defaultMotorVendor ?? '';
      const theBoxB = String(this.boxB || defaultBoxB || '');

      this._prodData.boxB = theBoxB;
      this._defaultBoxB = theBoxB;

      const res_boxD = await reqGetBoxD({
        modelName: this.doorType,
        rollerDiameter: this._doorGeneralSpecs.diameter,
        sidePlateSizeB: Number(this.boxB_mm),
        hp: this.horsepower,
        motorVendor: this.motor,
      });

      const boxD = res_boxD?.sidePlateSizeD ?? '0';
      this._prodData.boxD = new Decimal(boxD).div(1000).toString();
      this.area = this.calcArea();
      this.reRender();

      if (wasWgChanged) {
        this.W = oldW;
      }
    }

    // this.options_boxB?.unshift({
    //   value: 'auto',
    //   label: '自動計算',
    // });

    // 這個判斷沒有意義，改變寬度或高度時weight一定會改變
    // 先判斷跟原本的是否一樣
    // if (
    //   this._doorGeneralSpecs?.weight !== res.weight ||
    //   this._doorGeneralSpecs?.diameter !== res.diameter
    //   //
    // ) {
    //   this.shouldCall_pac = true;
    // }
    this.shouldCall_pac = true;

    // 這個判斷幾乎沒有意義，改變寬度時部分欄位一定會改變
    // 而寬度經常改變
    // if (
    //   this._doorGeneralSpecs?.diameter !== res.diameter ||
    //   this._doorGeneralSpecs?.slatLength !== res.slatLength ||
    //   this._doorGeneralSpecs?.guideRailLength !== res.guideRailLength ||
    //   this._doorGeneralSpecs?.bearingHousingTotalLength !== res.bearingHousingTotalLength ||
    //   this._doorGeneralSpecs?.headBoxLength !== res.headBoxLength ||
    //   this._doorGeneralSpecs?.bearingName !== res.bearingName ||
    //   this._doorGeneralSpecs?.sprocketWheelChains !== res.sprocketWheelChains
    // ) {
    //   this.shouldCall_pgpb = true;
    // }
    this.shouldCall_pgpb = true;

    this._doorGeneralSpecs = res;

    this.isWgChanged = false;

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
  } //  req_getProdAvailableComponents

  async reqProdGenerateDoorProductBom() {
    const comList = this.comList;

    // if (!comList || !this._doorGeneralSpecs || !comList.motor.gearNumber) {
    //   return false;
    // }

    if (!comList || !this._doorGeneralSpecs) {
      return false;
    }

    // const fullWidth = Number(this.fullWidth || 0) * 1000 + this._doorGeneralSpecs.gapA + this._doorGeneralSpecs.gapC;
    // const fullWidth = Number(this.fullWidth || 0) * 1000;
    const fullWidth = new Decimal(this.fullWidth).mul(1000).toNumber();

    const doorSpec: TgenerateDoorProductBomDto_DoorSpec = {
      modelName: this.doorType as TgenerateDoorProductBomDto_DoorSpec['modelName'],
      weight: this.weight ?? -1,
      // height: Number(this.height) * 1000,
      height: new Decimal(this.height).mul(1000).toNumber(),
      // B: Number(this.boxB) * 1000,
      // D: Number(this._prodData.boxD) * 1000,
      B: new Decimal(this.boxB).mul(1000).toNumber(),
      D: new Decimal(this._prodData.boxD).mul(1000).toNumber(),
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

    const generateBomObj_pre: Partial<TgenerateDoorProductBomDto> = { doorSpec };

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
        isPainted,
        componentId,
      } = item.componentInfo;

      let materialSurface = item.componentInfo.materialSurface;

      // materialSurface臨時新增烤漆，烤漆的處理等同2B
      if (materialSurface === '烤漆' || materialSurface === '氟碳') {
        materialSurface = '2B';
      }

      if (key === 'bottomBar') {
        materialSurface = undefined;
      }

      if (!componentId || !material) {
        console.log('reqProdGenerateDoorProductBom中斷，componentId或material為空');
        haveNull = true;
      }

      generateBomObj_pre[key] = {
        id: componentId,
        material,
        // materialSurface: materialSurface || undefined,
        materialSurface: materialSurface || undefined,
        isPainted,
      };

      // 門軌必須要送厚度
      if (key === 'guideRail' && generateBomObj_pre.guideRail && item.thickness) {
        const thickness = Number(item.thickness ?? '');

        generateBomObj_pre.guideRail.thickness = String(thickness);
      }
    });

    if (haveNull) {
      return false;
    }

    const generateBomObj = generateBomObj_pre as TgenerateDoorProductBomDto;

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

      let message = '';

      if (typeof err.response?.data.message === 'string') {
        message = err.response?.data.message;
      } else {
        message = JSON.stringify(err.response?.data.message);
      }

      myAlert.err({ title: '取得bom資料失敗', content: message });
    }
  } // reqProdGenerateDoorProductBom

  // 取得細部規格(取得slatCount)
  async reqGetDetailSpec() {
    if (!this.doorType || this.isSpecialProd) {
      return;
    }

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
      // this.isLoading = true;
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
      // this.isLoading = false;

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

    // ! warning01
    // 若是在沒有gapA的情況計算出fulllWidth(以下稱舊L)並執行req_calcGeneralSpec
    // 取得的doorGeneralSpecs會是錯誤的
    // 因此必須再取得 新L 後執行fullWidth的setter，再執行一次呼叫鏈，取得新L的doorGeneralSpec
    // 但是若舊L與新L在後端算出的重量剛好對應到不同馬達，將會導致新L時的W與舊L時的W不相符
    if (this.isEditW_noGapA) {
      this.fullWidth = this.fullWidth;
      this.isEditW_noGapA = false;
    }

    this.reRender();
  }

  // 注意 retrieveProdComponent裡面也有呼叫 callAllReq
  callAllReq({
    // 現在已經改為onBlur時會立即觸發呼叫callAllReq
    // 且callAllReq的延遲時間被設為150
    // 應該不會有因為使用者操作太快導致tocCallRetrieveCreProdCom被覆蓋掉的問題
    toCallRetrieveCreProdCom = false,
  }: { toCallRetrieveCreProdCom?: boolean } = {}) {
    // console.log('callAllReq', key);

    if (this.callAllTimeoutId) {
      clearTimeout(this.callAllTimeoutId);
      this.callAllTimeoutId = undefined;
    }

    this.callAllTimeoutId = setTimeout(async () => {
      this.isLoading = true;

      clearTimeout(this.callAllTimeoutId);
      this.callAllTimeoutId = undefined;

      await this.reqChain();
      toCallRetrieveCreProdCom && this.callRetrieveCreProdCom();

      // 在reqChain中，可能會間接的再次呼叫callAllReq
      // 於是this.callAllTimeoutId就不會為undefined
      // 只有在reqChain中沒有再次呼叫callAllReq時，this.isLoading才會被設為false
      if (!this.callAllTimeoutId) {
        this.isLoading = false;
      }
    }, 150);
  }

  // ---------------------------------------------------------

  // 在一開始取得下拉式選單的選項
  async callApiAndGetOptions() {
    if (this._availableComponents || this.isSpecialProd) {
      return;
    }

    if (!this.doorType || !this.height || !this.fullWidth) {
      return;
    }

    this.isLoading = true;
    this.reRender();

    const res_spec = await reqGetCalcGeneralSpec({
      modelName: this.doorType as TpcgsPrams['modelName'],
      // height: Number(this.height) * 1000,
      height: new Decimal(this.height).mul(1000).toNumber(),
      isAntiTyphoon: this.typhoonProtection,
      // fullWidth: Number(this.fullWidth || 0) * 1000,
      fullWidth: new Decimal(this.fullWidth || 0).mul(1000).toNumber(),
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
        isUL: this.isULGuideRail,
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
      let motorVendor = this.motor;

      if (motorVendor === '東元') {
        motorVendor = '大同';
      } else if (motorVendor === '大同') {
        motorVendor = '東元';
      }

      motor = filter_motors({
        dataArr: availableComponents.motors,
        filterParams: {
          horsePower: this.horsepower,
          gearNumber: this._doorGeneralSpecs?.gearNumber ?? 'undefined', // 那時好像是因為沒有鍊齒輪番號的資料所以才先略過
          // motorVendor: this.motor,
          motorVendor: motorVendor,
          phase: Number(this.phase),
          voltage: Number(this.voltage),
          weight: this.weight,
          hasSupportStand: this.motorSupport,
        },
      });

      if (motor) {
        this._prodData.motor = motorVendor;
      }
    }

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
        //鍊條排數
        chains: this._doorGeneralSpecs?.sprocketWheelChains ?? 0,
        //軸承 // 從doorGeneralSpecs取資料
        bearingType: this._doorGeneralSpecs?.bearingName || '',
        gearNumber: this._doorGeneralSpecs?.gearNumber || '',
      },
    });

    let headBox: Tcomponent | null = filter_headBoxes({
      dataArr: availableComponents.headBoxes,
      filterParams: {
        thickness: this.rollUpBoxThick, // 捲箱厚度
        //一體式捲箱
        isIntegrated: this.onePieceRollUpBox, // 一體式捲箱
      },
    });

    const isGearNumberChanged = this.comList?.motor?.gearNumber !== motor?.gearNumber;

    // get /products/door/available-components取得的金額不是正確的金額
    // 正確的金額之後會在 post /products/door/generate-door-product-bom 取得

    if (this.doorType === 'SJ-305D' && slat) {
      const standardSlat_sj305D = availableComponents.slats.find((ac) => {
        return ac.name.includes('標準');
      });

      if (standardSlat_sj305D) {
        slat = standardSlat_sj305D;
      }
    }

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
    // this.reqChain();

    this.reRender();

    return { isGearNumberChanged };
  } // retrieveProdComponent

  callRetrieveCreProdCom() {
    if (this.timeoutId_retrieveCreProdCom) {
      clearTimeout(this.timeoutId_retrieveCreProdCom);
    }

    this.timeoutId_retrieveCreProdCom = setTimeout(() => {
      this.retrieveCreProdCom();
    }, 1000);
  }

  takeDefaultDynaValue() {
    // const defaultMotorIndex = this._doorGeneralSpecs?.defaultMotorIndex ?? 0;
    const defaultMotorSpecs = this.defaultMotorSpecs;

    const call = () => {
      this._prodData.doorTrackThick = this.options_doorTrackThick?.[0].value ?? '';
      this._prodData.rollUpBoxThick = this.options_rollUpBoxThick?.[0].value ?? '';
      this._prodData.motor = this.options_motor?.[0].value ?? '';
      // this._prodData.horsepower = this.options_horsepower?.[defaultMotorIndex].value ?? '';
      this._prodData.horsepower = defaultMotorSpecs?.hp ?? '';
      this.changeDistributionBoxPrice_byHorsepower();
      this.changePhase_byHorsepower({ bySetter: false });
      // this._prodData.phase = Number(this.options_phase?.[0].value ?? '1');
      this._prodData.voltage = this.options_voltage?.[0].value ?? '';
      this.callRetrieveCreProdCom();
    };

    // 做比對，如果值都一樣就不執行call
    if (
      this._prodData.doorTrackThick !== this.options_doorTrackThick?.[0].value ||
      this._prodData.rollUpBoxThick !== this.options_rollUpBoxThick?.[0].value ||
      this._prodData.motor !== this.options_motor?.[0].value ||
      // this._prodData.horsepower !== this.options_horsepower?.[defaultMotorIndex].value ||
      this._prodData.horsepower !== defaultMotorSpecs?.hp ||
      this._prodData.phase !== Number(this.options_phase?.[0].value) ||
      this._prodData.voltage !== this.options_voltage?.[0].value
    ) {
      call();
    }
  }

  // ---------------------------------------------------------

  // private toSetDefaultBoxB() {
  //   if (!this._doorGeneralSpecs) {
  //     return;
  //   }

  //   const motorArr = this._doorGeneralSpecs.motors;
  //   const hp = this.horsepower;
  //   const vendor = this.motor as '東元' | '大同' | '';

  //   const defaultMotor = motorArr[this._doorGeneralSpecs.defaultMotorIndex];
  //   const defaultHP = defaultMotor.hp;
  //   const box = defaultMotor.box;

  //   if (hp !== defaultHP || !vendor || !box) {
  //     return;
  //   }

  //   const boxB = box[vendor]?.boxB || box.default?.boxB;

  //   if (boxB) {
  //     const boxB_num = new Decimal(boxB).div(1000).toNumber();
  //     const shouldChange = !this.isBoxBinOption({
  //       boxB_m: boxB_num,
  //     });

  //     if (shouldChange) {
  //       this.boxB = String(boxB_num);
  //     }
  //   }
  // }

  // ----------------------------------------------------------------

  calcAllPrice_comAndSubComAndAcce() {
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
  }

  // ----------------------------------------------------------------

  private timeoutId_calcProdAllprice: NodeJS.Timeout | null = null;

  //計算prod所有的價格 防抖
  calcProdAllprice_timeout() {
    if (this.timeoutId_calcProdAllprice) {
      clearTimeout(this.timeoutId_calcProdAllprice);
    }

    this.timeoutId_calcProdAllprice = setTimeout(() => {
      this.calcProdAllprice();
    }, 100);
  }

  // 直接編輯牌價(set price)時使用，不會涉及材料配件與選配的價格計算
  calcProdAllprice_simple() {
    const price = new Decimal(this._prodData.price);
    const qty = this._prodData.quantity;

    const discount = new Decimal(this._prodData.discount || '0').div(100);
    const quotationDiscount = new Decimal(this._quotationDiscount || '0').div(100);

    this.dualPrice = price.mul(qty).toFixed(0);
    const unitPrice = price.mul(discount).mul(quotationDiscount).toFixed(0);
    this.unitPrice = unitPrice;
    this.totalPrice = new Decimal(unitPrice).mul(qty).toFixed(0);
  }

  //計算prod所有的價格
  private calcProdAllprice() {
    console.log('call calcProdAllprice');

    this.calcAccessoriesAllprice();
    this.calcComAllPrice();

    // ________________________________________________
    const quantity = Number(this._quantity);

    // 牌價 為材料配件設定與選配設定的 牌價複價 總和
    const price = new Decimal(this.comAllPrice.dualPrice || 0).add(this.AcceAllPrice.dualPrice || 0);

    // 單價 為材料配件設定與選配設定的 複價 總和
    const unitPrice = new Decimal(this.comAllPrice.totalPrice || 0).add(this.AcceAllPrice.totalPrice || 0);

    const dualPrice = price.mul(quantity || 0).toNumber();

    // this.price = price.toFixed(0).toString();
    // this.dualPrice = dualPrice.toFixed(0).toString();
    this.price = new Decimal(price).toFixed(0);
    this.dualPrice = new Decimal(dualPrice).toFixed(0);

    // 複價===四捨五入後的單價*數量
    // const fiexedUnitPrice = unitPrice.toFixed(0);
    const fiexedUnitPrice = new Decimal(unitPrice).toFixed(0);
    this.unitPrice = fiexedUnitPrice;
    // const totalPrice = unitPrice.mul(quantity || 0).toNumber();
    const totalPrice = new Decimal(fiexedUnitPrice).mul(quantity || 0).toNumber();
    // this.totalPrice = totalPrice.toFixed(0).toString();
    this.totalPrice = new Decimal(totalPrice).toFixed(0);

    this.callCalcSubTotal();
    this.reRender();
  }

  //計算Accessories所有的價格
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
      // price: Number(d_price.toFixed(0)),
      // dualPrice: Number(d_dualPrice.toFixed(0)),
      // unitPrice: Number(d_unitPrice.toFixed(0)),
      // totalPrice: Number(d_totalPrice.toFixed(0)),
      price: Number(new Decimal(d_price || 0).toFixed(0)),
      dualPrice: Number(new Decimal(d_dualPrice || 0).toFixed(0)),
      unitPrice: Number(new Decimal(d_unitPrice || 0).toFixed(0)),
      totalPrice: Number(new Decimal(d_totalPrice || 0).toFixed(0)),
    };
  } // calcAccessoriesAllprice

  calcComAllPrice() {
    console.log('call calcComAllprice');

    let d_price = new Decimal(0);
    let d_dualPrice = new Decimal(0);
    let d_unitPrice = new Decimal(0);
    let d_totalPrice = new Decimal(0);

    const comListArr = Object.values(this.comList ?? {});
    const subComListArr = Object.values(this.subComList ?? {});
    const arr = [...comListArr, ...subComListArr];

    arr.forEach((item) => {
      if (!item) {
        console.log('!item', item);

        return;
      }

      const { price, dualPrice, unitPrice, totalPrice } = item;

      d_price = d_price.add(price || 0);
      d_dualPrice = d_dualPrice.add(dualPrice || 0);
      d_unitPrice = d_unitPrice.add(unitPrice || 0);
      d_totalPrice = d_totalPrice.add(totalPrice || 0);
    });

    this.comAllPrice = {
      // price: Number(d_price.toFixed(0)),
      // dualPrice: Number(d_dualPrice.toFixed(0)),
      // unitPrice: Number(d_unitPrice.toFixed(0)),
      // totalPrice: Number(d_totalPrice.toFixed(0)),
      price: Number(new Decimal(d_price || 0).toFixed(0)),
      dualPrice: Number(new Decimal(d_dualPrice || 0).toFixed(0)),
      unitPrice: Number(new Decimal(d_unitPrice || 0).toFixed(0)),
      totalPrice: Number(new Decimal(d_totalPrice || 0).toFixed(0)),
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
      // price: Number(d_price.toFixed(0)),
      // dualPrice: Number(d_dualPrice.toFixed(0)),
      // unitPrice: Number(d_unitPrice.toFixed(0)),
      // totalPrice: Number(d_totalPrice.toFixed(0)),
      price: Number(new Decimal(d_price || 0).toFixed(0)),
      dualPrice: Number(new Decimal(d_dualPrice || 0).toFixed(0)),
      unitPrice: Number(new Decimal(d_unitPrice || 0).toFixed(0)),
      totalPrice: Number(new Decimal(d_totalPrice || 0).toFixed(0)),
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

  // 所有acce執行calcPrice
  calcChangeAccePrice() {
    Object.values(this.accessoriesList)?.forEach((acce) => {
      acce.calcPrice();
    });
  }

  // 計算才數
  private calcVolume() {
    return calcProductVolume(Number(this.area || 0));
    // return Decimal.mul(this.area || 0, 10.89)
    //   .toFixed(2)
    //   .toString();
  }

  // ---------------------------------------------------------
  // ---------------------------------------------------------

  resetDoorGeneralSpacs() {
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
  }

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

      let theHorsePower = horsePower;

      if (horsePower === '1.5HP') {
        theHorsePower = '1 1/2HP';
      }

      const hpOrder =
        horsePower === '1/4HP'
          ? '0.25'
          : horsePower === '1/3HP'
          ? '0.33'
          : horsePower === '1/2HP'
          ? '0.5'
          : horsePower === '3/4HP'
          ? '0.75'
          : horsePower === '1 1/2HP'
          ? '1.5'
          : horsePower;

      if (horsePower) {
        horsePowerList[horsePower] = {
          value: theHorsePower,
          label: theHorsePower,
          // hpOrder: hpOrder,
          hpOrder: String(parseInt(hpOrder)),
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
          label: String(thickness) + ' t',
        };
      }
    });

    guideRails.forEach((item) => {
      const { thickness } = item;

      if (thickness) {
        railThickList[thickness] = {
          value: String(thickness),
          label: String(thickness) + ' t',
        };
      }
    });

    if (Object.keys(horsePowerList).length > 0) {
      this.options_horsepower = Object.values(horsePowerList);
    } else {
      // this.options_horsepower = undefined;
      this.options_horsepower = optionsCreator_horsePower();
    }

    if (this.options_horsepower) {
      this.options_horsepower = _.sortBy(this.options_horsepower, 'hpOrder');
    }

    if (Object.keys(motorVendorList).length > 0) {
      this.options_motor = Object.values(motorVendorList).reverse();
    } else {
      this.options_motor = undefined;
    }

    // if (this.options_motor) {
    //   const theIndex = this.options_motor.findIndex((item) => {
    //     return item.value === '1 1/2HP';
    //   });

    //   if (theIndex > 0) {
    //     const oneHPIndex = this.options_motor.findIndex((item) => {
    //       return item.value === '1HP';
    //     });

    //     if()

    //   }
    // }

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

  // 原本還需要用這個方法取得boxD的選項
  // 但是現在不需要了，也就不需要這個方法了
  // findBDoptions() {
  //   if (this._prodData.doorType) {
  //     this.options_boxB = undefined;

  //     if (this.doorType === 'SJ-302') {
  //       this.options_boxB = _.cloneDeep(optionsCreator_boxB_SJ302());
  //     } else if (this.doorType === 'SJ-303A' || this.doorType === 'SJ-303AS') {
  //       this.options_boxB = _.cloneDeep(optionsCreator_boxB_SJ303A());
  //     }

  //     if (this.options_boxB) {
  //       this.options_boxB.unshift({
  //         value: 'auto',
  //         label: '自動計算',
  //       });
  //     }
  //   }
  // }

  // 變更角鐵與底座版

  changeBottomBarAngleIronAndBottomBarPlate(
    v: string // '鍍鋅鋼板' | '高耐鍍鋅鋼板' | 'SST#304' | 'SST#316'
  ) {
    const list_bottomBarAngleIron = _.keyBy<Toption>(this.options_bottomBarAngleIron, 'material');
    const list_bottomBarPlate = _.keyBy<Toption>(this.options_bottomBarPlate, 'material');

    // _________________________________________________________________
    const bottomBarAngleIron = list_bottomBarAngleIron[v]?.value ?? '';
    const bottomBarPlate = list_bottomBarPlate[v]?.value ?? '';

    // // _________________________________________________________________
    // if (v === '高耐鍍鋅鋼板') {
    //   const v2 = '鍍鋅鋼板';

    //   if (!bottomBarAngleIron) {
    //     bottomBarAngleIron = list_bottomBarAngleIron[v2]?.value ?? '';
    //   }

    //   if (!bottomBarPlate) {
    //     bottomBarPlate = list_bottomBarPlate[v2]?.value ?? '';
    //   }
    // }

    // // _________________________________________________________________
    // if (!bottomBarAngleIron) {
    //   bottomBarAngleIron = list_bottomBarAngleIron['SST#304'].value ?? '';
    // }

    // if (!bottomBarPlate) {
    //   bottomBarPlate = list_bottomBarPlate['SST#304'].value ?? '';
    // }

    // // _________________________________________________________________
    this.bottomBarAngleIron = bottomBarAngleIron;
    this.bottomBarPlate = bottomBarPlate;
  }

  toGetInstallationFee() {
    const m2 = Number(this.subComList.installationFee?.quantity || '0');
    const doorType = this.doorType;
    const installationFee_class = this.subComList.installationFee;
    const fee = getInstallationFee({
      doorModel: doorType,
      m2,
    });
    installationFee_class.price_locale = String(fee);
  }

  // isBoxBinOption({ boxB_m }: { boxB_m: number }) {
  //   if (!this.options_boxB) {
  //     return false;
  //   }

  //   return this.options_boxB.some((option) => {
  //     if (isNaN(Number(option.value))) {
  //       return false;
  //     }

  //     return Number(option.value) === boxB_m;
  //   });
  // }

  //
  changeDistributionBoxPrice_byHorsepower() {
    this.subComList.distributionBox.price_locale = String(lookup_distributionBoxPrice[this.horsepower] ?? 0);
  }

  changePhase_byHorsepower({ bySetter = true }: { bySetter?: boolean } = {}) {
    const horsepower_num = lookup_horsePowerToNumber[this.horsepower] ?? 0;
    let phase = 1;

    if (horsepower_num >= 1.5) {
      phase = 3;
    }

    if (bySetter) {
      this.phase = String(phase);
    } else {
      this._prodData.phase = phase;
    }
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
  options_horsepower: Toption[] = optionsCreator_horsePower();
  options_motor: Toption[] | undefined = undefined;
  options_phase: Toption[] | undefined = undefined;
  options_voltage: Toption[] | undefined = undefined;
  options_rollUpBoxThick: Toption[] | undefined = undefined;
  options_doorTrackThick: Toption[] | undefined = undefined;
  //
  // options_boxB: Toption[] | undefined = undefined;
  // options_boxD: Toption[] | undefined = undefined;

  // options_bottomBarAngleIron: Toption[] | undefined = undefined;
  // options_bottomBarPlate: Toption[] | undefined = undefined;

  // 門型 options
  get options_doorType() {
    const list = lookup_quoteType_doorModelName[this.quoteType];

    if (!list) {
      return [{ value: '', label: '請直接輸入' }];
    }

    return Object.values(list);
  }

  // 門片材質 主產品設定的材質
  get options_material() {
    if (this.isSpecialProd) {
      return [{ value: '', label: '請直接輸入' }];
    }

    const doorModel = this._doorModelList[this.doorType];

    if (!doorModel) {
      return undefined;
    }

    const slatMaterialsArr = doorModel.slatMaterials;
    const order = ['黑鐵', '鍍鋅鋼板', 'SST#304', 'SST#316', '樹脂鋼板', '高耐鍍鋅鋼板'];
    const orderedArr = _.orderBy(slatMaterialsArr, (item) => order.indexOf(item.name));

    const arr = orderedArr.map((item) => {
      return {
        value: item.name,
        label: item.name,
      };
    });

    // 把黑鐵的label改為鐵材烤漆
    const blackIron = arr.find((item) => item.value === '黑鐵');
    blackIron && (blackIron.label = '鐵材烤漆');

    return arr;
  }

  // 門軌 options
  get options_doorTrack() {
    if (this.isSpecialProd) {
      return [
        {
          value: '',
          label: '請直接輸入',

          icon: '',
          guideRailsOpening: '',
          width: NaN,
        },
      ];
    }

    const doorModel = this._doorModelList[this.doorType];

    if (!doorModel) {
      return undefined;
    }

    const arr = doorModel.guideRails.map((item) => {
      const imgSrc = item.imgSrc;
      const withHook = item.withHook;
      const hasSilencingStrip = item.hasSilencingStrip;

      const option = {
        value: imgSrc,
        label: imgSrc,
        // 在後端那邊會多出一個 / 符號，暫時先把這邊的/拿掉處理
        icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
        // icon: `${process.env.NEXT_PUBLIC_API_BASE_URL}/products/assets/door-track/${imgSrc}`,
        guideRailsOpening: item.opening,
        width: item.width,
      };

      if (
        // (withHook === null || withHook === this.typhoonProtection) &&
        (withHook ?? false) === this.typhoonProtection &&
        (hasSilencingStrip === null || hasSilencingStrip === this.doorTrackSilencerStrip)
      ) {
        return option;
      }

      // if (hasSilencingStrip === null || hasSilencingStrip === this.hasSilencingStrip) {
      //   return option;
      // }

      return undefined;
    });

    _.pull(arr, undefined);

    return arr;
  } // options_doorTrack

  // 表面
  get options_surface() {
    if (this.isSpecialProd) {
      return [{ value: '', label: '請直接輸入' }];
    }

    if (!this.material) {
      return undefined;
    }

    if (!this.doorType) {
      return undefined;
    }

    let options = options_surface_onlyPaint;

    const isSST = checkIsSST(this.material);
    const isGalvanized = checkIsGalvanized(this.material); // 是否鍍鋅

    if (isSST) {
      options = options_surface;
    }

    if (!isGalvanized && this.doorType !== 'SJ-305D') {
      options = options.filter((item) => {
        return item.value !== '無烤漆';
      });
    }

    // if (this.doorType !== 'SJ-305D') {
    //   options = options.filter((item) => {
    //     return item.value !== '無烤漆';
    //   });
    // }

    return options;
  }

  // 底座角鐵
  get options_bottomBarAngleIron() {
    const doorType = this._prodData.doorType as keyof typeof lookup_options_bottomBarAngleIronAndPlate;

    return lookup_options_bottomBarAngleIronAndPlate[doorType]?.angleIron() ?? [];
  }
  get options_bottomBarPlate() {
    const doorType = this._prodData.doorType as keyof typeof lookup_options_bottomBarAngleIronAndPlate;

    return lookup_options_bottomBarAngleIronAndPlate[doorType]?.plate() ?? [];
  }

  get options_boxB() {
    if (this.isSpecialProd) {
      return [{ value: '', label: '請直接輸入' }];
    }

    if (!this._prodData.doorType) {
      return undefined;
    }

    let options: Toption[] | undefined = undefined;

    options = lookup_options_boxB[this.doorType];
    options = _.cloneDeep(options);

    // if (this.doorType === 'SJ-302') {
    //   options = _.cloneDeep(optionsCreator_boxB_SJ302());
    // } else if (this.doorType === 'SJ-303A' || this.doorType === 'SJ-303AS') {
    //   options = _.cloneDeep(optionsCreator_boxB_SJ303A());
    // }

    // if (options) {
    //   options.unshift({
    //     value: 'auto',
    //     // value: this._defaultBoxB,
    //     label: '自動計算',
    //   });
    // }

    return options;
  }

  // ---------------------------------------------------------
  // ---------------------------------------------------------

  get avalibleComponent() {
    return this._availableComponents;
  }

  // 來自_doorGeneralSpecs
  get weight() {
    return this._doorGeneralSpecs?.weight;
  }

  // ---------------------------------------------------------

  // 報價單折數，也就是TquotationContentDto[discount]
  get quotationDiscount() {
    return this._quotationDiscount;
  }

  set quotationDiscount(v) {
    this._quotationDiscount = v;

    if (this.isSpecialProd) {
      this.price = this.price;
    } else {
      // 因為折數改變了，所以選配設定的價格要重新計算
      this.calcAllPrice_comAndSubComAndAcce();
    }

    // this.calcProdAllprice_timeout();
    this.reRender();
  }

  // 主產品的折數，與報價單折數不同
  get discount() {
    // console.log(this._prodData.discount);

    return this._prodData.discount;
  }
  set discount(v) {
    if (this.makeFormatValueDontTriggerTwice) {
      return;
    }

    if (v === '') {
      v = '0';
    }

    if (Number(v) > 500) {
      v = '500';
    }

    // if (v.split('.')[1]?.length > 3) {
    //   return;
    // }

    if (!checkIsFloat(v, 3)) {
      return;
    }

    this._prodData.discount = v;

    this.onDiscountChange();

    if (this.isSpecialProd) {
      this.calcProdAllprice_simple();
      this.callCalcSubTotal();
    } else {
      // 因為折數改變了，所以選配設定的價格要重新計算
      this.calcAllPrice_comAndSubComAndAcce();
    }

    this.reRender();

    this.makeFormatValueDontTriggerTwice = true;
    setTimeout(() => {
      this.makeFormatValueDontTriggerTwice = false;
    }, 0);
  }

  set discount_noTimeout(v: string) {
    if (this.makeFormatValueDontTriggerTwice) {
      return;
    }

    if (v === '') {
      v = '0';
    }

    if (Number(v) > 500) {
      v = '500';
    }

    // if (v.split('.')[1]?.length > 3) {
    //   return;
    // }

    if (!checkIsFloat(v, 3)) {
      return;
    }

    this._prodData.discount = v;

    this.onDiscountChange();

    if (this.isSpecialProd) {
      this.calcProdAllprice_simple();
      this.callCalcSubTotal();
    } else {
      // 因為折數改變了，所以選配設定的價格要重新計算
      this.calcAllPrice_comAndSubComAndAcce();
    }

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
    // if (v.length >= 11) {
    //   v = v.slice(0, 10);
    // }

    this._prodData.itemName = v;
    this.reRender();
  }
  //

  // 是否為特殊門
  // 特殊門會隱藏部分欄位，可以讓使用者在原本為select的欄位手動輸入資料
  // 並且會跳過大部分的機制，例如呼叫api，材料配件過濾等等
  // 特殊門沒有材料配件，選配設定的話除非後端有資料，否則沒有選項可選
  get isSpecialProd() {
    // const isSpecial = !options_doorType.some((option) => option.value === this._prodData.quoteType);

    // const isSpecial =
    //   !options_quoteType.some((option) => option.value === this._prodData.quoteType) ||
    //   !options_doorModelName.some((option) => option.value === this._prodData.doorType);

    // if (options_quoteType.some((option) => option.value === this._prodData.quoteType)) {
    //   return false;
    // }

    if (this._prodData.doorType === 'W2') {
      return true;
    }

    if (
      Object.values(this._doorModelList).some((doorModel) => {
        return doorModel.name === this._prodData.doorType;
      })
    ) {
      return false;
    }

    return true;
  }

  get ignoreKeyArr_prod() {
    return [
      // 'doorTrack',
      'typhoonProtection',
      'doorTrackSilencerStrip',
      'thickness',
      'area',
      'volume',
      'bounceDoorWidth',
      'doorTrackThick',
      'rollUpBoxThick',
      // 'close',
      'onePieceRollUpBox',
      'isULGuideRail',
    ];
  }

  get quoteType() {
    return this._prodData.quoteType;
  }
  set quoteType(v) {
    const isSame = this._prodData.quoteType === v;

    if (isSame) {
      return;
    }

    this._prodData.quoteType = v;
    this.doorType = '';
    this.clearProd_all();

    if (this.isSpecialProd) {
      this.subComList = {};
      this.material = '';
      this.surface = '';
    }

    this.reRender();
  }
  //
  get doorType() {
    return this._prodData.doorType;
  }

  set doorType(v) {
    this._prodData.doorType = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    const isMaterailInOptions = check_isValueInOptions(this.material, this.options_material ?? []);
    const is304InOptions = check_isValueInOptions('SST#304', this.options_material ?? []);

    if (v === 'SJ-305D') {
      const theOption = this.options_material?.find((option) => {
        if (option.value.includes('內SST') && option.value.includes('外SST')) {
          return true;
        }
      });

      this.material = theOption?.value ?? '';
    } else if (is304InOptions) {
      this.material = 'SST#304';
    } else if (!isMaterailInOptions && this.options_material) {
      this.material = this.options_material?.[0]?.value ?? '';
    }

    this.clearProd_all();

    if (v === 'SJ-312') {
      this._prodData.typhoonProtection = true;
    } else if (v !== 'SJ-302') {
      this._prodData.typhoonProtection = false;
    }

    if (!this.doorTrack) {
      this.doorTrack = this.options_doorTrack?.[0]?.value ?? '';
      this._prodData.guideRailG = this.options_doorTrack?.[0]?.width ?? 0;
    }

    this.toGetInstallationFee();
    this.subComList.distributionBox.quantity = '1';

    this.shouldCall_cgs = true;
    this.shouldCall_pac = true;
    this.shouldCall_pgpb = true;
    // this.callAllReq();
    // onDoorTypeChange必須放在賦值之後再執行
    this.onDoorTypeChange?.({ newDoorType: this.doorType, newIsAntiTyphoon: this.typhoonProtection });

    this.reRender();
  }

  // 全寬
  get fullWidth() {
    return this._prodData.fullWidth;
  }
  set fullWidth(v) {
    if (!checkIsFloat(v, 3)) {
      return;
    }

    this.isWgChanged = false;

    this._prodData.fullWidth = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    // this._prodData.WG = '0';
    this.area = this.calcArea();
    // this.calcChangeAccePrice();
    // this.clearProd();
    this.shouldCall_cgs = true;
    // this.callAllReq();

    this.reRender();
  }
  get fullWidth_mm() {
    return new Decimal(this._prodData.fullWidth || 0).mul(1000).toNumber();
  }

  get WG_mm() {
    return new Decimal(this._prodData.WG || 0).mul(1000).toNumber();
  }
  get WG() {
    return this._prodData.WG;
  }

  set WG(str: string) {
    if (str === '') {
      str = '0';
    }

    // 現在使用者不可以操作WG，應該是不會有問題
    // if (!checkIsFloat(str, 3)) {
    //   return;
    // }

    this._prodData.WG = str;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    // 沒有horsepower就沒有gapA與gapC就無法計算正確的L
    // 沒有boxB，呼叫api會錯誤
    // 所以必須要在這邊做判斷
    // if (!this.horsepower || !this.boxB) {
    //   this.reRender();

    //   return;
    // }

    // 改變了WG並改變了L，就要呼叫
    // 之後呼叫的req_calcGeneralSpec的時候就會把hp帶入
    this.isWgChanged = true;

    const L = calcProductFullWidth({
      WG: new Decimal(this._prodData.WG).mul(1000).toNumber(),
      gapA: this._doorGeneralSpecs?.gapA ?? 0,
      gapC: this._doorGeneralSpecs?.gapC ?? 0,
    });

    this.fullWidth = new Decimal(L).div(1000).toString();
    this.isWgChanged = true;

    this.reRender();
  }

  // ------------------------------------

  get W() {
    const W_num = calcW({
      WG: this.WG_mm,
      G: Number(this._prodData.guideRailG),
    });

    return new Decimal(W_num).div(1000).toString();
  }

  // WG才是後端實際要收的東西
  // 所以編輯W的時候實際上是在編輯WG
  set W(v) {
    if (v === '') {
      v = '0';
    }

    if (!checkIsFloat(v, 3)) {
      return;
    }

    const WG = calcProductWG_withWAndG({
      W: Number(v || 0),
      G: Number(this.guildRailG || 0),
    });

    this.WG = String(WG);

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    if (!this._doorGeneralSpecs?.gapA) {
      this.isEditW_noGapA = true;
    }

    this.reRender;
  }

  // ------------------------------------

  //
  get height() {
    return this._prodData.height;
  }
  set height(v) {
    if (!checkIsFloat(v, 3)) {
      return;
    }

    this._prodData.height = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

    this.area = this.calcArea();
    // this.clearProd();

    this.shouldCall_cgs = true;
    this.shouldCall_pgpb = true;
    // this.callAllReq();

    this.reRender();
  }
  get height_mm() {
    // return String(Number(this._prodData.height) * 1000);
    return new Decimal(this._prodData.height || 0).mul(1000).toString();
  }

  // B(m)
  get boxB() {
    return this._prodData.boxB;
  }
  set boxB(v) {
    const setBoxB = async () => {
      if (v === 'auto') {
        v = this._defaultBoxB;
      }

      const v_num = Number(v);

      if (typeof v_num !== 'number' || Number.isNaN(v_num)) {
        return;
      }

      // ________________________
      if (this.isSpecialProd) {
        if (!checkIsFloat(v, 3)) {
          return;
        }

        this._prodData.boxB = v;
        this.reRender();

        return;
      }
      // ________________________

      this._prodData.boxB = v;

      // const reqBody: TgetBoxDParams = {
      //   modelName: this.doorType,
      //   rollerDiameter: this._doorGeneralSpecs?.diameter ?? 0,
      //   sidePlateSizeB: Number(this.boxB_mm),
      //   hp: this.horsepower,
      //   motorVendor: this.motor,
      // };

      // try {
      //   this.isLoading = true;
      //   const res = await apiGetboxD(reqBody);

      //   if (res) {
      //     const sidePlateSizeD = res?.sidePlateSizeD;
      //     this._prodData.boxD = new Decimal(sidePlateSizeD).div(1000).toString();
      //   }
      // } catch (error) {
      //   // const err = error as Error;
      //   // myAlert.err({ title: '取得boxD失敗', content: err.message });
      //   this._prodData.boxD = '0';
      // } finally {
      //   this.isLoading = false;
      // }

      // await this.updateBoxD();
      await this.updateBoxD();

      this.area = this.calcArea();

      // this.callRetrieveCreProdCom();

      this.shouldCall_pgpb = true;

      this.callAllReq({ toCallRetrieveCreProdCom: true });
      // this.callRetrieveCreProdCom();

      this.reRender();
    };

    setBoxB();
  }

  set boxB_noCall(v: string) {
    const setBoxB = async () => {
      // ________________________
      if (this.isSpecialProd) {
        if (!checkIsFloat(v, 3)) {
          return;
        }

        this._prodData.boxB = v;
        this.reRender();

        return;
      }
      // ________________________

      this._prodData.boxB = v;

      // const reqBody: TgetBoxDParams = {
      //   modelName: this.doorType,
      //   rollerDiameter: this._doorGeneralSpecs?.diameter ?? 0,
      //   sidePlateSizeB: Number(this.boxB_mm),
      //   hp: this.horsepower,
      //   motorVendor: this.motor,
      // };

      // try {
      //   this.isLoading = true;
      //   const res = await apiGetboxD(reqBody);

      //   if (res) {
      //     const sidePlateSizeD = res?.sidePlateSizeD;
      //     this._prodData.boxD = new Decimal(sidePlateSizeD).div(1000).toString();
      //   }
      // } catch (error) {
      //   // const err = error as Error;
      //   // myAlert.err({ title: '取得boxD失敗', content: err.message });
      //   this._prodData.boxD = '0';
      // } finally {
      //   this.isLoading = false;
      // }

      await this.updateBoxD();

      this.area = this.calcArea();
      this.reRender();
    };

    setBoxB();
  }

  get boxB_mm() {
    // return String(Number(this._prodData.boxB) * 1000);
    return new Decimal(this._prodData.boxB || 0).mul(1000).toString();
  }

  // async reqGetBoxD({ str, diameter }: { str: string; diameter: number }) {
  //   this._prodData.boxB = str;

  //   const reqBody: TgetBoxDParams = {
  //     modelName: this.doorType,
  //     rollerDiameter: this._doorGeneralSpecs?.diameter ?? diameter ?? 0,
  //     sidePlateSizeB: Number(this.boxB_mm),
  //     hp: this.horsepower,
  //     motorVendor: this.horsepower,
  //   };

  //   try {
  //     this.isLoading = true;
  //     const res = await apiGetboxD(reqBody);

  //     if (res) {
  //       const sidePlateSizeD = res?.sidePlateSizeD;
  //       this._prodData.boxD = new Decimal(sidePlateSizeD).div(1000).toString();
  //     }
  //   } catch (error) {
  //     // const err = error as Error;
  //     // myAlert.err({ title: '取得boxD失敗', content: err.message });
  //     this._prodData.boxD = '0';
  //   } finally {
  //     this.isLoading = false;
  //   }

  //   this.area = this.calcArea();
  //   this.reRender();
  // }

  // D(m)
  get boxD() {
    return this._prodData.boxD;
  }
  set boxD(v) {
    // ________________________
    if (this.isSpecialProd) {
      this._prodData.boxD = v;
      this.reRender();

      return;
    }
    // ________________________
    // this._prodData.boxD = v;
    // this._prodData.boxB = lookup_boxBAndBoxD[this._prodData.doorType]?.DtoB[v] ?? '';
    // this.area = this.calcArea();

    // this.shouldCall_pgpb = true;
    // this.callAllReq();

    this.reRender();
  }

  get guildRailG() {
    return new Decimal(this._prodData.guideRailG || 0).div(1000).toString();
  }
  get guildRailG_mm() {
    return this._prodData.guideRailG || 0;
  }

  //
  get area() {
    return this._prodData.area;
  }
  set area(v) {
    this._prodData.area = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    if (this.comList?.slat) {
      this.comList.slat.quantity = v;
    }

    if (this.subComList?.installationFee) {
      this.subComList.installationFee.quantity = v;
    }

    this.volume = this.calcVolume();

    this.calcChangeAccePrice();

    this.toGetInstallationFee();
    this.reRender();
  }
  //
  //  才數
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
    // ________________________
    if (this.isSpecialProd) {
      this._prodData.material = v;
      this.reRender();

      return;
    }
    // ________________________

    Object.values(this.comList || {}).forEach((com) => {
      if (com) {
        com.changeFindedMaterial(v);
      }
    });

    this._prodData.material = v;

    const isSurfaceExist = this.options_surface?.some((item) => {
      return item.value === this.surface;
    });

    if (!isSurfaceExist) {
      this.surface = this.options_surface?.[0].value ?? '';
    }

    this.reRender();
  }
  //
  get surface() {
    return this._prodData.surface;
  }
  set surface(v) {
    this._prodData.surface = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    if (this.comList?.slat) {
      this.comList.slat.surface_withCheckOptions = v;
    }

    if (this.comList?.headBox) {
      this.comList.headBox.surface_withCheckOptions = v;
    }

    if (this.comList?.guideRail) {
      this.comList.guideRail.surface_withCheckOptions = v;
    }

    // if (this.comList?.bottomBar) {
    //   this.comList.bottomBar.surface_withCheckOptions = v;
    // }

    this.reRender();
  }

  get doorTrack() {
    return this._prodData.doorTrack;
  }
  set doorTrack(v) {
    this._prodData.doorTrack = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    const theGuideRail = this.options_doorTrack?.find((item) => {
      return item?.value === v;
    });
    this._prodData.guideRailsOpening = theGuideRail?.guideRailsOpening ?? '';
    this._prodData.guideRailG = theGuideRail?.width ?? 0;

    this.W = String(
      calcW({
        WG: Number(this._prodData.WG) || 0,
        G: Number(this.guildRailG) || 0,
      })
    );

    this.callAllReq();
    this.callRetrieveCreProdCom();

    this.reRender();
  }

  get horsepower() {
    return this._prodData.horsepower;
  }
  set horsepower(v) {
    if (this._prodData.horsepower === v) {
      return;
    }

    this._prodData.horsepower = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    const { gapA, gapC } = lookup_hpToGapAGapC[v as keyof typeof lookup_hpToGapAGapC];

    if (!this._doorGeneralSpecs) {
      this.isDontClearProd = true;
      this.resetDoorGeneralSpacs();
    }

    this._doorGeneralSpecs!.gapA = gapA;
    this._doorGeneralSpecs!.gapC = gapC;

    const W = calcW_2({
      fullWidth: this.fullWidth_mm,
      gapA: Number(this._doorGeneralSpecs!.gapA || '0'),
      gapC: Number(this._doorGeneralSpecs!.gapC || '0'),
      G: this.guildRailG_mm,
    });

    this.W = new Decimal(W).div(1000).toString();

    this.changeDistributionBoxPrice_byHorsepower();
    this.changePhase_byHorsepower();

    this.callAllReq();

    // this.callRetrieveCreProdCom();

    this.reRender();
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(v) {
    if (this.parentProd) {
      // const remain = this.parentProd.remainQty + Number(this._quantity);
      const remain = new Decimal(this.parentProd.remainQty || 0).add(this._quantity || 0).toNumber();

      if (Number(v) > remain) {
        return;
      }
    }

    const originallyIsZero = this._quantity === '0';

    this._prodData.quantity = Number(v);
    this._quantity = v;

    this.onQtyChange();

    // ________________________
    if (this.isSpecialProd) {
      this.calcProdAllprice_simple();
      this.callCalcSubTotal();
      this.reRender();

      return;
    }
    // ________________________

    this.calcProdAllprice_timeout();

    if (originallyIsZero) {
      // 呼叫callAllReq後就會再自動算金額了
      this.shouldCall_cgs = true;
      this.shouldCall_pac = true;
      this.shouldCall_pgpb = true;
      // this.callAllReq();
    }

    this.reRender();
  }

  // 牌價
  get price() {
    if (!this._price) {
      return '';
    }

    return String(this._price);
    // return Number(this._price).toLocaleString();
  }

  set price(v) {
    // v = v.replace(/,/g, '');

    console.log('call price', v);

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

  get unitPrice_num() {
    if (!this._unitPrice) {
      return 0;
    }

    return Number(this._unitPrice);
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
    // ________________________
    if (this.isSpecialProd) {
      this._prodData.typhoonProtection = v;
      this.reRender();

      return;
    }
    // ________________________

    if (this.doorType === 'SJ-312') {
      if ((v = true)) {
        return;
      }

      v = true;
    } else if (this.doorType !== 'SJ-302') {
      if ((v = false)) {
        return;
      }

      v = false;
    }

    if (v === this._prodData.typhoonProtection) {
      this.reRender();

      return;
    }

    //
    this._prodData.typhoonProtection = v;
    this.isDontClearProd = true;
    this._prodData.isULGuideRail = false;

    this._prodData.doorTrack = '';
    this._prodData.guideRailG = 0;

    // onDoorTypeChange必須放在賦值之後再執行
    this.onDoorTypeChange?.({ newDoorType: this.doorType, newIsAntiTyphoon: this.typhoonProtection });

    this.shouldCall_cgs = true;
    this.shouldCall_pac = true;
    this.shouldCall_pgpb = true;
    this.callAllReq();

    this.reRender();
  }

  get isTyphoonProtectionDisabled() {
    if (this.doorType !== 'SJ-302') {
      return true;
    }
  }

  get isIsULDisabled() {
    if (this.typhoonProtection) {
      return false;
    } else {
      return true;
    }
  }

  // 彈射門
  get bounceDoor() {
    return this._prodData.bounceDoor;
  }
  set bounceDoor(v) {
    this._prodData.bounceDoor = v;
    this.reRender();
  }

  // 單位為公尺
  get bounceDoorWidth() {
    return this._bounceDoorWidth || '';
  }

  // 輸入的單位預期為公尺
  set bounceDoorWidth(str) {
    if (str && !checkIsFloat(str, 3)) {
      return;
    }

    this._bounceDoorWidth = str;
    const bounceDoorWidth_mm = new Decimal(this._bounceDoorWidth || 0).mul(1000).toNumber();
    this._prodData.bounceDoorWidth = bounceDoorWidth_mm;

    this.reRender();
  }

  get bounceDoorWidth_mm() {
    return this._prodData.bounceDoorWidth;
  }

  get bounceDoorWidth_cm() {
    return new Decimal(this._prodData.bounceDoorWidth).div(10).toNumber();
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

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________
    // this.toSetDefaultBoxB();
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get voltage() {
    return this._prodData.voltage;
  }
  set voltage(str) {
    this._prodData.voltage = str;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________
    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //

  get phase() {
    return String(this._prodData.phase);
  }
  set phase(str) {
    this._prodData.phase = Number(str);

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________
    this.callRetrieveCreProdCom();
    this.reRender();
  }

  //
  get motorSupport() {
    return this._prodData.motorSupport;
  }
  set motorSupport(v) {
    this._prodData.motorSupport = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }
    // ________________________

    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get bottomBar() {
    return this._prodData.bottomBar;
  }
  set bottomBar(v) {
    this._prodData.bottomBar = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

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

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

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
  // 如果使用者一開始就編輯門軌消音條
  // 會因為還沒有取得預設馬達，導致馬達被清空
  // 所以要呼叫req_calcGeneralSpec取得預設馬達
  // 並且isDontClearProd設為true避免資料被重置
  // 基本上與防颱一樣
  set doorTrackSilencerStrip(v) {
    this._prodData.doorTrackSilencerStrip = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

    this.isDontClearProd = true;
    this._prodData.doorTrack = '';
    this._prodData.guideRailG = 0;
    // this.doorTrack = this.options_doorTrack?.[0]?.value ?? '';

    // this.callRetrieveCreProdCom();
    // this.reRender();
    // onDoorTypeChange必須放在賦值之後再執行
    // this.onDoorTypeChange?.({ newDoorType: this.doorType, newIsAntiTyphoon: this.typhoonProtection });

    this.shouldCall_cgs = true;
    this.shouldCall_pac = true;
    this.shouldCall_pgpb = true;
    this.callAllReq();

    this.reRender();
  }
  //
  get onePieceRollUpBox() {
    return this._prodData.onePieceRollUpBox;
  }
  set onePieceRollUpBox(v) {
    this._prodData.onePieceRollUpBox = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

    this.callRetrieveCreProdCom();
    this.reRender();
  }
  //
  get rollUpBoxThick() {
    return this._prodData.rollUpBoxThick;
  }
  set rollUpBoxThick(v) {
    this._prodData.rollUpBoxThick = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

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

  get isULGuideRail() {
    return this._prodData.isULGuideRail;
  }
  set isULGuideRail(bool) {
    this._prodData.isULGuideRail = bool;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

    this.callRetrieveCreProdCom();

    this.reRender();
  }

  // 底座角鐵
  get bottomBarAngleIron() {
    return this._prodData.bottomBarAngleIron;
  }
  set bottomBarAngleIron(v) {
    this._prodData.bottomBarAngleIron = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

    this.shouldCall_pgpb = true;
    this.callAllReq();
    this.reRender();
  }
  // 底座版
  get bottomBarPlate() {
    return this._prodData.bottomBarPlate;
  }
  set bottomBarPlate(v) {
    this._prodData.bottomBarPlate = v;

    // ________________________
    if (this.isSpecialProd) {
      this.reRender();

      return;
    }

    // ________________________

    this.shouldCall_pgpb = true;
    this.callAllReq();
    this.reRender();
  }

  // 門片厚度
  get thickness() {
    if (!this._prodData.thickness) {
      return '';
    }

    const num = Number(this._prodData.thickness);

    // return num.toFixed(1) + ' t';
    return new Decimal(num || 0).toFixed(1) + ' t';
  }
  set thickness(v) {
    v = v.replace(' t', '');
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
    // return Number(this._quantity) - Number(this._reduceQty) - Number(this.exchangeQty);
    return new Decimal(this._quantity || 0)
      .minus(this._reduceQty || 0)
      .minus(this.exchangeQty || 0)
      .toNumber();
  }

  // 追減數量
  get reduceQty() {
    return this._reduceQty;
  }
  set reduceQty(v) {
    const nv = Number(v);

    // if (nv > this.remainQty + Number(this.reduceQty)) {
    //   return;
    // }
    if (nv > new Decimal(this.remainQty || 0).add(this.reduceQty || 0).toNumber()) {
      return;
    }

    this._reduceQty = v;
    this.reRender();

    const asyncCall = async () => {
      await this.getComAndAcce();
      // this.callCalcSubTotal();

      // // this.calcProdAllprice_timeout();
      this.reRender();
    };

    asyncCall();
  }

  // 變更數量
  get exchangeQty() {
    // let qty = 0;
    let qty = new Decimal(0);
    Object.values(this._exchangeProdList).forEach((item) => {
      // qty = qty + Number(item.quantity || 0);
      qty = qty.add(item.quantity || 0);
    });

    return qty.toNumber();
  }

  // 追減/變更金額
  get reduceExchangePrice() {
    // const qty = Number(this.reduceQty || 0) + Number(this.exchangeQty || 0);
    const qty = Decimal.add(this.reduceQty || 0, this.exchangeQty || 0).toNumber();
    const reducePrice = Decimal.mul(qty, this._unitPrice || 0).toString();

    return reducePrice;
  }

  // 新增變更的prod
  async addExchange(v: string) {
    // 不可以超過原本的數量
    if (Number(v) > this.remainQty) {
      return '超過上限';
    }

    // 需求變更 要可以超過上限 issue#501
    // if (false) {
    //   return '超過上限';
    // }

    if (this.isLoading_getProd) {
      return '正在取得產品資料';
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
      this.onDiscountChange();
      this.reRender();
    };

    this._exchangeProdList[exId] = new Class_product({
      reRender: this.reRender_ori,
      prodData: copy,
      delSelf,
      copySelf: () => {},
      callCalcSubTotal: () => {},
      doorModelList: this._doorModelList,
      parentProd: this,
      disabled_quantity: true,
      quotationDiscount: this._quotationDiscount,
      onDiscountChange: this.onDiscountChange,
      onQtyChange: this.onQtyChange,
    });

    this.reRender();

    // return true;
    //
  }

  // 清空變更prod
  clearAttach() {
    console.log('this', this);

    this._exchangeProdList = {};
    this._reduceQty = '0';
    this.onDiscountChange();
    this.reRender();
  }

  // --------------------------------------------------------------------
  // --------------------------------------------------------------------
  // --------------------------------------------------------------------

  get isComponentOk() {
    const componentBodyArr = this.comBodyArr;
    let isComponentBreak = false;

    if (componentBodyArr.length !== 8 && !this.isSpecialProd) {
      isComponentBreak = true;
    }

    componentBodyArr.forEach((com) => {
      if (!com.componentId) {
        isComponentBreak = true;
      }
    });

    // if (isComponentBreak) {
    //   myAlert.err({ title: '主產品無材料配件或無componentId', content: `項目:${this.itemName}` });
    // }

    return !isComponentBreak;
  }

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

    const accessories: TcreateQuotationProductAccessoryDto[] =
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

    let body: TcreateQuotationProductDto = {
      ...copy,
      id: copy.id,
      doorModelName: this.doorType,
      materialName: this.material,
      materialSurface: this.surface,
      guideRail: this.doorTrack,
      motorVendor: this.motor,
      guideRailThickness: this.doorTrackThick,
      hasSilencingStrip: this.doorTrackSilencerStrip,
      isIntegratedHeadBox: this.onePieceRollUpBox,
      isAntiTyphoon: this.typhoonProtection,
      closingType: this.close,
      motorPhase: Number(this.phase),

      // 送去後端要轉為要從m轉為mm
      WG: new Decimal(this._prodData.WG || 0).mul(1000).toNumber(),
      fullWidth: new Decimal(this._prodData.fullWidth || 0).mul(1000).toNumber(),
      height: new Decimal(this._prodData.height || 0).mul(1000).toNumber(),
      boxB: new Decimal(this._prodData.boxB || 0).mul(1000).toNumber(),
      boxD: new Decimal(this._prodData.boxD || 0).mul(1000).toNumber(),
      volume: this._prodData.volume || '0',
      area: this._prodData.area || '0',

      headBoxThickness: this._prodData.rollUpBoxThick,
      motorVoltage: Number(this._prodData.voltage),
      hasMotorSupportStand: this._prodData.motorSupport,

      price: Number(this._price),
      dualPrice: Number(this._dualPrice),
      unitPrice: Number(this._unitPrice),
      totalPrice: Number(this._totalPrice),

      components: this.comBodyArr,
      accessories: this.acceBodyArr,
      order: 0,

      thickness: this._prodData.thickness || '0',

      distributionBoxPrice: Number(this.subComList.distributionBox?.price ?? 0),
      distributionBoxUnitPrice: Number(this.subComList.distributionBox?.unitPrice ?? 0),
      distributionBoxQuantity: Number(this.subComList.distributionBox?.quantity ?? 0),
      distributionBoxDualPrice: Number(this.subComList.distributionBox?.dualPrice ?? 0),
      distributionBoxTotalPrice: Number(this.subComList.distributionBox?.totalPrice ?? 0),

      installationFeePrice: Number(this.subComList.installationFee?.price) ?? 0,
      installationFeeDualPrice: this.subComList.installationFee?.dualPrice ?? 0,
      installationFeeQuantity: this.subComList.installationFee?.quantity ?? 0,
      installationFeeUnitPrice: Number(this.subComList.installationFee?.unitPrice ?? 0),
      installationFeeTotalPrice: this.subComList.installationFee?.totalPrice ?? 0,

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
      //
      bounceDoorWidth: this._prodData.bounceDoorWidth || null,
      bounceDoor: !!(this._prodData.bounceDoorWidth || null),
    };

    if (this.isSpecialProd) {
      body = {
        ...body,

        area: null,
        volume: null,
        // guideRail: null,
        motorVendor: null,
        motorVoltage: null,
        bottomBar: null,
        motorLockBox: null,
        guideRailThickness: null,
        rollerSpec: null,
        hasSilencingStrip: null,
        isIntegratedHeadBox: null,
        headBoxThickness: null,
        isAntiTyphoon: null,
        bounceDoor: null,
        bounceDoorWidth: null,
        bounceDoorHeight: null,
        bounceDoorLength: null,
        // closingType: null,
        motorPhase: null,
        bottomBarAngleIron: null,
        bottomBarPlate: null,
        thickness: null,
        distributionBoxPrice: null,
        distributionBoxUnitPrice: null,
        distributionBoxQuantity: null,
        distributionBoxDualPrice: null,
        distributionBoxTotalPrice: null,
        installationFeePrice: null,
        installationFeeDualPrice: null,
        installationFeeQuantity: null,
        installationFeeUnitPrice: null,
        installationFeeTotalPrice: null,
        slatCount: null,
        sprocketWheelModel: null,
        sprocketWheelTeethNumber: null,
        sprocketWheelChains: null,
        bearingInnerDiameter: null,
        diameter: null,
        bearingHousingTotalLength: null,
        guideRailsOpening: null,
        slatLength: null,
        guideRailLength: null,
        headBoxLength: null,
        bearingHousingSize: null,
        bearingName: null,
        gapA: null,
        gapC: null,
        gearNumber: null,
        weight: null,
        guideRailG: null,
        isULGuideRail: null,
        hasMotorSupportStand: null,
        components: [],
      };
    }

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

      distributionBoxPrice: Number(this.subComList.distributionBox?.price || 0),
      distributionBoxUnitPrice: Number(this.subComList.distributionBox?.unitPrice || 0),
      installationFeePrice: Number(this.subComList.installationFee?.price || 0),
      installationFeeDualPrice: Number(this.subComList.installationFee?.dualPrice || 0),
      installationFeeQuantity: Number(this.subComList.installationFee?.quantity || 0),
      installationFeeUnitPrice: Number(this.subComList.installationFee?.unitPrice || 0),
      installationFeeTotalPrice: Number(this.subComList.installationFee?.totalPrice || 0),

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
    // const divQty = Number(this.reduceQty) + this.exchangeQty;
    const divQty = new Decimal(this.reduceQty || 0).add(this.exchangeQty || 0).toNumber();
    const theBody = this.body;

    // const quantity = theBody.quantity - divQty;
    const quantity = new Decimal(theBody.quantity).minus(divQty).toNumber();

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

  async updateBoxD() {
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
  }

  async callSideEffect(
    action:
      | 'fullWidth'
      | 'height'
      | 'W'
      | 'boxB'
      | 'quantity'
      | 'typhoonProtection'
      | 'doorTrackSilencerStrip'
      | 'bottomBarAngleIron'
      | 'bottomBarPlate'
    // | string
  ) {
    if (this.isSpecialProd) {
      // this.reRender();

      return;
    }

    switch (action) {
      case 'fullWidth':
        this.callAllReq();
        // await this.reqChain();
        break;

      case 'W':
        this.callAllReq();
        // await this.reqChain();
        break;

      case 'height':
        this.callAllReq();
        // await this.reqChain();
        break;

      // case 'boxB':
      //   await this.updateBoxD();
      //   this.callAllReq();
      //   this.callRetrieveCreProdCom();
      //   break;

      // case 'doorTrack':
      //   this.callAllReq();
      //   this.callRetrieveCreProdCom();
      //   break;

      // case 'horsepower':
      //   this.callAllReq();
      //   this.callRetrieveCreProdCom();
      //   break;

      case 'quantity':
        this._quantity === '0' && this.callAllReq();

        break;

      // case 'typhoonProtection':
      //   this.callAllReq();
      //   break;

      // case 'doorTrackSilencerStrip':
      //   this.callAllReq();
      //   break;

      default:
        break;
    }

    this.reRender();
  } // callSideEffect

  //-----------------------------------------
} // Class_product close

// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================
// ===========================================================

// type TprodKey = Exclude<keyof Tprod, 'id' | 'order'>;
type TprodKey = string;

const prodkeyArrOri: () => TprodKey[] = () => {
  return [
    'discount',
    'itemName',
    'quoteType',
    'doorType',

    'fullWidth',
    'W',
    // 'WG',
    'height',
    // 'guildRailG',
    'boxB',
    'boxD',
    'horsepower',
    'doorTrack',
    'typhoonProtection',
    'doorTrackSilencerStrip', // 門軌消音條
    'thickness',
    'area',
    'volume',
    'material',
    'surface',
    // bounceDoor不再使用，直接以bounceDoorWidth代替
    // 'bounceDoor',
    'bounceDoorWidth',

    // 'motor', // 馬達廠商
    // 'voltage', // 電壓
    // 'phase', // 相數
    // 'motorSupport', // 馬達支撐架
    // 'bottomBar', // 底座類型
    // 'motorLockBox', // 馬達鎖盒
    'doorTrackThick', // 門軌厚度
    // 'rollerSpec', // 捲軸規格
    'rollUpBoxThick', // 捲箱厚度
    'close', // 開閉方式
    'onePieceRollUpBox', // 一體式捲箱
    'isULGuideRail',
    // 'bottomBarAngleIron', // 底座角鐵
    // 'bottomBarPlate', // 底座板
    'notes', // 備註
    'quantity',
    'price', // 牌價
    'dualPrice', // 牌價複價
    'unitPrice', //單價
    'totalPrice', // 複價
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
    // 門軌G
    guideRailG: 0,
    horsepower: '',
    quantity: 1,
    price: 0,
    dualPrice: 0,
    unitPrice: 0,
    totalPrice: 0,
    typhoonProtection: false,
    bounceDoor: false,
    bounceDoorWidth: 0,
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

    // 配電箱數量;
    distributionBoxQuantity: 0,
    // 配電箱牌價複價;
    distributionBoxDualPrice: 0,
    // 配電箱複價;
    distributionBoxTotalPrice: 0,
    // 配電箱 牌價;
    distributionBoxPrice: 5940,
    // 配電箱 單價;
    distributionBoxUnitPrice: 0,

    // 安裝費 數量;
    installationFeeQuantity: 0,
    // 安裝費 牌價複價;
    installationFeeDualPrice: 0,
    // 安裝費 複價;
    installationFeeTotalPrice: 0,
    // 安裝費 牌價;
    installationFeePrice: 1800,
    // 安裝費 單價;
    installationFeeUnitPrice: 0,

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

    isULGuideRail: false,
  };
};

// ======================================================================
// ======================================================================
// ======================================================================
// ======================================================================

const checkIsSST = (material: string) => {
  let isSST = false;

  if (material.startsWith('SST')) {
    isSST = true;
  } else if (material.includes('外SST')) {
    isSST = true;
  }

  return isSST;
};

// 檢查是否鍍鋅
const checkIsGalvanized = (material: string) => {
  let isGalvanized = false;

  if (material.includes('鍍鋅')) {
    isGalvanized = true;
  }

  return isGalvanized;
};

const creOptions_surface: () => Toption[] = () => optionsCreator_surface();
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

// const horsePowerLookup = {
//   '1/4': '0.25',
//   '1/3': '0.33',
//   '1/2': '0.5',
//   '3/4': '0.75',
// };

const sortComponent = (comArr: TcreateQuotationProductComponentDto[]) => {
  const comPreList: Partial<{ [key in TcomponentKey]: Tcomponent }> = {};

  // 這邊改順序的話記得retrieveCreProdCom裡面的也要改
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

  if (res?.items?.[0]) {
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
    hp: Thp;
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
  modelName,
  height,
  fullWidth,
  WG,
  isAntiTyphoon,
  hp,
}: {
  modelName: string;
  height: number;
  fullWidth?: number;
  WG?: number;
  isAntiTyphoon: boolean;
  hp?: Thp | undefined;
}) => {
  const body = {
    modelName: modelName as TpcgsPrams['modelName'],
    height,
    isAntiTyphoon,
    fullWidth,
    WG: WG,
    hp,
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

const reqGetBoxD = async ({ modelName, rollerDiameter, sidePlateSizeB, hp, motorVendor }: TgetBoxDParams) => {
  const reqBody = {
    modelName: modelName as TdoorModelInfoDto['name'],
    rollerDiameter,
    sidePlateSizeB,
    hp,
    motorVendor,
  };

  try {
    const res = await apiGetboxD(reqBody);

    return res;
  } catch (error) {
    return null;
  } finally {
  }
};

const calcFullWidthOrW = ({
  fullWidth,
  W,
  G,
  gapA,
  gapC = 20, // gapC基本上都是20
}:
  | {
      fullWidth: number;
      W?: undefined;
      gapA: number;
      gapC?: number;
      G: number;
    }
  | {
      fullWidth?: undefined;
      W: number;
      G: number;
      gapA: number;
      gapC?: number;
    }) => {
  //
  if (fullWidth !== undefined) {
    W = calcW_2({
      fullWidth,
      gapA,
      gapC,
      G,
    });
  } else {
    const WG = new Decimal(W || 0).add(G).add(G).toNumber();

    fullWidth = calcProductFullWidth({
      WG,
      gapA,
      gapC,
    });
  }

  const WG = new Decimal(W || 0).add(G).add(G).toNumber();

  return {
    fullWidth,
    W,
    G,
    gapA,
    gapC,
    WG,
  };
};

const calcDefaultMotor = ({ doorGeneralSpecs }: { doorGeneralSpecs: TdoorGeneralSpecsDto }) => {
  const {
    // bearingHousingSize,
    // bearingHousingTotalLength,
    // bearingInnerDiameter,
    // bearingName,
    defaultMotorIndex,
    // density,
    // diameter,
    // gapA,
    // gapC,
    motors,
    // gearNumber,
    // sprocketWheelModel,
    // sprocketWheelTeethNumber,
    // sprocketWheelChains,
    // weight,
    // slatLength,
    // guideRailLength,
    // headBoxLength,
    // thickness,
  } = doorGeneralSpecs;

  // 後端說boxB只會在defaultMotorIndex指定的motors裡面會有

  const defaultMotorSpecs = motors[defaultMotorIndex];
  const defaultMotorBox: TdoorGeneralSpecsMotorBoxDto | undefined = defaultMotorSpecs.box;

  let defaultMotorVendor: string | undefined | null;
  let defaultBoxB: number | undefined | null;

  if (defaultMotorBox?.東元) {
    defaultMotorVendor = '東元';
    defaultBoxB = new Decimal(defaultMotorBox.東元.boxB).div(1000).toNumber();
  } else if (defaultMotorBox?.default) {
    // default存在代表東元或大同都可以
    // 馬達金額基本上都是用東元的金額，所以東元優先
    defaultMotorVendor = '東元';
    defaultBoxB = new Decimal(defaultMotorBox.default.boxB).div(1000).toNumber();
  } else if (defaultMotorBox?.大同) {
    defaultMotorVendor = '大同';
    defaultBoxB = new Decimal(defaultMotorBox.大同.boxB).div(1000).toNumber();
  } else {
    defaultMotorVendor = null;
    defaultBoxB = null;
  }

  return {
    // thickness,
    // diameter,
    //
    defaultMotorSpecs,
    defaultMotorVendor,
    defaultBoxB,
    defaultMotorBox,
  };
};

const check_isValueInOptions = (value: string, options: Toption[]) => {
  return options.some((item) => item.value === value);
};

const lookup_options_boxB: {
  [doorType: string]: Toption[] | undefined;
} = {
  'SJ-302': optionsCreator_boxB_SJ302(),
  'SJ-303A': optionsCreator_boxB_SJ303A(),
  'SJ-303AS': optionsCreator_boxB_SJ303A(),
  'SJ-305D': optionsCreator_boxB_SJ305D(),
  'SJ-312': optionsCreator_boxB_SJ312(),
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

//

// 不鏽鋼材質表面：
// 2B
// HL
// BA
// NO.4
//
// 非不鏽鋼材質就不能選表面
//
//
// 只有門片有重量
// 資料來自/products/door/calc-general-spec
//
//
// 材料配件設定
// 第一個代號不需要，拿掉
//
// 主產品設定裡的材質應該是指門片材質
//
// 送給後端，從後端收到的 長度相關的單位 都是mm
// 包過 L W h B
// 所以要再自己換算
//
//
// 過濾材料配件時，如果條件是null就表示不限制
//
// 要有烤漆欄位
// 除了馬達跟配件都要有
// 用checkBox表示
//
//
// 主產品設定的材質是指門片材質
// 變更主產品的材質時，材料配件設定裡面的材質也要跟著變
// 如果沒有對應的材質，就用SST#304
// 支板 捲軸 馬達 馬達配件 的材質是固定
//
// 主產品設定裡的表面更動時，連帶更動材料配件設定的表面
// 材料配件設定的材質選項來自 /products/door/models

// ## 材質規則

// - 底座: 鍍鋅鋼板, 高耐鍍鋅鋼板, SST#304, SST#316
// - 門軌: 鍍鋅鋼板, 高耐鍍鋅鋼板, SST#304, SST#316
// - 機械箱: 鍍鋅鋼板, 高耐鍍鋅鋼板, SST#304, SST#316
// - 支板: 黑鐵
// - 捲軸: 黑鐵
// - 馬達: 黑鐵
// - 馬達配件: 其他

//

// 主產品的材料改變後 下面沒有相應的材料話就帶入SST304

// 相數符號 ∮

import Decimal from 'decimal.js';

import type { TreRender } from './useProduct';
import { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

import { TdoorComponentListDto } from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';

import { Class_product, checkIsSST, creOptions_surface } from './classProduct';

import scss from './classComponent.module.scss';

import { TgenerateDoorProductBomDto_ComponentInfo } from 'js/api/api_product';
import { TcomponentKey } from './useProduct';

// ===========================================================
class Class_component {
  constructor({
    reRender,
    data,
    key,
    prod,
    callReqGetCodeNumber,
    isNew = true,
  }: {
    reRender: TreRender;
    data: Tcomponent;
    key: TcomponentKey;
    prod: Class_product;
    callReqGetCodeNumber: () => void;
    isNew?: boolean;
  }) {
    this.reRender = reRender;
    this._prod = prod;
    this._com = data;
    this.key = key;

    this.callReqGetCodeNumber = callReqGetCodeNumber;

    if (!this._com.material) {
      if (key === 'sidePlate' || key === 'roller' || key === 'motor' || key === 'motorAccessories') {
        this._com.material = comLookUp[key].options[0].value;
      }
    }

    if (!this._com.quantity) {
      this._com.quantity = calcDefaultQuantity({
        key,
        w: Number(prod.width),
        l: Number(prod.length),
        h: Number(prod.height),
        b: Number(prod.boxB),
      });
    }

    if (isNew) {
      this.calcAllPrice();
    }
  } // constructor

  private reRender;
  private _prod;
  private _com;
  readonly key;
  readonly callReqGetCodeNumber;
  //
  //
  // private _material: undefined | string = undefined;
  // private _surface: undefined | string = undefined;
  // private _isPainted = false;

  // private _quantity = '';
  private _dualPrice = 0;
  private _unitPrice = 0;
  private _totalPrice = 0;
  //
  //

  // ---------------------------------------------------------

  changeFindedMaterial = (v: string) => {
    if (this.key === 'sidePlate' || this.key === 'roller' || this.key === 'motor' || this.key === 'motorAccessories') {
      return;
    }

    const value = findOptionValue({
      options: this.options_material ?? [],
      value: v,
    });

    if (value) {
      this.material = value;
    } else {
      this.material = 'SST#304';
    }
  };

  calcAllPrice({
    toCalcComAllprice = true,
  }: //
  { toCalcComAllprice?: boolean } = {}) {
    const discount = new Decimal(this._prod.discount).div(100);

    const price = this.price || 0;
    const quantity = Number(this._com.quantity || 0);
    // 牌價複價
    const dualPrice = new Decimal(price).mul(quantity);
    // 單價
    const unitPrice = new Decimal(price).mul(discount);
    // 複價
    const totalPrice = new Decimal(unitPrice).mul(quantity);

    this._dualPrice = dualPrice.ceil().toNumber();
    this._unitPrice = unitPrice.ceil().toNumber();
    this._totalPrice = totalPrice.ceil().toNumber();

    if (toCalcComAllprice) {
      this._prod.calcComAllPrice();
    }

    this.reRender();
  }

  // ---------------------------------------------------------

  get hiddenKeyArr() {
    return comLookUp[this.key].hiddenKeyArr;
  }

  get componentInfo() {
    const info: TgenerateDoorProductBomDto_ComponentInfo = {
      id: this._com.id,
      material: this._com.material ?? '', // 注意，api不接受空字串
      materialSurface: this._com.materialSurface as '2B' | 'HL' | 'BA' | 'NO.4' | undefined,
      isPainted: !!this._com.isPainted,
    };

    return info;
  }

  // ---------------------------------------------------------

  get options_material() {
    if (this.key === 'slat') {
      return this._prod.options_material;
    }

    return comLookUp[this.key].options;
  }

  get options_surface() {
    if (checkIsSST(this.material ?? '')) {
      return creOptions_surface();
    }

    return undefined;
  }

  // ---------------------------------------------------------
  get comName() {
    return comLookUp[this.key].typeName;
  }

  get desc() {
    if (!this._com.id) {
      return '沒有符合規格的產品';
    }

    return comLookUp[this.key].creDesc(this);
  }

  // -------------------------------------------1--------------
  get doorModelName() {
    return this._com.doorModelName;
  }
  set doorModelName(v) {
    this._com.doorModelName = v;
    this.reRender();
  }

  get code() {
    return this._com.code;
  }
  set code(v) {
    this._com.code = v;
    this.reRender();
  }

  get specialSpec() {
    return this._com.specialSpec;
  }
  set specialSpec(v) {
    this._com.specialSpec = v;
    this.reRender();
  }

  get price() {
    return this._com.price;
  }
  // set price(v) {
  //   this._data.price = v;
  //   this.reRender();
  // }

  get name() {
    return this._com.name;
  }
  // set name(v) {
  //   this._data.name = v;
  //   this.reRender();
  // }

  get isAntiTyphoon() {
    return this._com.isAntiTyphoon;
  }
  set isAntiTyphoon(v) {
    this._com.isAntiTyphoon = v;
    this.reRender();
  }

  get gearNumber() {
    return this._com.gearNumber;
  }
  set gearNumber(v) {
    this._com.gearNumber = v;
    this.reRender();
  }

  get motorVendor() {
    return this._com.motorVendor;
  }
  set motorVendor(v) {
    this._com.motorVendor = v;
    this.reRender();
  }

  get bearingType() {
    return this._com.bearingType;
  }
  set bearingType(v) {
    this._com.bearingType = v;
    this.reRender();
  }

  get thickness() {
    return this._com.thickness;
  }
  set thickness(v) {
    this._com.thickness = v;
    this.reRender();
  }

  get isIntegrated() {
    return this._com.isIntegrated;
  }
  set isIntegrated(v) {
    this._com.isIntegrated = v;
    this.reRender();
  }

  get isWaterProof() {
    return this._com.isWaterProof;
  }
  set isWaterProof(v) {
    this._com.isWaterProof = v;
    this.reRender();
  }

  get hasAluminumBarrier() {
    return this._com.hasAluminumBarrier;
  }
  set hasAluminumBarrier(v) {
    this._com.hasAluminumBarrier = v;
    this.reRender();
  }

  get hasSilencingStrip() {
    return this._com.hasSilencingStrip;
  }
  set hasSilencingStrip(v) {
    this._com.hasSilencingStrip = v;
    this.reRender();
  }

  get maxDoorWeight() {
    return this._com.maxDoorWeight;
  }
  set maxDoorWeight(v) {
    this._com.maxDoorWeight = v;
    this.reRender();
  }

  get minDoorWeight() {
    return this._com.minDoorWeight;
  }
  set minDoorWeight(v) {
    this._com.minDoorWeight = v;
    this.reRender();
  }

  get diameter() {
    return this._com.diameter;
  }
  set diameter(v) {
    this._com.diameter = v;
    this.reRender();
  }

  get horsePower() {
    return this._com.horsePower;
  }
  set horsePower(v) {
    this._com.horsePower = v;
    this.reRender();
  }

  get phase() {
    return this._com.phase;
  }
  set phase(v) {
    this._com.phase = v;
    this.reRender();
  }

  get voltage() {
    return this._com.voltage;
  }
  set voltage(v) {
    this._com.voltage = v;
    this.reRender();
  }

  get loadWeight() {
    return this._com.loadWeight;
  }
  set loadWeight(v) {
    this._com.loadWeight = v;
    this.reRender();
  }

  get hasSupportStand() {
    return this._com.hasSupportStand;
  }
  set hasSupportStand(v) {
    this._com.hasSupportStand = v;
    this.reRender();
  }

  get chains() {
    return this._com.chains;
  }
  set chains(v) {
    this._com.chains = v;
    this.reRender();
  }
  // --------------------------------------------------
  // --------------------------------------------------
  // 不來自於Tcomponent

  get material() {
    return this._com.material ?? '';
  }
  set material(v) {
    if (!checkIsSST(v ?? '')) {
      this._com.materialSurface = '';
    }

    this._com.material = v;
    this.callReqGetCodeNumber();
    this.reRender();
  }

  get surface() {
    return this._com.materialSurface;
  }
  set surface(v) {
    this._com.materialSurface = v;
    this.callReqGetCodeNumber();
    this.reRender();
  }

  get isPainted() {
    return this._com.isPainted;
  }

  set isPainted(v) {
    this._com.isPainted = v;
    this.callReqGetCodeNumber();
    this.reRender();
  }

  get density() {
    return this._prod._doorGeneralSpecs?.density;
  }

  get quantity() {
    return this._com.quantity ?? '';
  }
  set quantity(str) {
    this._com.quantity = str;
    this.calcAllPrice();
    this.reRender();
  }

  get codeNumber() {
    return this._com.number ?? '';
  }
  set codeNumber(v) {
    this._com.number = v;
    this.reRender();
  }

  get componentId() {
    return this._com.componentId ?? '';
  }
  set componentId(v) {
    this._com.componentId = v;
    this.reRender();
  }

  get dualPrice() {
    return String(this._dualPrice);
  }

  get unitPrice() {
    return String(this._unitPrice);
  }

  get totalPrice() {
    return String(this._totalPrice);
  }

  get unit() {
    return comLookUp[this.key].unit;
  }

  get body() {
    return {
      type: comLookUp[this.key].type,
      material: this._com.material ?? '',
      materialSurface: this._com.materialSurface || undefined,
      isPainted: this._com.isPainted ?? false,
      price: this._com.price ?? 0,
      quantity: Number(this._com.quantity) ?? 0,
      // 下面這幾個先跳過
      number: this.codeNumber ?? '',
      componentId: this.componentId ?? '',
      rawData: '',
      bom: '',
      // order: '', //在外面處理
    };
  }
} // Class_component

// ===========================================================

type Tcomponent = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  name?: string; // TdoorMotorAccessoriesDto沒有name

  // ----------------------------------------------
  // 這邊是共有的property
  // TdoorSlatDto  TdoorBottomBarDto  TdoorGuideRailDto
  isAntiTyphoon?: boolean;

  // TdoorSidePlateDto  TdoorMotorDto
  gearNumber?: string | null; // 鍊齒輪番號
  motorVendor?: string | null; // 馬達廠商

  // TdoorSidePlateDto  TdoorMotorAccessoriesDto
  bearingType?: string | null; // 軸承

  // TdoorGuideRailDto TdoorMotorAccessoriesDto
  thickness?: string | null; // 厚度

  // TdoorSidePlateDto TdoorMotorAccessoriesDto
  isIntegrated?: boolean | null; // 一體式捲箱

  // ----------------------------------------------
  // TdoorBottomBarDto
  isWaterProof?: boolean;
  hasAluminumBarrier?: boolean;

  // TdoorGuideRailDto
  /**消音條 */
  hasSilencingStrip?: boolean; // 消音條

  //TdoorSidePlateDto
  /**一體式捲箱 */
  maxDoorWeight?: number | null; // 最大門重量(kg)
  minDoorWeight?: number | null; // 最小門重量(kg)

  // TdoorRollerDto
  /**直徑(inch) */
  diameter?: string; // 直徑(inch)

  // TdoorMotorDto
  horsePower?: string; // 馬力數
  phase?: number | null; // 相位
  /**電壓(V) */
  voltage?: number | null; // 電壓(V)
  /**荷重(kg) */
  loadWeight?: number | null; // 荷重(kg)
  hasSupportStand?: boolean | null; // 有腳

  // TdoorMotorAccessoriesDto
  // 沒有name
  /**鍊條排數 */
  chains?: number; // 鍊條排數

  // TdoorMotorAccessoriesDto
  // 兩個property，都是共有property
  //
  //

  // 以下這些來自TcreateQuotationProductComponentsDto
  material?: string;
  materialSurface?: string;
  isPainted?: boolean;
  price?: number | null;
  quantity?: string;
  number?: string;
  componentId?: string;
  rawData?: string;
  bom?: string;
  order?: number;
}; //  Taccessory

// type TacceKey = keyof Taccessory;

const comKeyArrOri: () => string[] = () => {
  return [
    // 'acceName',
    'codeNumber',
    'desc',
    // 'name',
    'material',
    'surface',
    'density',
    'isPainted',

    'unit',

    'quantity',
    'price',
    'dualPrice',
    'unitPrice',
    'totalPrice',
  ];
};

const comCellConfig: TcellConfig = {
  comName: {
    label: '名稱',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  code: {
    label: 'code',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  codeNumber: {
    label: '代號',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  name: {
    label: '名稱',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          placeholder: '',
          disabled: true,
        },
      },
    },
  },
  material: {
    label: '材料',
    inputSelProps: {
      wrapperStyle: { width: '150px' },
      selectProps: {
        props: {
          // options 不同種類有不同的選項，寫在class裡面
        },
      },
    },
  },
  surface: {
    label: '表面',
    inputSelProps: {
      wrapperStyle: { width: '80px' },
      selectProps: {
        props: {
          // options 寫在class裡面
        },
      },
    },
  },
  density: {
    label: '重量基重',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  isPainted: {
    label: '烤漆',
    theadItemClassName: 'text-center',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '45px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'isPainted' }],
      },
    },
  },
  desc: {
    label: '說明',
    inputSelProps: {
      wrapperStyle: { width: '200px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          placeholder: '',
          disabled: true,
        },
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
  price: {
    label: '牌價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '80px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  dualPrice: {
    label: '牌價複價',
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
  unitPrice: {
    label: '單價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '80px' },
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
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  unit: {
    label: '單位',
    theadItemClassName: 'text-center',
    isSuffixOnly: true,
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '60px' },
      suffixClassName: scss.suffix,
    },
  },
};

// ============================================================================================
// ============================================================================================
// ============================================================================================

const creDesc_slats = (classCom: Class_component) => {
  const { isAntiTyphoon, material, surface, thickness, name } = classCom;
  const desc_isAntiTyphoon = confomtTree.isAntiTyphoon[`${isAntiTyphoon}`];

  // return `${desc_isAntiTyphoon} `;
  return `${name ?? ''} ${material ?? ''} ${thickness ?? ''}`;
};

const creDesc_bottomBars = (classCom: Class_component) => {
  const { isAntiTyphoon, isWaterProof, hasAluminumBarrier } = classCom;

  const desc_isAntiTyphoon = confomtTree.isAntiTyphoon[`${isAntiTyphoon}`];
  const desc_waterProof = confomtTree.isWaterProof[`${isWaterProof}`];
  const desc_luminumBarrier = confomtTree.hasAluminumBarrier[`${hasAluminumBarrier}`];

  // return `${desc_isAntiTyphoon} ${desc_waterProof} ${desc_luminumBarrier}`;
  // 50*50*4T 錏 後端沒有給類似格式的的資料
  return ``;
};

const creDesc_guideRails = (classCom: Class_component) => {
  const { name, material, hasSilencingStrip, isAntiTyphoon, thickness } = classCom;
  const desc_isAntiTyphoon = confomtTree.isAntiTyphoon[`${isAntiTyphoon}`];
  const desc_hasSilencingStrip = confomtTree.hasSilencingStrip[`${hasSilencingStrip}`];

  // return `厚度${thickness} ${desc_isAntiTyphoon} ${desc_hasSilencingStrip}`;
  // return `${name} 厚度${thickness}`;
  return `${name ?? ''} ${material ?? ''} ${thickness ?? ''}`;
};

const creDesc_sidePlates = (classCom: Class_component) => {
  const {
    //
    name,
    bearingType,
    gearNumber,
    isIntegrated,
    maxDoorWeight,
    minDoorWeight,
    motorVendor,
  } = classCom;

  const desc_isIntegrated = confomtTree.isIntegrated[`${isIntegrated}`];

  // return `${desc_isIntegrated} 馬達供應商:${motorVendor ?? '無資料'} 軸承:${bearingType ?? '無資料'} 齒輪編號:${
  //   gearNumber ?? '無資料'
  // } 最大負重:${maxDoorWeight ?? '無資料'} 最小負重:${minDoorWeight ?? '無資料'}`;
  return `${name ?? ''} `;
};

const creDesc_rollers = (classCom: Class_component) => {
  const { diameter } = classCom;

  // return `直徑:${diameter ?? '無資料'}`;
  return `∮${diameter ?? ''}`;
};

const creDesc_motors = (classCom: Class_component) => {
  const {
    //
    gearNumber,
    hasSupportStand,
    horsePower,
    loadWeight,
    motorVendor,
    phase,
    voltage,
  } = classCom;

  const thePhase = phase as 1 | 3 | undefined | null;

  // const desc_gearNumber = `齒輪編號:${gearNumber ?? '無資料'}`;
  // const desc_hasSupportStand = confomtTree.hasSupportStand[`${hasSupportStand}`];
  // const desc_horsepower = `馬力:${horsePower ?? '無資料'}`;
  // const desc_loadWeight = `荷重:${loadWeight ?? '無資料'}`;
  // const desc_motorVendor = `馬達供應商:${motorVendor ?? '無資料'}`;
  // const desc_phase = `相數:${confomtTree.phase[`${thePhase}`]}`;
  // const desc_voltage = `電壓:${voltage ?? '無資料'}V`;
  // ---
  const desc_gearNumber = `${gearNumber ?? ''}`;
  const desc_hasSupportStand = confomtTree.hasSupportStand[`${hasSupportStand}`];
  const desc_horsepower = `${horsePower ?? ''}`;
  const desc_loadWeight = `${loadWeight ?? ''}`;
  const desc_motorVendor = `${motorVendor ?? ''}`;
  const desc_phase = `${confomtTree.phase[`${thePhase}`]}∮`;
  const desc_voltage = voltage ? `${voltage}V` : '';

  // return `${desc_motorVendor} ${desc_horsepower} ${desc_voltage} ${desc_phase} ${desc_loadWeight} ${desc_hasSupportStand} ${desc_gearNumber}`;
  return `${desc_phase} ${desc_voltage} ${desc_horsepower}`;
};

const creDesc_motorComponent = (classCom: Class_component) => {
  const { name, bearingType, chains } = classCom;

  // const desc_bearingType = `軸承編號:${bearingType ?? '無資料'}`;
  // const desc_chains = `鍊條數量:${chains ?? '無資料'}`;
  const desc_bearingType = `${bearingType ?? ''}`;
  const desc_chains = `${chains ?? ''}`;

  // return `${desc_bearingType} ${desc_chains}`;
  return `${name ?? ''}`;
};

const creDesc_headBoxes = (classCom: Class_component) => {
  const { name, material, isIntegrated, thickness } = classCom;

  // const desc_isIntegrated = confomtTree.isIntegrated[`${isIntegrated}`];
  // const desc_thickness = `厚度:${thickness ?? '無資料'}`;
  const desc_isIntegrated = confomtTree.isIntegrated[`${isIntegrated}`];
  const desc_thickness = `${thickness ?? ''}`;

  // return `${desc_isIntegrated} ${desc_thickness}`;
  return `${name ?? ''} ${material ?? ''} ${desc_thickness}`;
};

const confomtTree = {
  //
  isAntiTyphoon: {
    true: '防颱',
    false: '不防颱',
    undefined: '',
    null: '',
  },
  isWaterProof: {
    true: '防水',
    false: '不防水',
    undefined: '',
    null: '',
  },
  hasAluminumBarrier: {
    true: '附鋁障感',
    false: '無鋁障感',
    undefined: '',
    null: '',
  },
  hasSilencingStrip: {
    true: '有靜音條',
    false: '無靜音條',
    undefined: '',
    null: '',
  },
  isIntegrated: {
    true: '一體式捲箱',
    false: '非一體式捲箱',
    undefined: '',
    null: '',
  },
  hasSupportStand: {
    true: '有腳架',
    false: '無腳架',
    undefined: '',
    null: '',
  },
  phase: {
    '1': '1',
    '3': '3',
    undefined: '',
    null: '',
  },

  //
};

type Tkit = {
  typeName: string;
  // type是api要收的東西
  type: 'slatType' | 'bottomBar' | 'guideRail' | 'sidePlateType' | 'roller' | 'motor' | 'motorAccessories' | 'headBox';
  creDesc: (classCom: Class_component) => string;
  options: Toption[];
  hiddenKeyArr: string[];
  unit?: React.ReactNode;
};

const comLookUp: { [key in TcomponentKey]: Tkit } = {
  slat: {
    typeName: '捲門片',
    type: 'slatType',
    creDesc: creDesc_slats,
    options: [],
    hiddenKeyArr: [],
    unit: (
      <span>
        m<sup>2</sup>
      </span>
    ),
  },
  bottomBar: {
    typeName: '底座',
    type: 'bottomBar',
    creDesc: creDesc_bottomBars,
    options: [
      { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
      { value: 'SST#304', label: 'SST#304' },
      { value: 'SST#316', label: 'SST#316' },
      { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
    ],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
  guideRail: {
    typeName: '門軌',
    type: 'guideRail',
    creDesc: creDesc_guideRails,
    options: [
      { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
      { value: 'SST#304', label: 'SST#304' },
      { value: 'SST#316', label: 'SST#316' },
      { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
    ],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
  sidePlate: {
    typeName: '支板',
    type: 'sidePlateType',
    creDesc: creDesc_sidePlates,
    options: [{ value: '黑鐵', label: '黑鐵' }],
    hiddenKeyArr: ['surface', 'density'],
  },
  roller: {
    typeName: '捲軸',
    type: 'roller',
    creDesc: creDesc_rollers,
    options: [{ value: '黑鐵', label: '黑鐵' }],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
  motor: {
    typeName: '馬達機',
    type: 'motor',
    creDesc: creDesc_motors,
    options: [{ value: '黑鐵', label: '黑鐵' }],
    hiddenKeyArr: ['surface', 'density'],
    unit: '組',
  },
  motorAccessories: {
    typeName: '馬達配件',
    type: 'motorAccessories',
    creDesc: creDesc_motorComponent,
    options: [{ value: '其他', label: '其他' }],
    hiddenKeyArr: ['surface', 'density'],
    unit: '組',
  },
  headBox: {
    typeName: '門箱',
    type: 'headBox',
    creDesc: creDesc_headBoxes,
    options: [
      { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
      { value: 'SST#304', label: 'SST#304' },
      { value: 'SST#316', label: 'SST#316' },
      { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
    ],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
};

const comTypeLookUp = {
  slatType: 'slat',
  bottomBar: 'bottomBar',
  guideRail: 'guideRail',
  sidePlateType: 'sidePlate',
  roller: 'roller',
  motor: 'motor',
  motorAccessories: 'motorAccessories',
  headBox: 'headBox',
} as const;

const findOptionValue = ({ options, value }: { options: Toption[]; value: string }) => {
  const option = options.find((option) => option.value === value);

  return option?.value;
};

const calcDefaultQuantity = ({
  //
  key,
  w,
  l,
  h,
  b,
}: {
  key: string;
  w: number; // 單位為m
  l: number; // 單位為m
  h: number; // 單位為m
  b: number; // 單位為m
}) => {
  const hb = h + b;
  const wl = w || l;

  if (key === 'slat') {
    return new Decimal(wl).mul(hb).toFixed(2); // m2
  }

  if (key === 'bottomBar' || key === 'roller' || key === 'headBox') {
    return wl.toFixed(2); // M
  }

  if (key === 'guideRail') {
    return h.toFixed(2); // M
  }

  if (key === 'motor' || key === 'motorAccessories') {
    return '1.00';
  }

  return '1.00';

  // sidePlates // 沒有在表格裡面

  // motors motorAccessories
};

const creEmptyCom: () => Tcomponent = () => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  doorModelName: '',
  code: '',
  desc: '',
  specialSpec: '---',

  material: '',
  materialSurface: '',
  isPainted: false,
  price: 0,
  quantity: '',
});

// ===========================================================
export { Class_component, comKeyArrOri, comCellConfig, creEmptyCom, comTypeLookUp };
export type { Tcomponent };

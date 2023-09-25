import Decimal from 'decimal.js';

import type { TreRender } from './useProduct';
import { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

import { TdoorComponentListDto } from 'js/api/dtoTypes';
import { Toption } from 'js/utils/options/options';

import { Class_product, checkIsSST, creOptions_surface } from './classProduct';

import scss from './classAccessory.module.scss';

import { TgenerateDoorProductBomDto_ComponentInfo } from 'js/api/api_product';
import { TaccessoryKey } from './useProduct';

// ===========================================================
class Class_accessory {
  constructor({
    //
    reRender,
    data,
    key,
    prod,
  }: {
    reRender: TreRender;
    data: Taccessory;
    key: TaccessoryKey;
    prod: Class_product;
  }) {
    this.reRender = reRender;
    this._prod = prod;
    this._data = data;
    this.key = key;

    if (key === 'sidePlate' || key === 'roller' || key === 'motor' || key === 'motorAccessories') {
      this._material = acceLookUp[key].options[0].value;
    }

    this._quantity = calcDefaultValue({
      key,
      w: Number(prod.width),
      l: Number(prod.length),
      h: Number(prod.height),
      b: Number(prod.boxB),
    });

    this.calcAllPrice();
  } // constructor

  private reRender;
  private _prod;
  private _data;
  readonly key;
  //
  //
  private _material: undefined | string = undefined;
  private _surface: undefined | string = undefined;
  private _isPainted = false;

  private _quantity = '';
  private _dualPrice = 0;
  private _unitPrice = 0;
  private _totalPrice = 0;
  //
  //
  codeNumber = '';

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
    toCalcAcceAllprice = true,
  }: //
  { toCalcAcceAllprice?: boolean } = {}) {
    const discount = new Decimal(this._prod.discount).div(100);

    const price = this.price || 0;
    const quantity = Number(this._quantity || 0);
    // 牌價複價
    const dualPrice = new Decimal(price).mul(quantity);
    // 單價
    const unitPrice = new Decimal(price).mul(discount);
    // 複價
    const totalPrice = new Decimal(unitPrice).mul(quantity);

    this._dualPrice = dualPrice.ceil().toNumber();
    this._unitPrice = unitPrice.ceil().toNumber();
    this._totalPrice = totalPrice.ceil().toNumber();

    if (toCalcAcceAllprice) {
      this._prod.calcAcceAllPrice();
    }

    this.reRender();
  }

  // ---------------------------------------------------------

  get hiddenKeyArr() {
    return acceLookUp[this.key].hiddenKeyArr;
  }

  get componentInfo() {
    const info: TgenerateDoorProductBomDto_ComponentInfo = {
      id: this._data.id,
      material: this._material ?? '', // 注意，api不接受空字串
      materialSurface: this._surface as '2B' | 'HL' | 'BA' | 'NO.4' | undefined,
      isPainted: this._isPainted,
    };

    return info;
  }

  // ---------------------------------------------------------

  get options_material() {
    if (this.key === 'slat') {
      return this._prod.options_material;
    }

    return acceLookUp[this.key].options;
  }

  get options_surface() {
    if (checkIsSST(this.material ?? '')) {
      return creOptions_surface();
    }

    return undefined;
  }

  // ---------------------------------------------------------
  get acceName() {
    return acceLookUp[this.key].typeName;
  }

  get desc() {
    return acceLookUp[this.key].creDesc(this);
  }

  // -------------------------------------------1--------------
  get doorModelName() {
    return this._data.doorModelName;
  }
  set doorModelName(v) {
    this._data.doorModelName = v;
    this.reRender();
  }

  get code() {
    return this._data.code;
  }
  set code(v) {
    this._data.code = v;
    this.reRender();
  }

  get specialSpec() {
    return this._data.specialSpec;
  }
  set specialSpec(v) {
    this._data.specialSpec = v;
    this.reRender();
  }

  get price() {
    return this._data.price;
  }
  // set price(v) {
  //   this._data.price = v;
  //   this.reRender();
  // }

  get name() {
    return this._data.name;
  }
  // set name(v) {
  //   this._data.name = v;
  //   this.reRender();
  // }

  get isAntiTyphoon() {
    return this._data.isAntiTyphoon;
  }
  set isAntiTyphoon(v) {
    this._data.isAntiTyphoon = v;
    this.reRender();
  }

  get gearNumber() {
    return this._data.gearNumber;
  }
  set gearNumber(v) {
    this._data.gearNumber = v;
    this.reRender();
  }

  get motorVendor() {
    return this._data.motorVendor;
  }
  set motorVendor(v) {
    this._data.motorVendor = v;
    this.reRender();
  }

  get bearingType() {
    return this._data.bearingType;
  }
  set bearingType(v) {
    this._data.bearingType = v;
    this.reRender();
  }

  get thickness() {
    return this._data.thickness;
  }
  set thickness(v) {
    this._data.thickness = v;
    this.reRender();
  }

  get isIntegrated() {
    return this._data.isIntegrated;
  }
  set isIntegrated(v) {
    this._data.isIntegrated = v;
    this.reRender();
  }

  get isWaterProof() {
    return this._data.isWaterProof;
  }
  set isWaterProof(v) {
    this._data.isWaterProof = v;
    this.reRender();
  }

  get hasAluminumBarrier() {
    return this._data.hasAluminumBarrier;
  }
  set hasAluminumBarrier(v) {
    this._data.hasAluminumBarrier = v;
    this.reRender();
  }

  get hasSilencingStrip() {
    return this._data.hasSilencingStrip;
  }
  set hasSilencingStrip(v) {
    this._data.hasSilencingStrip = v;
    this.reRender();
  }

  get maxDoorWeight() {
    return this._data.maxDoorWeight;
  }
  set maxDoorWeight(v) {
    this._data.maxDoorWeight = v;
    this.reRender();
  }

  get minDoorWeight() {
    return this._data.minDoorWeight;
  }
  set minDoorWeight(v) {
    this._data.minDoorWeight = v;
    this.reRender();
  }

  get diameter() {
    return this._data.diameter;
  }
  set diameter(v) {
    this._data.diameter = v;
    this.reRender();
  }

  get horsePower() {
    return this._data.horsePower;
  }
  set horsePower(v) {
    this._data.horsePower = v;
    this.reRender();
  }

  get phase() {
    return this._data.phase;
  }
  set phase(v) {
    this._data.phase = v;
    this.reRender();
  }

  get voltage() {
    return this._data.voltage;
  }
  set voltage(v) {
    this._data.voltage = v;
    this.reRender();
  }

  get loadWeight() {
    return this._data.loadWeight;
  }
  set loadWeight(v) {
    this._data.loadWeight = v;
    this.reRender();
  }

  get hasSupportStand() {
    return this._data.hasSupportStand;
  }
  set hasSupportStand(v) {
    this._data.hasSupportStand = v;
    this.reRender();
  }

  get chains() {
    return this._data.chains;
  }
  set chains(v) {
    this._data.chains = v;
    this.reRender();
  }
  // --------------------------------------------------
  // --------------------------------------------------
  // 不來自於Taccessory

  get material() {
    return this._material;
  }
  set material(v) {
    if (!checkIsSST(v ?? '')) {
      this._surface = '';
    }

    this._material = v;
    this.reRender();
  }

  get surface() {
    return this._surface;
  }
  set surface(v) {
    this._surface = v;
    this.reRender();
  }

  get isPainted() {
    return this._isPainted;
  }

  set isPainted(v) {
    this._isPainted = v;
    this.reRender();
  }

  get density() {
    return this._prod._doorGeneralSpecs?.density;
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(str) {
    this._quantity = str;
    this.calcAllPrice();
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
    return acceLookUp[this.key].unit;
  }
} // Class_accessory

// ===========================================================

type Taccessory = {
  id: string;
  createdAt: string;
  updatedAt: string;
  doorModelName: string; // 門型名稱
  code: string; // 編號
  specialSpec: string | null; // 特殊規格
  price: number | null;
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
}; //  Taccessory

// type TacceKey = keyof Taccessory;

const acceKeyArrOri: () => string[] = () => {
  return [
    // 'acceName',
    'name',
    'material',
    'surface',
    'density',
    'isPainted',

    'desc',

    'unit',

    'quantity',
    'price',
    'dualPrice',
    'unitPrice',
    'totalPrice',
  ];
};

const acceCellConfig: TcellConfig = {
  acceName: {
    label: '種類名稱',
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
      wrapperStyle: { width: '40px' },
      checkBoxProps: {
        wrapperStyle: { justifyContent: 'center' },
        propsArr: [{ key: 'isPainted' }],
      },
    },
  },
  desc: {
    label: '說明',
    inputSelProps: {
      wrapperStyle: { width: '500px' },
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
      wrapperStyle: { width: '120px' },
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

const creNotConformAcce = () => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  doorModelName: '',
  // code: '沒有符合規格的產品',
  desc: '沒有符合規格的產品',
  specialSpec: '---',
  price: 0,
});

const creDesc_slats = (classAcce: Class_accessory) => {
  const { isAntiTyphoon } = classAcce;
  const desc_isAntiTyphoon = confomtTree.isAntiTyphoon[`${isAntiTyphoon}`];

  // return `${desc_isAntiTyphoon} `;
  return ``;
};

const creDesc_bottomBars = (classAcce: Class_accessory) => {
  const { isAntiTyphoon, isWaterProof, hasAluminumBarrier } = classAcce;

  const desc_isAntiTyphoon = confomtTree.isAntiTyphoon[`${isAntiTyphoon}`];
  const desc_waterProof = confomtTree.isWaterProof[`${isWaterProof}`];
  const desc_luminumBarrier = confomtTree.hasAluminumBarrier[`${hasAluminumBarrier}`];

  // return `${desc_isAntiTyphoon} ${desc_waterProof} ${desc_luminumBarrier}`;
  return ``;
};

const creDesc_guideRails = (classAcce: Class_accessory) => {
  const { name, hasSilencingStrip, isAntiTyphoon, thickness } = classAcce;
  const desc_isAntiTyphoon = confomtTree.isAntiTyphoon[`${isAntiTyphoon}`];
  const desc_hasSilencingStrip = confomtTree.hasSilencingStrip[`${hasSilencingStrip}`];

  // return `厚度${thickness} ${desc_isAntiTyphoon} ${desc_hasSilencingStrip}`;
  return `${name} 厚度${thickness}`;
};

const creDesc_sidePlates = (classAcce: Class_accessory) => {
  const {
    //
    name,
    bearingType,
    gearNumber,
    isIntegrated,
    maxDoorWeight,
    minDoorWeight,
    motorVendor,
  } = classAcce;

  const desc_isIntegrated = confomtTree.isIntegrated[`${isIntegrated}`];

  // return `${desc_isIntegrated} 馬達供應商:${motorVendor ?? '無資料'} 軸承:${bearingType ?? '無資料'} 齒輪編號:${
  //   gearNumber ?? '無資料'
  // } 最大負重:${maxDoorWeight ?? '無資料'} 最小負重:${minDoorWeight ?? '無資料'}`;
  return `${name} `;
};

const creDesc_rollers = (classAcce: Class_accessory) => {
  const { diameter } = classAcce;

  return `直徑:${diameter ?? '無資料'}`;
};

const creDesc_motors = (classAcce: Class_accessory) => {
  const {
    //
    gearNumber,
    hasSupportStand,
    horsePower,
    loadWeight,
    motorVendor,
    phase,
    voltage,
  } = classAcce;

  const thePhase = phase as 1 | 3 | undefined | null;

  const desc_gearNumber = `齒輪編號:${gearNumber ?? '無資料'}`;
  const desc_hasSupportStand = confomtTree.hasSupportStand[`${hasSupportStand}`];
  const desc_horsepower = `馬力:${horsePower ?? '無資料'}`;
  const desc_loadWeight = `荷重:${loadWeight ?? '無資料'}`;
  const desc_motorVendor = `馬達供應商:${motorVendor ?? '無資料'}`;
  const desc_phase = `相位:${confomtTree.phase[`${thePhase}`]}`;
  const desc_voltage = `電壓:${voltage ?? '無資料'}V`;

  // return `${desc_motorVendor} ${desc_horsepower} ${desc_voltage} ${desc_phase} ${desc_loadWeight} ${desc_hasSupportStand} ${desc_gearNumber}`;
  return `${desc_phase} ${desc_voltage} ${desc_horsepower}`;
};

const creDesc_motorAccessories = (classAcce: Class_accessory) => {
  const { name, bearingType, chains } = classAcce;

  const desc_bearingType = `軸承編號:${bearingType ?? '無資料'}`;
  const desc_chains = `鍊條數量:${chains ?? '無資料'}`;

  // return `${desc_bearingType} ${desc_chains}`;
  return `${name}`;
};

const creDesc_headBoxes = (classAcce: Class_accessory) => {
  const { name, isIntegrated, thickness } = classAcce;

  const desc_isIntegrated = confomtTree.isIntegrated[`${isIntegrated}`];
  const desc_thickness = `厚度:${thickness ?? '無資料'}`;

  // return `${desc_isIntegrated} ${desc_thickness}`;
  return `${name} ${desc_thickness}`;
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
    '1': '單相',
    '3': '三相',
    undefined: '',
    null: '',
  },

  //
};

type Tkit = {
  typeName: string;
  creDesc: (classAcce: Class_accessory) => string;
  options: Toption[];
  hiddenKeyArr: string[];
  unit?: React.ReactNode;
};

// slats // 門片
// bottomBars // 底座
// guideRails // 門軌
// sidePlates // 支板
// rollers // 捲軸
// motors // 馬達
// motorAccessories // 馬達配件
// headBoxes // 捲箱

const acceLookUp: { [key in TaccessoryKey]: Tkit } = {
  slat: {
    typeName: '捲門片',
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
    creDesc: creDesc_bottomBars,
    options: [
      { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
      { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
      { value: 'SST#304', label: 'SST#304' },
      { value: 'SST#316', label: 'SST#316' },
    ],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
  guideRail: {
    typeName: '門軌',
    creDesc: creDesc_guideRails,
    options: [
      { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
      { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
      { value: 'SST#304', label: 'SST#304' },
      { value: 'SST#316', label: 'SST#316' },
    ],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
  sidePlate: {
    typeName: '支板',
    creDesc: creDesc_sidePlates,
    options: [{ value: '黑鐵', label: '黑鐵' }],
    hiddenKeyArr: ['surface', 'density'],
  },
  roller: {
    typeName: '捲軸',
    creDesc: creDesc_rollers,
    options: [{ value: '黑鐵', label: '黑鐵' }],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
  motor: {
    typeName: '馬達機',
    creDesc: creDesc_motors,
    options: [{ value: '黑鐵', label: '黑鐵' }],
    hiddenKeyArr: ['surface', 'density'],
    unit: '組',
  },
  motorAccessories: {
    typeName: '馬達配件',
    creDesc: creDesc_motorAccessories,
    options: [{ value: '其他', label: '其他' }],
    hiddenKeyArr: ['surface', 'density'],
    unit: '組',
  },
  headBox: {
    typeName: '門箱',
    creDesc: creDesc_headBoxes,
    options: [
      { value: '鍍鋅鋼板', label: '鍍鋅鋼板' },
      { value: '高耐鍍鋅鋼板', label: '高耐鍍鋅鋼板' },
      { value: 'SST#304', label: 'SST#304' },
      { value: 'SST#316', label: 'SST#316' },
    ],
    hiddenKeyArr: ['surface', 'density'],
    unit: 'M',
  },
};

const findOptionValue = ({ options, value }: { options: Toption[]; value: string }) => {
  const option = options.find((option) => option.value === value);

  return option?.value;
};

const calcDefaultValue = ({
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

  return '';

  // sidePlates // 沒有在表格裡面

  // motors motorAccessories
};

// ===========================================================
export { Class_accessory, acceKeyArrOri, acceCellConfig, creNotConformAcce };
export type { Taccessory };

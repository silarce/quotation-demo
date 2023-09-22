import type { TreRender } from './useProduct';
import { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

import { TdoorComponentListDto } from 'js/api/dtoTypes';

// ===========================================================
class Class_accessory {
  constructor({
    //
    reRender,
    data,
    key,
  }: {
    reRender: TreRender;
    data: Taccessory;
    key: keyof TdoorComponentListDto;
  }) {
    this.reRender = reRender;
    this._data = data;
    this.key = key;
  } // constructor

  private reRender;
  private _data;
  readonly key;
  // ---------------------------------------------------------
  get acceName() {
    return acceNameLookup[this.key];
  }

  get desc() {
    return acceDescLookUp[this.key](this);
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
  set price(v) {
    this._data.price = v;
    this.reRender();
  }

  get name() {
    return this._data.name;
  }
  set name(v) {
    this._data.name = v;
    this.reRender();
  }

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
type TacceKey = string;

const acceKeyArrOri: () => TacceKey[] = () => {
  return ['acceName', 'name', 'desc', 'price'];
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
          disabled: true,
        },
      },
    },
  },
  desc: {
    label: '說明',
    inputSelProps: {
      wrapperStyle: { width: '700px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          placeholder: '',
          disabled: true,
        },
      },
    },
  },
  price: {
    label: '價格',
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
};

// ===========================================================

const creNotConformAcce = () => ({
  id: '',
  createdAt: '',
  updatedAt: '',
  doorModelName: '',
  code: '沒有符合規格的產品',
  specialSpec: '---',
  price: '---',
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

const acceNameLookup: { [key in keyof TdoorComponentListDto]: string } = {
  slats: '門片',
  bottomBars: '底座',
  guideRails: '門軌',
  sidePlates: '支板',
  rollers: '卷軸',
  motors: '馬達',
  motorAccessories: '馬達配件',
  headBoxes: '捲箱',
};

const acceDescLookUp = {
  slats: creDesc_slats,
  bottomBars: creDesc_bottomBars,
  guideRails: creDesc_guideRails,
  sidePlates: creDesc_sidePlates,
  rollers: creDesc_rollers,
  motors: creDesc_motors,
  motorAccessories: creDesc_motorAccessories,
  headBoxes: creDesc_headBoxes,
};

// ===========================================================
export { Class_accessory, acceKeyArrOri, acceCellConfig, acceNameLookup, creNotConformAcce };
export type { Taccessory, TacceKey };

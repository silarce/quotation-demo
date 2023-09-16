import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { optionsCre_doorTrack_normal, optionsCre_doorTrack_typhoonProtection } from 'js/utils/options/doorTrackOptions';
import { optionsCreator_doorModel, optionsCreator_quoteType } from 'js/utils/options/productOptions';

const options_doorTrack_normal = optionsCre_doorTrack_normal();
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection();

// ===========================================================
import { TlegacyContractProductDto, TcreateLegacyContractProductDto } from 'js/api/dtoTypes';

import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { Toption } from 'js/utils/options/options';
import type { TreRender } from './useProduct';

class Class_product {
  constructor({
    //
    reRender,
    prodData = emptyProdOri(),
    delSelf,
    copySelf,
  }: {
    reRender: TreRender;
    prodData?: Tprod;
    delSelf: () => void;
    copySelf: () => void;
  }) {
    this.reRender = reRender;
    this._prodData = _.cloneDeep(prodData);
    this.delSelf = delSelf;
    this.copySelf = copySelf;
    //
    this._quantity = String(this._prodData.quantity);
    this._unitPrice = String(this._prodData.unitPrice);
    this._totalPrice = String(this._prodData.totalPrice);
  } //  constructor close

  private reRender;
  readonly delSelf;
  readonly copySelf;

  private _prodData;
  private _quantity;
  private _unitPrice;
  private _totalPrice;

  readonly options_doorTrack_normal = options_doorTrack_normal;
  readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;

  // ---------------------------------------------------------

  get options_doorTrack() {
    if (this.typhoonProtection) {
      return this.options_doorTrack_typhoonProtection;
    } else {
      return this.options_doorTrack_normal;
    }
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
  get doorType() {
    return this._prodData.doorType;
  }

  set doorType(v) {
    this._prodData.doorType = v;
    this.reRender();
  }
  //
  get length() {
    return this._prodData.length;
  }
  set length(v) {
    this._prodData.length = v;
    this._prodData.width = '0';
    this.area = this.calcArea();
    this.reRender();
  }
  //
  get width() {
    return this._prodData.width;
  }
  set width(v) {
    this._prodData.width = v;
    this._prodData.length = '0';
    this.area = this.calcArea();
    this.reRender();
  }
  //
  get height() {
    return this._prodData.height;
  }
  set height(v) {
    this._prodData.height = v;
    this.area = this.calcArea();
    this.reRender();
  }
  //
  /**B(m) */
  get thickness() {
    return this._prodData.thickness;
  }
  set thickness(v) {
    this._prodData.thickness = v;
    this.area = this.calcArea();
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
    this.reRender();
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(v) {
    this._prodData.quantity = Number(v);
    this._quantity = v;
    this.countTotalPrice();
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
    this.reRender();
  }

  get typhoonProtection() {
    return this._prodData.typhoonProtection;
  }
  set typhoonProtection(v) {
    this._prodData.typhoonProtection = v;
    this._prodData.doorTrack = '';
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
  //
  //
  //
  get motorVendor() {
    return this._prodData.motorVendor;
  }
  set motorVendor(v) {
    this._prodData.motorVendor = v;
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
  doorType: string;
  length: string; // L(m)
  width: string; // W(m)
  height: string; //h(m)
  thickness: string; // B(m)
  area: string; // 面積
  volume: string; // 才數
  material: string;
  surface: string;
  doorTrack: string;
  horsepower: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  typhoonProtection: boolean;
  bounceDoor: boolean;
  notes: string;
  //
  motorVendor: string; // 馬達廠商
  voltage: string; // 電壓
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
    'doorType',
    'length',
    'width',
    'height',
    'thickness',
    'area',
    'volume',
    'material',
    'surface',
    'doorTrack',
    'horsepower',
    'quantity',
    'unitPrice',
    'totalPrice',
    'typhoonProtection',
    'bounceDoor',
    'notes',
    //
    'motorVendor', // 馬達廠商
    'voltage', // 電壓
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

type TprodCellConfig = {
  [key in string]: {
    label: string;
    theadItemClassName?: string;
    inputSelProps: TinputSelProps;
  };
};

const prodCellConfig: TprodCellConfig = {
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
  doorType: {
    label: '門型',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      selectProps: {
        props: {
          options: optionsCreator_doorModel(),
        },
      },
    },
  },
  length: {
    label: 'L(m)',
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
  /**全寬 在product系列api的key為WG */
  width: {
    label: 'W(m)', // 全寬
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
  thickness: {
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
      inputProps: {
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
        props: {},
        withIcon: true,
        dynaOptionsList: {
          normal: optionsCre_doorTrack_normal(),
          typhoonProtection: optionsCre_doorTrack_typhoonProtection(),
        },
      },
    },
  },
  horsepower: {
    label: '馬力',
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      inputProps: {
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
  unitPrice: {
    label: '單價',
    inputSelProps: {
      wrapperStyle: { width: '120px' },
      inputProps: {
        props: {},
      },
    },
  },
  totalPrice: {
    label: '複價',
    inputSelProps: {
      wrapperStyle: { width: '140px' },
      inputProps: {
        props: {},
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
    inputSelProps: {
      wrapperStyle: { width: '90px' },
      selectProps: {
        props: {
          options: [
            { value: '東元', label: '東元' },
            { value: '大同', label: '大同' },
          ],
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
          options: [
            { value: '220V', label: '220V' },
            { value: '380V', label: '380V' },
          ],
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

/**
 *
 * 馬達廠商
 * 電壓
 * 馬達支撐架
 * 底座類型
 * 馬達鎖盒
 * 門軌厚度
 * 捲軸規格
 * 門軌消音條
 * 一體式捲箱
 * 捲箱厚度
 * 開閉方式
 *
 */

const emptyProdOri: () => Tprod = () => {
  return {
    discountRate: '100',
    itemName: '',
    quoteType: '',
    doorType: '',
    length: '',
    width: '',
    height: '',
    thickness: '',
    area: '',
    volume: '',
    material: '',
    surface: '',
    doorTrack: '',
    horsepower: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    typhoonProtection: false,
    bounceDoor: false,
    notes: '',
    //
    motorVendor: '',
    voltage: '',
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

// ===========================================================
// ===========================================================
// ===========================================================
export { Class_product, prodkeyArrOri, prodCellConfig };
export type { Tprod, TprodKey, TprodCellConfig };

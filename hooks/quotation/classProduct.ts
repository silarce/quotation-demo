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

  // ---------------------------------------------------------

  get discountRate() {
    return this._prodData.discountRate;
  }
  set discountRate(v) {
    this._prodData.discountRate = v;
    this.reRender();
  }

  get itemName() {
    return this._prodData.itemName;
  }
  set itemName(v) {
    this._prodData.itemName = v;
    this.reRender();
  }

  get quoteType() {
    return this._prodData.quoteType;
  }
  set quoteType(v) {
    this._prodData.quoteType = v;
    this.reRender();
  }

  get doorType() {
    return this._prodData.doorType;
  }

  set doorType(v) {
    this._prodData.doorType = v;
    this.reRender();
  }

  get length() {
    return this._prodData.length;
  }
  set length(v) {
    this._prodData.length = v;
    this.reRender();
  }

  get width() {
    return this._prodData.width;
  }
  set width(v) {
    this._prodData.width = v;
    this.reRender();
  }

  get height() {
    return this._prodData.height;
  }
  set height(v) {
    this._prodData.height = v;
    this.reRender();
  }

  get thickness() {
    return this._prodData.thickness;
  }
  set thickness(v) {
    this._prodData.thickness = v;
    this.reRender();
  }

  get area() {
    return this._prodData.area;
  }
  set area(v) {
    this._prodData.area = v;
    this.reRender();
  }

  get volume() {
    return this._prodData.volume;
  }
  set volume(v) {
    this._prodData.volume = v;
    this.reRender();
  }

  get material() {
    return this._prodData.material;
  }
  set material(v) {
    this._prodData.material = v;
    this.reRender();
  }

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
    this.reRender();
  }

  get unitPrice() {
    return this._unitPrice;
  }
  set unitPrice(v) {
    this._prodData.unitPrice = Number(v);
    this._unitPrice = v;
    this.reRender();
  }

  get totalPrice() {
    return this._totalPrice;
  }
  set totalPrice(v) {
    this._prodData.totalPrice = Number(v);
    this._totalPrice = v;
    this.reRender();
  }

  get typhoonProtection() {
    return this._prodData.typhoonProtection;
  }
  set typhoonProtection(v) {
    this._prodData.typhoonProtection = v;
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
  width: {
    label: 'W(m)',
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
};

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
  };
};

// ===========================================================
// ===========================================================
// ===========================================================
export { Class_product, prodkeyArrOri, prodCellConfig };
export type { Tprod, TprodKey, TprodCellConfig };

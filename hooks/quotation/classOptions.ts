import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// type
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
import type { Toption } from 'js/utils/options/options';

// type
import { TcreateQuotationProductOptionDto } from 'js/api/dtoTypes';
import { borderTopRightRadius } from 'html2canvas/dist/types/css/property-descriptors/border-radius';

// =======================================================================
class Class_options {
  constructor({
    //
    reRender,
    data = emptyOptionsOri(),
    delSelf,
    copySelf,
  }: {
    reRender: TreRender;
    data?: Toptions;
    delSelf: () => void;
    copySelf: () => void;
  }) {
    this.reRender = reRender;
    this._data = data;
    this.delSelf = delSelf;
    this.copySelf = copySelf;
  } // constructor

  private reRender;
  private _data;
  readonly delSelf;
  readonly copySelf;

  get codeName() {
    return this._data.codeName;
  }
  set codeName(v) {
    this._data.codeName = v;
    this.reRender();
  }

  get name() {
    return this._data.name;
  }
  set name(v) {
    this._data.name = v;
    this.reRender();
  }

  get unit() {
    return this._data.unit;
  }
  set unit(v) {
    this._data.unit = v;
    this.reRender();
  }

  get quantity() {
    return this._data.quantity;
  }
  set quantity(v) {
    this._data.quantity = v;
    this.reRender();
  }

  get unitPrice() {
    return this._data.unitPrice;
  }
  set unitPrice(v) {
    this._data.unitPrice = v;
    this.reRender();
  }

  get totalPrice() {
    return this._data.totalPrice;
  }
  set totalPrice(v) {
    this._data.totalPrice = v;
    this.reRender();
  }

  get price() {
    return this._data.price;
  }
  set price(v) {
    this._data.price = v;
    this.reRender();
  }

  get dualPrice() {
    return this._data.dualPrice;
  }
  set dualPrice(v) {
    this._data.dualPrice = v;
    this.reRender();
  }

  // ---------------------------------------------------------

  get body() {
    return this._data;
  }
} // Class_options  close

// ============================================================================

type Toptions = {
  id?: string;
  codeName: string;
  name: string;
  unit: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  price: number;
  dualPrice: number;
};

type ToptionsKey = Exclude<keyof Toptions, 'id'>;

const optionsKeyArrOri: () => ToptionsKey[] = () => {
  return ['codeName', 'name', 'unit', 'quantity', 'unitPrice', 'totalPrice', 'price', 'dualPrice'];
};

const optionsCellConfig: TcellConfig = {
  codeName: {
    label: '代號',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  name: {
    label: '名稱',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  unit: {
    label: '單位',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  quantity: {
    label: '數量',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  unitPrice: {
    label: '單價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  totalPrice: {
    label: '複價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  price: {
    label: '牌價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  dualPrice: {
    label: '牌價複價',
    inputSelProps: {
      wrapperStyle: { width: '100px' },
      inputProps: {
        props: {},
      },
    },
  },
};

// ============================================================================
const emptyOptionsOri: () => Toptions = () => {
  return {
    codeName: '',
    name: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    price: 0,
    dualPrice: 0,
  };
};

// ============================================================================
export type { Toptions, ToptionsKey };
export { Class_options, optionsCellConfig, optionsKeyArrOri, emptyOptionsOri };

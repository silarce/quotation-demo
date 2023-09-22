import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// type
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';
import type { Toption } from 'js/utils/options/options';

// type
import { TcreateQuotationContentOtherDto } from 'js/api/dtoTypes';

// =======================================================================
class Class_other {
  constructor({
    //
    reRender,
    data = emptyOthersOri(),
    delSelf,
    copySelf,
  }: {
    reRender: TreRender;
    data?: Tothers;
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

  get item() {
    return this._data.item;
  }
  set item(v) {
    this._data.item = v;
    this.reRender();
  }

  get description() {
    return this._data.description;
  }
  set description(v) {
    this._data.description = v;
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

  get notes() {
    return this._data.notes;
  }
  set notes(v) {
    this._data.notes = v;
    this.reRender();
  }

  // ---------------------------------------------------------

  get body() {
    return this._data;
  }
} // Class_other  close

// ============================================================================

type Tothers = {
  id?: string;
  item: string;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
};

type TothersKey = Exclude<keyof Tothers, 'id'>;

const othersKeyArrOri: () => TothersKey[] = () => {
  return ['item', 'description', 'quantity', 'unitPrice', 'totalPrice', 'notes'];
};

const othersCellConfig: TcellConfig = {
  item: {
    label: '項目',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  description: {
    label: '內容',
    inputSelProps: {
      wrapperStyle: { width: '600px' },
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
        props: {
          type: 'number',
        },
      },
    },
  },
  unitPrice: {
    label: '單價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  totalPrice: {
    label: '複價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          type: 'number',
        },
      },
    },
  },
  notes: {
    label: '備註',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
};

// ============================================================================
const emptyOthersOri: () => Tothers = () => {
  return {
    item: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    notes: '',
  };
};

// ============================================================================
export type { Tothers, TothersKey };
export { Class_other, othersCellConfig, othersKeyArrOri, emptyOthersOri };

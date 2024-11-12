import _ from 'lodash';
import Decimal from 'decimal.js';

// type
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

// =======================================================================
class Class_other {
  constructor({
    reRender,
    data = emptyOthersOri(),
    delSelf,
    copySelf,
    callCalcSubTotal,
  }: // calcSubTotalPrice,
  {
    reRender: TreRender;
    data?: Tothers;
    delSelf: () => void;
    copySelf: () => void;
    callCalcSubTotal: () => void;
  }) {
    // this.reRender = reRender;
    this.reRender = function () {
      this.renderCount++;
      reRender();
    };

    this._data = data;
    this.delSelf = delSelf;
    this.copySelf = copySelf;
    // this.calcSubTotalPrice = calcSubTotalPrice;
    this.callCalcSubTotal = callCalcSubTotal;
  } // constructor

  private reRender;
  private renderCount = 0;
  private _data;
  readonly delSelf;
  readonly copySelf;
  callCalcSubTotal;
  // calcSubTotalPrice;

  makeFormatValueDontTriggerTwice = false;

  // ---------------------------------------------------------

  calcAllPrice() {
    const qty = this._data.quantity || 0;
    const unitPrice = this._data.unitPrice || 0;
    const totalPrice = new Decimal(qty).mul(unitPrice).toNumber();
    this._data.totalPrice = totalPrice;

    this.callCalcSubTotal();
    this.reRender();
  }

  // ---------------------------------------------------------

  get item() {
    return this._data.item;
  }
  set item(v) {
    this._data.item = v;
    this.reRender();
  }

  get spec() {
    return this._data.spec ?? '';
  }
  set spec(v) {
    this._data.spec = v;
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
    this.calcAllPrice();
    this.reRender();
  }

  get unitPrice() {
    return this._data.unitPrice;
  }
  set unitPrice(v) {
    this._data.unitPrice = v;
    this.calcAllPrice();
    this.reRender();
  }

  get unitPrice_number() {
    return this._data.unitPrice;
  }

  get unitPrice_locale() {
    return String(this._data.unitPrice || '0');
    // return this._data.unitPrice.toLocaleString();
  }
  set unitPrice_locale(v) {
    // v = v.replace(/,/g, '');

    if (this.makeFormatValueDontTriggerTwice) {
      return;
    }

    this._data.unitPrice = Number(v);
    this.calcAllPrice();
    this.reRender();

    this.makeFormatValueDontTriggerTwice = true;
    setTimeout(() => {
      this.makeFormatValueDontTriggerTwice = false;
    }, 0);
  }

  get totalPrice() {
    return this._data.totalPrice;
  }

  get totalPrice_num() {
    return this._data.totalPrice;
  }
  // set totalPrice(v) {
  //   this._data.totalPrice = v;
  //   this.reRender();
  // }
  get totalPrice_locale() {
    return this._data.totalPrice.toLocaleString();
  }

  get notes() {
    return this._data.notes;
  }
  set notes(v) {
    this._data.notes = v;
    this.reRender();
  }

  get unit() {
    return this._data.unit || '';
  }
  set unit(v) {
    this._data.unit = v;
    this.reRender();
  }

  get isDisplayedOnAccountReceivable() {
    return this._data.isDisplayedOnAccountReceivable;
  }

  set isDisplayedOnAccountReceivable(v) {
    this._data.isDisplayedOnAccountReceivable = v;
    this.reRender();
  }

  // ---------------------------------------------------------

  get body() {
    const copy = _.cloneDeep(this._data);

    return {
      ...copy,
      unit: copy.unit || null,
    };
  }
} // Class_other  close

// ============================================================================

type Tothers = {
  id?: string;
  item: string;
  spec: string | null;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  notes: string;
  unit: string | null;
  isDisplayedOnAccountReceivable: boolean;
};

// type TothersKey = Exclude<keyof Tothers, 'id'>;
type TothersKey = string;

const othersKeyArrOri: () => TothersKey[] = () => {
  return [
    'item',
    'spec',
    'description',
    'quantity',
    'unit',
    //  'unitPrice',
    //  'totalPrice',
    'unitPrice_locale',
    'totalPrice_locale',
    'notes',
    // 'isDisplayedOnAccountReceivable',
  ];
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
  spec: {
    label: '尺寸',
    inputSelProps: {
      wrapperStyle: { width: '150px' },
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
          onWheel: (e) => e.currentTarget.blur(),
        },
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
  // // unitPrice: {
  // //   label: '單價',
  // //   inputSelProps: {
  // //     wrapperStyle: { width: '60px' },
  // //     inputProps: {
  // //       props: {
  // //         type: 'number',
  // //       },
  // //     },
  // //   },
  // // },
  // // totalPrice: {
  // //   label: '複價',
  // //   inputSelProps: {
  // //     wrapperStyle: { width: '60px' },
  // //     showBaseline: 'invisible',
  // //     inputProps: {
  // //       props: {
  // //         disabled: true,
  // //         type: 'number',
  // //       },
  // //     },
  // //   },
  // // },
  unitPrice_locale: {
    label: '單價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {},
      },
    },
  },
  totalPrice_locale: {
    label: '複價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  notes: {
    label: '備註',
    inputSelProps: {
      wrapperStyle: { width: '300px' },
      inputProps: {
        props: {},
      },
    },
  },
  isDisplayedOnAccountReceivable: {
    label: '是否在應收帳款揭露金額',
    inputSelProps: {
      wrapperStyle: { width: '210px' },
      checkBoxProps: {
        propsArr: [{ key: 'isDisplayedOnAccountReceivable' }],
      },
    },
  },
};

// ============================================================================
const emptyOthersOri: () => Tothers = () => {
  return {
    item: '',
    spec: '',
    description: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    notes: '',
    unit: '',
    isDisplayedOnAccountReceivable: false,
  };
};

// ============================================================================
export type { Tothers, TothersKey };
export { Class_other, othersCellConfig, othersKeyArrOri, emptyOthersOri };

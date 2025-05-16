import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

// type
import type { TreRender } from './useProduct';
import type { TcellConfig } from 'components/page/domestic/quotation/quotation/tbody';

// type
// import {
//   TcreateQuotationProductAccessoriesDto,
//   TquotationProductAccessoriesDto,
//   TdoorAccessoryDto,
// } from 'js/api/dtoTypes';

import scss from './classComponent.module.scss';

import { Class_product } from './classProduct';

// =======================================================================
class Class_accessories {
  constructor({
    //
    reRender,
    data = emptyAccessoriesOri(),
    // delSelf,
    // copySelf,
    // calcOptionsAllprice,
    prod,
    isNew = true,
    key,
  }: {
    reRender: TreRender;
    data?: Taccessories;
    // delSelf: () => void;
    // copySelf: () => void;
    // calcOptionsAllprice: () => void;
    prod: Class_product;
    isNew?: boolean;
    key: string;
  }) {
    this.reRender = function () {
      this.renderCount++;
      reRender();
    };

    this._acceData = data;
    this._prod = prod;
    this.key = key;

    // this.delSelf = delSelf;
    // this.copySelf = copySelf;

    this.delSelf = () => prod.delAcce(key);
    this.copySelf = () => prod.copyAcce(key);

    if (isNew) {
      setTimeout(() => {
        this.calcPrice();
        this.decideUnit();
      }, 0);
    }

    this.identificationId = prod.id || nanoid();

    // this.calcOptionsAllprice = calcOptionsAllprice;
    // =constructor=============================
  } // =constructor=============================

  private reRender;
  renderCount = 0;
  private _acceData;
  readonly key;
  private _prod;
  identificationId;

  delSelf: () => void;
  copySelf: () => void;
  // readonly calcOptionsAllprice;

  makeFormatValueDontTriggerTwice = false;

  // --------------------------------------------------------------------

  reNewMethod() {
    this.delSelf = () => this._prod.delAcce(this.key);
    this.copySelf = () => this._prod.copyAcce(this.key);
  }

  // --------------------------------------------------------------------

  calcPrice() {
    const referenceSpec = this._acceData.referenceSpec;

    // length跟width互斥，length為0的時候 price為0?
    if (referenceSpec === 'fullWidth') {
      const l = Number(new Decimal(this._prod.fullWidth || 0).toFixed(2));
      // const w = Number(this._prod.WG);
      const w = 0;
      this.quantity = l || w;
    } else if (referenceSpec === 'area') {
      this.quantity = Number(new Decimal(this._prod.area || 0).toFixed(2));
    }

    this.price = String(this._acceData.originalPrice); // will call calcAllPrice
  }

  decideUnit = () => {
    const referenceSpec = this._acceData.referenceSpec;
    const unit = this._acceData.unit;

    if (unit) {
      return;
    }

    if (referenceSpec === 'fullWidth') {
      this.unit = 'M';
    } else if (referenceSpec === 'area') {
      // this.unit = (
      //   <span>
      //     m<sup>2</sup>
      //   </span>
      // );
      this.unit = 'm2';
    } else {
      this.unit = '組';
    }
  };

  calcAllPrice() {
    const discount = new Decimal(this._prod.discount).div(100);
    const quotationDiscount = new Decimal(this._prod.quotationDiscount).div(100);
    // const quotationDiscount = 1;

    const quantity = this.quantity || 0;

    const price = this._acceData.price;

    // 牌價複價;
    const dualPrice = new Decimal(price).mul(quantity);
    // 單價;
    const unitPrice = new Decimal(price).mul(discount).mul(quotationDiscount);

    // this._acceData.dualPrice = Number(dualPrice.toFixed(0));
    // this._acceData.unitPrice = Number(unitPrice.toFixed(0));
    this._acceData.dualPrice = Number(new Decimal(dualPrice).toFixed(0));
    this._acceData.unitPrice = Number(new Decimal(unitPrice).toFixed(0));

    // 複價;
    // const totalPrice = new Decimal(unitPrice).mul(quantity);
    const totalPrice = new Decimal(this._acceData.unitPrice).mul(quantity);

    // this._acceData.totalPrice = Number(totalPrice.toFixed(0));
    this._acceData.totalPrice = Number(new Decimal(totalPrice).toFixed(0));

    this._prod.calcProdAllprice_timeout();

    this.reRender();
  }

  get codeName() {
    return this._acceData.codeName;
  }
  set codeName(v) {
    this._acceData.codeName = v;
    this.reRender();
  }

  get referenceSpec() {
    return this._acceData.referenceSpec;
  }

  get name() {
    return this._acceData.name;
  }
  set name(v) {
    this._acceData.name = v;
    this.reRender();
  }

  get unit() {
    return this._acceData.unit;
  }
  set unit(v) {
    this._acceData.unit = v;
    this.reRender();
  }

  get quantity() {
    return this._acceData.quantity;
  }
  set quantity(v) {
    this._acceData.quantity = v;
    this.calcAllPrice();
    this.reRender();
  }

  set originalPrice(v: number) {
    this._acceData.originalPrice = v;
    this.calcPrice();
  }

  get price() {
    return String(this._acceData.price);
  }

  set price(str) {
    const num = Number(str);
    this._acceData.price = num;
    this.calcAllPrice();
    this.reRender();
  }

  get price_num() {
    return this._acceData.price;
  }

  get price_locale() {
    return String(this._acceData.price || 0);
    // return this._acceData.price.toLocaleString();
  }
  set price_locale(v) {
    if (this.makeFormatValueDontTriggerTwice) {
      return;
    }

    v = v ?? '0';
    // v = v.replace(/,/g, '');
    this._acceData.price = Number(v);
    this.calcAllPrice();
    this.reRender();

    this.makeFormatValueDontTriggerTwice = true;
    setTimeout(() => {
      this.makeFormatValueDontTriggerTwice = false;
    }, 0);
  }

  get dualPrice() {
    return this._acceData.dualPrice;
  }
  set dualPrice(v) {
    this.reRender();
  }
  get dualPrice_locale() {
    return this._acceData.dualPrice.toLocaleString();
  }

  get unitPrice() {
    return String(this._acceData.unitPrice);
  }
  set unitPrice(str) {
    this.reRender();
  }
  get unitPrice_locale() {
    return this._acceData.unitPrice.toLocaleString();
  }

  get totalPrice() {
    return String(this._acceData.totalPrice);
  }
  set totalPrice(str) {
    // this._data.totalPrice = num;
    this.reRender();
  }
  get totalPrice_locale() {
    return this._acceData.totalPrice.toLocaleString();
  }

  // ---------------------------------------------------------

  get body() {
    return this._acceData;
  }
} // Class_accessories  close

// ============================================================================

type Taccessories = {
  id?: string;

  codeName: string; //代號
  name: string; //名稱
  unit: string; // 單位
  // unit: React.ReactNode; // 單位
  quantity: number; // 數量
  price: number; // 牌價
  totalPrice: number; // 複價
  unitPrice: number; // 單價
  dualPrice: number; // 牌價複價
  //
  referenceSpec: string | null;
  originalPrice?: number;
};

// type TaccessoriesKey = Exclude<keyof Taccessories, 'id'>;
type TaccessoriesKey = string;

const accessoriesKeyArrOri: () => TaccessoriesKey[] = () => {
  return [
    //
    // 'codeName',
    'name',
    'unit',
    'quantity',
    // 'price',
    // 'dualPrice',
    // 'unitPrice',
    // 'totalPrice',
    'price_locale',
    'dualPrice_locale',
    'unitPrice_locale',
    'totalPrice_locale',
  ];
};

const accessoriesCellConfig: TcellConfig = {
  codeName: {
    label: '代號',
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
  name: {
    label: '名稱',
    inputSelProps: {
      wrapperStyle: { width: '550px' },
      showBaseline: 'invisible',
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
      wrapperStyle: { width: '60px' },
      showBaseline: 'invisible',
      suffixClassName: scss.suffix,
      // inputProps: {
      //   props: {
      //     disabled: true,
      //     placeholder: '',
      //   },
      // },
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
  // // price: {
  // //   label: '牌價',
  // //   inputSelProps: {
  // //     wrapperStyle: { width: '60px' },
  // //     showBaseline: 'invisible',
  // //     inputProps: {
  // //       props: {
  // //         disabled: true,
  // //       },
  // //     },
  // //   },
  // // },
  price_locale: {
    label: '牌價',
    inputSelProps: {
      wrapperStyle: { width: '60px' },
      // showBaseline: 'invisible',
      inputProps: {
        props: {
          // disabled: true,
        },
      },
    },
  },
  // // dualPrice: {
  // // label: '牌價複價',
  // // inputSelProps: {
  // // showBaseline: 'invisible',
  // // wrapperStyle: { width: '100px' },
  // // inputProps: {
  // // props: {
  // // disabled: true,
  // // },
  // // },
  // // },
  // // },
  dualPrice_locale: {
    label: '牌價複價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '100px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  // // unitPrice: {
  // //   label: '單價',
  // //   inputSelProps: {
  // //     showBaseline: 'invisible',
  // //     wrapperStyle: { width: '60px' },
  // //     inputProps: {
  // //       props: {
  // //         disabled: true,
  // //       },
  // //     },
  // //   },
  // // },
  unitPrice_locale: {
    label: '單價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
  // // totalPrice: {
  // //   label: '複價',
  // //   inputSelProps: {
  // //     showBaseline: 'invisible',
  // //     wrapperStyle: { width: '60px' },
  // //     inputProps: {
  // //       props: {
  // //         disabled: true,
  // //       },
  // //     },
  // //   },
  // // },
  totalPrice_locale: {
    label: '複價',
    inputSelProps: {
      showBaseline: 'invisible',
      wrapperStyle: { width: '60px' },
      inputProps: {
        props: {
          disabled: true,
        },
      },
    },
  },
};

// ============================================================================
const emptyAccessoriesOri: () => Taccessories = () => {
  return {
    codeName: '',
    name: '',
    unit: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    price: 0,
    dualPrice: 0,
    referenceSpec: null,
  };
};

// ============================================================================
export type { Taccessories, TaccessoriesKey };
export { Class_accessories, accessoriesCellConfig, accessoriesKeyArrOri, emptyAccessoriesOri };

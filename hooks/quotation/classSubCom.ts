import Decimal from 'decimal.js';

import type { TreRender } from './useProduct';

import { Class_product, checkIsSST, creOptions_surface } from './classProduct';

type TSubCom = {
  price: number;
  unitPrice: number;
  dualPrice: number;
  totalPrice: number;
  quantity: number;
  comName: string;
  unit: string;
};

class Class_SubCom {
  constructor({
    //
    reRender,
    data,
    prod,
  }: // prod,
  {
    reRender: TreRender;
    data: TSubCom;
    prod: Class_product;
  }) {
    this.reRender = reRender;
    this._data = data;
    this._prod = prod;

    this.calcAllPrice();
  } // =constructor

  readonly reRender;
  private _data;
  private _prod: Class_product;

  calcAllPrice() {
    const discount = new Decimal(this._prod.discount).div(100);

    const quantity = Number(this._data.quantity || 0);

    const price = this.price || 0;
    // 牌價複價
    const dualPrice = new Decimal(price).mul(quantity);
    // 單價
    const unitPrice = new Decimal(price).mul(discount);
    // 複價
    const totalPrice = new Decimal(unitPrice).mul(quantity);

    this._data.dualPrice = Number(dualPrice.toFixed(0));
    this._data.unitPrice = Number(unitPrice.toFixed(0));
    this._data.totalPrice = Number(totalPrice.toFixed(0));

    this._prod.calcProdAllprice_timeout();

    this.reRender();
  }

  // ----------------------------------------------------------------

  get hiddenKeyArr() {
    return ['isPainted', 'desc', 'density', 'code', 'material', 'surface', 'codeNumber'];
  }

  get comName() {
    return this._data.comName;
  }

  get quantity() {
    return String(this._data.quantity);
  }
  set quantity(v) {
    this._data.quantity = Number(v);
    this.calcAllPrice();
    this.reRender();
  }

  get price() {
    return `${this._data.price}`;
  }
  get price_locale() {
    return this._data.price.toLocaleString();
  }
  // set price(v) {
  //   this._data.price = Number(v);
  //   this.reRender();
  // }

  get unitPrice() {
    return `${this._data.unitPrice}`;
  }
  get unitPrice_locale() {
    return this._data.unitPrice.toLocaleString();
  }
  // set unitPrice(v) {
  //   this._data.unitPrice = Number(v);
  //   this.reRender();
  // }

  get dualPrice() {
    return `${this._data.dualPrice}`;
  }
  get dualPrice_locale() {
    return this._data.dualPrice.toLocaleString();
  }
  // set dualPrice(v) {
  //   this._data.dualPrice = Number(v);
  //   this.reRender();
  // }

  get totalPrice() {
    return `${this._data.totalPrice}`;
  }
  get totalPrice_locale() {
    return this._data.totalPrice.toLocaleString();
  }

  get unit() {
    return this._data.unit;
  }

  // set totalPrice(v) {
  //   this._data.totalPrice = Number(v);
  //   this.reRender();
  // }
}

export { Class_SubCom };
export type { TSubCom };

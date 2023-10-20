import Decimal from 'decimal.js';

import { TlegacyContractDto } from 'js/api/dtoTypes';

import { clearThousandsSeparator } from 'js/utils/helpers/universal';

// ======================================================================
import { TemptyLegacyContract, TreRender } from './useLegacyContract';
import { Class_product } from './useLegacyContract';

// ======================================================================
class Class_payInfo {
  constructor(
    reRender: TreRender,
    legacyContract: TlegacyContractDto | TemptyLegacyContract,
    classProductArr: Class_product[],
    // editAllProdDiscount: (v: string) => void,
    countSubTotal: () => void
  ) {
    this._reRender = reRender;
    this._legacyContract = legacyContract;
    this._legacyContract.discountRate = Decimal.mul(this._legacyContract.discountRate || '0', 100).toString();
    this._legacyContract.paymentMethods.forEach((item) => {
      item.totalPaymentRatio = Decimal.mul(item.totalPaymentRatio || '0', 100).toString();
    });
    this._classProductArr = classProductArr;
    // this._editAllProdDiscount = editAllProdDiscount;
    this._countSubTotal = countSubTotal;

    this._subTotal = this._legacyContract.subTotal.toString();
    this._salesTax = this._legacyContract.salesTax.toString();
    this._total = this._legacyContract.total.toString();
  }
  private _reRender;
  private _legacyContract;
  private _classProductArr;
  // private _editAllProdDiscount;
  private _countSubTotal;
  private _subTotal;
  private _salesTax;
  private _total;

  /**總折數 */
  get discountRate() {
    return this._legacyContract.discountRate;
  }
  set discountRate(v) {
    if (parseFloat(v) > 100) {
      v = '100';
    }

    this._legacyContract.discountRate = v || '0';
    this._reRender();
  }

  set discountRate_noLoop(v: string) {
    if (parseFloat(v) > 100) {
      v = '100';
    }

    const discountRate = Decimal.div(v || 0, 100);
    const subTotal: string = (() => {
      let subTotal = new Decimal(0);
      this._classProductArr.forEach((prod) => {
        if (!prod.totalPrice) {
          return;
        }

        subTotal = subTotal.add(clearThousandsSeparator(prod.totalPrice));
      });

      return subTotal.mul(discountRate).toString();
    })();

    this.subTotal = subTotal;
    this._legacyContract.discountRate = v || '0';
    this._reRender();
  }
  /**小計 */
  get subTotal() {
    if (!this._subTotal) {
      return '';
    }

    return Number(this._subTotal).toLocaleString();
  }
  set subTotal(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    const salesTax = Decimal.mul(v || 0, 0.05).toFixed(0);
    const total = Decimal.add(salesTax, v || 0).toString();
    this._subTotal = v;
    this._legacyContract.subTotal = parseFloat(v || '0');
    this.salesTax = salesTax;
    this.total = total;
    this._reRender();
  }

  /**營業稅 */
  get salesTax() {
    if (!this._salesTax) {
      return '';
    }

    return Number(this._salesTax).toLocaleString();
  }
  set salesTax(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._salesTax = v;
    this._legacyContract.salesTax = Number(v || '0');
    this._reRender();
  }
  /**總計 */
  get total() {
    if (!this._total) {
      return '';
    }

    return Number(this._total).toLocaleString();
  }
  set total(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    v = new Decimal(v || 0).toDecimalPlaces(0).toString();

    this._total = v; // 必須可以接受空字串""
    this._legacyContract.total = Number(v || '0'); // 必須是number
    // this._total = v; // 必須可以接受空字串""
    // this._legacyContract.total = parseFloat(v || "0");// 必須是num
    this._reRender();
  }

  get deliveryLocation() {
    return this._legacyContract.deliveryLocation;
  }
  set deliveryLocation(v) {
    this._legacyContract.deliveryLocation = v;
    this._reRender();
  }

  get deliveryDate() {
    return this._legacyContract.deliveryDate;
  }
  set deliveryDate(v) {
    this._legacyContract.deliveryDate = v;
    this._reRender();
  }

  get paymentMethods() {
    return this._legacyContract.paymentMethods;
  }

  get payPrice() {
    return {
      discountRate: this._legacyContract.discountRate,
      subTotal: this._legacyContract.subTotal,
      salesTax: this._legacyContract.salesTax,
      total: this._legacyContract.total,
    };
  }

  editPayMethod = (index: number, v: string) => {
    this._legacyContract.paymentMethods[index].totalPaymentRatio = v;
    this._reRender();
  };
  addPayMethod = (milestone: string) => {
    this._legacyContract.paymentMethods.push({ milestone, totalPaymentRatio: '0' });
    this._reRender();
  };
  removePayMethod = (index: number) => {
    this._legacyContract.paymentMethods.splice(index, 1);
    this._reRender();
  };
}

export { Class_payInfo };

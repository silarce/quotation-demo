import { useState, useEffect, HTMLInputTypeAttribute } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';
import { checkDateFormat } from 'js/tools/date/checkDate';
// import { yearConversion_chToStandard } from "js/tools/date/yearConversion_chToStandard"
// import { yearConversion_standardToCh } from "js/tools/date/yearConversion_standardToCh"

import { optionsCre_doorTrack_normal, optionsCre_doorTrack_typhoonProtection } from 'js/utils/options/doorTrackOptions';

import {
  TlegacyContractDto,
  TcreateLegacyContractDto,
  TlegacyContractProductDto,
  TcreateLegacyContractProductDto,
  TlegacyContractAdditionDto,
  TcreateLegacyContractAdditionDto,
  TcustomerDto,
} from 'js/api/dtoTypes';

import { checkIsNumberStr, clearThousandsSeparator } from 'js/utils/helpers/universal';

const options_doorTrack_normal = optionsCre_doorTrack_normal();
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection();

type TreRender = () => void;

// =======================================================================
class Class_basicInfo {
  constructor(reRender: TreRender, legacyContract: TlegacyContractDto | TemptyLegacyContract) {
    this._reRender = reRender;
    this._legacyContract = legacyContract;
    this._legacyContract.quoteDate = (() => {
      if (!this._legacyContract.quoteDate) {
        return '';
      }

      // const quoteDate = moment(this._legacyContract.quoteDate).format("YYYY-MM-DD")
      // return yearConversion_standardToCh(quoteDate ?? "", true)
      return this._legacyContract.quoteDate;
    })();
    this._legacyContract.deliveryDate = (() => {
      if (!this._legacyContract.deliveryDate) {
        return '';
      }

      // const deliveryDate = moment(this._legacyContract.deliveryDate).format("YYYY-MM-DD")
      // return yearConversion_standardToCh(deliveryDate ?? "", true)
      return this._legacyContract.deliveryDate;
    })();
  }

  private _reRender;
  private _legacyContract;

  get contractNumber() {
    return this._legacyContract.contractNumber;
  }
  set contractNumber(v) {
    this._legacyContract.contractNumber = v;
    this._reRender();
  }

  get quoteValidity() {
    return this._legacyContract.quoteValidity;
  }
  set quoteValidity(v) {
    this._legacyContract.quoteValidity = v;
    this._reRender();
  }

  get quoteDate() {
    return this._legacyContract.quoteDate;
  }
  set quoteDate(v) {
    this._legacyContract.quoteDate = v;
    this._reRender();
  }

  get projectName() {
    return this._legacyContract.projectName;
  }
  set projectName(v) {
    this._legacyContract.projectName = v;
    this._reRender();
  }

  get customerName() {
    return this._legacyContract.customerName;
  }
  set customerName(v) {
    this._legacyContract.customerName = v;
    this._reRender();
  }

  get contactPerson() {
    return this._legacyContract.contactPerson;
  }
  set contactPerson(v) {
    this._legacyContract.contactPerson = v;
    this._reRender();
  }

  get contactNumber() {
    return this._legacyContract.contactNumber;
  }
  set contactNumber(v) {
    this._legacyContract.contactNumber = v;
    this._reRender();
  }

  get faxNumber() {
    return this._legacyContract.faxNumber;
  }
  set faxNumber(v) {
    this._legacyContract.faxNumber = v;
    this._reRender();
  }

  get trackingStatus() {
    return this._legacyContract.trackingStatus;
  }
  set trackingStatus(v) {
    this._legacyContract.trackingStatus = v;
    this._reRender();
  }

  get projectProgress() {
    return this._legacyContract.projectProgress;
  }
  set projectProgress(v) {
    this._legacyContract.projectProgress = v;
    this._reRender();
  }

  get projectCity() {
    return this._legacyContract.projectCity;
  }
  set projectCity(v) {
    this._legacyContract.projectCity = v;
    this._reRender();
  }

  get projectDistrict() {
    return this._legacyContract.projectDistrict;
  }
  set projectDistrict(v) {
    this._legacyContract.projectDistrict = v;
    this._reRender();
  }

  get projectAddress() {
    return this._legacyContract.projectAddress;
  }
  set projectAddress(v) {
    this._legacyContract.projectAddress = v;
    this._reRender();
  }
}

// =======================================================================
/**單一個product */
class Class_product {
  constructor(
    reRender: TreRender,
    legacyProduct: TlegacyContractProductDto | TcreateLegacyContractProductDto,
    countTotalDiscount: () => void,
    countSubTotal: () => void
  ) {
    this._reRender = reRender;
    this._product = legacyProduct;
    const foo = legacyProduct;

    this._countTotalDiscount = countTotalDiscount;
    this._countSubTotal = countSubTotal;

    this._id = (() => {
      // if ("id" in this._product) return this._product?.id
      if ('id' in legacyProduct) {
        return legacyProduct.id;
      }

      return undefined;
    })();

    this._idNumber = this._product.idNumber ? this._product.idNumber.toString() : '';
    this._length = this._product.length ? this._product.length.toString() : '';
    this._width = this._product.width ? this._product.width.toString() : '';
    this._height = this._product.height ? this._product.height.toString() : '';
    this._thickness = this._product.thickness ? this._product.thickness.toString() : '';
    this._quantity = this._product.quantity ? this._product.quantity.toString() : '';
    this._unitPrice = this._product.unitPrice ? this._product.unitPrice.toString() : '';
    this._totalPrice = this._product.totalPrice ? this._product.totalPrice.toString() : '';

    this._discountRate =
      this._product.discountRate === '0' ? '' : Decimal.mul(this._product.discountRate || '0', 100).toString();
  } // constructor

  private _reRender;
  private _product;
  private _countTotalDiscount;
  private _countSubTotal;
  private _id;
  private _idNumber;
  private _length;
  private _width;
  private _height;
  private _thickness;
  private _quantity;
  private _unitPrice;
  private _totalPrice;
  private _discountRate;

  readonly options_doorTrack_normal = options_doorTrack_normal;
  readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;

  calcArea = () => {
    const area = Decimal.add(this._height || '0', this._thickness || '0') // h+b
      /** "0"被視為true，所以用型別為number的值來計算 */
      .mul(this._product.width || this._product.length || '0') // *w or *h
      .toFixed(2)
      .toString();

    return area;
  };

  calcVolume = () => {
    return Decimal.mul(this.area || 0, 10.89)
      .toFixed(2)
      .toString();
  };

  get options_doorTrack() {
    if (this.typhoonProtection) {
      return this.options_doorTrack_typhoonProtection;
    } else {
      return this.options_doorTrack_normal;
    }
  }

  get id() {
    return this._id;
  }

  set id(v) {
    this._id = v;
  }

  get idNumber() {
    return this._idNumber;
  }
  set idNumber(v) {
    this._idNumber = v;
    this._product.idNumber = parseFloat(v || '0');
    this._reRender();
  }

  get discountRate() {
    return this._discountRate;
  }
  set discountRate(v) {
    if (parseFloat(v) > 100) {
      v = '100';
    }

    this._discountRate = v;
    this._product.discountRate = Decimal.div(v || 0, 100).toString();
    this._countTotalDiscount();
    this._countSubTotal();
    this._reRender();
  }

  set discountRate_noLoop(v: string) {
    if (parseFloat(v) > 100) {
      v = '100';
    }

    this._discountRate = v;
    this._product.discountRate = Decimal.div(v || 0, 100).toString();
    this._reRender();
  }

  get itemName() {
    return this._product.itemName;
  }
  set itemName(v) {
    if (v.length >= 11) {
      v = v.slice(0, 10);
    }

    this._product.itemName = v;
    this._reRender();
  }

  get quoteType() {
    return this._product.quoteType;
  }
  set quoteType(v) {
    this._product.quoteType = v;
    this._reRender();
  }

  get doorType() {
    return this._product.doorType;
  }
  set doorType(v) {
    this._product.doorType = v;
    this._reRender();
  }

  get length() {
    return this._length;
  }
  set length(v) {
    this._length = v;
    this._product.length = parseFloat(v || '0');
    this._width = '0';
    this._product.width = 0;

    this.area = this.calcArea();
    this._reRender();
  }

  get width() {
    return this._width;
  }
  set width(v) {
    this._width = v;
    this._product.width = parseFloat(v || '0');
    this._length = '0';
    this._product.length = 0;
    this.area = this.calcArea();
    this._reRender();
  }

  get height() {
    return this._height;
  }
  set height(v) {
    this._height = v;
    this._product.height = parseFloat(v || '0');
    this.area = this.calcArea();
    this._reRender();
  }

  /** 這個就是B */
  get thickness() {
    return this._thickness;
  }
  set thickness(v) {
    this._thickness = v;
    this._product.thickness = parseFloat(v || '0');
    this.area = this.calcArea();
    this._reRender();
  }

  get area() {
    return this._product.area;
  }
  set area(v) {
    this._product.area = v;
    this.volume = this.calcVolume();
    this._reRender();
  }

  /** 才數*/
  get volume() {
    return this._product.volume;
  }
  set volume(v) {
    this._product.volume = v;
    this._reRender();
  }

  get material() {
    return this._product.material;
  }
  set material(v) {
    this._product.material = v;
    this._reRender();
  }

  get surface() {
    return this._product.surface;
  }
  set surface(v) {
    this._product.surface = v;
    this._reRender();
  }

  get doorTrack() {
    return this._product.doorTrack;
  }
  set doorTrack(v) {
    this._product.doorTrack = v;
    this._reRender();
  }

  get horsepower() {
    return this._product.horsepower;
  }
  set horsepower(v) {
    this._product.horsepower = v;
    this._reRender();
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(v) {
    this._quantity = v;
    v = parseInt(v || '0').toString();
    this._product.quantity = parseInt(v || '0');
    this.countTotalPrice();
    this._reRender();
  }

  get unitPrice() {
    if (!this._unitPrice) {
      return '';
    }

    return parseFloat(this._unitPrice).toLocaleString();
  }
  set unitPrice(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._unitPrice = v;
    this._product.unitPrice = parseFloat(v || '0');
    this.countTotalPrice();
    this._reRender();
  }

  get totalPrice() {
    if (!this._totalPrice) {
      return '';
    }

    return parseFloat(this._totalPrice).toLocaleString();
  }
  set totalPrice(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._totalPrice = v;
    this._product.totalPrice = parseFloat(v || '0');
    this._countSubTotal();
    this._reRender();
  }

  countTotalPrice() {
    const quantity = this.quantity.replace(/,/g, '') || 0;
    const unitPrice = this.unitPrice.replace(/,/g, '') || 0;
    const total = Decimal.mul(quantity, unitPrice).toString();
    this.totalPrice = total;
  }

  get typhoonProtection() {
    return this._product.typhoonProtection;
  }
  set typhoonProtection(v) {
    this._product.typhoonProtection = v;
    this._product.doorTrack = '';
    this._reRender();
  }

  get bounceDoor() {
    return this._product.bounceDoor;
  }
  set bounceDoor(v) {
    this._product.bounceDoor = v;
    this._reRender();
  }

  get notes() {
    return this._product.notes;
  }
  set notes(v) {
    this._product.notes = v;
    this._reRender();
  }

  get postProd() {
    return {
      ...this._product,
      id: this.id,
    };
  }
}

// =======================================================================
/**單一個addition */
class Class_addition {
  constructor(
    reRender: TreRender,
    addition: TlegacyContractAdditionDto | TcreateLegacyContractAdditionDto,
    countSubTotal: () => void
  ) {
    this._reRender = reRender;
    this._addition = addition;
    this._countSubTotal = countSubTotal;

    this._quantity = addition.quantity ? addition.quantity.toString() : '';
    this._unitPrice = addition.unitPrice ? addition.unitPrice.toString() : '';
    this._totalPrice = addition.totalPrice ? addition.totalPrice.toString() : '';
  } // constructor
  private _reRender;
  private _addition;
  private _countSubTotal;
  private _quantity;
  private _unitPrice;
  private _totalPrice;

  get id() {
    if ('id' in this._addition) {
      return this._addition.id;
    }

    return undefined;
  }

  get itemName() {
    return this._addition.itemName;
  }
  set itemName(v) {
    if (v.length >= 11) {
      v = v.slice(0, 10);
    }

    this._addition.itemName = v;
    this._reRender();
  }

  get content() {
    return this._addition.content;
  }
  set content(v) {
    this._addition.content = v;
    this._reRender();
  }

  get quantity() {
    return this._quantity;
  }
  set quantity(v) {
    this._quantity = v;
    v = parseInt(v || '0').toString();
    this._addition.quantity = parseInt(v || '0');
    this._countTotalPrice();
    this._reRender();
  }

  get unitPrice() {
    if (!this._unitPrice) {
      return '';
    }

    return parseFloat(this._unitPrice).toLocaleString();
  }
  set unitPrice(v) {
    v = clearThousandsSeparator(v);

    if (!checkIsNumberStr(v)) {
      return;
    }

    this._unitPrice = v;
    this._addition.unitPrice = parseFloat(v || '0');
    this._countTotalPrice();
    this._reRender();
  }

  get totalPrice() {
    if (!this._totalPrice) {
      return '';
    }

    return parseFloat(this._totalPrice).toLocaleString();
  }
  set totalPrice(v) {
    v = clearThousandsSeparator(v);

    if (!checkIsNumberStr(v)) {
      return;
    }

    this._totalPrice = v;
    this._addition.totalPrice = parseFloat(v || '0');
    this._countSubTotal();
    this._reRender();
  }

  get notes() {
    return this._addition.notes;
  }
  set notes(v) {
    this._addition.notes = v;
    this._reRender();
  }

  get postAddition() {
    return this._addition;
  }

  private _countTotalPrice = () => {
    const quantity = clearThousandsSeparator(this.quantity);
    const unitPrice = clearThousandsSeparator(this.unitPrice);
    this.totalPrice = Decimal.mul(quantity, unitPrice).toString();
  };
} // Class_part
// =======================================================================
class Class_payInfo {
  constructor(
    reRender: () => void,
    legacyContract: TlegacyContractDto | TemptyLegacyContract,
    classProductArr: Class_product[],
    editAllProdDiscount: (v: string) => void,
    countSubTotal: () => void
  ) {
    this._reRender = reRender;
    this._legacyContract = legacyContract;
    this._legacyContract.discountRate = Decimal.mul(this._legacyContract.discountRate || '0', 100).toString();
    this._legacyContract.paymentMethods.forEach((item) => {
      item.totalPaymentRatio = Decimal.mul(item.totalPaymentRatio || '0', 100).toString();
    });
    this._classProductArr = classProductArr;
    this._editAllProdDiscount = editAllProdDiscount;
    this._countSubTotal = countSubTotal;

    this._subTotal = this._legacyContract.subTotal.toString();
    this._salesTax = this._legacyContract.salesTax.toString();
    this._total = this._legacyContract.total.toString();
  }
  private _reRender;
  private _legacyContract;
  private _classProductArr;
  private _editAllProdDiscount;
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

    const discountRate = Decimal.div(v || 0, 100);
    const subTotal: string = (() => {
      let subTotal = new Decimal(0);

      this._classProductArr.forEach((prod) => {
        if (!prod.totalPrice) {
          return;
        }

        subTotal = subTotal.add(prod.totalPrice);
      });

      return subTotal.mul(discountRate).toString();
    })();
    this.subTotal = subTotal;

    this._editAllProdDiscount(v || '0');
    this._countSubTotal();
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

    return parseFloat(this._subTotal).toLocaleString();
  }
  set subTotal(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    const salesTax = Decimal.mul(v || 0, 0.05).toString();
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

    return parseFloat(this._salesTax).toLocaleString();
  }
  set salesTax(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    this._salesTax = v;
    this._legacyContract.salesTax = parseFloat(v || '0');
    this._reRender();
  }
  /**總計 */
  get total() {
    if (!this._total) {
      return '';
    }

    return parseFloat(this._total).toLocaleString();
  }
  set total(v) {
    v = v.replace(/,/g, '');

    const numberRegex = /^(\d+(\.\d+)?|)$/;

    if (!numberRegex.test(v)) {
      return;
    }

    v = new Decimal(v || 0).toDecimalPlaces(0).toString();

    this._total = v; // 必須可以接受空字串""
    this._legacyContract.total = parseFloat(v || '0'); // 必須是number
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
} // Class_payInfo

// =======================================================================

/**備註notes與報價範圍quoteScopes*/
class Class_listString {
  constructor(reRender: () => void, stringArr: (TlegacyContractDto | TemptyLegacyContract)['notes' | 'quoteScopes']) {
    this._reRender = reRender;
    this.stringArr = stringArr;
  }

  private _reRender;
  stringArr;

  editString = (index: number, v: string) => {
    this.stringArr[index] = v;
    this._reRender();
  };
  addString = (v: string | string[]) => {
    if (typeof v === 'string') {
      this.stringArr.push(v);
    } else {
      this.stringArr = [...this.stringArr, ...v];
    }

    this._reRender();
  };
  delString = (index: number) => {
    this.stringArr.splice(index, 1);
    this._reRender();
  };
} // Class_listString

// =======================================================================
class Class_signature {
  constructor(reRender: () => void, legacyContract: TlegacyContractDto | TemptyLegacyContract) {
    this._reRender = reRender;
    this._legacyContract = legacyContract;
  }
  private _reRender;
  private _legacyContract;

  // 經理
  get managerName() {
    return this._legacyContract.managerName;
  }
  set managerName(v: string) {
    this._legacyContract.managerName = v;
    this._reRender();
  }

  // 主管
  get supervisorName() {
    return this._legacyContract.supervisorName;
  }
  set supervisorName(v: string) {
    this._legacyContract.supervisorName = v;
    this._reRender();
  }

  // 經辦人
  get operatorName() {
    return this._legacyContract.operatorName;
  }
  set operatorName(v: string) {
    this._legacyContract.operatorName = v;
    this._reRender();
  }
} // Class_signature

// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
// =======================================================================
class Class_legacyContract {
  constructor(
    reRender: TreRender,
    legacyContract: (TlegacyContractDto | TemptyLegacyContract) & { customer?: TcustomerDto | undefined },
    prodCellConfig: TprodCellConfig,
    additionCellConfig: TadditionCellConfig
  ) {
    this._legacyContract = legacyContract;
    this._reRender = reRender;
    /**  報價單基本資料*/
    this.classBasicInfo = new Class_basicInfo(reRender, this._legacyContract);

    const sortedProdArr = _.sortBy(this._legacyContract.products, 'idNumber');
    /**  主產品設定 (包括材料配件設定) 裡面裝的是class*/
    this.classProductArr = sortedProdArr.map((product) => {
      return new Class_product(reRender, product, this.countTotalDiscount, this.countSubTotal);
    });

    /**額外項目 */
    this.classAdditionArr = this._legacyContract.additions.map(
      (addition) => new Class_addition(reRender, addition, this.countSubTotal)
    );
    /**   付款資訊*/
    this.classPayInfo = new Class_payInfo(
      reRender,
      this._legacyContract,
      this.classProductArr,
      this.editAllProdDiscount,
      this.countSubTotal
    );
    /**  備註*/
    this.classNotes = new Class_listString(reRender, this._legacyContract.notes);
    /**  報價範圍*/
    this.classQuoteScopes = new Class_listString(reRender, this._legacyContract.quoteScopes);
    /**  簽名*/
    this.classSignature = new Class_signature(reRender, this._legacyContract);

    this.prodCellConfig = prodCellConfig;
    this.additionCellConfig = additionCellConfig;
  } // constructor

  private _legacyContract;
  private _reRender;
  /**用來判斷這是哪個class */
  identify = 'legacy' as const;
  // ---------------------
  classBasicInfo;
  classProductArr;
  classAdditionArr;
  classPayInfo;
  classNotes;
  classQuoteScopes;
  classSignature;
  // ---------------------

  /**計算總折數 */
  countTotalDiscount = () => {
    let totalDiscount = new Decimal(0);
    this.classProductArr.forEach((prod) => {
      const discountRate = prod.discountRate.replace(/,/g, '') || 0;
      totalDiscount = Decimal.add(discountRate || 0, totalDiscount);
    });
    this.classPayInfo.discountRate_noLoop = Decimal.div(totalDiscount, this.classProductArr.length).toFixed(2);
  };
  /**變更所有主產品的折數 */
  editAllProdDiscount = (v: string) => {
    this.classProductArr.forEach((prod) => {
      prod.discountRate_noLoop = v;
    });
  };

  /**計算小計 */
  countSubTotal = () => {
    let subTotal = new Decimal(0);
    this.classProductArr.forEach((prod) => {
      let totalPrice = prod.totalPrice.replace(/,/g, '') || 0;
      const discountRate = Decimal.div(prod.discountRate, 100);
      totalPrice = Decimal.mul(totalPrice, discountRate).toString();
      subTotal = Decimal.add(totalPrice || 0, subTotal);
    });
    this.classAdditionArr.forEach((addi) => {
      const totalPrice = addi.totalPrice.replace(/,/g, '') || 0;
      subTotal = Decimal.add(totalPrice || 0, subTotal);
    });
    this.classPayInfo.subTotal = subTotal.toString();
  };

  get customer() {
    return this._legacyContract.customer;
  }
  set customer(v) {
    this._legacyContract.customer = v;
    this._reRender();
  }

  // ---------------------
  get prodkeyList() {
    return this.prodCellConfig.keyList;
  }
  set prodkeyList(v) {
    this.prodCellConfig.keyList = v;
    this._reRender();
  }

  private _activeProd = -1; // 被選中的mainProduct的index
  get activeProd() {
    return this._activeProd;
  }
  set activeProd(v) {
    this._activeProd = v;
    this._reRender();
  }

  delProd = (index: number) => {
    this.classProductArr.splice(index, 1);
    this.activeProd = -1;
    this.countTotalDiscount();
    this.countSubTotal();
    this._reRender();
  };
  copyProd = (index: number) => {
    const copy = _.cloneDeep(this.classProductArr[index]);
    copy.id = undefined;
    this.classProductArr.push(copy);
    this.activeProd = index;
    this.countTotalDiscount();
    this.countSubTotal();
    this._reRender();
  };
  addProd = () => {
    this.classProductArr.push(
      new Class_product(this._reRender, emptyProdCre(), this.countTotalDiscount, this.countSubTotal)
    );
    this._activeProd = this.classProductArr.length - 1;
    this.countTotalDiscount();
    this._reRender();
  };

  delAddition = (index: number) => {
    this.classAdditionArr.splice(index, 1);
    this.countSubTotal();
    this._reRender();
  };
  copyAddition = (index: number) => {
    this.classAdditionArr.push(_.cloneDeep(this.classAdditionArr[index]));
    this.countSubTotal();
    this._reRender();
  };
  addAddition = () => {
    this.classAdditionArr.push(new Class_addition(this._reRender, emptyAdditionCre(), this.countSubTotal));
    this._reRender();
  };

  // ---------------------
  prodCellConfig; // dnd head的狀態，也是資料分類目錄
  additionCellConfig;
  // ---------------------

  get postBody(): TcreateLegacyContractDto | false {
    const customerId = (() => {
      return this._legacyContract.customer?.id;
    })();

    if (!customerId) {
      myAlert.warning({ title: '沒有選擇客戶' });

      return false;
    }

    let { quoteDate, deliveryDate } = this._legacyContract;

    // if (!checkDateFormat(quoteDate as string ?? "", "tw")) {
    //   myAlert.warning({ title: "報價日期格式錯誤", content: "格式例:100-01-01" }); return false
    // }
    // if (!checkDateFormat(deliveryDate as string ?? "", "tw")) {
    //   myAlert.warning({ title: "交貨日期格式錯誤", content: "格式例:100-01-01" }); return false
    // }

    if (!quoteDate) {
      // myAlert.warning({ title: '請選擇報價日期' });
      // return false;
      quoteDate = '';
    }

    if (!deliveryDate) {
      // myAlert.warning({ title: '請選擇交貨日期' });
      // return false;
      deliveryDate = '';
    }

    const legacyContractCopy = _.cloneDeep(this._legacyContract);

    legacyContractCopy.products = this.classProductArr.map((prod, index) => {
      const thePost = prod.postProd;

      // if(!thePost.idNumber) thePost.idNumber = index + 1
      return thePost;
    });

    legacyContractCopy.additions = this.classAdditionArr.map((prod) => prod.postAddition);

    const quoteDate_Date = (() => {
      if (!legacyContractCopy.quoteDate) {
        return '';
      }

      const date = moment(legacyContractCopy.quoteDate as string);

      if (date.isValid()) {
        return '';
      } else {
        // console.log(date.toISOString());

        return date.toISOString();
      }
    })();

    // const quoteDate_Date = legacyContractCopy.quoteDate
    //   ? new Date(legacyContractCopy.quoteDate as string).toISOString()
    //   : '';
    // = new Date(yearConversion_chToStandard(legacyContractCopy.quoteDate as string) as string)

    const deliveryDate_Date = (() => {
      if (!legacyContractCopy.deliveryDate) {
        return '';
      }

      const date = moment(legacyContractCopy.deliveryDate);

      if (date.isValid()) {
        return '';
      } else {
        return date.toISOString();
      }
    })();
    // const deliveryDate_Date = legacyContractCopy.deliveryDate
    //   ? new Date(legacyContractCopy.deliveryDate).toISOString()
    //   : '';
    // = new Date(yearConversion_chToStandard(legacyContractCopy.deliveryDate as string) as string)

    legacyContractCopy.discountRate = Decimal.div(legacyContractCopy.discountRate, 100).toString();

    legacyContractCopy.paymentMethods.forEach((item) => {
      item.totalPaymentRatio = Decimal.div(item.totalPaymentRatio, 100).toString();
    });

    const notes = this.classNotes.stringArr;
    const quoteScopes = this.classQuoteScopes.stringArr;

    // console.log('quoteDate_Date', quoteDate_Date);

    return {
      ...legacyContractCopy,
      customerId,
      notes,
      quoteScopes,
      quoteDate: quoteDate_Date,
      deliveryDate: deliveryDate_Date,
    };
  }
  // ---------------------
} // Class_legacyContract

const useLegacyContract = (data: TlegacyContractDto | undefined) => {
  const [render, setRender] = useState(0);
  const reRender: TreRender = () => setRender((state) => state + 1);

  const checkData = () => {
    return new Class_legacyContract(
      reRender,
      _.cloneDeep(data) ?? emptyLegacyContract(),
      prodCellConfigCre(),
      additionCellConfigCre()
    );
  };

  // 回朔到修改前的狀態
  const rewind = () => {
    setClassLegacyContract(checkData());
  };

  const [classLegacyContract, setClassLegacyContract] = useState(checkData());

  return { classLegacyContract, rewind };
};

export {
  Class_legacyContract,
  Class_basicInfo,
  Class_product,
  Class_addition,
  Class_payInfo,
  Class_listString,
  useLegacyContract,
};

// ==========================================================================

// console.log(isNaN(new Date('1111-11-11').getTime()));
// console.log(isNaN(new Date('aaaa').getTime()));

type TprodInputCellType = {
  [key in keyof Pick<
    Class_product,
    | 'discountRate'
    | 'idNumber'
    | 'itemName'
    | 'quoteType'
    | 'doorType'
    | 'length'
    | 'width'
    | 'height'
    | 'thickness'
    | 'area'
    | 'volume'
    | 'material'
    | 'surface'
    | 'horsepower'
    | 'quantity'
    | 'unitPrice'
    | 'totalPrice'
    | 'notes'
  >]: { type: 'input' };
};

type TprodSelectWithIconCellType = { [key in keyof Pick<Class_product, 'doorTrack'>]: { type: 'selectWithIcon' } };
type TprodCheckboxCellType = {
  [key in keyof Pick<Class_product, 'bounceDoor' | 'typhoonProtection'>]: { type: 'checkbox' };
};

type TprodKeys = keyof (TprodInputCellType & TprodSelectWithIconCellType & TprodCheckboxCellType);

type TprodCellConfig = {
  keyList: TprodKeys[];
  cellConfig: {
    [key in TprodKeys]: {
      id: key;
      label: string;
      width: string;
      // type: "input" | "select" | "selectWithIcon" | "checkbox" | "readOnly"
      inputType?: HTMLInputTypeAttribute;
    };
  } & TprodInputCellType &
    TprodSelectWithIconCellType &
    TprodCheckboxCellType;
};

function prodCellConfigCre(): TprodCellConfig {
  return {
    // 這個會影響一開始的排列順序
    keyList: [
      // "idNumber",
      'discountRate',
      'itemName',
      'quoteType',
      'length',
      'width',
      'height',
      'thickness',
      'area',
      'volume',
      'doorType',
      'material',
      'surface',
      'doorTrack',
      'typhoonProtection',
      'horsepower',
      'quantity',
      'unitPrice',
      'totalPrice',
      'notes',
      'bounceDoor',
    ],
    cellConfig: {
      // input
      idNumber: { id: 'idNumber', label: '編號', width: '100px', type: 'input', inputType: 'number' },
      discountRate: { id: 'discountRate', label: '折數', width: '60px', type: 'input', inputType: 'number' },
      itemName: { id: 'itemName', label: '項目', width: '100px', type: 'input' },
      quoteType: { id: 'quoteType', label: '報價別', width: '105px', type: 'input' },
      doorType: { id: 'doorType', label: '門型', width: '100px', type: 'input' },
      length: { id: 'length', label: 'L(m)', width: '60px', type: 'input', inputType: 'number' },
      width: { id: 'width', label: 'W(m)', width: '60px', type: 'input', inputType: 'number' },
      height: { id: 'height', label: 'h(m)', width: '60px', type: 'input', inputType: 'number' },
      thickness: { id: 'thickness', label: 'B(m)', width: '60px', type: 'input', inputType: 'number' },
      area: { id: 'area', label: '面積', width: '60px', type: 'input' },
      volume: { id: 'volume', label: '才數', width: '75px', type: 'input' },
      material: { id: 'material', label: '材料', width: '120px', type: 'input' },
      surface: { id: 'surface', label: '表面', width: '55px', type: 'input' },
      doorTrack: { id: 'doorTrack', label: '門軌', width: '300px', type: 'selectWithIcon' },
      horsepower: { id: 'horsepower', label: '馬力', width: '90px', type: 'input' },
      quantity: { id: 'quantity', label: '數量', width: '55px', type: 'input', inputType: 'number' },
      unitPrice: { id: 'unitPrice', label: '單價', width: '120px', type: 'input', inputType: 'text' },
      totalPrice: { id: 'totalPrice', label: '複價', width: '140px', type: 'input', inputType: 'text' },
      typhoonProtection: { id: 'typhoonProtection', label: '防颱', width: '60px', type: 'checkbox' },
      bounceDoor: { id: 'bounceDoor', label: '彈射門', width: '60px', type: 'checkbox' },
      notes: { id: 'notes', label: '備註', width: '90px', type: 'input' },
    },
  };
}

// =============================================================

type TaddtionInputCellType = {
  [key in keyof Pick<Class_addition, 'itemName' | 'content' | 'quantity' | 'unitPrice' | 'totalPrice' | 'notes'>]: {
    type: 'input';
  };
};

type TadditionKeys = keyof TaddtionInputCellType;

type TadditionCellConfig = {
  keyList: TadditionKeys[];
  cellConfig: {
    [key in TadditionKeys]: {
      label: string;
      width: string;
      flex?: string;
      inputType?: HTMLInputTypeAttribute;
    };
  } & TaddtionInputCellType;
};

const additionCellConfigCre = (): TadditionCellConfig => {
  return {
    keyList: ['itemName', 'content', 'quantity', 'unitPrice', 'totalPrice', 'notes'],
    cellConfig: {
      itemName: { label: '項目', width: '60px', type: 'input' },
      content: { label: '內容', width: 'auto', flex: 'auto', type: 'input' },
      quantity: { label: '數量', width: '60px', type: 'input', inputType: 'number' },
      unitPrice: { label: '單價', width: '110px', type: 'input' },
      totalPrice: { label: '複價', width: '110px', type: 'input' },
      notes: { label: '備註', width: '170px', type: 'input' },
    },
  };
};

// =============================================================
export type {
  // mainProduct
  TprodInputCellType,
  TprodSelectWithIconCellType,
  TprodCheckboxCellType,
  // addition
  TaddtionInputCellType,
};

// ===================================================================

const emptyProdCre = (): TcreateLegacyContractProductDto => {
  return {
    idNumber: 0,
    discountRate: '1.0',
    itemName: '',
    quoteType: '',
    doorType: '',
    length: 0,
    width: 0,
    height: 0,
    thickness: 0,
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

const emptyAdditionCre = (): TcreateLegacyContractAdditionDto => {
  return {
    itemName: '',
    content: '',
    quantity: 0,
    unitPrice: 0,
    totalPrice: 0,
    notes: '',
  };
};

type TemptyLegacyContract = Omit<TcreateLegacyContractDto, 'deliveryDate'> & {
  deliveryDate: TcreateLegacyContractDto['deliveryDate'] | string;
};

// const emptyLegacyContract = (): TcreateLegacyContractDto => {
const emptyLegacyContract = (): TemptyLegacyContract => {
  return {
    customerId: '',
    contractNumber: '',
    quoteValidity: null,
    quoteDate: null,
    projectName: '',
    customerName: '',
    contactPerson: '',
    contactNumber: '',
    faxNumber: null,
    trackingStatus: null,
    projectProgress: null,
    projectCity: '',
    projectDistrict: '',
    projectAddress: '',
    discountRate: '1.0',
    subTotal: 0,
    salesTax: 0,
    total: 0,
    deliveryLocation: '',
    deliveryDate: '',
    paymentMethods: [],
    notes: [],
    quoteScopes: [],
    managerName: '',
    supervisorName: '',
    operatorName: '',
    products: [],
    additions: [],
  };
};

/**
筆記
countTotalDiscount 計算總折數
運作方式:將所有主產品的折數加起來並平均，計算到小數點第二位

editAllProdDiscount 變更所有主產品折數
運作方式:將所有主產品的折數設定為指定值

countSubTotal 計算小計
運作方式:const x = (將所有個別主產品的複價與折數相乘)後加總
        const y = 將其他設定所有的複價加總
        reuturn x+y
        程式的運作不是如上面描述，但概念是上面所述

以下情況會呼叫特定函式
變更主產品設定與其他設定的複價時 countSubTotal
變更數量或單價時會自動計算、變更複價，所以也會呼叫 countSubTotal
變更主產品設定的折數 countSubTotal countTotalDiscount
變更總折數 先呼叫editAllProdDiscount再呼叫countSubTotal (必須照順序)

新增產品 countTotalDiscount
移除產品 countTotalDiscount countSubTotal
複製產品 countTotalDiscount countSubTotal
新增項目 
移除項目 countSubTotal
複製項目 countSubTotal 

 */

import { useState } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  TlegacyContractDto,
  TcreateLegacyContractDto,
  TcreateLegacyContractProductDto,
  TcreateLegacyContractAdditionDto,
  TcustomerDto,
} from 'js/api/dtoTypes';

// =======================================================================

import { Class_basicInfo } from './class_basicInfo';
import {
  Class_product,
  prodCellConfigCre,
  TprodCellConfig,
  TprodInputCellType,
  TprodSelectWithIconCellType,
  TprodCheckboxCellType,
} from './class_product';
import { Class_addition, additionCellConfigCre, TaddtionInputCellType, TadditionCellConfig } from './class_addition';
import { Class_payInfo } from './class_payInfo';
import { Class_listString } from './class_listString';
import { Class_signature } from './class_signature';

// =======================================================================

type TreRender = () => void;

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

    // --------------------------------------------------------------
    // --------------------------------------------------------------

    const sortedProdArr = _.sortBy(this._legacyContract.products, 'idNumber');
    /**  主產品設定 (包括材料配件設定) 裡面裝的是class*/
    this.classProductArr = sortedProdArr.map((product) => {
      return new Class_product({
        reRender: reRender,
        legacyProduct: product,
        // countTotalDiscount: this.countTotalDiscount,
        countSubTotal: this.countSubTotal,
      });
    });
    // __________________________
    // __________________________

    // --------------------------------------------------------------
    // --------------------------------------------------------------

    /**額外項目 */
    // this.classAdditionArr = this._legacyContract.additions.map(
    //   (addition) => new Class_addition(reRender, addition, this.countSubTotal)
    // );

    this.classAdditionArr = this._legacyContract.additions.map(
      (addition) => new Class_addition(reRender, addition, this.countSubTotal)
    );

    /**   付款資訊*/
    this.classPayInfo = new Class_payInfo(
      reRender,
      this._legacyContract,
      this.classProductArr,
      // this.editAllProdDiscount,
      this.countSubTotal
    );
    /**  備註*/
    this.classNotes = new Class_listString(reRender, this._legacyContract.notes);
    /**  報價範圍*/
    this.classQuoteScopes = new Class_listString(reRender, this._legacyContract.quoteScopes);
    /**  簽名*/
    this.classSignature = new Class_signature(reRender, this._legacyContract);

    this.prodCellConfig = prodCellConfig;
    // 原本想直接用_exProdKeyArr的，但考慮到之後業主會不會有有什麼需求...，還是另外做一個吧
    // 編輯舊合約整合報價單時用的主產品設定keyArr
    this._editProdKeyArr = _.cloneDeep(prodCellConfig.keyArr);
    this._editProdKeyArr = _.pull(this._editProdKeyArr, 'quotationNumber') as typeof prodCellConfig.keyArr;

    // 變更 主產品設定用的keyArr
    this._exProdKeyArr = _.cloneDeep(prodCellConfig.keyArr);
    this._exProdKeyArr = _.pull(this._exProdKeyArr, 'quotationNumber') as typeof prodCellConfig.keyArr;

    this.additionCellConfig = additionCellConfig;
    // 編輯舊合約整合報價單時用的配件設定keyArr
    this._editAddiKeyArr = _.cloneDeep(additionCellConfig.keyArr);
    this._editAddiKeyArr = _.pull(this._editAddiKeyArr, 'quotationNumber') as typeof additionCellConfig.keyArr;
    // 變更 配件設定用的keyArr
    this._exAddiKeyArr = _.cloneDeep(additionCellConfig.keyArr);
    this._exAddiKeyArr = _.pull(this._exAddiKeyArr, 'quotationNumber') as typeof additionCellConfig.keyArr;

    // constructor
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
  _editProdKeyArr;
  _editAddiKeyArr;
  _exProdKeyArr;
  _exAddiKeyArr;
  // ---------------------

  // 需求變更 編輯折數與總折數時不再影響其他數值 // 先留著，免得哪天又要改回來
  /**計算總折數 */
  // countTotalDiscount = () => {
  // let totalDiscount = new Decimal(0);
  // this.classProductArr.forEach((prod) => {
  //   const discountRate = prod.discountRate.replace(/,/g, '') || 0;
  //   totalDiscount = Decimal.add(discountRate || 0, totalDiscount);
  // });
  // this.classPayInfo.discountRate_noLoop = Decimal.div(totalDiscount, this.classProductArr.length).toFixed(2);
  // };
  // 需求變更 編輯折數與總折數時不再影響其他數值 // 先留著，免得哪天又要改回來
  /**變更所有主產品的折數 */
  // editAllProdDiscount = (v: string) => {
  // this.classProductArr.forEach((prod) => {
  //   prod.discountRate_noLoop = v;
  // });
  // };

  /**計算小計 */
  countSubTotal = () => {
    let subTotal = new Decimal(0);
    this.classProductArr.forEach((prod) => {
      const totalPrice = prod.totalPrice.replace(/,/g, '') || 0;
      // 需求變更 編輯折數與總折數時不再影響其他數值
      // const discountRate = Decimal.div(prod.discountRate || 0, 100);
      // totalPrice = Decimal.mul(totalPrice, discountRate).toString();
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
  get prodkeyArr() {
    return this.prodCellConfig.keyArr;
  }
  set prodkeyArr(v) {
    this.prodCellConfig.keyArr = v;
    this._reRender();
  }

  get editProdKeyArr() {
    return this._editProdKeyArr;
  }
  set editProdKeyArr(v) {
    this._editProdKeyArr = v;
    this._reRender();
  }

  get exProdKeyArr() {
    return this._exProdKeyArr;
  }
  set exProdKeyArr(v) {
    this._exProdKeyArr = v;
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
    // this.countTotalDiscount();
    this.countSubTotal();
    this._reRender();
  };
  copyProd = (index: number) => {
    const copy = _.cloneDeep(this.classProductArr[index]);
    copy.id = undefined;
    // this.classProductArr.push(copy);
    this.classProductArr.push(
      new Class_product({
        reRender: this._reRender,
        legacyProduct: copy._product,
        // countTotalDiscount: this.countTotalDiscount,
        countSubTotal: this.countSubTotal,
      })
    );
    this.activeProd = index;
    // this.countTotalDiscount();
    this.countSubTotal();
    this._reRender();
  };
  addProd = () => {
    this.classProductArr.push(
      new Class_product({
        reRender: this._reRender,
        legacyProduct: emptyProdCre(),
        // countTotalDiscount: this.countTotalDiscount,
        countSubTotal: this.countSubTotal,
      })
    );
    this._activeProd = this.classProductArr.length - 1;
    // this.countTotalDiscount();
    this._reRender();
  };

  //
  get exAddiKeyArr() {
    return this._exAddiKeyArr;
  }
  set exAddiKeyArr(v) {
    this._exAddiKeyArr = v;
    this._reRender();
  }

  get editAddiKeyArr() {
    return this._editAddiKeyArr;
  }
  set editAddiKeyArr(v) {
    this._editAddiKeyArr = v;
    this._reRender();
  }

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

    // const { quoteDate, deliveryDate } = this._legacyContract;

    // if (!checkDateFormat(quoteDate as string ?? "", "tw")) {
    //   myAlert.warning({ title: "報價日期格式錯誤", content: "格式例:100-01-01" }); return false
    // }
    // if (!checkDateFormat(deliveryDate as string ?? "", "tw")) {
    //   myAlert.warning({ title: "交貨日期格式錯誤", content: "格式例:100-01-01" }); return false
    // }

    // if (!quoteDate) {
    //   myAlert.warning({ title: '請選擇合約日期' });

    //   return false;
    // }

    // if (!deliveryDate) {
    //   myAlert.warning({ title: '請選擇交貨日期' });

    //   return false;
    // }

    const legacyContractCopy = _.cloneDeep(this._legacyContract);

    legacyContractCopy.products = this.classProductArr.map((prod, index) => {
      const thePost = prod.postProd;

      // if(!thePost.idNumber) thePost.idNumber = index + 1
      return thePost;
    });

    legacyContractCopy.additions = this.classAdditionArr.map((prod) => prod.postAddition);

    const quoteDate_Date = (() => {
      if (!legacyContractCopy.quoteDate) {
        return null;
      }

      const date = moment(legacyContractCopy.quoteDate as string);

      if (date.isValid()) {
        return date.toISOString();
      } else {
        return null;
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
        return date.toISOString();
      } else {
        return '';
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

    return {
      ...legacyContractCopy,
      customerId,
      notes,
      quoteScopes,
      quoteDate: quoteDate_Date || null,
      deliveryDate: deliveryDate_Date || null,
    };
  }
  // -------------------
  // 主產品設定list
  get prodList() {
    // type Tlist = {
    //   [key: string]: Class_product;
    // };
    type Tlist = {
      [key: string]: {
        del: () => void;
        copy: () => void;
        prod: Class_product;
      };
    };

    const list: Tlist = {};

    this.classProductArr.forEach((prod, index) => {
      list[prod.dndId] = {
        del: () => this.delProd(index),
        copy: () => this.copyProd(index),
        prod,
      };
    });
    // console.log(list);

    return list;
  }

  // 變更主產品設定
  // appendProduction
  private _prodAdditionalExchangeArr: Class_product[] = [];
  addExProd = () => {
    this._prodAdditionalExchangeArr.push(
      new Class_product({
        reRender: this._reRender,
        legacyProduct: emptyProdCre(),
        // countTotalDiscount: () => {},
        countSubTotal: () => {},
      })
    );
    this._reRender();
  };

  // 變更 主產品設定 的list object
  get prodExchangeList() {
    // 來源自主產品(classProduct)的陣列
    const exchangeArrArr = this.classProductArr.map((cp) => {
      return cp.exchangeProdArr;
    });

    // const list: { [key: `${number}`]: Class_product } = {};
    // const exchangeArr = [..._.flatten(exchangeArrArr), ...this._additionalExchangeArr];

    type TexchangeProdlist = {
      [key: string]: {
        prod: Class_product;
        delSelf?: () => void;
      };
    };

    const list: TexchangeProdlist = {};

    let exchangeArr = [..._.flatten(exchangeArrArr)]; // 展開
    exchangeArr = _.pull(exchangeArr, undefined); // 去掉undefined
    // 把陣列裡的東西放進list
    exchangeArr.forEach((prod, index) => {
      if (!prod) {
        return;
      }

      list[prod.dndId] = {
        prod,
      };
    });

    // 把額外追加的主產品放進去
    this._prodAdditionalExchangeArr.forEach((prod, index) => {
      if (!prod) {
        return;
      }

      list[prod.dndId] = {
        prod,
        delSelf: () => {
          this._prodAdditionalExchangeArr.splice(index, 1);
          this._reRender();
        },
      };
    });

    return list;
  }
  // -----------

  // 配件設定 的list object
  get addiList() {
    type Tlist = {
      [key: string]: Class_addition;
    };
    const list: Tlist = {};
    this.classAdditionArr.forEach((addi) => {
      list[addi.dndId] = addi;
    });

    return list;
  }

  private _additionAdditionalExchangeArr: Class_addition[] = [];
  addExAddi = () => {
    this._additionAdditionalExchangeArr.push(
      new Class_addition(
        this._reRender,
        emptyAdditionCre(),
        () => {}
        //
      )
    );
    this._reRender();
  };
  // 變更 配件設定 的list object
  get addiExchangeList() {
    const exchangeArrArr = this.classAdditionArr.map((ca) => {
      return ca.exchangeAdditionArr;
    });

    type TexchangeAddilist = {
      [key: string]: {
        addi: Class_addition;
        delSelf?: () => void;
      };
    };

    const list: TexchangeAddilist = {};

    let exchangeArr = [..._.flatten(exchangeArrArr)]; // 展開
    exchangeArr = _.pull(exchangeArr, undefined); // 去掉undefined
    // 把陣列裡的東西放進list
    exchangeArr.forEach((addi, index) => {
      if (!addi) {
        return;
      }

      list[addi.dndId] = {
        addi,
      };
    });

    // 把額外的addition放進去
    this._additionAdditionalExchangeArr.forEach((addi, index) => {
      if (!addi) {
        return;
      }

      list[addi.dndId] = {
        addi,
        delSelf: () => {
          this._additionAdditionalExchangeArr.splice(index, 1);
          this._reRender();
        },
      };
    });

    return list;
  }

  // ________________________________
  get prodExTotal() {
    let totalPrice = 0;

    Object.values(this.prodExchangeList).forEach((prod) => {
      totalPrice += Number(prod.prod.totalPrice.replaceAll(',', ''));
    });

    return totalPrice;
  }

  get addiExTotal() {
    let totalPrice = 0;
    Object.values(this.addiExchangeList).forEach((addi) => {
      totalPrice += Number(addi.addi.totalPrice.replaceAll(',', ''));
    });

    return totalPrice;
  }

  get exchangeTotal() {
    return this.prodExTotal + this.addiExTotal;
  }

  // -----------

  // ---------------------
} // Class_legacyContract

const useLegacyContract = (data: TlegacyContractDto | undefined) => {
  const [render, setRender] = useState(0);
  const reRender: TreRender = () => setRender((state) => state + 1);

  const createClass = () => {
    return new Class_legacyContract(
      reRender,
      _.cloneDeep(data) ?? emptyLegacyContract(),
      prodCellConfigCre(),
      additionCellConfigCre()
    );
  };

  // 回朔到修改前的狀態
  const reset = () => {
    setClassLegacyContract(createClass());
  };

  const [classLegacyContract, setClassLegacyContract] = useState(createClass());

  return { classLegacyContract, reset };
};

// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================
// ==========================================================================

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
    paymentMethods: [
      {
        milestone: '訂製同時付總金額',
        totalPaymentRatio: '0',
      },
      {
        milestone: '交貨同時付總金額',
        totalPaymentRatio: '0',
      },
      {
        milestone: '按裝同時付總金額',
        totalPaymentRatio: '0',
      },
      {
        milestone: '接電同時付總金額',
        totalPaymentRatio: '0',
      },
    ],
    notes: [],
    quoteScopes: [],
    managerName: '',
    supervisorName: '',
    operatorName: '',
    products: [],
    additions: [],
  };
};

// =============================================================

export {
  Class_legacyContract,
  Class_basicInfo,
  Class_product,
  Class_addition,
  Class_payInfo,
  Class_listString,
  useLegacyContract,
};

export type {
  // mainProduct
  TprodInputCellType,
  TprodSelectWithIconCellType,
  TprodCheckboxCellType,
  // addition
  TaddtionInputCellType,
  TemptyLegacyContract,
  TreRender,
  TprodCellConfig,
  TlegacyContractDto,
};

// =============================================================
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
變更主產品設定的折數 countSubTotal countTotalDiscountD
變更總折數 先呼叫editAllProdDiscount再呼叫countSubTotal (必須照順序)

新增產品 countTotalDiscount
移除產品 countTotalDiscount countSubTotal
複製產品 countTotalDiscount countSubTotal
新增項目 
移除項目 countSubTotal
複製項目 countSubTotal 

 */

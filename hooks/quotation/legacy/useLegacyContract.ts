import { useState, useEffect, useMemo } from 'react';
import _ from 'lodash';
import Decimal from 'decimal.js';
import moment from 'moment';
import { nanoid } from 'nanoid';

import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import {
  TlegacyContractDto,
  TcreateLegacyContractDto,
  TcreateLegacyContractProductDto,
  TcreateLegacyContractAdditionDto,
  TcustomerDto,
  TlegacyContractProductDto,
  TupdateLegacyContractProductDto,
  TupdateLegacyContractAdditionDto,
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

type TprodList = {
  [key: string]: Class_product;
};

type TprodKit = {
  [key: string]: {
    key: string;
    prod: Class_product;
    // delSelf: () => void;
    copySelf: () => void;
  };
};

type TadditionList = {
  [key: string]: Class_addition;
};

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
    additionCellConfig: TadditionCellConfig,
    isAppend = false
  ) {
    this._legacyContract = legacyContract;
    this._reRender = reRender;

    /**  報價單基本資料*/
    this.classBasicInfo = new Class_basicInfo(reRender, this._legacyContract);

    // --------------------------------------------------------------

    const sortedProdArr = _.sortBy(this._legacyContract.products, 'idNumber');
    /**  主產品設定 (包括材料配件設定) 裡面裝的是class*/
    const prodList: TprodList = {};
    sortedProdArr.forEach((prodData) => {
      let key: string;

      if ('id' in prodData) {
        // 已經用'id' in prodData了，這邊也沒有紅線
        // check的時候還是會報型別錯誤
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        key = String(prodData.id as string);
      } else {
        key = 'new-' + nanoid();
      }

      const delSelf = () => {
        delete this._prodList[key];
      };

      prodList[key] = new Class_product({
        reRender: reRender,
        legacyProduct: prodData,
        countSubTotal: this.countSubTotal,
        delSelf,
      });
    });
    //
    this._prodList = prodList;
    //
    this.prodCellConfig = prodCellConfig;
    // 原本想直接用_exProdKeyArr的，但考慮到之後業主會不會有有什麼需求...，還是另外做一個吧
    // 編輯舊合約整合報價單時用的主產品設定keyArr
    this._editProdKeyArr = _.cloneDeep(prodCellConfig.keyArr);
    this._editProdKeyArr = _.pull(this._editProdKeyArr, 'batchNumber') as typeof prodCellConfig.keyArr;

    // 變更 主產品設定用的keyArr
    this._exProdKeyArr = _.cloneDeep(prodCellConfig.keyArr);
    this._exProdKeyArr = _.pull(this._exProdKeyArr, 'batchNumber') as typeof prodCellConfig.keyArr;

    // --------------------------------------------------------------
    // --------------------------------------------------------------

    /**配件設定 */
    const additionList: TadditionList = {};
    this._legacyContract.additions.forEach((addi) => {
      let key: string;

      if ('id' in addi) {
        // 啊我都已經用'id' in prodData了，這邊也沒有紅線
        // check的時候還是給我報型別錯誤
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        key = String(addi.id as string);
      } else {
        key = 'new-' + nanoid();
      }

      const delSelf = () => {
        delete this._additionList[key];
      };

      additionList[key] = new Class_addition({
        reRender: reRender,
        addition: addi,
        countSubTotal: this.countSubTotal,
        delSelf: delSelf,
      });
    });
    //
    this._additionList = additionList;
    //
    this.additionCellConfig = additionCellConfig;
    // 編輯舊合約整合報價單時用的配件設定keyArr
    this._editAddiKeyArr = _.cloneDeep(additionCellConfig.keyArr);
    this._editAddiKeyArr = _.pull(this._editAddiKeyArr, 'batchNumber') as typeof additionCellConfig.keyArr;
    // 變更 配件設定用的keyArr
    this._exAddiKeyArr = _.cloneDeep(additionCellConfig.keyArr);
    this._exAddiKeyArr = _.pull(this._exAddiKeyArr, 'batchNumber') as typeof additionCellConfig.keyArr;

    // --------------------------------------------------------------
    // --------------------------------------------------------------
    /**   付款資訊*/
    this.classPayInfo = new Class_payInfo(
      reRender,
      this._legacyContract,
      // this.classProductArr,
      Object.values(this._prodList),
      // this.editAllProdDiscount,
      this.countSubTotal
    );

    /**  備註*/
    this.classNotes = new Class_listString(reRender, this._legacyContract.notes);

    /**  報價範圍*/
    this.classQuoteScopes = new Class_listString(reRender, this._legacyContract.quoteScopes);

    /**  簽名*/
    this.classSignature = new Class_signature(reRender, this._legacyContract);

    // -------------------------------------------------------------
    // if (isAppend) {
    //   this.countSubTotal();
    // }
    // -------------------------------------------------------------

    // constructor
    // constructor
    // constructor
  } // constructor

  private _legacyContract;
  private _reRender;

  // ---------------------
  private _prodList;
  /**追加追減時按新增按鈕新增的prod */
  private _extraExProdList: TprodList = {};

  private _editProdKeyArr;
  private _exProdKeyArr;
  // ---------------------
  private _additionList;
  /**追加追減時按新增按鈕新增的addi */
  private _extraExAddiList: TadditionList = {};

  private _editAddiKeyArr;
  private _exAddiKeyArr;
  // ---------------------
  classBasicInfo;
  classPayInfo;
  classNotes;
  classQuoteScopes;
  classSignature;
  // ---------------------
  /**主產品 格子設定 包括欄位keyArr */
  prodCellConfig;
  /**配件 格子設定 包括欄位keyArr */
  additionCellConfig;
  // ---------------------
  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  // 先留著，免得哪天要改回來
  // 先留著，免得哪天要改回來
  // 先留著，免得哪天要改回來

  // 需求變更 編輯折數與總折數時不再影響其他數值
  /**計算總折數 */
  // countTotalDiscount = () => {
  // let totalDiscount = new Decimal(0);
  // this.classProductArr.forEach((prod) => {
  //   const discountRate = prod.discountRate.replace(/,/g, '') || 0;
  //   totalDiscount = Decimal.add(discountRate || 0, totalDiscount);
  // });
  // this.classPayInfo.discountRate_noLoop = Decimal.div(totalDiscount, this.classProductArr.length).toFixed(2);
  // };

  // 需求變更 編輯折數與總折數時不再影響其他數值
  /**變更所有主產品的折數 */
  // editAllProdDiscount = (v: string) => {
  // this.classProductArr.forEach((prod) => {
  //   prod.discountRate_noLoop = v;
  // });
  // };

  // -------------------------------------------------------------------------
  // -------------------------------------------------------------------------
  /**計算小計，就是右下方的那個小計*/
  countSubTotal = () => {
    let subTotal = new Decimal(0);

    //-------
    Object.values(this._prodList).forEach((prod) => {
      // 複價
      const totalPrice = prod.totalPrice.replace(/,/g, '') || 0;
      // 追減、變更金額
      const reduceExchangePrice = prod.reduceExchangePrice.replace(/,/g, '') || 0;

      // 需求變更 編輯折數與總折數時不再影響其他數值
      // const discountRate = Decimal.div(prod.discountRate || 0, 100);
      // totalPrice = Decimal.mul(totalPrice, discountRate).toString();

      subTotal = subTotal.add(totalPrice).sub(reduceExchangePrice);
    });

    //-------
    this.additionArr.forEach((addi) => {
      const totalPrice = addi.totalPrice.replace(/,/g, '') || 0;
      const reduceExchangePrice = addi.reduceExchangePrice.replace(/,/g, '') || 0;

      subTotal = subTotal.add(totalPrice).sub(reduceExchangePrice);
    });

    //-------
    Object.values(this.exProdList).forEach((prod) => {
      // 複價
      const totalPrice = prod.totalPrice.replace(/,/g, '') || 0;
      // 追減、變更金額
      const reduceExchangePrice = prod.reduceExchangePrice.replace(/,/g, '') || 0;

      subTotal = subTotal.add(totalPrice).sub(reduceExchangePrice);
    });

    //-------
    Object.values(this.exAddiList).forEach((addi) => {
      const totalPrice = addi.totalPrice.replace(/,/g, '') || 0;
      const reduceExchangePrice = addi.reduceExchangePrice.replace(/,/g, '') || 0;

      subTotal = subTotal.add(totalPrice).sub(reduceExchangePrice);
    });

    //

    this.classPayInfo.subTotal = subTotal.toString();
  };
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------

  get prodList() {
    return this._prodList;
  }

  get prodArr() {
    return Object.values(this._prodList);
  }

  // get prodKeyArr_2() {
  //   return this._prodKeyArr;
  // }

  // set prodKeyArr_2(v) {
  //   this._prodKeyArr = v;
  //   this._reRender();
  // }

  // delProd_2(id: string) {
  //   delete this._prodList[id];
  //   // _.pull(this._prodKeyArr, id);

  //   this._reRender();
  // }

  copyProd(id: string) {
    const key = 'new-' + nanoid();

    const copy = _.cloneDeep(this._prodList[id]);

    copy.id = undefined;

    copy.delSelf = () => {
      delete this._prodList[key];
    };

    this._prodList[key] = copy;

    this.countSubTotal();

    this._reRender();
  }

  addProd = () => {
    const key = 'new-' + nanoid();

    const delSelf = () => {
      delete this._prodList[key];
    };

    const prod = new Class_product({
      reRender: this._reRender,
      legacyProduct: emptyProdCre(),
      countSubTotal: this.countSubTotal,
      delSelf: delSelf,
    });
    this._prodList[key] = prod;

    this._reRender();
  };

  // get prodKitArr_2() {
  //   return this._prodKeyArr.map((key) => {
  //     const prod = this._prodList[key];

  //     const delSelf = () => {
  //       this.delProd_2(key);
  //     };

  //     const copySelf = () => {
  //       this.copyProd_2(key);
  //     };

  //     return {
  //       key,
  //       prod,
  //       delSelf,
  //       copySelf,
  //     };
  //   });
  // }

  get prodKitList_2() {
    const kitList: TprodKit = {};

    Object.keys(this._prodList).forEach((key) => {
      const prod = this._prodList[key];

      const copySelf = () => {
        this.copyProd(key);
      };

      kitList[key] = {
        key,
        prod,
        copySelf,
      };
    });

    return kitList;
  }

  // -----------------------

  // 追加追減 按新增按鈕新增的prod
  get extraExProdList() {
    return this._extraExProdList;
  }

  addExtraExProd = () => {
    const key = 'new-' + nanoid();

    const delSelf = () => {
      delete this._extraExProdList[key];
    };

    const prod = new Class_product({
      reRender: this._reRender,
      legacyProduct: emptyProdCre(),
      countSubTotal: this.countSubTotal,
      delSelf: delSelf,
    });

    this._extraExProdList[key] = prod;

    this._reRender();
  };

  /**變更主產品 主產品按變更按紐新增的主產品加上 extraExProdList*/
  get exProdList() {
    type TexchangeProdlist = {
      [key: string]: Class_product;
    };

    const list: TexchangeProdlist = {};

    Object.values(this._prodList).forEach((prod) => {
      const exchangeProdList = prod.exchangeProdList;
      Object.keys(exchangeProdList).forEach((key) => {
        list[key] = exchangeProdList[key];
      });
    });

    Object.keys(this._extraExProdList).forEach((key) => {
      list[key] = this._extraExProdList[key];
    });

    return list;
  }

  // prod減少的金額合計
  get prodSubPriceTotal() {
    let total = 0;
    this.prodArr.forEach((prod) => {
      total = total + Number(prod.reduceExchangePrice);
    });

    return total;
  }

  //
  get prodExTotal() {
    let totalPrice = 0;

    Object.values(this.exProdList).forEach((prod) => {
      totalPrice += Number(prod.totalPrice.replaceAll(',', ''));
    });

    return totalPrice;
  }
  //
  // 這三組都是水平欄位的keyArr

  // 報價單 主產品設定用的 沒有合約編號欄位
  get editProdKeyArr() {
    return this._editProdKeyArr;
  }
  set editProdKeyArr(v) {
    this._editProdKeyArr = v;
    this._reRender();
  }
  // 追加追減 上面的主產品設定用的 有合約編號欄位
  get appendProdkeyArr() {
    return this.prodCellConfig.keyArr;
  }
  set appendProdkeyArr(v) {
    this.prodCellConfig.keyArr = v;
    this._reRender();
  }
  // 變更 主產品設定用的keyArr 沒有合約編號欄位
  get exProdKeyArr() {
    return this._exProdKeyArr;
  }
  set exProdKeyArr(v) {
    this._exProdKeyArr = v;
    this._reRender();
  }

  //

  //------------------------------------------------------
  //------------------------------------------------------
  //------------------------------------------------------
  // 配件設定

  get additionList() {
    return this._additionList;
  }

  get additionArr() {
    return Object.values(this._additionList);
  }

  copyAddition = (id: string) => {
    const key = 'new-' + nanoid();

    const copy = _.cloneDeep(this._additionList[id]);
    copy.id = undefined;

    copy.delSelf = () => {
      delete this._additionList[key];
    };

    this._additionList[key] = copy;

    this._reRender();
  };

  addAddition = () => {
    const key = 'new-' + nanoid();

    const delSelf = () => {
      delete this._additionList[key];
    };

    const addi = new Class_addition({
      reRender: this._reRender,
      addition: emptyAdditionCre(),
      countSubTotal: this.countSubTotal,
      delSelf,
    });

    this._additionList[key] = addi;

    this._reRender();
  };

  /**追加追減時按新增按鈕新增的addi */
  get extraExAddiList() {
    return this._extraExAddiList;
  }

  addExtraExAddi = () => {
    const key = 'new-' + nanoid();

    const delSelf = () => {
      delete this._extraExAddiList[key];
    };

    const addi = new Class_addition({
      reRender: this._reRender,
      addition: emptyAdditionCre(),
      countSubTotal: this.countSubTotal,
      delSelf,
    });

    this._extraExAddiList[key] = addi;

    this._reRender();
  };

  /**按變更按紐新增的addi加上 extraExAddiList*/
  get exAddiList() {
    type TexAddiList = {
      [key: string]: Class_addition;
    };

    const list: TexAddiList = {};

    Object.values(this._additionList).forEach((addi) => {
      const exchangeAddiList = addi.exAddiList;
      Object.keys(exchangeAddiList).forEach((key) => {
        list[key] = exchangeAddiList[key];
      });
    });

    Object.keys(this._extraExAddiList).forEach((key) => {
      list[key] = this._extraExAddiList[key];
    });

    return list;
  }

  get addiSubPriceTotal() {
    let total = 0;
    this.additionArr.forEach((addi) => {
      total = total + Number(addi.reduceExchangePrice);
    });

    return total;
  }

  get addiExTotal() {
    let totalPrice = 0;
    Object.values(this.exAddiList).forEach((addi) => {
      totalPrice += Number(addi.totalPrice.replaceAll(',', ''));
    });

    return totalPrice;
  }

  // 水平欄位的keyArr
  get editAddiKeyArr() {
    return this._editAddiKeyArr;
  }
  set editAddiKeyArr(v) {
    this._editAddiKeyArr = v;
    this._reRender();
  }
  /**追加追減 變更配件用的 */
  get exAddiKeyArr() {
    return this._exAddiKeyArr;
  }
  set exAddiKeyArr(v) {
    this._exAddiKeyArr = v;
    this._reRender();
  }

  // ---------------------------------------------------------------

  /**下方粉紅色總合計 */
  get exchangeTotal() {
    let total = this.prodExTotal + this.addiExTotal - this.prodSubPriceTotal - this.addiSubPriceTotal;
    const operator = total >= 0 ? '+' : '-';

    total = Math.abs(total);

    return `${operator} ${total.toLocaleString()}`;
  }
  // ---------------------------------------------------------------
  // ---------------------------------------------------------------

  get customer() {
    return this._legacyContract.customer;
  }
  set customer(v) {
    this._legacyContract.customer = v;
    this._reRender();
  }

  get postBody(): TcreateLegacyContractDto | false {
    const customerId = (() => {
      return this._legacyContract.customer?.id;
    })();

    if (!customerId) {
      myAlert.warning({ title: '請選擇客戶' });

      return false;
    }

    const legacyContractCopy = _.cloneDeep(this._legacyContract);

    legacyContractCopy.products = Object.values(this._prodList).map((prod, index) => {
      const thePost = prod.postProd;

      return thePost;
    });

    legacyContractCopy.additions = Object.values(this._additionList).map((prod) => prod.postAddition);

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

  get appendBody() {
    // const legacyContractCopy = _.cloneDeep(this._legacyContract);
    //
    // ______________________
    let appendProd: TupdateLegacyContractProductDto[] | undefined = [];

    Object.values(this._prodList).forEach((prod, index) => {
      const body = prod.appendProd;

      if (body) {
        appendProd!.push(body);
      }
    });

    Object.values(this.exProdList).forEach((prod, index) => {
      appendProd!.push(prod.postProd);
    });
    // ______________________

    let appendAddition: TupdateLegacyContractAdditionDto[] | undefined = [];

    Object.values(this._additionList).forEach((addi) => {
      const body = addi.appendAddition;

      if (body) {
        appendAddition!.push(body);
      }
    });

    Object.values(this.exAddiList).forEach((addi) => {
      appendAddition!.push(addi.postAddition);
    });

    if (appendProd.length === 0) {
      appendProd = undefined;
    }

    if (appendAddition.length === 0) {
      appendAddition = undefined;
    }

    const payPrice = this.classPayInfo.payPrice;
    const priceRecord = {
      discountRate: new Decimal(payPrice.discountRate).div(100).toFixed(2),
      subTotal: String(payPrice.subTotal),
      salesTax: payPrice.salesTax,
      total: payPrice.total,
    };

    return {
      products: appendProd,
      additions: appendAddition,
      batchNumber: this.classBasicInfo.contractNumber,
      priceRecord,
    };
  }

  // ---------------------
} // Class_legacyContract

// ==========================================================================

const useLegacyContract = ({
  contract,
  batch,
  isAppend,
}: {
  contract: TlegacyContractDto | undefined;
  batch: number;
  isAppend?: boolean;
}) => {
  const [render, setRender] = useState(0);
  const reRender: TreRender = () => setRender((state) => state + 1);

  const copyContract = _.cloneDeep(contract);

  const { lastBatchProductArr, lastBatchAddiArr, lastBatchTotal } = useMemo(() => {
    const copyContract = _.cloneDeep(contract);

    const lastBatchProductArr =
      copyContract?.products.filter((prod) => {
        if ('batch' in prod) {
          return prod.batch === batch;
        }
      }) ?? [];

    const lastBatchAddiArr =
      copyContract?.additions.filter((addi) => {
        if ('batch' in addi) {
          return addi.batch === batch;
        }
      }) ?? [];

    let lastBatchTotal = new Decimal(0);

    lastBatchProductArr.forEach((prod) => {
      lastBatchTotal = lastBatchTotal.add(prod.totalPrice);
    });

    lastBatchAddiArr.forEach((addi) => {
      lastBatchTotal = lastBatchTotal.add(addi.totalPrice);
    });

    return {
      lastBatchProductArr,
      lastBatchAddiArr,
      lastBatchTotal: lastBatchTotal.toNumber(),
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contract]);

  const createClass = () => {
    if (copyContract) {
      // 在這邊就把prod與addi依batch過濾了
      copyContract.products = copyContract.products.filter((prod) => {
        if ('batch' in prod) {
          return prod.batch === batch;
        }
      });

      copyContract.additions = copyContract.additions.filter((addi) => {
        if ('batch' in addi) {
          return addi.batch === batch;
        }
      });

      // 追加追減的合約沒有contractNumber，因此從attachBatchNumbers取得
      if (!copyContract.contractNumber && batch > 0) {
        copyContract.contractNumber = copyContract.attachBatchNumbers[batch];
      }
    }

    return new Class_legacyContract(
      reRender,
      _.cloneDeep(copyContract) ?? emptyLegacyContract(),
      prodCellConfigCre(),
      additionCellConfigCre(),
      isAppend
    );
  };

  // 回朔到修改前的狀態
  const reset = () => {
    setClassLegacyContract(createClass());
  };

  const [classLegacyContract, setClassLegacyContract] = useState(createClass());

  useEffect(() => {
    if (classLegacyContract && isAppend) {
      classLegacyContract.countSubTotal();
    }
  }, [classLegacyContract]);

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
    boxB: 0,
    area: '',
    volume: '',
    thickness: '',
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
    closingType: '',
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

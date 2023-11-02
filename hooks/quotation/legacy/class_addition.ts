import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { checkIsNumberStr, clearThousandsSeparator } from 'js/utils/helpers/universal';

// ===========================================================

import { TlegacyContractAdditionDto, TcreateLegacyContractAdditionDto } from 'js/api/dtoTypes';
import type { TreRender } from './useLegacyContract';
import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

// ===========================================================
/**單一個addition */
class Class_addition {
  constructor({
    reRender,
    addition,
    countSubTotal,
    parentAddition,
    belongList,
    key,
  }: {
    reRender: TreRender;
    addition: TlegacyContractAdditionDto | TcreateLegacyContractAdditionDto;
    countSubTotal: () => void;
    parentAddition?: Class_addition;
    belongList: { [key: string]: Class_addition };
    key: string;
  }) {
    this._reRender = reRender;

    this._id = (() => {
      if ('id' in addition) {
        return addition.id;
      }

      return undefined;
    })();

    this._addition = addition;

    this._belongList = belongList;
    this._key = key;

    this._countSubTotal = countSubTotal;

    this._quantity = addition.quantity ? addition.quantity.toString() : '';
    this._unitPrice = addition.unitPrice ? addition.unitPrice.toString() : '';
    this._totalPrice = addition.totalPrice ? addition.totalPrice.toString() : '';

    if ('batchNumber' in this._addition) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._batchNumber = this._addition.batchNumber;
    } else {
      this._batchNumber = 'new';
    }

    if (parentAddition) {
      this._parentAddition = parentAddition;
    }
  } // constructor
  // -------------------------------------------------
  private _id;
  // private _delSelf;
  private _parentAddition: Class_addition | undefined = undefined;

  private _belongList;
  private _key;

  // 等api新增，先用假資料
  private _batchNumber;

  private _reRender;
  private _addition;
  private _countSubTotal;
  private _quantity;
  private _unitPrice;
  private _totalPrice;

  private _exAddiList: { [key: string]: Class_addition } = {};
  private _reduceQty = '0';

  // -------------------------------------------------
  get id() {
    return this._id;
  }
  set id(v) {
    this._id = v;
    this._reRender();
  }

  get hasParent() {
    return !!this._parentAddition;
  }
  get batchNumber() {
    return this._batchNumber; // 'M-1120821-1'
  }
  set batchNumber(v) {}

  delSelf() {
    delete this._belongList[this._key];
    this._countSubTotal();
    this._reRender();
  }
  copySelf() {
    const key = 'new-' + nanoid();

    const newAddiData: TcreateLegacyContractAdditionDto = {
      itemName: this._addition.itemName,
      content: this._addition.content,
      quantity: this._addition.quantity,
      unitPrice: this._addition.unitPrice,
      totalPrice: this._addition.totalPrice,
      notes: this._addition.notes,
    };

    this._belongList[key] = new Class_addition({
      reRender: this._reRender,
      addition: newAddiData,
      countSubTotal: this._countSubTotal,
      belongList: this._belongList,
      key,
    });

    this._countSubTotal();
    this._reRender();
  }

  // ----------------------------------------------------
  // ----------------------------------------------------

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
    if (this._parentAddition) {
      const parentRemain = this._parentAddition.remainQty + Number(this._quantity);

      if (Number(v) > parentRemain) {
        return;
      }
    }

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

  private _countTotalPrice = () => {
    const quantity = clearThousandsSeparator(this.quantity);
    const unitPrice = clearThousandsSeparator(this.unitPrice);
    this.totalPrice = Decimal.mul(quantity, unitPrice).toString();
  };

  get notes() {
    return this._addition.notes;
  }
  set notes(v) {
    this._addition.notes = v;
    this._reRender();
  }

  // -----------------------------------------------------------------
  // -----------------------------------------------------------------
  // 變更的配件

  get exAddiList() {
    return this._exAddiList;
  }
  get exAddiArr() {
    return Object.values(this._exAddiList);
  }

  get remainQty() {
    return Number(this._quantity) - Number(this._reduceQty) - Number(this.exchangeQty);
  }

  // 追減
  get reduceQty() {
    return this._reduceQty;
  }
  set reduceQty(v) {
    const nv = Number(v);

    if (nv > this.remainQty + Number(this.reduceQty)) {
      return;
    }

    this._reduceQty = v;
    this._countSubTotal();
    this._reRender();
  }

  // 變更
  get exchangeQty() {
    if (Object.keys(this._exAddiList).length === 0) {
      return 0;
    }

    let qty = 0;
    this.exAddiArr.forEach((item) => {
      qty = qty + Number(item.quantity || 0);
    });

    return qty;
  }

  // 追減/變更金額
  get reduceExchangePrice() {
    const qty = Number(this.reduceQty || 0) + Number(this.exchangeQty || 0);
    const reducePrice = Decimal.mul(qty, this._unitPrice || 0).toString();

    return reducePrice;
  }

  // 新增變更項目
  addExchange = (v: string) => {
    if (Number(v) > this.remainQty) {
      return false;
    }

    const exId = 'ex-' + nanoid();

    const copy = _.cloneDeep(this._addition);

    if ('id' in copy) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      copy.id = '';
    }

    copy.quantity = Number(v);
    copy.totalPrice = Decimal.mul(copy.unitPrice || 0, copy.quantity || 0).toNumber();

    this._exAddiList[exId] = new Class_addition({
      reRender: this._reRender,
      addition: copy,
      countSubTotal: this._countSubTotal,
      parentAddition: this,

      belongList: this._exAddiList,
      key: exId,
    });

    this._countSubTotal();

    this._reRender();

    return true;
  };

  // 清空變更項目
  clearExchange = () => {
    this._exAddiList = {};
    this._reduceQty = '0';
    this._countSubTotal();
    this._reRender();
  };

  // -----------------------------------------------------------------

  get postAddition() {
    return {
      ...this._addition,
      id: this.id || undefined,
    };
  }

  get appendAddition() {
    const hasExchange = this.remainQty !== Number(this._quantity);

    if (!hasExchange) {
      return null;
    }

    const copy = _.cloneDeep(this._addition);
    copy.quantity = this.remainQty;
    copy.totalPrice = Decimal.mul(copy.unitPrice || 0, copy.quantity || 0).toNumber();

    return {
      ...copy,
      id: this.id || undefined,
    };
  }
}

// ==========================================================================
// ==========================================================================
// ==========================================================================

type TaddtionInputCellType = {
  [key in keyof Pick<
    Class_addition,
    'batchNumber' | 'itemName' | 'content' | 'quantity' | 'unitPrice' | 'totalPrice' | 'notes'
  >]: {
    type: 'input';
  };
};

type TadditionKeys = keyof TaddtionInputCellType;

type TadditionCellConfig = {
  keyArr: TadditionKeys[];
  cellConfig: {
    [key in TadditionKeys]: {
      readonly label: string;
      inputSelPorps: TinputSelProps;
    };
  };
};

const additionCellConfigCre = (): TadditionCellConfig => {
  return {
    keyArr: ['batchNumber', 'itemName', 'content', 'quantity', 'unitPrice', 'totalPrice', 'notes'],
    cellConfig: {
      batchNumber: {
        label: '合約編號',

        inputSelPorps: {
          wrapperStyle: { width: '100px' },
          disabled: true,
          showBaseline: 'invisible',
          inputProps: {
            props: {
              readOnly: true,
            },
          },
        },
      },
      itemName: {
        label: '項目',
        inputSelPorps: {
          wrapperStyle: { width: '120px' },
          inputProps: {
            props: {},
          },
        },
      },
      content: {
        label: '內容',
        inputSelPorps: {
          wrapperStyle: { width: '225px', flex: 'auto' },
          inputProps: {
            props: {},
          },
        },
      },
      quantity: {
        label: '數量',
        inputSelPorps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: { type: 'number' },
          },
        },
      },
      unitPrice: {
        label: '單價',
        inputSelPorps: {
          wrapperStyle: { width: '100px' },
          inputProps: {
            props: {},
          },
        },
      },
      totalPrice: {
        label: '複價',
        inputSelPorps: {
          wrapperStyle: { width: '110px' },
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
        inputSelPorps: {
          wrapperStyle: { width: '170px' },
          inputProps: {
            props: {},
          },
        },
      },
    },
  };
};

// ==========================================================================

export { Class_addition, additionCellConfigCre };
export type { TaddtionInputCellType, TadditionCellConfig };

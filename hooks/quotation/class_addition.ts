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
  constructor(
    reRender: TreRender,
    addition: TlegacyContractAdditionDto | TcreateLegacyContractAdditionDto,
    countSubTotal: () => void,
    parentAddition?: Class_addition
  ) {
    this._reRender = reRender;
    this._addition = addition;
    this._countSubTotal = countSubTotal;

    this._quantity = addition.quantity ? addition.quantity.toString() : '';
    this._unitPrice = addition.unitPrice ? addition.unitPrice.toString() : '';
    this._totalPrice = addition.totalPrice ? addition.totalPrice.toString() : '';

    if (parentAddition) {
      this.parentAddition = parentAddition;
    }

    this.dndId = nanoid();
  } // constructor
  private _reRender;
  private _addition;
  private _countSubTotal;
  private _quantity;
  private _unitPrice;
  private _totalPrice;

  readonly dndId;
  // -------------------------------

  private _reduceQty = '0';
  get remainQty() {
    return Number(this._quantity) - Number(this._reduceQty) - Number(this.exchangeQty);
  }
  private parentAddition: Class_addition | undefined = undefined;
  private _exchangeAdditionArr: Class_addition[] | undefined = undefined;
  get exchangeAdditionArr() {
    return this._exchangeAdditionArr;
  }

  //
  // 等api新增，先用假資料
  private _quotationNumber = 'M-1120821-1';
  get quotationNumber() {
    return this._quotationNumber;
  }
  set quotationNumber(v) {}
  //
  // 追減
  get reduceQty() {
    return this._reduceQty;
  }
  set reduceQty(v) {
    const nv = Number(v);

    if (nv > this.remainQty + Number(this.reduceQty)) {
      return;
      // if (this.remainQty === 0) {
      //   return;
      // }

      // v = String(this.remainQty);
    }

    this._reduceQty = v;
    this._reRender();
  }

  // 變更
  get exchangeQty() {
    if (!this._exchangeAdditionArr) {
      return 0;
    }

    let qty = 0;
    this._exchangeAdditionArr.forEach((item) => {
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

    if (!this._exchangeAdditionArr) {
      this._exchangeAdditionArr = [];
    }

    const copy = _.cloneDeep(this._addition);
    copy.quantity = Number(v);
    copy.totalPrice = Decimal.mul(copy.unitPrice || 0, copy.quantity || 0).toNumber();
    this._exchangeAdditionArr.push(
      new Class_addition(
        this._reRender,
        copy,
        () => {},
        //
        this
      )
    );
    this._reRender();

    return true;
  };

  // 清空變更項目
  clearExchange = () => {
    this._exchangeAdditionArr = undefined;
    this._reduceQty = '0';
    this._reRender();
  };

  // ----------------------------------------------------
  // ----------------------------------------------------
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
}

// ==========================================================================
// ==========================================================================
// ==========================================================================

type TaddtionInputCellType = {
  [key in keyof Pick<
    Class_addition,
    'quotationNumber' | 'itemName' | 'content' | 'quantity' | 'unitPrice' | 'totalPrice' | 'notes'
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
    keyArr: ['quotationNumber', 'itemName', 'content', 'quantity', 'unitPrice', 'totalPrice', 'notes'],
    cellConfig: {
      quotationNumber: {
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
          wrapperStyle: { width: '60px' },
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
          inputProps: {
            props: {},
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

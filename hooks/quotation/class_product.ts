import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import { optionsCre_doorTrack_normal, optionsCre_doorTrack_typhoonProtection } from 'js/utils/options/doorTrackOptions';
import { optionsCreator_doorModel, optionsCreator_quoteType } from 'js/utils/options/productOptions';

const options_doorTrack_normal = optionsCre_doorTrack_normal();
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection();

// ===========================================================
import { TlegacyContractProductDto, TcreateLegacyContractProductDto } from 'js/api/dtoTypes';
import type { TreRender } from './useLegacyContract';
import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { Toption } from 'js/utils/options/options';
// ===========================================================

/**
 * 單一個主產品
 */
class Class_product {
  constructor({
    reRender,
    legacyProduct,
    // countTotalDiscount,
    countSubTotal,
    parentProd,
    //
    delSelf,
  }: {
    reRender: TreRender;
    legacyProduct: TlegacyContractProductDto | TcreateLegacyContractProductDto;
    // countTotalDiscount: () => void;
    countSubTotal: () => void;
    parentProd?: Class_product;
    //
    delSelf: () => void;
  }) {
    this._reRender = reRender;
    this._product = legacyProduct;

    // this._countTotalDiscount = countTotalDiscount;
    this._countSubTotal = countSubTotal;

    this._id = (() => {
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
    //
    this._quantity = this._product.quantity ? this._product.quantity.toString() : '';
    //
    this._unitPrice = this._product.unitPrice ? this._product.unitPrice.toString() : '';
    this._totalPrice = this._product.totalPrice ? this._product.totalPrice.toString() : '';

    this._discountRate =
      this._product.discountRate === '0' ? '' : Decimal.mul(this._product.discountRate || '0', 100).toString();

    if (parentProd) {
      this.parentProd = parentProd;
    }

    this._delSelf = () => {
      delSelf();
      this._countSubTotal();
      this._reRender();
    };
  } // constructor
  //----------------------------------------------

  private parentProd: Class_product | undefined = undefined;

  private _reRender;
  private _delSelf;
  private _countSubTotal;

  private _product;
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

  private _reduceQty = '0';
  private _exchangeProdList: {
    [key in string]: Class_product;
  } = {};
  // 等api新增，先用假資料
  private _quotationNumber = 'M-1120821-1';

  //----------------------------------------------
  get quotationNumber() {
    return this._quotationNumber; // 'M-1120821-1'
  }
  // set quotationNumber(v) {}

  get hasParent() {
    return !!this.parentProd;
  }

  get delSelf() {
    return this._delSelf;
  }
  set delSelf(newDelSelf) {
    this._delSelf = () => {
      newDelSelf();
      this._countSubTotal();
      this._reRender();
    };
  }

  //----------------------------------------------

  calcArea = () => {
    const area = Decimal.add(this._height || '0', this._thickness || '0') // h+b
      /** "0"被視為true，所以用型別為number的值來計算 */
      .mul(this._product.width || this._product.length || '0') // *w or *h
      .toFixed(2)
      .toString();

    return area;
  };

  /**計算才數 */
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
    // this._countTotalDiscount();
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
    if (this.parentProd) {
      const parentRemain = this.parentProd.remainQty;

      if (Number(v) > parentRemain) {
        return;
      }
    }

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
  // ----------------------------------------------
  // ----------------------------------------------
  // 追加追減

  // 因變更而新增的prod
  get exchangeProdList() {
    return this._exchangeProdList;
  }
  //
  get remainQty() {
    return Number(this._quantity) - Number(this._reduceQty) - Number(this.exchangeQty);
  }

  // 追減數量
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

  // 變更數量
  get exchangeQty() {
    let qty = 0;
    Object.values(this._exchangeProdList).forEach((item) => {
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

  // 新增變更的prod
  addExchange(v: string) {
    if (Number(v) > this.remainQty) {
      return false;
    }

    const copy = _.cloneDeep(this._product);
    copy.quantity = Number(v);
    copy.totalPrice = Decimal.mul(copy.unitPrice || 0, copy.quantity || 0).toNumber();

    if ('id' in copy) {
      copy.id = '';
    }

    const exId = 'ex-' + nanoid();

    const delSelf = () => {
      delete this._exchangeProdList[exId];
      // this._reRender();
    };

    this._exchangeProdList[exId] = new Class_product({
      reRender: this._reRender,
      legacyProduct: copy,
      countSubTotal: this._countSubTotal,
      parentProd: this,
      delSelf,
    });

    this._countSubTotal();

    this._reRender();

    return true;
    //
  }

  // 清空變更prod
  clearExchange = () => {
    this._exchangeProdList = {};
    this._reduceQty = '0';
    this._countSubTotal();
    this._reRender();
  };

  // -------------------------------------------------
  get postProd() {
    return {
      ...this._product,
      id: this.id,
    };
  }
}

// =========================================================================
// =========================================================================
// =========================================================================
type TprodInputCellType = {
  [key in keyof Pick<
    Class_product,
    | 'quotationNumber'
    | 'discountRate'
    | 'idNumber'
    | 'itemName'
    // | 'quoteType'
    // | 'doorType'
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

type TprodSelect = {
  [key in keyof Pick<Class_product, 'quoteType' | 'doorType'>]: { type: 'select'; options: Toption[] };
};

type TprodKeys = keyof (TprodInputCellType & TprodSelectWithIconCellType & TprodCheckboxCellType & TprodSelect);

type TprodCellConfig = {
  keyArr: TprodKeys[];
  cellConfig: {
    [key in TprodKeys]: {
      id: key;
      label: string;
      theadItemClassName?: string;
      inputSelProps: TinputSelProps;
    };
  };
};

function prodCellConfigCre(): TprodCellConfig {
  return {
    // 這個會影響一開始的排列順序
    keyArr: [
      // "idNumber",
      'quotationNumber',
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
      quotationNumber: {
        id: 'quotationNumber',
        label: '合約編號',
        inputSelProps: {
          wrapperStyle: { width: '100px' },
          inputProps: {
            props: {
              readOnly: true,
            },
          },
        },
      },
      idNumber: {
        id: 'idNumber',
        label: '編號',
        inputSelProps: {
          wrapperStyle: { width: '100px' },
          inputProps: {
            props: {
              type: 'number',
            },
          },
        },
      },
      discountRate: {
        id: 'discountRate',
        label: '折數',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: {
              type: 'number',
            },
          },
        },
      },
      itemName: {
        id: 'itemName',
        label: '項目',
        inputSelProps: {
          wrapperStyle: { width: '100px' },
          inputProps: {
            props: {},
          },
        },
      },
      quoteType: {
        id: 'quoteType',
        label: '報價別',
        inputSelProps: {
          wrapperStyle: { width: '105px' },
          selectProps: {
            props: {
              options: optionsCreator_quoteType(),
            },
          },
        },
      },
      doorType: {
        id: 'doorType',
        label: '門型',
        inputSelProps: {
          wrapperStyle: { width: '100px' },
          selectProps: {
            props: {
              options: optionsCreator_doorModel(),
            },
          },
        },
      },
      length: {
        id: 'length',
        label: 'L(m)',
        theadItemClassName: 'text-center',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: {
              type: 'number',
              className: 'text-center',
            },
          },
        },
      },
      width: {
        id: 'width',
        label: 'W(m)',
        theadItemClassName: 'text-center',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: {
              type: 'number',
              className: 'text-center',
            },
          },
        },
      },
      height: {
        id: 'height',
        label: 'h(m)',
        theadItemClassName: 'text-center',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: {
              type: 'number',
              className: 'text-center',
            },
          },
        },
      },
      thickness: {
        id: 'thickness',
        label: 'B(m)',
        theadItemClassName: 'text-center',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: {
              type: 'number',
              className: 'text-center',
            },
          },
        },
      },
      area: {
        id: 'area',
        label: '面積',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: {
              type: 'number',
            },
          },
        },
      },
      volume: {
        id: 'volume',
        label: '才數',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          inputProps: {
            props: {
              type: 'number',
            },
          },
        },
      },
      material: {
        id: 'material',
        label: '材料',
        inputSelProps: {
          wrapperStyle: { width: '120px' },
          inputProps: {
            props: {
              type: 'number',
            },
          },
        },
      },
      surface: {
        id: 'surface',
        label: '表面',
        inputSelProps: {
          wrapperStyle: { width: '55px' },
          inputProps: {
            props: {},
          },
        },
      },
      doorTrack: {
        id: 'doorTrack',
        label: '門軌',
        inputSelProps: {
          wrapperStyle: { width: '300px' },
          selectProps: {
            props: {},
            withIcon: true,
            dynaOptionsList: {
              normal: optionsCre_doorTrack_normal(),
              typhoonProtection: optionsCre_doorTrack_typhoonProtection(),
            },
          },
        },
      },
      horsepower: {
        id: 'horsepower',
        label: '馬力',
        inputSelProps: {
          wrapperStyle: { width: '90px' },
          inputProps: {
            props: {},
          },
        },
      },
      quantity: {
        id: 'quantity',
        label: '數量',
        inputSelProps: {
          wrapperStyle: { width: '55px' },
          inputProps: {
            props: { type: 'number' },
          },
        },
      },
      unitPrice: {
        id: 'unitPrice',
        label: '單價',
        inputSelProps: {
          wrapperStyle: { width: '120px' },
          inputProps: {
            props: {},
          },
        },
      },
      totalPrice: {
        id: 'totalPrice',
        label: '複價',
        inputSelProps: {
          wrapperStyle: { width: '140px' },
          inputProps: {
            props: {},
          },
        },
        // inputType: 'text',
      },
      typhoonProtection: {
        id: 'typhoonProtection',
        label: '防颱',
        theadItemClassName: 'text-center',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          checkBoxProps: {
            wrapperStyle: { justifyContent: 'center' },
            propsArr: [{ key: 'typhoonProtection' }],
          },
        },
      },
      bounceDoor: {
        id: 'bounceDoor',
        label: '彈射門',
        theadItemClassName: 'text-center',
        inputSelProps: {
          wrapperStyle: { width: '60px' },
          checkBoxProps: {
            wrapperStyle: { justifyContent: 'center' },
            propsArr: [{ key: 'bounceDoor' }],
          },
        },
      },
      notes: {
        id: 'notes',
        label: '備註',
        inputSelProps: {
          wrapperStyle: { width: '90px' },
          inputProps: {
            props: {},
          },
        },
      },
    },
  };
}

// =========================================================================

export { Class_product, prodCellConfigCre };
export type { TprodCellConfig, TprodInputCellType, TprodSelectWithIconCellType, TprodCheckboxCellType };

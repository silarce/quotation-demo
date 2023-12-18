import _ from 'lodash';
import Decimal from 'decimal.js';
import { nanoid } from 'nanoid';

import {
  optionsCre_doorTrack_normal,
  optionsCre_doorTrack_typhoonProtection,
  getDoorTrackByDoorModel,
} from 'js/utils/options/doorTrackOptions';
import {
  optionsCreator_doorModel,
  optionsCreator_quoteType_02,
  optionsCreator_horsePower,
} from 'js/utils/options/productOptions';

const options_doorTrack_normal = optionsCre_doorTrack_normal();
const options_doorTrack_typhoonProtection = optionsCre_doorTrack_typhoonProtection();

// ===========================================================
import { TlegacyContractProductDto, TcreateLegacyContractProductDto } from 'js/api/dtoTypes';
import type { TreRender } from './useLegacyContract';
import { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';
import { Toption } from 'js/utils/options/options';

import { calcProductArea, calcProductVolume } from 'js/utils/product/calc';

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
    belongList,
    key,
    //
    addExtraExProd,
  }: {
    reRender: TreRender;
    legacyProduct: TlegacyContractProductDto | TcreateLegacyContractProductDto;
    // countTotalDiscount: () => void;
    countSubTotal: () => void;
    parentProd?: Class_product;
    //
    belongList: { [key in string]: Class_product };
    key: string;
    //
    addExtraExProd: (body?: TcreateLegacyContractProductDto) => void;
  }) {
    this._reRender = reRender;
    this._product = legacyProduct;

    this._belongList = belongList;
    this._key = key;

    this._addExtraExProd = addExtraExProd;

    // this._countTotalDiscount = countTotalDiscount;
    this._countSubTotal = countSubTotal;

    this._id = (() => {
      if ('id' in legacyProduct) {
        return legacyProduct.id;
      }

      return undefined;
    })();

    this._idNumber = this._product.idNumber ? this._product.idNumber.toString() : '';

    // this._length = this._product.length ? this._product.length.toString() : '';
    // this._width = this._product.width ? this._product.width.toString() : '';
    // this._height = this._product.height ? this._product.height.toString() : '';
    // this._boxB = this._product.boxB ? this._product.boxB.toString() : '';
    this._length = this._product.length === '0' ? '' : this._product.length;
    this._width = this._product.width === '0' ? '' : this._product.width;
    this._height = this._product.height === '0' ? '' : this._product.height;
    this._boxB = this._product.boxB === '0' ? '' : this._product.boxB;

    //
    // this._quantity = this._product.quantity ? this._product.quantity.toString() : '';
    this._quantity = this._product.quantity.toString();
    //
    this._unitPrice = this._product.unitPrice ? this._product.unitPrice.toString() : '';
    this._totalPrice = this._product.totalPrice ? this._product.totalPrice.toString() : '';

    this._discountRate =
      this._product.discountRate === '0' ? '' : Decimal.mul(this._product.discountRate || '0', 100).toString();

    if ('batchNumber' in this._product) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this._batchNumber = this._product.batchNumber;
    } else {
      this._batchNumber = 'new';
    }

    if (parentProd) {
      this.parentProd = parentProd;
    }
  } // constructor
  //----------------------------------------------

  private parentProd: Class_product | undefined = undefined;

  private _reRender;
  // private _delSelf;
  private _countSubTotal;

  private _belongList;
  private _key;

  private _addExtraExProd;

  private _product;
  private _id;
  private _idNumber;
  private _length;
  private _width;
  private _height;
  private _boxB;
  private _quantity;
  private _unitPrice;
  private _totalPrice;
  private _discountRate;

  readonly options_doorTrack_normal = options_doorTrack_normal;
  readonly options_doorTrack_typhoonProtection = options_doorTrack_typhoonProtection;
  readonly options_doorModel = optionsCreator_doorModel();

  private _reduceQty = '0';
  // 因變更而新增的prod
  private _exchangeProdList: {
    [key in string]: Class_product;
  } = {};

  private _batchNumber;

  //----------------------------------------------
  get batchNumber() {
    return this._batchNumber; // 'M-1120821-1'
  }
  // set batchNumber(v) {}

  get hasParent() {
    return !!this.parentProd;
  }

  delSelf() {
    delete this._belongList[this._key];
    this._countSubTotal();
    this._reRender();
  }

  copySelf() {
    const key = 'new-' + nanoid();
    const copy = this.postProd;
    copy.id = undefined;
    this._belongList[key] = new Class_product({
      reRender: this._reRender,
      legacyProduct: copy,
      countSubTotal: this._countSubTotal,
      belongList: this._belongList,
      key,
      addExtraExProd: this._addExtraExProd,
    });
    this._countSubTotal();
  }

  //----------------------------------------------

  calcArea = () => {
    const h = Number(this._height || 0);
    const b = Number(this._boxB || 0);

    const w = Number(this._product.width || 0);
    const l = Number(this._product.length || 0);

    const area = calcProductArea({
      height: h,
      boxb: b,
      fullWidth: l,
      WG: w,
    });

    return area;
  };

  /**計算才數 */
  calcVolume = () => {
    return calcProductVolume(Number(this.area || 0));
  };

  get options_doorTrack() {
    let optionArr: Toption[] | undefined = [];

    let options_doorTrack_byDoorModel = getDoorTrackByDoorModel({ doorModelName: this._product.doorType });

    if (options_doorTrack_byDoorModel) {
      const typhoonProtection = this._product.typhoonProtection;

      options_doorTrack_byDoorModel = options_doorTrack_byDoorModel.filter((item) => {
        if (typhoonProtection) {
          return item.typhoonProtection === 'true';
        } else {
          return item.typhoonProtection !== 'true';
        }
      });

      optionArr = _.cloneDeep(options_doorTrack_byDoorModel) ?? [];
    } else {
      optionArr = _.cloneDeep(this.options_doorTrack_normal) ?? [];
    }

    optionArr.unshift({ value: '', label: '清空' });

    return optionArr;
  }

  get options_doorModel_byQuoteType() {
    return this.options_doorModel.filter((item) => {
      return item.quoteType === this.quoteType;
    });
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
    if (v === '') {
      v = '0';
    }

    if (Number(v) > 100) {
      v = '100';
    }

    if (v.split('.')[1]?.length > 2) {
      return;
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
    this._product.doorType = '';
    this._reRender();
  }

  get doorType() {
    return this._product.doorType;
  }
  set doorType(v) {
    this._product.doorType = v;

    const options = this.options_doorTrack;
    this.doorTrack = options[0]?.value ?? '';

    this._reRender();
  }

  get length() {
    return this._length;
  }
  set length(v) {
    this._length = v;
    this._product.length = v || '0';
    this._width = '0';
    this._product.width = '0';

    this.area = this.calcArea();
    this._reRender();
  }

  get width() {
    return this._width;
  }
  set width(v) {
    this._width = v;
    this._product.width = v || '0';
    this._length = '0';
    this._product.length = '0';
    this.area = this.calcArea();
    this._reRender();
  }

  get height() {
    return this._height;
  }
  set height(v) {
    this._height = v;
    this._product.height = v || '0';
    this.area = this.calcArea();
    this._reRender();
  }

  get boxB() {
    return this._boxB;
  }
  set boxB(v) {
    this._boxB = v;
    this._product.boxB = v || '0';
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

  /**厚度 */
  get thickness() {
    return this._product.thickness;
  }
  set thickness(v) {
    this._product.thickness = v;
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
      const remain = this.parentProd.remainQty + Number(this._quantity);

      if (Number(v) > remain) {
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

    // return parseFloat(this._unitPrice).toLocaleString();
    return String(this._unitPrice);
  }
  set unitPrice(v) {
    // v = v.replace(/,/g, '');

    // const numberRegex = /^(\d+(\.\d+)?|)$/;

    // if (!numberRegex.test(v)) {
    //   return;
    // }

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
    const options = this.options_doorTrack;
    this.doorTrack = options[0]?.value ?? '';
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

  get closingType() {
    return this._product.closingType;
  }

  set closingType(v) {
    this._product.closingType = v;
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      copy.id = '';
    }

    const key = 'ex-' + nanoid();

    this._exchangeProdList[key] = new Class_product({
      reRender: this._reRender,
      legacyProduct: copy,
      countSubTotal: this._countSubTotal,
      parentProd: this,
      belongList: this._belongList,
      key: this._key,
      addExtraExProd: this._addExtraExProd,
    });

    this._countSubTotal();

    this._reRender();

    return true;
    //
  }

  copySelfToExchange() {
    // const key = 'ex-' + nanoid();
    const copy = this.postProd;
    copy.id = undefined;

    this._addExtraExProd(copy);

    this._countSubTotal();
    this._reRender();
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
    const body = {
      ...this._product,
      id: this.id || undefined,
      closingType: this._product.closingType ?? '',
      boxB: this.boxB || '0',
      width: this.width || '0',
      length: this.length || '0',
      height: this.height || '0',
      thickness: this.thickness || '0',
    };

    const copy = _.cloneDeep(body);

    return copy;
  }

  get appendProd() {
    // const hasExchange = Object.keys(this._exchangeProdList).length > 0;
    const hasExchange = this.remainQty !== Number(this._quantity);

    if (!hasExchange) {
      return null;
    }

    const copy = _.cloneDeep(this._product);
    copy.quantity = Number(this.remainQty);
    copy.totalPrice = Decimal.mul(copy.unitPrice || 0, copy.quantity || 0).toNumber();

    return {
      ...copy,
      id: this.id || undefined,
      closingType: copy.closingType ?? '',
      boxB: this.boxB || '0',
      width: this.width || '0',
      length: this.length || '0',
      height: this.height || '0',
      thickness: this.thickness || '0',
    };
  }
}

// =========================================================================
// =========================================================================
// =========================================================================
type TprodInputCellType = {
  [key in keyof Pick<
    Class_product,
    | 'batchNumber'
    | 'discountRate'
    | 'idNumber'
    | 'itemName'
    // | 'quoteType'
    // | 'doorType'
    | 'length'
    | 'width'
    | 'height'
    | 'boxB'
    | 'area'
    | 'volume'
    | 'thickness'
    | 'material'
    | 'surface'
    | 'horsepower'
    | 'quantity'
    | 'unitPrice'
    | 'totalPrice'
    | 'notes'
    | 'closingType'
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
      'batchNumber',
      // 'discountRate',
      'itemName',
      'quoteType',
      'length',
      'width',
      'height',
      'boxB',
      'area',
      'volume',
      'thickness',
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
      'closingType',
    ],
    cellConfig: {
      // input
      batchNumber: {
        id: 'batchNumber',
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
              options: optionsCreator_quoteType_02(),
            },
          },
        },
      },
      //
      doorType: {
        id: 'doorType',
        label: '門型',
        inputSelProps: {
          wrapperStyle: { width: '320px' },
          // selectProps: {
          //   props: {
          //     options: optionsCreator_doorModel(),
          //     isSearchable: true, // 啟用react select 的createable功能
          //   },
          // },
          inputPropsAndSelectProps: {
            inputProps: {
              props: {},
            },
            selectProps: {
              props: {
                options: optionsCreator_doorModel(),
                // isSearchable: true, // 啟用react select 的createable功能
              },
            },
          },
        },
      },
      //
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
      boxB: {
        id: 'boxB',
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
      thickness: {
        id: 'thickness',
        label: '厚度',
        inputSelProps: {
          suffix: 't',
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
            props: {},
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
            withIcon: true,
            creOptionWithIconProps: {
              imgProps: {
                style: {
                  height: '40px',
                },
              },
            },
            creSingleValueWithIconProps: {
              imgProps: {
                style: {
                  height: '40px',
                },
              },
            },
            dynaOptionsList: {
              normal: optionsCre_doorTrack_normal(),
              typhoonProtection: optionsCre_doorTrack_typhoonProtection(),
            },
            props: {},
          },
        },
      },
      // optionsCreator_horsePower
      horsepower: {
        id: 'horsepower',
        label: '馬力',
        inputSelProps: {
          wrapperStyle: { width: '100px' },
          selectProps: {
            props: {
              options: optionsCreator_horsePower(),
            },
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
            props: {
              type: 'number',
            },
          },
        },
      },
      totalPrice: {
        id: 'totalPrice',
        label: '複價',
        inputSelProps: {
          wrapperStyle: { width: '140px' },
          showBaseline: 'invisible',
          inputProps: {
            props: {
              disabled: true,
            },
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
      closingType: {
        id: 'closingType',
        label: '開閉方式',
        inputSelProps: {
          wrapperStyle: { width: '100px' },
          selectProps: {
            props: {
              options: [
                { value: '電動', label: '電動' },
                { value: '手動', label: '手動' },
              ],
            },
          },
        },
      },
    },
  };
}

// =========================================================================

export { Class_product, prodCellConfigCre };
export type { TprodCellConfig, TprodInputCellType, TprodSelectWithIconCellType, TprodCheckboxCellType };

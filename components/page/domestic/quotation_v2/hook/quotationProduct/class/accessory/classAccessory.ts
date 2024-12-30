import Decimal from 'decimal.js';

import {
  TstateProd,
  TsetProd,
  //
  TstateProdData,
  TstateProdDict,
  //
  TstateAccessoryData,
  TsetAccessory,
} from '../../type';

import { TnodeConfig_accessory, createNodeConfig_accessory } from './config';

import { ClassProd } from '../prod/classProd_remake';
import { calcAllPrice } from '../../method/calcProd';

import type { TdoorAccessoryDto } from 'js/api/dtoTypes';

// ==========================================================================

const nodeConfig = createNodeConfig_accessory();

// ==========================================================================

interface Interface_ClassAccessory {
  readonly nodeConfig: TnodeConfig_accessory;
  //
  name: string; //名稱
  unit: string; // 單位
  quantity: `${number}` | ''; // 數量

  price: `${number}` | ''; // 牌價
  dualPrice: `${number}` | ''; // 牌價複價

  unitPrice: `${number}` | ''; // 單價
  totalPrice: `${number}` | ''; // 複價
  // originalPrice: number | undefined;
  // order: number;
  // referenceSpec: string | null;
}

// ============================================================================

class Class_accessory implements Interface_ClassAccessory {
  static createAcce = createAcce;

  // ---------------------------------------------------------------------------
  readonly state: TstateAccessoryData;
  private readonly setState: TsetAccessory;
  readonly nodeConfig = nodeConfig;
  render() {
    this.setState({ ...this.state });
  }

  protected classProd: ClassProd | undefined;

  constructor({
    state_accessory,
    setState_accessory,
    classProd,
  }: {
    state_accessory: TstateAccessoryData;
    setState_accessory: TsetAccessory;
    classProd: ClassProd;
  }) {
    this.state = state_accessory;
    this.setState = setState_accessory;
    this.classProd = classProd;
  } // constructor

  // -----------------------------------------------------------------------

  // MARK: renewAcceAllPrice
  renewAcceAllPrice() {
    const { dualPrice, unitPrice, totalPrice } = calcAllPrice({
      price: this.price || 0,
      quantity: this.quantity || 0,
      priceDiscount_percent: this.classProd?.priceDiscount_percent ?? 0,
    });

    this.state.dualPrice = `${dualPrice}` as `${number}`;
    this.state.unitPrice = `${unitPrice}` as `${number}`;
    this.state.totalPrice = `${totalPrice}` as `${number}`;
    this.render();
  }

  // -----------------------------------------------------------------------
  get name() {
    return this.state.name;
  }

  get unit() {
    return this.state.unit;
  }

  get quantity() {
    return this.state.quantity;
  }
  set quantity(value) {
    this.state.quantity = value;
    this.renewAcceAllPrice();
    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();

    this.render();
  }

  //牌價
  get price() {
    return this.state.price;
  }
  set price(value) {
    this.state.price = value;
    this.renewAcceAllPrice();
    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();

    this.render();
  }

  //牌價複價
  get dualPrice() {
    return this.state.dualPrice;
  }

  get unitPrice() {
    return this.state.unitPrice;
  }

  get totalPrice() {
    return this.state.totalPrice;
  }
}

// ==========================================================================
// TdoorAccessoryDto
function createAcce({ classProd, doorAccesssory }: { classProd: ClassProd; doorAccesssory: TdoorAccessoryDto }) {
  const {
    id,
    name,
    unit: _unit,
    referenceSpec,
    price,
    // cost,
  } = doorAccesssory;

  let unit = _unit;
  let quantity = 1;

  if (!unit) {
    if (referenceSpec === 'fullWidth') {
      unit = 'M';
    } else if (referenceSpec === 'area') {
      unit = '㎡';
    } else {
      unit = '組';
    }
  }

  if (referenceSpec === 'fullWidth') {
    quantity = new Decimal(classProd.data.fullWidth || 0).toDecimalPlaces(2).toNumber();
  } else if (referenceSpec === 'area') {
    quantity = new Decimal(classProd.data.area || 0).toDecimalPlaces(2).toNumber();
  }

  const { unitPrice, totalPrice, dualPrice } = calcAllPrice({
    price: price || 0,
    quantity: quantity,
    priceDiscount_percent: classProd.priceDiscount_percent,
  });

  const state_accessory: TstateAccessoryData = {
    codeName: id, //選配的id，也就是TdoorAccessoryDto.id
    name: name, //名稱
    unit, // 單位
    referenceSpec: referenceSpec,
    quantity: `${quantity}`, // 數量
    originalPrice: price ?? undefined,
    price: `${price || 0}`, // 牌價
    unitPrice: `${unitPrice}`, // 單價
    totalPrice: `${totalPrice}`, // 複價
    dualPrice: `${dualPrice}`, // 牌價複價
    order: 9999,
  };

  return state_accessory;
}

// ==========================================================================
export type { Interface_ClassAccessory };
export { Class_accessory };

import { isThisWeek } from 'date-fns';
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

class Class_accessory implements Interface_ClassAccessory {
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
    this.render();
  }

  //牌價
  get price() {
    return this.state.price;
  }
  set price(value) {
    this.state.price = value;
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
export type { Interface_ClassAccessory };
export { Class_accessory };

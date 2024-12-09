import {
  TstateProd,
  TsetProd,
  //
  TstateProdData,
  TstateProdDict,
  //
  TstateComponentData,
  TcomponentRawDataDict,
  Tdata_componentDict,
  TsetComponent,
} from '../../type';

import { TnodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

// interface Interface_ClassComponent_base<T extends keyof TcomponentRawDataDict> {
interface Interface_ClassComponent_base {
  // readonly state: TstateComponentData<T>;
  // readonly setState: TsetComponent<T>;
  // readonly nodeConfig: TnodeConfig_component;
  // readonly key: string;
  // readonly name: string;

  number: string | undefined; // 代號
  desc: string; // 說明
  material: string; // 材料
  materialSurface: string | null; // 表面
  density: `${number}` | null; // 重量基重
  isPainted: boolean; // 烤漆
  quantity: `${number}` | ''; // 數量
  price: `${number}` | ''; // 牌價

  dualPrice: number; // 牌價複價 // 虛值
  unitPrice: number; // 單價 = 牌價 * 主產品折數 * 總折數 // 虛值
  totalPrice: number; // 複價 = 單價 * 數量 // 虛值
}

interface Interface_ClassComponent_prime extends Interface_ClassComponent_base {
  readonly key: string;
  readonly name: string;
  readonly nodeConfig: TnodeConfig_component;
  readonly unit: string; // 單位 //要送到excel，不可以用ReactNode // 平方公尺可以用unicode處理 // ㎡或m²
}

// type TconstructorProps<T extends keyof Tdata_componentDict> = {
//   state_component: TstateComponentData<T>;
//   setState_component: TsetComponent<T>;
// };

// ========================================================================
// class ClassCompnent_base<T extends keyof Tdata_componentDict> implements Interface_ClassComponent_base<T> {
class ClassCompnent_base<T extends keyof Tdata_componentDict> implements Interface_ClassComponent_base {
  readonly state: TstateComponentData<T>;
  private readonly setState: TsetComponent<T>;
  //
  constructor({
    //
    state_component,
    setState_component,
  }: {
    state_component: TstateComponentData<T>;
    setState_component: TsetComponent<T>;
  }) {
    this.state = state_component;
    this.setState = setState_component;
  } // constructor close

  get number() {
    return this.state.number;
  }

  get desc() {
    return this.state.desc;
  }

  get material() {
    return this.state.material;
  }
  set material(value) {
    this.setState((prev) => ({ ...prev, material: value }));
  }

  get materialSurface() {
    return this.state.materialSurface;
  }
  set materialSurface(value) {
    this.setState((prev) => ({ ...prev, materialSurface: value }));
  }

  get density() {
    return this.state.density;
  }

  get isPainted() {
    return this.state.isPainted;
  }
  set isPainted(value) {
    this.setState((prev) => ({ ...prev, isPainted: value }));
  }

  get quantity() {
    return this.state.quantity;
  }
  set quantity(value) {
    this.setState((prev) => ({ ...prev, quantity: value }));
  }

  get price() {
    return this.state.price;
  }
  set price(value) {
    this.setState((prev) => ({ ...prev, price: value }));
  }

  get dualPrice() {
    return 9999;
  }

  get unitPrice() {
    return 9999;
  }

  get totalPrice() {
    return 9999;
  }
} //  ClassCompnent_base

export type { Interface_ClassComponent_base, Interface_ClassComponent_prime };
export { ClassCompnent_base };

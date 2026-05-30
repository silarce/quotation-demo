import { TstateComponentData, Tdata_componentDict, TsetComponent } from '../../type';

import { TnodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import type { Toption } from 'js/utils/options/options';

import { ClassProd } from '../prod/classProd_remake';

import { calcAllPrice } from '../../method/calcProd';

// ========================================================================
interface Interface_ClassComponent_base {
  number: string | undefined;
  desc: string;
  material: string;
  materialSurface: string | null;
  quantity: `${number}` | '';
  price: `${number}` | '';

  dualPrice: number;
  unitPrice: number;
  totalPrice: number;

  options_material: Toption[] | undefined;
  options_materialSurface: Toption[] | undefined;
  readonly onProdChangeMaterial: (prodMaterial: string | null | undefined) => void;
  readonly onProdChangeSurface: (prodSurface: string | null | undefined) => void;
  renewComponentAllPrice(): void;
}

interface Interface_ClassComponent_prime extends Interface_ClassComponent_base {
  readonly key: string;
  readonly name: string;
  readonly nodeConfig: TnodeConfig_component;
  readonly unit: string;
}

type TconstructorProps_componentBase<T extends keyof Tdata_componentDict> = {
  state_component: TstateComponentData<T>;
  setState_component: TsetComponent<T>;
};

// ========================================================================

class ClassCompnent_base<T extends keyof Tdata_componentDict> implements Interface_ClassComponent_base {
  key: T | undefined = undefined;

  state: TstateComponentData<T>;
  protected readonly setState: TsetComponent<T>;
  protected readonly render = () => {
    this.state.renderCount = (this.state.renderCount ?? 0) + 1;
    this.setState(this.state as Tdata_componentDict[T]);
  };

  protected classProd: ClassProd | undefined;

  setClassProd(classProd: ClassProd) {
    if (this.classProd === classProd) {
      return;
    }

    this.classProd = classProd;
    this.renewComponentAllPrice();
  }

  constructor({ state_component, setState_component }: TconstructorProps_componentBase<T>) {
    this.state = state_component;
    this.setState = setState_component;
  }

  // ------------------------------------------------------------------------

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
    this.state.material = value;
    this.render();
  }

  get materialSurface() {
    return this.state.materialSurface;
  }
  set materialSurface(value) {
    this.state.materialSurface = value;
    this.render();
  }

  get quantity() {
    return this.state.quantity;
  }
  set quantity(value) {
    this.state.quantity = value;
    this.renewComponentAllPrice();
    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  get price() {
    return this.state.price;
  }
  set price(value) {
    this.state.price = value;
    this.renewComponentAllPrice();
    this.classProd?.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  get dualPrice() {
    return this.state.dualPrice ?? 0;
  }

  get unitPrice() {
    return this.state.unitPrice ?? 0;
  }

  get totalPrice() {
    return this.state.totalPrice ?? 0;
  }

  // ------------------------------------------------------------------------

  get options_material(): Toption[] | undefined {
    return this.classProd?.options_material;
  }

  get options_materialSurface(): Toption[] | undefined {
    return this.classProd?.options_surface;
  }

  // ------------------------------------------------------------------------

  renewComponentAllPrice() {
    const { dualPrice, unitPrice, totalPrice } = calcAllPrice({
      price: this.state.price || 0,
      quantity: this.state.quantity || 0,
      priceDiscount_percent: this.classProd?.priceDiscount_percent || 0,
    });

    this.state.dualPrice = dualPrice;
    this.state.unitPrice = unitPrice;
    this.state.totalPrice = totalPrice;
  }

  onProdChangeMaterial(prodMaterial: string | null | undefined) {
    this.state.material = prodMaterial ?? '';
    this.render();
  }

  onProdChangeSurface(prodSurface: string | null | undefined) {
    this.state.materialSurface = prodSurface ?? '';
    this.render();
  }
}

export type { TconstructorProps_componentBase, Interface_ClassComponent_base, Interface_ClassComponent_prime };
export { ClassCompnent_base };

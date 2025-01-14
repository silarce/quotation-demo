import Decimal from 'decimal.js';

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

import type { TdoorComponentListDto } from 'js/api/dtoTypes';

// import { Interface_ClassProd_prime } from '../prod/interface';

import { TnodeConfig_component } from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/component/config';

import type { Toption } from 'js/utils/options/options';
import {
  optionDict_surface,
  optionsCreator_surface,
  optionsCreator_surface_onlyPaint,
  optionsCreator_surface_sst,
  optionsCreator_surface_galvanizedSteelPlate,
} from 'js/utils/options/productOptions';

import { checkIsSST, checkIsGalvanized } from '../library';

import { ClassProd } from '../prod/classProd_remake';

import { calcAllPrice } from '../../method/calcProd';

// ========================================================================
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

  //

  options_material: Toption[] | undefined;
  options_materialSurface: Toption[] | undefined;
  readonly onProdChangeMaterial: (prodMaterial: string | null | undefined) => void;
  readonly onProdChangeSurface: (prodSurface: string | null | undefined) => void;
  readonly renewDesc: () => void;
  readonly renewSurface: () => void;

  availableComponents?: TdoorComponentListDto | undefined | null; // undefined視為未曾初始化
  changeRaw?: (v: string) => void;
  //
  isRawDataExist?: boolean;
}

interface Interface_ClassComponent_prime extends Interface_ClassComponent_base {
  readonly key: string;
  readonly name: string;
  readonly nodeConfig: TnodeConfig_component;
  readonly unit: string; // 單位 //要送到excel，不可以用ReactNode // 平方公尺可以用unicode處理 // ㎡或m²
}

type TconstructorProps_componentBase<T extends keyof Tdata_componentDict> = {
  state_component: TstateComponentData<T>;
  setState_component: TsetComponent<T>;
};

// ========================================================================

const utils = {
  checkIsSST,
  checkIsGalvanized,
};

// ========================================================================
// class ClassCompnent_base<T extends keyof Tdata_componentDict> implements Interface_ClassComponent_base<T> {
class ClassCompnent_base<T extends keyof Tdata_componentDict> implements Interface_ClassComponent_base {
  static utils = utils;

  key: T | undefined = undefined;

  state: TstateComponentData<T>;
  protected readonly setState: TsetComponent<T>;
  protected readonly render = () => {
    this.state.renderCount = (this.state.renderCount ?? 0) + 1;
    this.setState(this.state as Tdata_componentDict[T]);
  };

  protected classProd: ClassProd | undefined;

  setClassProd(classProd: ClassProd) {
    this.classProd = classProd;

    // if (
    //   this.state.dualPrice === undefined ||
    //   this.state.unitPrice === undefined ||
    //   this.state.totalPrice === undefined
    // ) {
    //   this.renewComponentAllPrice();
    //   this.render();
    // }
    if (!this.state.isInited) {
      this.renewComponentAllPrice();
      this.state.isInited = true;
      this.render();
    }
  }

  //
  // -----------------------------------------------------------------------
  constructor({
    //
    state_component,
    setState_component,
  }: TconstructorProps_componentBase<T>) {
    this.state = state_component;
    this.setState = setState_component;

    this.state.shouldInit && this.init();
  } // constructor close

  // -----------------------------------------------------------------------

  get isRawDataExist() {
    return !!this.state.rawData;
  }

  get number() {
    return this.state.number;
  }

  get desc() {
    if (!this.state.rawData) {
      return '無資料';
    }

    return this.state.desc;
  }

  get material() {
    return this.state.material;
  }
  set material(value) {
    this.state.material = value;

    this.renewSurface();

    this.renewDesc();

    this.classProd?.isAllowReqChain && this.classProd?.reqChain_04();

    this.render();
  }

  get materialSurface() {
    return this.state.materialSurface;
  }
  set materialSurface(value) {
    this.state.materialSurface = value;
    this.renewDesc();

    this.classProd?.isAllowReqChain && this.classProd?.reqChain_04();

    this.render();
  }

  get density() {
    return this.state.density;
  }

  get isPainted() {
    return this.state.isPainted;
  }
  set isPainted(value) {
    this.state.isPainted = value;

    this.classProd?.isAllowReqChain && this.classProd?.reqChain_04();

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
  // -----------------------------------------------------------------------

  get options_material() {
    return this.classProd?.options_material;
  }

  get options_materialSurface() {
    const material = this.state.material;

    if (!material) {
      return undefined;
    }

    const doorModelName = this.classProd?.data.doorModelName;

    if (doorModelName === 'SJ-305D') {
      return [optionDict_surface.HL];
    }

    let options = optionsCreator_surface_onlyPaint();

    if (material === 'SST#304' || material === 'SST#316') {
      options = optionsCreator_surface_sst();
    } else if (material === '鍍鋅鋼板') {
      options = optionsCreator_surface_galvanizedSteelPlate();
    } else if (checkIsSST(material)) {
      options = optionsCreator_surface();
    }

    // if (doorModelName === 'SJ-302' || doorModelName === 'SJ-303A' || doorModelName === 'SJ-303AS') {
    //   options = options.filter((item) => {
    //     return item.value !== '烤漆';
    //   });
    // }

    return options;
  }

  get availableComponents() {
    return this.classProd?.state.availableComponents;
  }

  // -----------------------------------------------------------------------

  // 這個方案的型別搞不定，因此不採用，不然應該是這樣處理比較好
  // reset(data_component: TstateComponentData<T>) {
  //   this.state = {
  //     ...data_component,
  //     material: this.state.material,
  //     materialSurface: this.state.materialSurface,
  //   };
  // }

  // replaceState({
  //   remainMaterial = true,
  //   remainMaterialSurface = true,
  // }: {
  //   remainMaterial?: boolean;
  //   remainMaterialSurface?: boolean;
  // } = {}) {
  //   const prod_data_component = this.key && this.classProd?.state.data_componentDict[this.key];

  //   if (!prod_data_component) {
  //     throw new Error('replaceState方法，prod_data_component is undefined');
  //   }

  //   const state = prod_data_component;

  //   remainMaterial && (state.material = this.state.material);
  //   remainMaterialSurface && (state.materialSurface = this.state.materialSurface);

  //   this.state = state;

  //   this.render();
  // }

  init = () => {
    this.state.shouldInit = false;
    const material = this.classProd?.data.materialName;
    const materialSurface = this.classProd?.data.materialSurface;

    this.onProdChangeMaterial(material);
    this.onProdChangeSurface(materialSurface);
    this.renewDesc();

    this.render();
  };

  renewComponentAllPrice() {
    const { dualPrice, unitPrice, totalPrice } = calcAllPrice({
      price: this.state.price || 0,
      quantity: this.state.quantity || 0,
      priceDiscount_percent: this.classProd?.priceDiscount_percent || 0,
    });

    this.state.dualPrice = dualPrice;
    this.state.unitPrice = unitPrice;
    this.state.totalPrice = totalPrice;
    this.render();
  }

  renewDesc() {
    // 將會在各個子類別中實作
  }
  renewSurface() {
    const options_surfacce = this.options_materialSurface;

    const surface = this.state.materialSurface;

    if (!options_surfacce?.some((option) => option.value === surface)) {
      this.state.materialSurface = options_surfacce?.[0].value ?? '';
    }
  }

  // 在各個子類別中可能有各自的實作
  onProdChangeMaterial(prodMaterial: string | null | undefined) {
    const options_material = this.options_material;
    const value = options_material?.find((option) => option.value === prodMaterial)?.value;

    if (value) {
      this.state.material = value;
    } else {
      this.state.material = 'SST#304';

      if (this.options_materialSurface) {
        this.state.materialSurface = this.options_materialSurface[0].value;
      }
    }

    this.renewSurface();

    this.renewDesc();

    this.render();
  }

  // 在各個子類別中可能有各自的實作
  onProdChangeSurface(prodSurface: string | null | undefined) {
    const options_materialSurface = this.options_materialSurface;

    const isSurfaceExist = options_materialSurface?.some((option) => option.value === prodSurface);

    if (!isSurfaceExist) {
      return;
    }

    this.state.materialSurface = prodSurface ?? '';

    this.renewDesc();
    this.render();
  }

  onBomUpdate() {
    const generateDoorProductBom = this.classProd?.state.generateDoorProductBom;

    const key = this.key as keyof NonNullable<typeof generateDoorProductBom>;

    const componentBom = generateDoorProductBom?.[key];

    if (!componentBom) {
      this.state.componentId = undefined;
      this.state.bom = undefined;

      return;
    }

    const { id, number, bom, unitPrice, quantity } = componentBom;

    this.state.componentId = id;
    this.state.bom = bom;
    this.state.number = number;
    this.state.quantity = `${quantity}`;
    this.state.price = `${unitPrice}`;

    this.renewComponentAllPrice();

    this.render();
  }
} //  ClassCompnent_base

export type { TconstructorProps_componentBase, Interface_ClassComponent_base, Interface_ClassComponent_prime };
export { ClassCompnent_base };

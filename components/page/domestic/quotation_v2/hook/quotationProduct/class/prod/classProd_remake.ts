import Decimal from 'decimal.js';

import type { TstateProd, TstateProdDict, TsetProd } from '../../type';
import type { TnodeConfig } from './config';
import { calcProdTotalPrice, calcPriceDiscount_percent } from '../../method/calcProd';

import type { Interface_ClassComponent_prime } from '../component/classComponent_base';
import type { Class_accessory } from '../accessory/classAccessory';

import { getProdDefaults, createComponentDictFromTemplate, getDoorModelComponentKeys } from 'config/product/lookup';
import { optionsCreator_productMaterial, optionsCreator_surface } from 'js/utils/options/productOptions';
import type { Toption } from 'js/utils/options/options';
import type { TdoorAccessoryDto } from 'js/api/dtoTypes';

type TclassComponentDictLite = { [k: string]: Interface_ClassComponent_prime | undefined };
type TclassAccessoryDictLite = { [k: string]: Class_accessory | undefined };

type TonPordTotalChange = (stateProdDict?: TstateProdDict) => void;

type TconstructorProps = {
  stateProd: TstateProd;
  setStateProd: TsetProd;
  nodeConfig: TnodeConfig;
  quotationDiscount: `${number}` | number | '';
  onPordTotalChange: TonPordTotalChange;
  allowProdAutoChange?: boolean;
};

const calcArea = (fullWidth: `${number}` | '' | undefined, height: `${number}` | '' | undefined): `${number}` => {
  const w = Number(fullWidth || 0);
  const h = Number(height || 0);

  return `${new Decimal(w).mul(h).toDecimalPlaces(2).toNumber()}` as `${number}`;
};

class ClassProd {
  state: TstateProd;
  protected readonly setState: TsetProd;
  readonly nodeConfig: TnodeConfig;
  readonly quotationDiscount: `${number}` | number | '';
  protected readonly onPordTotalChange: TonPordTotalChange;
  readonly allowProdAutoChange: boolean;

  protected classComponentDict: TclassComponentDictLite = {};
  protected classAccessoryDict: TclassAccessoryDictLite = {};

  constructor({
    stateProd,
    setStateProd,
    nodeConfig,
    quotationDiscount,
    onPordTotalChange,
    allowProdAutoChange = true,
  }: TconstructorProps) {
    this.state = stateProd;
    this.setState = setStateProd;
    this.nodeConfig = nodeConfig;
    this.quotationDiscount = quotationDiscount;
    this.onPordTotalChange = onPordTotalChange;
    this.allowProdAutoChange = allowProdAutoChange;
  }

  protected render() {
    this.state.renderCount = (this.state.renderCount ?? 0) + 1;
    this.setState(this.state);
  }

  registerClassComponentDict(dict: TclassComponentDictLite) {
    this.classComponentDict = dict;
  }

  registerClassAccessoryDict(dict: TclassAccessoryDictLite) {
    this.classAccessoryDict = dict;
  }

  get key() {
    return this.state.key;
  }

  get data() {
    return this.state.data_prod;
  }

  get isSpecial() {
    return !this.state.doorModel;
  }

  get isValid_doorModel() {
    return !!this.state.doorModel;
  }

  get isFetching() {
    return false;
  }

  get isInited() {
    return true;
  }

  init() {
    this.render();
  }

  get isQuantityValid() {
    return true;
  }

  get rootProductName() {
    return '';
  }

  get qty_reduce(): `${number}` | '' {
    return this.state.qty_reduce ?? '';
  }

  set qty_reduce(v: `${number}` | '') {
    this.state.qty_reduce = v;
    this.render();
  }

  get qty_modify() {
    return 0;
  }

  get qty_remain() {
    return Number(this.data.quantity || 0);
  }

  get deductedPrice() {
    return 0;
  }

  runAfterChange() {
    // no-op
  }

  get priceDiscount_percent() {
    return calcPriceDiscount_percent({
      prodDiscount: (this.data.discount || 0) as `${number}` | 0,
      quotationDiscount: this.quotationDiscount || 0,
    });
  }

  get options_material(): Toption[] {
    return optionsCreator_productMaterial();
  }

  get options_surface(): Toption[] {
    return optionsCreator_surface();
  }

  get itemName() {
    return this.data.itemName ?? '';
  }

  set itemName(v: string) {
    this.data.itemName = v;
    this.render();
  }

  get quoteType() {
    return this.data.quoteType ?? '';
  }

  set quoteType(v: string) {
    this.data.quoteType = v;
    this.render();
  }

  get doorModelName() {
    return this.data.doorModelName ?? '';
  }

  set doorModelName(v: string) {
    this.data.doorModelName = v;
    this.render();
  }

  get fullWidth() {
    return this.data.fullWidth ?? '';
  }

  set fullWidth(v: `${number}` | '') {
    this.data.fullWidth = v;
    this.data.area = calcArea(v, this.data.height);
    this.render();
  }

  get height() {
    return this.data.height ?? '';
  }

  set height(v: `${number}` | '') {
    this.data.height = v;
    this.data.area = calcArea(this.data.fullWidth, v);
    this.render();
  }

  get area() {
    return this.data.area ?? '';
  }

  get materialName() {
    return this.data.materialName ?? '';
  }

  set materialName(v: string) {
    this.data.materialName = v;
    this.propagateMaterialToComponents(v);
    this.render();
  }

  get materialSurface() {
    return this.data.materialSurface ?? '';
  }

  set materialSurface(v: string | null) {
    this.data.materialSurface = v;
    this.propagateSurfaceToComponents(v);
    this.render();
  }

  get quantity() {
    return this.data.quantity ?? '';
  }

  set quantity(v: `${number}` | '') {
    this.data.quantity = v;
    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  get price() {
    return this.data.price ?? '';
  }

  set price(v: `${number}` | '') {
    this.data.price = v;
    this.state.isCustomPrice = true;
    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  get dualPrice() {
    return this.data.dualPrice ?? '';
  }

  get unitPrice() {
    return this.data.unitPrice ?? '';
  }

  get totalPrice() {
    return this.data.totalPrice ?? '';
  }

  get discount() {
    return this.data.discount ?? '';
  }

  set discount(v: `${number}` | '') {
    this.data.discount = v;
    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  changeDoorModel(arg: { doorModelName?: string; doorModel?: TstateProd['doorModel'] | null }) {
    const doorModelName = arg.doorModelName ?? arg.doorModel?.name ?? '';

    this.data.doorModelName = doorModelName;

    if (!doorModelName) {
      this.state.doorModel = null;
      this.state.data_componentDict = {} as TstateProd['data_componentDict'];
      this.state.componentKeyArr = [];
      this.render();

      return;
    }

    const defaults = getProdDefaults(doorModelName);

    this.data.materialName = defaults.materialName;
    this.data.materialSurface = defaults.materialSurface;

    this.state.data_componentDict = createComponentDictFromTemplate(doorModelName) as TstateProd['data_componentDict'];
    this.state.componentKeyArr = getDoorModelComponentKeys(doorModelName);
    this.state.doorModel = arg.doorModel ?? ({ name: doorModelName } as TstateProd['doorModel']);

    this.state.isCustomPrice = false;
    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  protected propagateMaterialToComponents(v: string) {
    Object.values(this.state.data_componentDict).forEach((c) => {
      if (!c) {
        return;
      }

      c.material = v;
    });
  }

  protected propagateSurfaceToComponents(v: string | null) {
    Object.values(this.state.data_componentDict).forEach((c) => {
      if (!c) {
        return;
      }

      c.materialSurface = v;
    });
  }

  renewProdAllPrice_updateQuotationTotalPrice() {
    Object.values(this.classComponentDict).forEach((c) => c?.renewComponentAllPrice?.());
    Object.values(this.classAccessoryDict).forEach((a) => a?.renewAcceAllPrice?.());

    const { price, dualPrice, unitPrice, totalPrice } = calcProdTotalPrice({
      stateProd: this.state,
      quotationDiscount: this.quotationDiscount || 0,
    });

    this.data.price = price;
    this.data.dualPrice = dualPrice;
    this.data.unitPrice = unitPrice;
    this.data.totalPrice = totalPrice;

    this.onPordTotalChange?.();
  }

  addAccessory(accessories: TdoorAccessoryDto[] | TdoorAccessoryDto) {
    const arr = Array.isArray(accessories) ? accessories : [accessories];
    const baseOrder = this.state.accessoryKeyArr.length;

    arr.forEach((dto, i) => {
      const key = dto.id;

      this.state.data_accessoryDict[key] = {
        codeName: dto.id,
        name: dto.name,
        unit: dto.unit ?? '',
        quantity: '1' as `${number}`,
        originalPrice: dto.price ?? 0,
        price: `${dto.price ?? 0}` as `${number}`,
        dualPrice: '0' as `${number}`,
        unitPrice: '0' as `${number}`,
        totalPrice: '0' as `${number}`,
        referenceSpec: dto.referenceSpec ?? null,
        order: baseOrder + i,
      };

      if (!this.state.accessoryKeyArr.includes(key)) {
        this.state.accessoryKeyArr.push(key);
      }
    });

    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }

  removeAccessory(key: string) {
    delete this.state.data_accessoryDict[key];
    this.state.accessoryKeyArr = this.state.accessoryKeyArr.filter((k) => k !== key);
    this.renewProdAllPrice_updateQuotationTotalPrice();
    this.render();
  }
}

export { ClassProd };

import Decimal from 'decimal.js';

import type { TstateProd, TstateProdDict, TsetProd, TstateAccessoryData, Tdata_componentDict } from '../../type';
import type { TnodeConfig } from './config';
import {
  calcProdTotalPrice,
  calcPriceDiscount_percent,
  calcAllPrice,
  recalcAccessoryInPlace,
  recalcComponentInPlace,
  recalcProdTotalsInPlace,
} from '../../method/calcProd';

import type { Interface_ClassComponent_prime } from '../component/classComponent_base';
import type { Class_accessory } from '../accessory/classAccessory';

import { getProdDefaults, createComponentDictFromTemplate, getDoorModelComponentKeys } from 'config/product/lookup';
import { optionsCreator_productMaterial, optionsCreator_surface } from 'js/utils/options/productOptions';
import type { Toption } from 'js/utils/options/options';
import type { TdoorAccessoryDto, TdoorComponentType } from 'js/api/dtoTypes';

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

// ===========================================================================
// MARK: 重算任務佇列（去重 + 共用 timer）
// task 不存 bound method，改存「描述」(target + action + key)；flush 透過 module-level
// registry 拿到最新的 setState_prodDict，再用 functional updater 對 React live state
// 做 in-place mutate，避免「new ClassProd 取代 instance 後，timer 內 this.state 是舊參照」的雷。

type RecalcTask =
  | { target: 'accessory'; action: 'recalcPrice'; prodKey: string; acceKey: string }
  | { target: 'accessory'; action: 'syncQuantityFromSize'; prodKey: string; acceKey: string }
  | { target: 'component'; action: 'recalcPrice'; prodKey: string; compKey: TdoorComponentType }
  | { target: 'component'; action: 'syncQuantityFromSize'; prodKey: string; compKey: TdoorComponentType }
  | { target: 'prod'; action: 'recalcTotals'; prodKey: string };

// 各 component 子類的 readonly unit 在此查表，避免 flush 內反查 class instance。
const componentTypeUnitMap: Partial<Record<TdoorComponentType, 'M' | '㎡'>> = {
  slat: '㎡',
  bottomBar: 'M',
  headBox: 'M',
  guideRail: 'M',
};

// 依 unit 取出對應的 prod 尺寸（'M' → fullWidth, '㎡' → area）；其它 unit 不同步。
const getQuantityForUnit = (stateProd: TstateProd, unit: string | undefined): `${number}` | null => {
  if (unit === 'M') {
    return `${new Decimal(stateProd.data_prod.fullWidth || 0).toDecimalPlaces(2).toNumber()}` as `${number}`;
  }

  if (unit === '㎡') {
    return `${new Decimal(stateProd.data_prod.area || 0).toDecimalPlaces(2).toNumber()}` as `${number}`;
  }

  return null;
};

const RECALC_DEBOUNCE_MS = 300;

const recalcQueue = new Map<string, RecalcTask>();
let recalcTimeoutId: ReturnType<typeof setTimeout> | null = null;

const setProdRegistry = new Map<string, TsetProd>();
const onPordTotalChangeRegistry = new Map<string, TonPordTotalChange>();
let quotationDiscountRef: `${number}` | number | '' = '';

const targetOrder: Record<RecalcTask['target'], number> = {
  accessory: 0,
  component: 0,
  prod: 1,
};

const taskDedupKey = (task: RecalcTask): string => {
  switch (task.target) {
    case 'accessory':
      return `${task.action}:${task.target}:${task.prodKey}:${task.acceKey}`;
    case 'component':
      return `${task.action}:${task.target}:${task.prodKey}:${task.compKey}`;
    case 'prod':
      return `${task.action}:${task.target}:${task.prodKey}`;
  }
};

const enqueueRecalc = (task: RecalcTask): void => {
  recalcQueue.set(taskDedupKey(task), task);

  if (recalcTimeoutId !== null) {
    clearTimeout(recalcTimeoutId);
  }

  recalcTimeoutId = setTimeout(flushRecalc, RECALC_DEBOUNCE_MS);
};

const applyAccessoryTask = (
  next: TstateProd,
  task: Extract<RecalcTask, { target: 'accessory' }>,
  priceDiscount_percent: number | `${number}`
): void => {
  const acce = next.data_accessoryDict[task.acceKey];

  if (!acce) {
    return;
  }

  const acceCopy: TstateAccessoryData = { ...acce };

  if (task.action === 'syncQuantityFromSize') {
    const newQty = getQuantityForUnit(next, acceCopy.unit);

    if (newQty !== null) {
      acceCopy.quantity = newQty;
    }
  }

  recalcAccessoryInPlace(acceCopy, priceDiscount_percent);
  next.data_accessoryDict[task.acceKey] = acceCopy;
};

const applyComponentTask = (
  next: TstateProd,
  task: Extract<RecalcTask, { target: 'component' }>,
  priceDiscount_percent: number | `${number}`
): void => {
  const comp = next.data_componentDict[task.compKey];

  if (!comp) {
    return;
  }

  const compCopy = { ...comp } as NonNullable<Tdata_componentDict[typeof task.compKey]>;

  if (task.action === 'syncQuantityFromSize') {
    const newQty = getQuantityForUnit(next, componentTypeUnitMap[task.compKey]);

    if (newQty !== null) {
      compCopy.quantity = newQty;
    }
  }

  recalcComponentInPlace(compCopy, priceDiscount_percent);
  (next.data_componentDict as Record<TdoorComponentType, unknown>)[task.compKey] = compCopy;
};

function flushRecalc() {
  recalcTimeoutId = null;
  const tasks = Array.from(recalcQueue.values());
  recalcQueue.clear();

  // 排序：child 在前、prod 在後；同階層維持插入順序（Array.from 已保留）。
  tasks.sort((a, b) => targetOrder[a.target] - targetOrder[b.target]);

  // 按 prodKey 分組，逐組透過該 prod 的 setState functional updater 套用 task。
  const grouped = new Map<string, RecalcTask[]>();
  tasks.forEach((task) => {
    const arr = grouped.get(task.prodKey);

    if (arr) {
      arr.push(task);
    } else {
      grouped.set(task.prodKey, [task]);
    }
  });

  grouped.forEach((groupTasks, prodKey) => {
    const setProd = setProdRegistry.get(prodKey);

    if (!setProd) {
      return;
    }

    setProd((latest) => {
      if (!latest) {
        return latest;
      }

      const next: TstateProd = {
        ...latest,
        data_prod: { ...latest.data_prod },
        data_componentDict: { ...latest.data_componentDict },
        data_accessoryDict: { ...latest.data_accessoryDict },
      };

      const priceDiscount_percent = calcPriceDiscount_percent({
        prodDiscount: (next.data_prod.discount || 0) as `${number}` | 0,
        quotationDiscount: quotationDiscountRef || 0,
      });

      groupTasks.forEach((task) => {
        switch (task.action) {
          case 'recalcPrice':
            if (task.target === 'accessory') {
              applyAccessoryTask(next, task, priceDiscount_percent);
            } else if (task.target === 'component') {
              applyComponentTask(next, task, priceDiscount_percent);
            }

            break;
          case 'syncQuantityFromSize':
            if (task.target === 'accessory') {
              applyAccessoryTask(next, task, priceDiscount_percent);
            } else if (task.target === 'component') {
              applyComponentTask(next, task, priceDiscount_percent);
            }

            break;
          case 'recalcTotals':
            recalcProdTotalsInPlace(next, quotationDiscountRef);

            break;
        }
      });

      return next;
    });

    onPordTotalChangeRegistry.get(prodKey)?.();
  });
}

// ===========================================================================

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

    // 註冊到 module-level registry，讓 debounced flushRecalc() 能拿到「永遠最新」的 setState。
    setProdRegistry.set(stateProd.key, setStateProd);
    onPordTotalChangeRegistry.set(stateProd.key, onPordTotalChange);
    quotationDiscountRef = quotationDiscount;
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
    this.requestSyncChildrenQtyFromSize();
    this.requestRecalc();
    this.render();
  }

  get height() {
    return this.data.height ?? '';
  }

  set height(v: `${number}` | '') {
    this.data.height = v;
    this.data.area = calcArea(this.data.fullWidth, v);
    this.requestSyncChildrenQtyFromSize();
    this.requestRecalc();
    this.render();
  }

  // prod 尺寸變動 → 喰各個 unit='M' / unit='㎡' 的 child sync task。單向（child 不反向影響 prod）。
  protected requestSyncChildrenQtyFromSize() {
    Object.entries(this.state.data_accessoryDict).forEach(([key, acce]) => {
      if (!acce) {
        return;
      }

      if (acce.unit === 'M' || acce.unit === '㎡') {
        this.requestSyncAccessoryQtyFromSize(key);
      }
    });

    (Object.keys(componentTypeUnitMap) as TdoorComponentType[]).forEach((compKey) => {
      if (this.state.data_componentDict[compKey]) {
        this.requestSyncComponentQtyFromSize(compKey);
      }
    });
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
    this.requestRecalc();
    this.render();
  }

  get price() {
    return this.data.price ?? '';
  }

  set price(v: `${number}` | '') {
    this.data.price = v;
    this.state.isCustomPrice = true;
    this.requestRecalc();
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
    this.requestRecalc();
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

  // MARK: requestRecalc / requestRecalcAccessory / requestRecalcComponent / requestSyncAccessoryQtyFromSize
  // 這些 wrapper 在 setter 裡被呼叫。所有金額 / 折數 / 尺寸的變動都透過佇列收斂到 prod 的 recalcTotals，
  // 以達成 300ms 防抖 + 去重。
  requestRecalc() {
    enqueueRecalc({ target: 'prod', action: 'recalcTotals', prodKey: this.state.key });
  }

  requestRecalcAccessory(acceKey: string) {
    enqueueRecalc({ target: 'accessory', action: 'recalcPrice', prodKey: this.state.key, acceKey });
    enqueueRecalc({ target: 'prod', action: 'recalcTotals', prodKey: this.state.key });
  }

  requestRecalcComponent(compKey: TdoorComponentType) {
    enqueueRecalc({ target: 'component', action: 'recalcPrice', prodKey: this.state.key, compKey });
    enqueueRecalc({ target: 'prod', action: 'recalcTotals', prodKey: this.state.key });
  }

  requestSyncAccessoryQtyFromSize(acceKey: string) {
    enqueueRecalc({ target: 'accessory', action: 'syncQuantityFromSize', prodKey: this.state.key, acceKey });
    enqueueRecalc({ target: 'prod', action: 'recalcTotals', prodKey: this.state.key });
  }

  requestSyncComponentQtyFromSize(compKey: TdoorComponentType) {
    enqueueRecalc({ target: 'component', action: 'syncQuantityFromSize', prodKey: this.state.key, compKey });
    enqueueRecalc({ target: 'prod', action: 'recalcTotals', prodKey: this.state.key });
  }

  addAccessory(accessories: TdoorAccessoryDto[] | TdoorAccessoryDto) {
    const arr = Array.isArray(accessories) ? accessories : [accessories];
    const baseOrder = this.state.accessoryKeyArr.length;
    const discountPct = this.priceDiscount_percent;

    arr.forEach((dto, i) => {
      const key = dto.id;
      const referenceSpec = dto.referenceSpec ?? null;

      let quantityNum = 1;

      if (referenceSpec === 'fullWidth') {
        quantityNum = new Decimal(this.data.fullWidth || 0).toDecimalPlaces(2).toNumber();
      } else if (referenceSpec === 'area') {
        quantityNum = new Decimal(this.data.area || 0).toDecimalPlaces(2).toNumber();
      }

      let unit = dto.unit ?? '';

      if (!unit) {
        if (referenceSpec === 'fullWidth') {
          unit = 'M';
        } else if (referenceSpec === 'area') {
          unit = '㎡';
        } else {
          unit = '組';
        }
      }

      const priceNum = dto.price ?? 0;
      const { dualPrice, unitPrice, totalPrice } = calcAllPrice({
        price: priceNum,
        quantity: quantityNum,
        priceDiscount_percent: discountPct,
      });

      this.state.data_accessoryDict[key] = {
        codeName: dto.id,
        name: dto.name,
        unit,
        quantity: `${quantityNum}` as `${number}`,
        originalPrice: priceNum,
        price: `${priceNum}` as `${number}`,
        dualPrice: `${dualPrice}` as `${number}`,
        unitPrice: `${unitPrice}` as `${number}`,
        totalPrice: `${totalPrice}` as `${number}`,
        referenceSpec,
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
    // 清掉佇列中針對此 accessory 的 pending task，避免 flush 又把資料寫回去。
    recalcQueue.delete(`recalcPrice:accessory:${this.state.key}:${key}`);
    recalcQueue.delete(`syncQuantityFromSize:accessory:${this.state.key}:${key}`);

    // 注意：不可走 renewProdAllPrice_updateQuotationTotalPrice，
    // 它會遍歷 classAccessoryDict（仍含舊實例）並 setAccessory 把已刪 entry 寫回。
    this.setState((latest) => {
      if (!latest) {
        return latest;
      }

      const nextDict = { ...latest.data_accessoryDict };

      delete nextDict[key];

      const next: TstateProd = {
        ...latest,
        data_prod: { ...latest.data_prod },
        data_componentDict: { ...latest.data_componentDict },
        data_accessoryDict: nextDict,
        accessoryKeyArr: latest.accessoryKeyArr.filter((k) => k !== key),
      };

      recalcProdTotalsInPlace(next, quotationDiscountRef);

      return next;
    });

    // 同步本地 this.state，避免後續同實例的 getter 讀到舊資料。
    delete this.state.data_accessoryDict[key];
    this.state.accessoryKeyArr = this.state.accessoryKeyArr.filter((k) => k !== key);

    this.onPordTotalChange?.();
  }
}

export { ClassProd };

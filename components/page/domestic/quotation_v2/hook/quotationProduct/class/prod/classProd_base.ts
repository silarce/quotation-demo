import Decimal from 'decimal.js';
import _ from 'lodash';

import { createAssetUrl } from 'js/api/api_product';

import { TstateProd } from '../../type';
import { TnodeConfig } from './config';

// DTO
import { TdoorModelInfoDto } from 'js/api/api_product';
// =======================================================================
interface Interface_ClassProd_base {
  readonly state: TstateProd;
  readonly nodeConfig: TnodeConfig;
  //
  //
  readonly id: string | null | undefined;
  readonly key: string;
  // 項目名
  itemName: string;
  // 折數
  discount: string;
  // 報價別
  quoteType: string;
  // 門型
  doorModelName: string;

  // L(公尺)全寬 浮點數
  fullWidth: `${number}` | '';
  // WG(公尺) 浮點數
  WG: `${number}` | '';
  // h(公尺) 浮點數
  height: `${number}` | '';
  // B(公尺) 浮點數
  boxB: `${number}` | '';
  // D(公尺) 浮點數
  boxD: `${number}` | '';
  // 面積 (平方公尺) 浮點數
  area: `${number}` | '';
  // 才數 (台制單位，代表面積) 浮點數
  volume: `${number}` | '';

  // 材料
  materialName: string;
  // 表面
  materialSurface: string | null;

  // 馬力 格式為分數 例如"1/4HP"
  horsepower: string;
  // 馬達廠商
  motorVendor: string | null;
  // 電壓
  motorVoltage: number | null; // 220 | 380
  // 相數
  motorPhase: number | null; // 1 | 3 | null

  // 門軌 門軌圖檔的名稱，例如 "SJ302_30.svg"，基本上都是.svg結尾
  // 目前沒有需要顯示門軌名稱的地方，都是顯示圖檔
  guideRail: string | null;
  // 門軌圖檔的URL
  guideRailImg: string | undefined | 'none';

  // 門軌厚度 浮點數
  guideRailThickness: `${number}` | null;
  // 門軌消音條
  hasSilencingStrip: boolean | null;
  // guideRailG為門軌的width
  // guideRailG是指單邊門軌的寬度。要注意，在工務部，G是指兩邊門軌寬度的總和。
  // guideRailG: number | null;
  // 門軌UL
  isULGuideRail: boolean | null;

  // 馬達支撐架
  // hasMotorSupportStand: boolean | null;
  // 底座類型 // 實際上似乎都是送空字串?
  // bottomBar: string | null; // 鋁障感 | 止水型 | ''
  // 馬達鎖盒
  // motorLockBox: string | null;
  // 一體式捲箱
  isIntegratedHeadBox: boolean | null;
  // 捲箱厚度 浮點數
  headBoxThickness: `${number}` | null;

  // 防颱
  isAntiTyphoon: boolean | null;

  // 彈射門
  // bounceDoor: boolean | null;
  // 彈射門寬度(公尺)
  bounceDoorWidth: `${number}` | '' | null;
  // 彈射門高度
  // bounceDoorHeight: number | null;
  // 彈射門長度
  // bounceDoorLength: number | null;

  // 關閉方式
  closingType: string | null; // 電動 | 手動 | ''
  // 備註
  notes: string;

  // 底座角鐵 目前選項寫死在前端
  bottomBarAngleIron: string | null;
  // 底座板 目前選項寫死在前端
  bottomBarPlate: string | null;

  // // 配電箱牌價
  // distributionBoxPrice: `${number}` | '';
  // // 配電箱單價
  // distributionBoxUnitPrice: `${number}` | '';
  // // 配電箱數量
  // distributionBoxQuantity: `${number}` | '';
  // // 配電箱牌價複價
  // distributionBoxDualPrice: `${number}` | '';
  // // 配電箱複價
  // distributionBoxTotalPrice: `${number}` | '';
  // // 安裝費牌價
  // installationFeePrice: `${number}` | '';
  // // 安裝費牌價複價
  // installationFeeDualPrice: `${number}` | '';
  // // 安裝費數量
  // installationFeeQuantity: `${number}` | '';
  // // 安裝費單價
  // installationFeeUnitPrice: `${number}` | '';
  // // 安裝費複價
  // installationFeeTotalPrice: `${number}` | '';

  //

  // 以下這些東西會從 get /products/door/calc-general-spec 取得
  // generalSpec: {
  //   gapA: string | null;
  //   gapC: string | null;
  //   gearNumber: string | null;
  //   weight: string | null;
  //   // 門片厚度 浮點數
  //   thickness: `${number}` | '';
  //   // 門片 - 捲片支數
  //   slatCount: `${number}` | null;
  //   // 鏈齒輪 - 鏈齒輪番號
  //   sprocketWheelModel: string | null;
  //   // 鏈齒輪 - 大鏈輪
  //   sprocketWheelTeethNumber: string | null;
  //   // 可能為鍊條數量
  //   sprocketWheelChains: `${number}` | null;
  //   // 鏈齒輪/捲軸 - 孔徑/軸徑
  //   bearingInnerDiameter: string | null;
  //   // 捲軸 - 尺寸
  //   diameter: `${number}` | null;
  //   // 捲軸 - 總長
  //   bearingHousingTotalLength: `${number}` | null;
  //   // 底座 - 開口
  //   guideRailsOpening: string | null;
  //   // 門片長度
  //   slatLength: number | null;
  //   // 門軌長度
  //   guideRailLength: number | null;
  //   // 捲箱長度
  //   headBoxLength: number | null;
  //   // 軸承座寸法
  //   bearingHousingSize: number | null;
  //   // 軸承
  //   bearingName: string | null;
  // };
  // 以上這些東西會從 get /products/door/calc-general-spec 取得

  // 數量 // 整數
  quantity: number;
  // 單價
  unitPrice: `${number}` | '';
  // 複價
  totalPrice: `${number}` | '';
  // 牌價
  price: `${number}` | '';
  // 牌價複價
  dualPrice: `${number}` | '';

  // 排序
  // order: number;

  // // 來源產品Id
  // attachedToProductId?: string | null;
  // // 源頭產品
  // // 實際上可能為null，運作正常的話預期不會為null。若為null代表有問題，要跟後端討論
  // rootProductId: string;
  // -----------------------------------------------------------------------

  changeDoorModel: (doorModel: TdoorModelInfoDto | null) => Interface_ClassProd_base;

  // -----------------------------------------------------------------------
}

// ================================================================================

// 在子類別中，可以透過customizeNodeConfig方法來覆寫nodeConfig
// 務必要先進行深拷貝，避免影響到原本的nodeConfig
const customizeNodeConfig = (nodeConfig: TnodeConfig) => {
  const config = _.cloneDeep(nodeConfig);

  // 修改style與className時要注意避免修改影響寬度的樣式，避免與其他的row不對齊

  // 範例
  // config.itemName.style = { ...config.itemName.style, background: 'red' };
  // config.itemName.className = classNames(config.itemName.className, scss.foo);
  // config.itemName.createNode = (state) => {
  //   return null;
  // };

  return config;
};

// ================================================================================

class ClassProd_base implements Interface_ClassProd_base {
  // MARK: constructor
  constructor({
    stateProd,
    setStateProd,
    nodeConfig,
  }: {
    stateProd: TstateProd;
    setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
    nodeConfig: TnodeConfig;
  }) {
    this.state = stateProd;
    this.data = this.state.data;
    this.setState = setStateProd;
    this.nodeConfig = customizeNodeConfig(nodeConfig);
  } // constructor
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  readonly nodeConfig: TnodeConfig;
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  readonly state: TstateProd;
  readonly data: TstateProd['data'];
  private setState: React.Dispatch<React.SetStateAction<TstateProd>>;
  private setData<K extends keyof TstateProd['data']>(key: K, value: TstateProd['data'][K]) {
    this.setState((prev) => {
      const copy = { ...prev };
      copy.data[key] = value;

      return copy;
    });
  }
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  changeDoorModel(doorModel: TdoorModelInfoDto | null) {
    this.state.doorModel = doorModel;

    return this;
  }
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // region 輸出
  get key() {
    return this.state.key;
  }

  get id() {
    return this.data.id;
  }

  get itemName() {
    return this.data.itemName;
  }
  set itemName(value) {
    this.setData('itemName', value);
  }

  get discount() {
    return this.data.discount;
  }
  set discount(value) {
    this.setData('discount', value);
  }

  get quoteType() {
    return this.data.quoteType;
  }
  set quoteType(value) {
    this.setData('quoteType', value);
  }

  get doorModelName() {
    return this.data.doorModelName;
  }
  set doorModelName(value) {
    this.setData('doorModelName', value);
  }

  get fullWidth() {
    return this.data.fullWidth;
  }
  set fullWidth(value) {
    this.setData('fullWidth', value);
  }
  get fullWidth_mm() {
    return new Decimal(this.data.fullWidth).mul(1000).toNumber();
  }

  get WG() {
    return this.data.WG;
  }
  set WG(value) {
    this.setData('WG', value);
  }
  get WG_mm() {
    return new Decimal(this.data.WG).mul(1000).toNumber();
  }

  get height() {
    return this.data.height;
  }
  set height(value) {
    this.setData('height', value);
  }
  get height_mm() {
    return new Decimal(this.data.height).mul(1000).toNumber();
  }

  get boxB() {
    return this.data.boxB;
  }
  set boxB(value) {
    this.setData('boxB', value);
  }
  get boxB_mm() {
    return new Decimal(this.data.boxB).mul(1000).toNumber();
  }

  get boxD() {
    return this.data.boxD;
  }
  set boxD(value) {
    this.setData('boxD', value);
  }
  get boxD_mm() {
    return new Decimal(this.data.boxD).mul(1000).toNumber();
  }

  get area() {
    return this.data.area ?? '';
  }

  get volume() {
    return this.data.volume ?? '';
  }

  get materialName() {
    return this.data.materialName;
  }
  set materialName(value) {
    this.setData('materialName', value);
  }

  get materialSurface() {
    return this.data.materialSurface;
  }
  set materialSurface(value) {
    this.setData('materialSurface', value);
  }

  get horsepower() {
    return this.data.horsepower;
  }
  set horsepower(value) {
    this.setData('horsepower', value);
  }

  get motorVendor() {
    return this.data.motorVendor;
  }
  set motorVendor(value) {
    this.setData('motorVendor', value);
  }

  get motorVoltage() {
    return this.data.motorVoltage;
  }
  set motorVoltage(value) {
    this.setData('motorVoltage', value);
  }

  get motorPhase() {
    return this.data.motorPhase;
  }
  set motorPhase(value) {
    this.setData('motorPhase', value);
  }

  get guideRail() {
    return this.data.guideRail;
  }
  set guideRail(value) {
    this.setData('guideRail', value);
  }

  get guideRailImg() {
    if (!this.data.guideRail) {
      return undefined;
    }

    return createAssetUrl(this.data.guideRail);
  }

  get guideRailThickness() {
    return this.data.guideRailThickness;
  }
  set guideRailThickness(value) {
    this.setData('guideRailThickness', value);
  }

  get hasSilencingStrip() {
    return this.data.hasSilencingStrip;
  }
  set hasSilencingStrip(value) {
    this.setData('hasSilencingStrip', value);
  }

  get isULGuideRail() {
    return this.data.isULGuideRail;
  }
  set isULGuideRail(value) {
    this.setData('isULGuideRail', value);
  }

  get isIntegratedHeadBox() {
    return this.data.isIntegratedHeadBox;
  }
  set isIntegratedHeadBox(value) {
    this.setData('isIntegratedHeadBox', value);
  }

  get headBoxThickness() {
    return this.data.headBoxThickness;
  }
  set headBoxThickness(value) {
    this.setData('headBoxThickness', value);
  }

  get isAntiTyphoon() {
    return this.data.isAntiTyphoon;
  }
  set isAntiTyphoon(value) {
    this.setData('isAntiTyphoon', value);
  }

  get bounceDoorWidth() {
    return this.data.bounceDoorWidth;
  }
  set bounceDoorWidth(value) {
    this.setData('bounceDoorWidth', value);
    this.setData('bounceDoor', !!value);
  }

  get closingType() {
    return this.data.closingType;
  }
  set closingType(value) {
    this.setData('closingType', value);
  }

  get notes() {
    return this.data.notes;
  }
  set notes(value) {
    this.setData('notes', value);
  }

  get bottomBarAngleIron() {
    return this.data.bottomBarAngleIron;
  }
  set bottomBarAngleIron(value) {
    this.setData('bottomBarAngleIron', value);
  }

  get bottomBarPlate() {
    return this.data.bottomBarPlate;
  }
  set bottomBarPlate(value) {
    this.setData('bottomBarPlate', value);
  }

  get quantity() {
    return this.data.quantity;
  }
  set quantity(value) {
    this.setData('quantity', value);
  }

  get unitPrice() {
    return this.data.unitPrice;
  }
  set unitPrice(value) {
    this.setData('unitPrice', value);
  }

  get totalPrice() {
    return this.data.totalPrice;
  }
  set totalPrice(value) {
    this.setData('totalPrice', value);
  }

  get price() {
    return this.data.price;
  }
  set price(value) {
    this.setData('price', value);
  }

  get dualPrice() {
    return this.data.dualPrice;
  }
  set dualPrice(value) {
    this.setData('dualPrice', value);
  }

  //  endregion  輸出
  // -----------------------------------------------------------------------------------
} // ClassProd_base

// ================================================================================

export { ClassProd_base };
export type { Interface_ClassProd_base };

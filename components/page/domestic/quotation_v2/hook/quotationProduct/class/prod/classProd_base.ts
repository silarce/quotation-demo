import Decimal from 'decimal.js';

import { createAssetUrl } from 'js/api/api_product';

import { TstateProd } from '../../type';

interface Interface_ClassProd_base {
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
}

class ClassProd_base implements Interface_ClassProd_base {
  // MARK: constructor
  constructor({
    stateProd,
    setStateProd,
  }: {
    stateProd: TstateProd;
    setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
  }) {
    this.stateProd = stateProd;
    this.setStateProd = setStateProd;
  } // constructor
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------
  stateProd: TstateProd;
  setStateProd: React.Dispatch<React.SetStateAction<TstateProd>>;
  setProd<K extends keyof TstateProd>(key: K, value: TstateProd[K]) {
    this.setStateProd((prev) => {
      return {
        ...prev,
        [key]: value,
      };
    });
  }
  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // -----------------------------------------------------------------------

  get id() {
    return this.stateProd.id;
  }

  get key() {
    return this.stateProd.key;
  }

  get itemName() {
    return this.stateProd.itemName;
  }
  set itemName(value) {
    this.setProd('itemName', value);
  }

  get discount() {
    return this.stateProd.discount;
  }
  set discount(value) {
    this.setProd('discount', value);
  }

  get quoteType() {
    return this.stateProd.quoteType;
  }
  set quoteType(value) {
    this.setProd('quoteType', value);
  }

  get doorModelName() {
    return this.stateProd.doorModelName;
  }
  set doorModelName(value) {
    this.setProd('doorModelName', value);
  }

  get fullWidth() {
    return this.stateProd.fullWidth;
  }
  set fullWidth(value) {
    this.setProd('fullWidth', value);
  }
  get fullWidth_mm() {
    return new Decimal(this.stateProd.fullWidth).mul(1000).toNumber();
  }

  get WG() {
    return this.stateProd.WG;
  }
  set WG(value) {
    this.setProd('WG', value);
  }
  get WG_mm() {
    return new Decimal(this.stateProd.WG).mul(1000).toNumber();
  }

  get height() {
    return this.stateProd.height;
  }
  set height(value) {
    this.setProd('height', value);
  }
  get height_mm() {
    return new Decimal(this.stateProd.height).mul(1000).toNumber();
  }

  get boxB() {
    return this.stateProd.boxB;
  }
  set boxB(value) {
    this.setProd('boxB', value);
  }
  get boxB_mm() {
    return new Decimal(this.stateProd.boxB).mul(1000).toNumber();
  }

  get boxD() {
    return this.stateProd.boxD;
  }
  set boxD(value) {
    this.setProd('boxD', value);
  }
  get boxD_mm() {
    return new Decimal(this.stateProd.boxD).mul(1000).toNumber();
  }

  get area() {
    return this.stateProd.area ?? '';
  }

  get volume() {
    return this.stateProd.volume ?? '';
  }

  get materialName() {
    return this.stateProd.materialName;
  }
  set materialName(value) {
    this.setProd('materialName', value);
  }

  get materialSurface() {
    return this.stateProd.materialSurface;
  }
  set materialSurface(value) {
    this.setProd('materialSurface', value);
  }

  get horsepower() {
    return this.stateProd.horsepower;
  }
  set horsepower(value) {
    this.setProd('horsepower', value);
  }

  get motorVendor() {
    return this.stateProd.motorVendor;
  }
  set motorVendor(value) {
    this.setProd('motorVendor', value);
  }

  get motorVoltage() {
    return this.stateProd.motorVoltage;
  }
  set motorVoltage(value) {
    this.setProd('motorVoltage', value);
  }

  get motorPhase() {
    return this.stateProd.motorPhase;
  }
  set motorPhase(value) {
    this.setProd('motorPhase', value);
  }

  get guideRail() {
    return this.stateProd.guideRail;
  }
  set guideRail(value) {
    this.setProd('guideRail', value);
  }

  get guideRailImg() {
    if (!this.stateProd.guideRail) {
      return undefined;
    }

    return createAssetUrl(this.stateProd.guideRail);
  }

  get guideRailThickness() {
    return this.stateProd.guideRailThickness;
  }
  set guideRailThickness(value) {
    this.setProd('guideRailThickness', value);
  }

  get hasSilencingStrip() {
    return this.stateProd.hasSilencingStrip;
  }
  set hasSilencingStrip(value) {
    this.setProd('hasSilencingStrip', value);
  }

  get isULGuideRail() {
    return this.stateProd.isULGuideRail;
  }
  set isULGuideRail(value) {
    this.setProd('isULGuideRail', value);
  }

  get isIntegratedHeadBox() {
    return this.stateProd.isIntegratedHeadBox;
  }
  set isIntegratedHeadBox(value) {
    this.setProd('isIntegratedHeadBox', value);
  }

  get headBoxThickness() {
    return this.stateProd.headBoxThickness;
  }
  set headBoxThickness(value) {
    this.setProd('headBoxThickness', value);
  }

  get isAntiTyphoon() {
    return this.stateProd.isAntiTyphoon;
  }
  set isAntiTyphoon(value) {
    this.setProd('isAntiTyphoon', value);
  }

  get bounceDoorWidth() {
    return this.stateProd.bounceDoorWidth;
  }
  set bounceDoorWidth(value) {
    this.setProd('bounceDoorWidth', value);
    this.setProd('bounceDoor', !!value);
  }

  get closingType() {
    return this.stateProd.closingType;
  }
  set closingType(value) {
    this.setProd('closingType', value);
  }

  get notes() {
    return this.stateProd.notes;
  }
  set notes(value) {
    this.setProd('notes', value);
  }

  get bottomBarAngleIron() {
    return this.stateProd.bottomBarAngleIron;
  }
  set bottomBarAngleIron(value) {
    this.setProd('bottomBarAngleIron', value);
  }

  get bottomBarPlate() {
    return this.stateProd.bottomBarPlate;
  }
  set bottomBarPlate(value) {
    this.setProd('bottomBarPlate', value);
  }

  get quantity() {
    return this.stateProd.quantity;
  }
  set quantity(value) {
    this.setProd('quantity', value);
  }

  get unitPrice() {
    return this.stateProd.unitPrice;
  }
  set unitPrice(value) {
    this.setProd('unitPrice', value);
  }

  get totalPrice() {
    return this.stateProd.totalPrice;
  }
  set totalPrice(value) {
    this.setProd('totalPrice', value);
  }

  get price() {
    return this.stateProd.price;
  }
  set price(value) {
    this.setProd('price', value);
  }

  get dualPrice() {
    return this.stateProd.dualPrice;
  }
  set dualPrice(value) {
    this.setProd('dualPrice', value);
  }
} // ClassProd_base

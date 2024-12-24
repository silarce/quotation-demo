// DTO
import {
  //
  TdoorModelInfoDto,
  //
  TdoorGeneralSpecsDto,
  TdoorComponentListDto,
  TgenerateDoorProductBomDto,
  //
  // TdoorComponentType的內容
  // slat bottomBar guideRail sidePlate roller motor
  // motorAccessories headBox middlePillar backBone
  TdoorComponentType, // 材料配件的類型，字串
  //
  TdoorSlatDto,
  TdoorBottomBarDto,
  TdoorGuideRailDto,
  TdoorSidePlateDto,
  TdoorRollerDto,
  TdoorMotorDto,
  TdoorMotorAccessoriesDto,
  TdoorHeadBoxDto,
  TdoorMiddlePillarDto,
  TdoorBackBoneDto,
  //
  TdoorAccessoryDto,
  //
  //
  Tcurrency,
  TdoorModel,
  TdoorProductBomDto,
  TdoorBomDto_Component,
} from 'js/api/dtoTypes';

// ========================================================================

// MARK:PROD
interface TstateProdData {
  //
  readonly id: string | null | undefined;
  // 項目名
  itemName: string;
  // 折數
  discount: string;
  // 報價別
  quoteType: string;
  //
  // 這兩個作法太複雜了
  // doorModelName: TdoorModel | string;
  // doorModelName: P['isSpecialDoor'] extends true ? string : TdoorModel;
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
  area: `${number}` | '' | null;
  // 才數 (台制單位，代表面積) 浮點數
  volume: `${number}` | '' | null;

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
  // 門軌厚度 浮點數
  // guideRailThickness: `${number}` | null;
  guideRailThickness: `${number}` | '';
  // 門軌消音條
  hasSilencingStrip: boolean | null;
  // guideRailG為門軌的width
  // guideRailG是指單邊門軌的寬度。要注意，在工務部，G是指兩邊門軌寬度的總和。
  guideRailG: number | null;
  // 門軌UL
  isULGuideRail: boolean | null;

  // 馬達支撐架
  hasMotorSupportStand: boolean | null;
  // 底座類型 // 實際上似乎都是送空字串?
  bottomBar: string | null; // 鋁障感 | 止水型 | ''
  // 馬達鎖盒
  motorLockBox: string | null;
  // 一體式捲箱
  isIntegratedHeadBox: boolean | null;
  // 捲箱厚度 浮點數
  headBoxThickness: `${number}` | null;

  // 防颱
  isAntiTyphoon: boolean | null;

  // 彈射門
  bounceDoor: boolean | null;
  // 彈射門寬度(公尺)
  bounceDoorWidth: `${number}` | '';
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

  // W 這些要做成component
  // 配電箱牌價
  distributionBoxPrice: `${number}` | '';
  // 配電箱單價
  distributionBoxUnitPrice: `${number}` | '';
  // 配電箱數量
  distributionBoxQuantity: `${number}` | '';
  // 配電箱牌價複價
  distributionBoxDualPrice: `${number}` | '';
  // 配電箱複價
  distributionBoxTotalPrice: `${number}` | '';

  // 安裝費牌價
  installationFeePrice: `${number}` | '';
  // 安裝費牌價複價
  installationFeeDualPrice: `${number}` | '';
  // 安裝費數量
  installationFeeQuantity: `${number}` | '';
  // 安裝費單價
  installationFeeUnitPrice: `${number}` | '';
  // 安裝費複價
  installationFeeTotalPrice: `${number}` | '';
  // W 這些要做成component

  //
  // 門片 - 捲片支數 // 從apiGetProdCalcDetailSpec取得
  slatCount: `${number}` | null;
  // 底座 - 開口 // 從doorModel.guideRails取得
  guideRailsOpening: string | null;

  // 以下這些東西會從 get /products/door/calc-general-spec 取得
  gapA: `${number}` | '';
  gapC: `${number}` | '';
  gearNumber: string | null;
  weight: string | null;
  // 門片厚度 浮點數
  thickness: `${number}` | '';
  // 鏈齒輪 - 鏈齒輪番號
  sprocketWheelModel: string | null;
  // 鏈齒輪 - 大鏈輪
  sprocketWheelTeethNumber: string | null;
  // 可能為鍊條數量
  sprocketWheelChains: `${number}` | null;
  // 鏈齒輪/捲軸 - 孔徑/軸徑
  bearingInnerDiameter: string | null;
  // 捲軸 - 尺寸
  diameter: `${number}` | null;
  // 捲軸 - 總長
  bearingHousingTotalLength: `${number}` | null;
  // 門片長度
  slatLength: number | null;
  // 門軌長度
  guideRailLength: number | null;
  // 捲箱長度
  headBoxLength: number | null;
  // 軸承座寸法
  bearingHousingSize: number | null;
  // 軸承
  bearingName: string | null;
  // 以上這些東西會從 get /products/door/calc-general-spec 取得

  // 數量
  quantity: `${number}` | '';
  // 牌價
  price: `${number}` | '';
  // 牌價複價
  dualPrice: `${number}` | '';
  // 單價
  unitPrice: `${number}` | '';
  // 複價
  totalPrice: `${number}` | '';

  // 排序
  order?: number;

  // 來源產品Id
  attachedToProductId?: string | null;
  // 源頭產品
  // 實際上可能為null，運作正常的話預期不會為null。若為null代表有問題，要跟後端討論
  rootProductId: string;
}

// ========================================================================

// region COMPONENT

// 確保key是TdoorComponentType
type TcomponentRawDataDict = {
  [K in TdoorComponentType]: K extends 'slat'
    ? TdoorSlatDto
    : K extends 'bottomBar'
    ? TdoorBottomBarDto
    : K extends 'guideRail'
    ? TdoorGuideRailDto
    : K extends 'sidePlate'
    ? TdoorSidePlateDto
    : K extends 'roller'
    ? TdoorRollerDto
    : K extends 'motor'
    ? TdoorMotorDto
    : K extends 'motorAccessories'
    ? TdoorMotorAccessoriesDto
    : K extends 'headBox'
    ? TdoorHeadBoxDto
    : K extends 'middlePillar'
    ? TdoorMiddlePillarDto
    : K extends 'backBone'
    ? TdoorBackBoneDto
    : never;
};

interface TstateComponentData<T extends keyof TcomponentRawDataDict> {
  type: T;
  renderCount?: number;
  //
  shouldInit?: boolean; // 是否初始化
  // 輸出
  number: string | undefined; // 代號 來自於 door/generate-door-product-bom
  desc: string; // 說明
  material: string; // 材料
  materialSurface: string | null; // 表面
  density: `${number}` | null; // 重量基重
  isPainted: boolean; // 烤漆
  quantity: `${number}` | ''; // 數量
  price: `${number}` | ''; // 牌價

  //
  bom?: TdoorBomDto_Component['bom'];
  componentId?: string;
  rawData: TcomponentRawDataDict[T] | null; // 來自於availableComponent的資料
  //
  optionalComponent?: TcomponentRawDataDict[T][] | null; // 來自於availableComponent的資料

  // 這幾個寫在class裡面,考慮要不要在class的建構函式把這些資料寫進state
  // name: string; // 名稱
  // unit: string; // 單位 //要送到excel，不可以用ReactNode // 平方公尺可以用unicode處理 // ㎡或m²
  // dualPrice: number; // 牌價複價 // 虛值
  // unitPrice: `${number}` | ''; // 單價 = 牌價 * 主產品折數 * 總折數 // 虛值
  // totalPrice: number; // 複價 = 單價 * 數量 // 虛值

  //
}

type Tdata_componentDict = {
  [key in TdoorComponentType]?: TstateComponentData<key>;
  // slat?: TstateComponentData<'slat'>;
  // bottomBar?: TstateComponentData<'bottomBar'>;
  // guideRail?: TstateComponentData<'guideRail'>;
  // sidePlate?: TstateComponentData<'sidePlate'>;
  // roller?: TstateComponentData<'roller'>;
  // motor?: TstateComponentData<'motor'>;
  // motorAccessories?: TstateComponentData<'motorAccessories'>;
  // headBox?: TstateComponentData<'headBox'>;
  // middlePillar?: TstateComponentData<'middlePillar'>;
  // backBone?: TstateComponentData<'backBone'>;
};

// ========================================================================

// MARK:ACCESSORY

interface TstateAccessoryData {
  codeName: string; //選配的id，也就是TdoorAccessoryDto.id
  name: string; //名稱
  unit: string; // 單位
  quantity: `${number}` | ''; // 數量
  unitPrice: `${number}` | ''; // 單價
  totalPrice: `${number}` | ''; // 複價
  originalPrice?: number | undefined;
  price: `${number}` | ''; // 牌價
  dualPrice: `${number}` | ''; // 牌價複價
  order: number;
  referenceSpec: string | null;
}

interface Tdata_accessoryDict {
  [key: string]: TstateAccessoryData;
}

// ========================================================================

// MARK: TstateProd
interface TstateProd {
  readonly key: string;
  renderCount?: number;

  data_prod: TstateProdData;

  data_componentDict: Tdata_componentDict;
  componentKeyArr: TdoorComponentType[];

  data_accessoryDict: Tdata_accessoryDict;
  accessoryKeyArr: string[];

  doorModel: TdoorModelInfoDto | null; // 若為null，基本上就是特殊門

  generalSpecs: TdoorGeneralSpecsDto | undefined | null; // undefined視為未曾初始化
  availableComponents: TdoorComponentListDto | undefined | null; // undefined視為未曾初始化
  generateDoorProductBom?: TdoorProductBomDto | undefined | null;
  //
  isFetching?: boolean;
  afterChangeQueue?: string[];
}

interface TstateProdDict {
  [key: string]: TstateProd;
}

//控制TstateProd
type TsetProd = React.Dispatch<React.SetStateAction<TstateProd>>;
// 控制data_componentDict[T]
type TsetComponent<T extends keyof Tdata_componentDict> = //
  React.Dispatch<React.SetStateAction<Tdata_componentDict[T]>>;

type TsetAccessory = React.Dispatch<React.SetStateAction<TstateAccessoryData>>;

// ===========================================================================

interface TstateTotalPrice {
  prodPriceTotal: number; // 後端沒有

  //
  // quotationDiscount: `${number}` | ''; // 總折數 // 這個折數會作用在每個主產品上
  averageDiscount: number; // 平均折數 // 浮點數

  tuneTotal: `${number}` | ''; // 小計調整

  subTotal: number; //小計
  salesTax: number; // 營業稅
  total: number; //總計

  currency: Tcurrency; // 幣別
  exchangeRate: `${number}` | ''; // 匯率(外幣兌新台幣)
  foreignTotal: `${number}` | ''; // 外幣計價
}

type Tstate_quotaionDiscount = `${number}` | ''; // 總折數 // 這個折數會作用在每個主產品上

// ===========================================================================
export type {
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
  //
  TstateAccessoryData,
  TsetAccessory,
  //
  //
  //
  TstateTotalPrice,
  Tstate_quotaionDiscount,
};

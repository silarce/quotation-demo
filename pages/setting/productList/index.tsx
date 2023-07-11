// 產品列表
// 產品列表
// 產品列表
import { useState } from 'react';

// layer
import SubLayer from 'components/Layer/SubLayer/SubLayer';

// component
import FilterPanel from 'components/page/setting/productList/filterPanel/filterPanel';

import ProductList_table_02 from 'components/page/setting/productList/productList_Table_02';
import TabBar from 'components/page/setting/productList/tabBar';

// glogal gear
import PageHeader02, { TpanelList } from 'components/PageHeader/PageHeader02/PageHeader02';

// scss
import scss from './productList.module.scss';

// ==============================================================================
export default function ProductList() {
  // ---------------------------------------------------------------------------
  const [checkedProdClass, setCheckedProdClass] = useState<TprodClassValues[]>([]);
  const [checkedDoorType, setCheckedDoorType] = useState<TdoorTypeValues[]>([]);
  const [checkedPart, setCheckedPart] = useState<TpartValues[]>([]);
  // 因為要按下篩選按鈕才做篩選的行為，所以要另外建立一個狀態
  const [filterParams, setFilterParams] = useState({
    checkedProdClass: [...checkedProdClass],
    checkedDoorType: [...checkedDoorType],
    checkedPart: [...checkedPart],
  });

  const [tabQuery, setTabQuery] = useState<
    'base' | 'rollDoorPiece' | 'doorTrack' | 'supportPlate' | 'reel' | 'motor' | 'motorParts' | 'reelBox'
  >('base');
  const switchTab = (query: typeof tabQuery) => setTabQuery(query);

  console.log(filterParams);

  // 點擊類別的checkBox
  const checkProdClass = (value: TprodClassValues) => {
    const valueIndex = checkedProdClass.findIndex((item) => item === value);

    if (valueIndex === -1) {
      checkedProdClass.push(value);
    } else {
      checkedProdClass.splice(valueIndex, 1);
    }

    setCheckedProdClass([...checkedProdClass]);
  };

  // 點擊門型的checkBox
  const checkDoorType = (value: TdoorTypeValues) => {
    const valueIndex = checkedDoorType.findIndex((item) => item === value);

    if (valueIndex === -1) {
      checkedDoorType.push(value);
    } else {
      checkedDoorType.splice(valueIndex, 1);
    }

    setCheckedDoorType([...checkedDoorType]);
  };

  // 點擊顯示條件的checkBox
  const checkPark = (value: TpartValues) => {
    const valueIndex = checkedPart.findIndex((item) => item === value);

    if (valueIndex === -1) {
      checkedPart.push(value);
    } else {
      checkedPart.splice(valueIndex, 1);
    }

    setCheckedPart([...checkedPart]);
  };

  // 篩選按鈕
  const filterConfirm = () => {
    setFilterParams({
      checkedProdClass: [...checkedProdClass],
      checkedDoorType: [...checkedDoorType],
      checkedPart: [...checkedPart],
    });
  };

  // 清除按鈕
  const filterClear = () => {
    setCheckedProdClass([]);
    setCheckedDoorType([]);
    setCheckedPart([]);
    setFilterParams({
      checkedProdClass: [],
      checkedDoorType: [],
      checkedPart: [],
    });
  };

  // 打包起來送進FilterPanel
  const filterCtrl: TfilterCtrl = {
    checkedProdClass,
    checkProdClass,
    checkedDoorType,
    checkDoorType,
    checkedPart,
    checkPark,
    filterConfirm,
    filterClear,
  };

  // // 送到ProductList_Table裡面做篩選
  // const doFilter = (data: TfakeData) => {
  //   const { checkedProdClass, checkedDoorType, checkedPart } = filterParams;
  //   const { prodClass, doorType, part } = data;
  //   let check01 = true;

  //   if (checkedProdClass[0]) {
  //     check01 = !!checkedProdClass.find((item) => item === prodClass);
  //   }

  //   let check02 = true;

  //   if (checkedDoorType[0]) {
  //     check02 = !!checkedDoorType.find((item) => item === doorType);
  //   }

  //   let check03 = true;

  //   if (checkedPart[0]) {
  //     check03 = !!checkedPart.find((item) => item === part);
  //   }

  //   if (check01 && check02 && check03) {
  //     return true;
  //   }

  //   return false;
  // };

  // ---------------------------------------------------------------------------
  const panelList: TpanelList = [
    {
      type: 'inputSearch',
      placeholder: '請輸入搜尋內容',
      onClick: () => {},
    },
  ];

  // ---------------------------------------------------------------------------
  return (
    <SubLayer className={scss.container} bodyClassName={scss.subLayer}>
      <PageHeader02 tag="產品列表" panelList={panelList} />

      <div className={scss.wrapper}>
        <div>
          <FilterPanel
            prodClassOptions={prodClassOptions}
            doorTypeOptions={doorTypeOptions}
            partOptions={partOptions}
            filterCtrl={filterCtrl}
          />
        </div>
        <div className={scss.main}>
          <TabBar query={tabQuery} switchTab={switchTab} />
          <ProductList_table_02 fakeDataArr={fakeDataArr} tabQuery={tabQuery} />
        </div>
      </div>
    </SubLayer>
  );
}

// ==============================================================================
type TprodClassValues =
  | '防火防煙捲門系列'
  | '防水防洪門系列'
  | '抗風防颱捲門系列'
  | '廠辦管制門'
  | '圍牆大門'
  | '機庫門'
  | '客製化';

type TdoorTypeValues = '120A' | 'SJ-312' | 'SJ-302' | 'SJ-303A' | 'SJ-303AS' | 'SJ-305D';

type TpartValues =
  | '支板'
  | '捲門片'
  | '底座'
  | '電動機'
  | '門軌'
  | '配電箱及按鈕開關'
  | '門箱'
  | '安裝費(含送電及試車)'
  | '捲軸';

type TcheckOption<value> = {
  label: string;
  value: value;
};

const prodClassOptions: TcheckOption<TprodClassValues>[] = [
  { label: '防火防煙捲門系列', value: '防火防煙捲門系列' },
  { label: '防水防洪門系列', value: '防水防洪門系列' },
  { label: '抗風防颱捲門系列', value: '抗風防颱捲門系列' },
  { label: '廠辦管制門', value: '廠辦管制門' },
  { label: '圍牆大門', value: '圍牆大門' },
  { label: '機庫門', value: '機庫門' },
  { label: '客製化', value: '客製化' },
];
const doorTypeOptions: TcheckOption<TdoorTypeValues>[] = [
  { label: '120A', value: '120A' },
  { label: 'SJ-312', value: 'SJ-312' },
  { label: 'SJ-302', value: 'SJ-302' },
  { label: 'SJ-303A', value: 'SJ-303A' },
  { label: 'SJ-303AS', value: 'SJ-303AS' },
  { label: 'SJ-305D', value: 'SJ-305D' },
];
const partOptions: TcheckOption<TpartValues>[] = [
  { label: '支板', value: '支板' },
  { label: '底座', value: '底座' },
  { label: '門軌', value: '門軌' },
  { label: '門箱', value: '門箱' },
  { label: '捲軸', value: '捲軸' },
  { label: '捲門片', value: '捲門片' },
  { label: '電動機', value: '電動機' },
  { label: '配電箱及按鈕開關', value: '配電箱及按鈕開關' },
  { label: '安裝費(含送電及試車)', value: '安裝費(含送電及試車)' },
];

// ==============================================================================

export type TprodClassOptions = typeof prodClassOptions;
export type TdoorTypeOptions = typeof doorTypeOptions;
export type TpartOptions = typeof partOptions;

export type TfilterCtrl = {
  checkedProdClass: TprodClassValues[];
  checkProdClass: (value: TprodClassValues) => void;
  checkedDoorType: TdoorTypeValues[];
  checkDoorType: (value: TdoorTypeValues) => void;
  checkedPart: TpartValues[];
  checkPark: (value: TpartValues) => void;
  filterConfirm: () => void;
  filterClear: () => void;
};

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

// export type TfakeData = {
//   prodClass: string;
//   doorType: string;
//   part: string;
//   name: string;
//   // breach: string // 底座角鐵開口
//   length: number;
//   caliber: number; // 口徑
//   thickness: string; //厚度
//   expandHeight: number; //展開門片高
//   densityRatio: number; // 密度比
// };

export type TfakeData = {
  doorType: string; // 門型 // SH-303AS
  prodClass: string; // 類別 防火防煙捲門系列
  base: TfakeBase; // 底座
  rollDoorPiece: TfakeRollDoorPiece; // 捲門片
  doorTrack: TfakeDoorTrack; // 門軌
  supportPlate: TfakeSupportPlate; // 支板
  reel: TfakeReel; // 捲軸
  motor: TfakeMotor; // 電動機
  motorParts: TfakeMotorParts; // 電動機配件
  reelBox: TfakeReelBox; // 捲箱
};

// 底座
export type TfakeBase = {
  // name: '底座'; // 類型
  type01: string; // 形式1
  type02: string | undefined; // 形式2
  surface: boolean; // 表面
};
// 捲門片
export type TfakeRollDoorPiece = {
  // name: '捲門片'; // 類型
  type: string; // 型式
  surface: boolean; // 表面
  material: string; // 材質
  thickness: string | undefined; // 厚度
};

// 門軌
export type TfakeDoorTrack = {
  // name: '門軌'; // 類型
  type: string; // 型式
  surface: boolean; // 表面
  material: string; // 材質
  thickness: string | undefined; // 厚度
  noiseStrip: boolean; //消音條
};

// 支板
export type TfakeSupportPlate = {
  // name: '支板'; // 類型
  chainGearNumber: string; // 鏈齒輪番號
  reelBoxType: string; // 捲箱型式
  supplier: string | undefined; // 廠商 供應商
  maxMotorWeight: string | undefined; // 最大馬達重量
  minMotorWeight: string | undefined; // 最小馬達重量
  horsepower: string | undefined; // 馬力數
};

// 捲軸
export type TfakeReel = {
  // name: '捲軸'; // 類型
  size: string; // 捲軸尺寸
  bearing: string | undefined; // 軸承
};

// 電動機
export type TfakeMotor = {
  // name: '電動機'; // 類型
  horsepower: string; // 馬力數
  weight: string; // 重量
  supportFrame: boolean; // 支撐架
  powerSupplier: string | undefined; // 電供
  voltage: string | undefined; // 電壓
  chainGearNumber: string; // 鏈齒輪番號
  supplier: string; // 廠商 供應商
};

// 馬達配件
export type TfakeMotorParts = {
  // name: '馬達配件'; // 類型
  chain: string; // 鏈條
  lockCase: string; // 鎖盒
  bearing: string; // 軸承
};

// 捲箱
export type TfakeReelBox = {
  // name: '捲箱'; // 類型
  thickness: string; // 厚度
  surface: boolean; // 表面
  material: string; // 材質
  front: string; // 前面
  back: string; // 後面
  type: string; // 捲箱型式
};

const fakeDate2: TfakeData = {
  doorType: 'SH-303AS',
  prodClass: '防火防煙捲門系列',
  base: {
    type01: '一般型',
    type02: undefined,
    surface: false,
  },
  rollDoorPiece: {
    type: '一般型',
    surface: false,
    material: '鍍鋅鋼板(1.5t)',
    thickness: '1.5t',
  },
  doorTrack: {
    type: '一般型',
    surface: true,
    material: '鍍鋅鋼板(1.5t)',
    thickness: '1.5t',
    noiseStrip: false,
  },
  supportPlate: {
    chainGearNumber: '#530',
    reelBoxType: '捲箱',
    supplier: undefined,
    maxMotorWeight: undefined,
    minMotorWeight: undefined,
    horsepower: undefined,
  },
  reel: {
    size: '5',
    bearing: undefined,
  },
  motor: {
    horsepower: '1/4HP',
    weight: '300KG',
    supportFrame: false,
    powerSupplier: undefined,
    voltage: undefined,
    chainGearNumber: '#640',
    supplier: '大同',
  },
  motorParts: {
    chain: '單排',
    lockCase: '外露式',
    bearing: '#6208',
  },
  reelBox: {
    thickness: '0.8T',
    surface: true,
    material: '鍍鋅鋼板',
    front: '正雲白',
    back: '正乳白',
    type: '捲箱',
  },
};

const fakeDataArr: TfakeData[] = [
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
  fakeDate2,
];

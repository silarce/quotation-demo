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

export type TcheckOption = {
  label: string;
  value: string;
};

// ==============================================================================
export default function ProductList() {
  // ---------------------------------------------------------------------------
  const [checkedProdClass, setCheckedProdClass] = useState<string[]>([]);
  const [checkedDoorType, setCheckedDoorType] = useState<string[]>([]);
  const [checkedPart, setCheckedPart] = useState<string[]>([]);
  // 因為要按下篩選按鈕才做篩選的行為，所以要另外建立一個狀態
  const [filterParams, setFilterParams] = useState({
    checkedProdClass: [...checkedProdClass],
    checkedDoorType: [...checkedDoorType],
    checkedPart: [...checkedPart],
  });

  const [tabQuery, setTabQuery] = useState<
    'base' | 'rollDoorPiece' | 'doorTrack' | 'supportPlate' | 'reel' | 'motor' | 'motorParts' | 'reelBox'
  >();
  const switchTab = (query: typeof tabQuery) => setTabQuery(query);

  // 點擊類別的checkBox
  const checkProdClass = (value: string) => {
    const valueIndex = checkedProdClass.findIndex((item) => item === value);

    if (valueIndex === -1) {
      checkedProdClass.push(value);
    } else {
      checkedProdClass.splice(valueIndex, 1);
    }

    setCheckedProdClass([...checkedProdClass]);
  };

  // 點擊門型的checkBox
  const checkDoorType = (value: string) => {
    const valueIndex = checkedDoorType.findIndex((item) => item === value);

    if (valueIndex === -1) {
      checkedDoorType.push(value);
    } else {
      checkedDoorType.splice(valueIndex, 1);
    }

    setCheckedDoorType([...checkedDoorType]);
  };

  // 點擊顯示條件的checkBox
  const checkPark = (value: string) => {
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
    setTabQuery(checkedPart[0] as typeof tabQuery);
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
  const tabArr: TcheckOption[] = [];
  filterParams.checkedPart.forEach((item) => {
    const tab = partOptions.find((option) => {
      return option.value === item;
    });
    tab && tabArr.push(tab);
  });

  // ---------------------------------------------------------------------------
  return (
    <SubLayer className={scss.container} bodyClassName={scss.subLayer}>
      <PageHeader02 tag="產品列表" panelList={panelList} />

      <div className={scss.wrapper}>
        <FilterPanel
          prodClassOptions={prodClassOptions}
          doorTypeOptions={doorTypeOptions}
          partOptions={partOptions}
          filterCtrl={filterCtrl}
        />

        <div className={scss.main}>
          <TabBar query={tabQuery} tabArr={tabArr} switchTab={switchTab} />
          {tabQuery && (
            <ProductList_table_02 fakeDataArr={fakeDataArr} tabQuery={tabQuery} filterParams={filterParams} />
          )}
        </div>
      </div>
    </SubLayer>
  );
}

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

const prodClassOptions: TcheckOption[] = [
  { label: '防火防煙捲門系列', value: '防火防煙捲門系列' },
  { label: '防水防洪門系列', value: '防水防洪門系列' },
  { label: '抗風防颱捲門系列', value: '抗風防颱捲門系列' },
  { label: '廠辦管制門', value: '廠辦管制門' },
  { label: '圍牆大門', value: '圍牆大門' },
  { label: '機庫門', value: '機庫門' },
  { label: '客製化', value: '客製化' },
];
const doorTypeOptions: TcheckOption[] = [
  { label: '120A', value: '120A' },
  { label: 'SJ-312', value: 'SJ-312' },
  { label: 'SJ-302', value: 'SJ-302' },
  { label: 'SJ-303A', value: 'SJ-303A' },
  { label: 'SJ-303AS', value: 'SJ-303AS' },
  { label: 'SJ-305D', value: 'SJ-305D' },
];
const partOptions: TcheckOption[] = [
  { label: '支板', value: 'supportPlate' },
  { label: '底座', value: 'base' },
  { label: '門軌', value: 'doorTrack' },
  { label: '捲軸', value: 'reel' },
  { label: '捲箱', value: 'reelBox' },
  { label: '電動機', value: 'motor' },
  { label: '電動機配件', value: 'motorParts' },
  { label: '捲門片', value: 'rollDoorPiece' },
  { label: '捲門材質', value: 'rollDoorMaterial' },
  // { label: '門箱', value: '門箱' },
  // { label: '配電箱及按鈕開關', value: '配電箱及按鈕開關' },
  // { label: '安裝費(含送電及試車)', value: '安裝費(含送電及試車)' },
];

// ==============================================================================

export type TprodClassOptions = typeof prodClassOptions;
export type TdoorTypeOptions = typeof doorTypeOptions;
export type TpartOptions = typeof partOptions;

export type TfilterCtrl = {
  checkedProdClass: string[];
  checkProdClass: (value: string) => void;
  checkedDoorType: string[];
  checkDoorType: (value: string) => void;
  checkedPart: string[];
  checkPark: (value: string) => void;
  filterConfirm: () => void;
  filterClear: () => void;
};

// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================
// ==============================================================================

export type TfakeData = {
  doorType: string; // 門型 // SH-303AS
  prodClass: string; // 類別 防火防煙捲門系列
  base: TfakeBase; // 底座
  rollDoorPiece: TfakeRollDoorPiece; // 捲門片
  doorTrack: TfakeDoorTrack; // 門軌
  supportPlate: TfakeSupportPlate; // 支板
  reel: TfakeReel; // 捲軸
  motor: TfakeMotor; // 電動機
  motorParts: TfakeMotorParts; // 馬達配件
  reelBox: TfakeReelBox; // 捲箱
  rollDoorMaterial: TfakeRollDoorMaterial; // 捲門材質
};

// 底座
export type TfakeBase = {
  // name: '底座'; // 類型
  type01: string; // 形式1
  type02: string | undefined; // 形式2
  paint: string | undefined; // 烤漆
  // surface: boolean; // 表面
  material: string; // 材質
};
// 捲門片
export type TfakeRollDoorPiece = {
  // name: '捲門片'; // 類型
  type: string; // 型式
  paint: string | undefined; // 烤漆
  // surface: boolean; // 表面
  // material: string; // 材質
  // thickness: string | undefined; // 厚度
};
// 捲門材質
export type TfakeRollDoorMaterial = {
  material: string; // 材質
  thickness: string | undefined; // 厚度
};

// 門軌
export type TfakeDoorTrack = {
  // name: '門軌'; // 類型
  type01: string; // 型式
  // surface: boolean; // 表面
  paint: string | undefined; // 烤漆
  noiseStrip: boolean; //消音條
  thickness: string | undefined; // 厚度
  material: string; // 材質
};

// 支板
export type TfakeSupportPlate = {
  // name: '支板'; // 類型
  // chainGearNumber: string; // 鏈齒輪番號
  // supplier: string | undefined; // 廠商 供應商
  // maxMotorWeight: string | undefined; // 最大馬達重量
  // minMotorWeight: string | undefined; // 最小馬達重量
  // horsepower: string | undefined; // 馬力數
  bearing: string; // 軸承
  chain: string; // 鍊條
  reelBoxType: string; // 捲箱型式
};

// 捲軸
export type TfakeReel = {
  // name: '捲軸'; // 類型
  size: string; // 捲軸尺寸
  // bearing: string | undefined; // 軸承
  haveConvex: boolean;
};

// 電動機
export type TfakeMotor = {
  // name: '電動機'; // 類型
  horsepower: string; // 馬力數
  weight: string; // 重量
  supportFrame: boolean; // 支撐架
  powerSupplier: string; // 電供
  voltage: string; // 電壓
  chain: string; // 鍊條
  // chainGearNumber: string; // 鏈齒輪番號
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
  paint: string; // 烤漆
  front: string; // 前面
  // surface: boolean; // 表面
  // back: string; // 正面
  type: string; // 捲箱型式
  thickness: string; // 厚度
  material: string; // 材質
};

const fakeDate2: TfakeData = {
  doorType: 'SJ-302',
  prodClass: '防火防煙捲門系列',
  base: {
    type01: '一般型',
    type02: undefined,
    // surface: false,
    paint: '一般烤',
    material: '鍍鋅鋼板',
  },
  rollDoorPiece: {
    type: '一般型',
    paint: '一般烤',
    // surface: false,
    // material: '鍍鋅鋼板(1.5t)',
    // thickness: '1.5t',
  },
  rollDoorMaterial: {
    material: '鍍鋅鋼板',
    thickness: '1.5t',
  },
  doorTrack: {
    type01: '一般型',
    // surface: true,
    paint: '一般烤',
    material: '鍍鋅鋼板(1.5t)',
    thickness: '1.5t',
    noiseStrip: false,
  },
  supportPlate: {
    bearing: '6208#',
    reelBoxType: '捲箱',
    chain: '#530',
    // chainGearNumber: '#530',
    // supplier: undefined,
    // maxMotorWeight: undefined,
    // minMotorWeight: undefined,
    // horsepower: undefined,
  },
  reel: {
    size: '5',
    // bearing: undefined,
    haveConvex: true,
  },
  motor: {
    horsepower: '1/4HP',
    weight: '300KG',
    supportFrame: false,
    powerSupplier: '單相',
    voltage: '220V',
    // chainGearNumber: '#640',
    chain: '#530',
    supplier: '大同',
  },
  motorParts: {
    chain: '單排',
    lockCase: '外露式',
    bearing: '#6208',
  },
  reelBox: {
    paint: '一般烤',
    thickness: '0.8T',
    // surface: true,
    material: '鍍鋅鋼板',
    front: '正雲白',
    // back: '正乳白',
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

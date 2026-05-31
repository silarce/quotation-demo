import { TassetPath, createAssetUrl } from 'js/api/api_product';
import type {
  TquotationProductItemDto,
  TdoorComponentType,
  TdoorModelInfoDto,
  TdoorAccessoryDto,
  TdoorModel,
} from 'js/api/dtoTypes';
import type { Tdata_componentDict } from 'components/page/domestic/quotation_v2/hook/quotationProduct/type';

type TpariBD = {
  [key: string]:
    | {
        BtoD: {
          [key: string]: string | undefined;
        };
        DtoB: {
          [key: string]: string | undefined;
        };
      }
    | undefined;
};
// 單位為公尺
export const lookup_boxBAndBoxD: TpariBD = {
  'A-001': {
    BtoD: {
      '0.35': '0.56',
      '0.40': '0.60',
      '0.45': '0.65',
      '0.50': '0.75',
      '0.55': '0.80',
      '0.60': '0.90',
    },
    DtoB: {
      '0.56': '0.35',
      '0.60': '0.40',
      '0.65': '0.45',
      '0.75': '0.50',
      '0.80': '0.55',
      '0.90': '0.60',
    },
  },
};

// 配電箱及按鈕開關
export const lookup_distributionBoxPrice: { [key: string]: number | undefined } = {
  '1/4HP': 5940,
  '1/3HP': 5940,
  '1/2HP': 5940,
  '3/4HP': 5940,
  '1HP': 5940,
  '1 1/2HP': 5940,
  '1.5HP': 5940,
  '2HP': 12900,
  '3HP': 12900,
  '5HP': 13500,
};

// 馬力對照表
export const lookup_horsePowerToNumber: { [key: string]: number | undefined } = {
  '1/4HP': 0.25,
  '1/3HP': 0.33,
  '1/2HP': 0.5,
  '3/4HP': 0.75,
  '1HP': 1,
  '1 1/2HP': 1.5,
  '1.5HP': 1.5,
  '2HP': 2,
  '3HP': 3,
  '5HP': 5,
};

// 這些unicode是客製unicode，必須要安裝指定的字型才能看到
// 該字型是天心系統附的，需要安裝的話找會計部怡君
// 門軌unicode查找表
export const lookup_guideRailUnicode: {
  [guideRail: string]: string | undefined;
} = {
  // A-001
  SJ302_30: '\uE010',
  SJ302_75_30t: '\uE013',
  SJ302_90_30t: '\uE013',
  SJ302_95_30t: '\uE016',
  SJ302_95_45t: '\uE016',
  SJ302_60: '\uE011',
  // A-002
  SJ312_106_60t: '\uE014',
  // SJ-305D
  SJ305D_22: '\uE010',
};

export const findGuideRailUnicode = ({ guideRail }: { guideRail: string }) => {
  return lookup_guideRailUnicode[guideRail] || '';
};

export const lookup_hpToGapAGapC = {
  '1/4HP': {
    HPValue: 0.25,
    outputTooth: 9,
    reelGear: 50,
    gapA: 30,
    gapC: 20,
    distributionBoxPrice: 5940,
  },
  '1/3HP': {
    HPValue: 0.3,
    outputTooth: 9,
    reelGear: 50,
    gapA: 40,
    gapC: 20,
    distributionBoxPrice: 5940,
  },
  '1/2HP': {
    HPValue: 0.5,
    outputTooth: 9,
    reelGear: 50,
    gapA: 50,
    gapC: 20,
    distributionBoxPrice: 5940,
  },
  '3/4HP': {
    HPValue: 0.75,
    outputTooth: 9,
    reelGear: 50,
    gapA: 60,
    gapC: 20,
    distributionBoxPrice: 5940,
  },
  '1HP': {
    HPValue: 1,
    outputTooth: 9,
    reelGear: 50,
    gapA: 70,
    gapC: 20,
    distributionBoxPrice: 5940,
  },
  '1 1/2HP': {
    HPValue: 1.5,
    outputTooth: 9,
    reelGear: 60,
    gapA: 70,
    gapC: 20,
    distributionBoxPrice: 5940,
  },
  '1.5HP': {
    HPValue: 1.5,
    outputTooth: 9,
    reelGear: 60,
    gapA: 120,
    gapC: 20,
    distributionBoxPrice: 5940,
  },
  '2HP': {
    HPValue: 2,
    outputTooth: 15,
    reelGear: 60,
    gapA: 120,
    gapC: 20,
    distributionBoxPrice: 12900,
  },
  '3HP': {
    HPValue: 3,
    outputTooth: 15,
    reelGear: 60,
    gapA: 150,
    gapC: 20,
    distributionBoxPrice: 12900,
  },
  '5HP': {
    HPValue: 5,
    outputTooth: 17,
    reelGear: 60,
    gapA: 170,
    gapC: 20,
    distributionBoxPrice: 12900,
  },
  '50Nm': {
    HPValue: 50,
    outputTooth: 17,
    reelGear: 60,
    gapA: 40,
    gapC: 10,
    distributionBoxPrice: undefined, // 價格不知道，
  },
};

export const lookup_motorPhase = {
  '1': '單相',
  '3': '三相',
} as const;

export const lookup_motorPhase_reverse = {
  單相: '1',
  三相: '3',
} as const;

export const lookup_componentConfig = (doorModelName: string) => {
  const slat = doorModelName === 'W2' ? '門片' : '捲門片';

  return {
    slat: {
      name: doorModelName === 'W2' ? '門片' : '捲門片',
      unit: '㎡',
    },
    bottomBar: {
      name: '底座',
      unit: 'M',
    },
    guideRail: {
      name: '門軌',
      unit: 'M',
    },
    sidePlate: {
      name: '支版',
      unit: '組',
    },
    roller: {
      name: '捲軸',
      unit: 'M',
    },
    motor: {
      name: '馬達機',
      unit: '組',
    },
    motorAccessories: {
      name: '馬達配件',
      unit: '組',
    },
    headBox: {
      name: '門箱',
      unit: 'M',
    },
    middlePillar: {
      name: '中柱',
      unit: '支',
    },
    backBone: {
      name: '背撐',
      unit: '支',
    },
  };
};

// ============================================================================
// 寫死門型模板：每筆門型對應 product 預設材質與 8 件 component 預設值。
// 未來新增門型或 component 種類時，僅需在此追加。
// ============================================================================

type TdoorModelTemplateComponent = {
  number: string;
  desc: string;
  price: `${number}`;
  quantity: `${number}`;
};

type TdoorModelTemplate = {
  prodDefault: {
    materialName: string;
    materialSurface: string;
  };
  components: Partial<Record<TdoorComponentType, TdoorModelTemplateComponent>>;
};

export const lookup_doorModelTemplate: Record<string, TdoorModelTemplate> = {
  'A-001': {
    prodDefault: {
      materialName: '鍍鋅鋼板',
      materialSurface: '烤漆',
    },
    components: {
      slat: { number: 'C-102001', desc: '一般門板', price: '3000', quantity: '1' },
      bottomBar: { number: 'C-102002', desc: '底座', price: '1500', quantity: '1' },
      guideRail: { number: 'C-102003', desc: '軌道', price: '2000', quantity: '1' },
      sidePlate: { number: 'C-102004', desc: '側板組', price: '1000', quantity: '1' },
      roller: { number: 'C-102005', desc: '中軸組', price: '2000', quantity: '1' },
      motor: { number: 'C-102006', desc: '馬達', price: '3000', quantity: '1' },
      motorAccessories: { number: 'C-102007', desc: '馬達配件', price: '1000', quantity: '1' },
      headBox: { number: 'C-102008', desc: '馬達箱', price: '1500', quantity: '1' },
    },
  },
  'A-002': {
    prodDefault: {
      materialName: 'SST#304',
      materialSurface: '2B',
    },
    components: {
      slat: { number: 'C-212001', desc: '加厚門版', price: '6000', quantity: '1' },
      bottomBar: { number: 'C-212002', desc: '加厚底座', price: '3000', quantity: '1' },
      guideRail: { number: 'C-212003', desc: '高品質軌道', price: '4000', quantity: '1' },
      sidePlate: { number: 'C-212004', desc: '加厚側板組', price: '2000', quantity: '1' },
      roller: { number: 'C-212005', desc: '高品質中軸組', price: '4000', quantity: '1' },
      motor: { number: 'C-212006', desc: '高扭力馬達', price: '6000', quantity: '1' },
      motorAccessories: { number: 'C-212007', desc: '高扭力馬達配件', price: '2000', quantity: '1' },
      headBox: { number: 'C-212008', desc: '高扭力馬達箱', price: '3000', quantity: '1' },
    },
  },
};

// 寫死的 doorModel 最小資訊集，給 useGlobal_doorModel 注入用
export const lookup_doorModelInfoMinimal: TdoorModelInfoDto[] = Object.keys(lookup_doorModelTemplate).map(
  (name) =>
    ({
      name,
      density: 0,
      guideRails: [],
      thickness: '',
      slatMaterials: [],
    } as unknown as TdoorModelInfoDto)
);

// 取 product 預設材質
export const getProdDefaults = (doorModelName: string) => {
  return (
    lookup_doorModelTemplate[doorModelName]?.prodDefault ?? {
      materialName: '',
      materialSurface: '',
    }
  );
};

// 依模板組出 component dict，material/materialSurface 來自所屬 product 預設
export const createComponentDictFromTemplate = (doorModelName: string): Tdata_componentDict => {
  const template = lookup_doorModelTemplate[doorModelName];

  if (!template) {
    return {};
  }

  const { materialName, materialSurface } = template.prodDefault;
  const dict: Tdata_componentDict = {};
  (Object.keys(template.components) as TdoorComponentType[]).forEach((key) => {
    const tmpl = template.components[key];

    if (!tmpl) {
      return;
    }

    (dict as Record<string, unknown>)[key] = {
      type: key,
      number: tmpl.number,
      desc: tmpl.desc,
      material: materialName,
      materialSurface: materialSurface,
      quantity: tmpl.quantity,
      price: tmpl.price,
    };
  });

  return dict;
};

// 取得門型下所有 component key (用於 componentKeyArr)
export const getDoorModelComponentKeys = (doorModelName: string): TdoorComponentType[] => {
  const template = lookup_doorModelTemplate[doorModelName];

  if (!template) {
    return [];
  }

  return Object.keys(template.components) as TdoorComponentType[];
};

// ============================================================================
// 寫死門型選配（accessory）假資料。API 停用期間供選擇器使用。
// ============================================================================
const _now = '2025-01-01T00:00:00.000Z';

export const lookup_doorAccessoryByModel: Record<string, TdoorAccessoryDto[]> = {
  'A-001': [
    {
      id: 'ACC-302-001',
      createdAt: _now,
      updatedAt: _now,
      doorModelName: 'A-001' as TdoorModel,
      name: '遵導防水條',
      unit: 'M',
      referenceSpec: 'fullWidth',
      cost: 80,
      price: 150,
    },
    {
      id: 'ACC-302-002',
      createdAt: _now,
      updatedAt: _now,
      doorModelName: 'A-001' as TdoorModel,
      name: '門片加厚棒',
      unit: '㎡',
      referenceSpec: 'area',
      cost: 200,
      price: 350,
    },
    {
      id: 'ACC-302-003',
      createdAt: _now,
      updatedAt: _now,
      doorModelName: 'A-001' as TdoorModel,
      name: '遥控器組',
      unit: '組',
      referenceSpec: null,
      cost: 600,
      price: 1200,
    },
    {
      id: 'ACC-302-004',
      createdAt: _now,
      updatedAt: _now,
      doorModelName: 'A-001' as TdoorModel,
      name: '緊急手拉組',
      unit: '組',
      referenceSpec: null,
      cost: 500,
      price: 950,
    },
  ],
  'A-002': [
    {
      id: 'ACC-312-001',
      createdAt: _now,
      updatedAt: _now,
      doorModelName: 'A-002' as TdoorModel,
      name: '防颱補強內條',
      unit: 'M',
      referenceSpec: 'fullWidth',
      cost: 180,
      price: 320,
    },
    {
      id: 'ACC-312-002',
      createdAt: _now,
      updatedAt: _now,
      doorModelName: 'A-002' as TdoorModel,
      name: '加厚門片表面處理',
      unit: '㎡',
      referenceSpec: 'area',
      cost: 280,
      price: 480,
    },
    {
      id: 'ACC-312-003',
      createdAt: _now,
      updatedAt: _now,
      doorModelName: 'A-002' as TdoorModel,
      name: '雙路限位開關',
      unit: '組',
      referenceSpec: null,
      cost: 800,
      price: 1600,
    },
  ],
};

import _ from 'lodash';

// antd
import { Checkbox } from 'antd';

// gear
import InputSel, {
  TinputSelProps,
  inputLocaleStringSwitcher,
  InputSel_input_timeout,
} from 'components/global/gear/inputAndSel_v2/inputSel';
import {
  InputSel_prod,
  InputSel_prod_memo_select,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';

import {
  lookup_classProd,
  // Interface_ClassProd_base,
  Interface_ClassProd_base2,
  Interface_ClassProd_prime,
  Interface_ClassProd_special,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/lookup_classProd';
import { Interface_ClassComponent_base, Interface_ClassComponent_prime } from '../component/classComponent_base';

import {
  optionsCreator_doorModel,
  optionsCreator_quoteType,
  optionsCreator_bottomBar,
  optionsCreator_motorLockBox,
  optionsCreator_rollerSpec,
  optionsCreator_closingType,
  optionsCreator_bottomBarAngleIron,
  optionsCreator_bottomBarPlate,
} from 'js/utils/options/productOptions';

import { TdoorModelInfoDto } from 'js/api/api_product';
import { createAssetUrl } from 'js/api/api_product';
import type { Toption, ToptionPlus } from 'js/utils/options/options';

// =======================================================================
const options_quoteType = optionsCreator_quoteType();
// =======================================================================

interface TconfigItem_prod {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  createNode: (params: {
    //
    classProd: Interface_ClassProd_base2;
    disabled: boolean;
  }) => React.ReactNode;
}

type TcellKey = keyof Pick<
  Interface_ClassProd_prime,
  | 'itemName' // 項目名
  | 'discount' // 折數
  | 'quoteType' // 報價別
  | 'doorModelName' // 門型
  | 'fullWidth' // L(公尺)全寬
  // | 'WG' // WG(公尺)
  | 'W'
  | 'height' // h(公尺)
  | 'boxB' // B(公尺)
  | 'boxD' // D(公尺)
  | 'area' // 面積
  | 'volume' // 才數
  //
  | 'horsepower' // 馬力
  | 'guideRail' // 門軌
  | 'isAntiTyphoon' // 防颱
  | 'hasSilencingStrip' // 門軌消音條
  | 'thickness' // 門片厚度
  | 'materialName' // 材料
  | 'materialSurface' // 表面 // select
  | 'bounceDoorWidth' // 彈射門寬度(m) // input
  | 'guideRailThickness' // 門軌厚度 // select
  | 'headBoxThickness' // 捲箱厚度 // select
  | 'closingType' // 開閉方式 // select
  | 'isIntegratedHeadBox' // 一體式捲箱 // checkbox
  | 'isULGuideRail' // UL // checkbox
  | 'notes' // 備註 // input
  | 'quantity' // 數量 // input
  | 'price' // 牌價 // input
  | 'dualPrice' // 牌價複價 // input
  | 'unitPrice' // 單價 // input
  | 'totalPrice' // 複價 // input
  | 'bottomBarAngleIron' // 底座角鐵 // select
  | 'bottomBarPlate' // 底座板 // select
>;

type TnodeConfig = {
  readonly [key in TcellKey]: TconfigItem_prod;
};

// ----------------------------------------------------------------------------

// =======================================================================

// =======================================================================

const defaultKeyArr: TcellKey[] = [
  // 'itemName',
  'discount',
  'quoteType',
  'doorModelName',
  'fullWidth',
  // 'WG',
  'W',
  'height',
  'boxB',
  'boxD',
  'area',
  'volume',

  'horsepower',
  'guideRail',
  'isAntiTyphoon',
  'hasSilencingStrip',
  'thickness',
  'materialName',
  'materialSurface',
  'bounceDoorWidth',
  'guideRailThickness',
  'headBoxThickness',
  'closingType',
  'isIntegratedHeadBox',
  'isULGuideRail',
  'notes',
  'quantity',
  'price',
  'dualPrice',
  'unitPrice',
  'totalPrice',
  'bottomBarAngleIron',
  'bottomBarPlate',
];

// =======================================================================

// MARK:nodeConfig_origin

const nodeConfig_origin: TnodeConfig = {
  itemName: {
    label: '項目',
    style: { width: 100 },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classProd.itemName,
          onChange: (e) => {
            classProd.itemName = e.target.value;
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  discount: {
    label: '折數',
    style: { width: 60 },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.discount,
          onChange: (e) => {
            classProd.discount = e.target.value;
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  quoteType: {
    label: '報價別',
    style: { width: 105 },
    createNode({ disabled, classProd }) {
      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          menuPortalTarget: undefined,
          isSearchable: true,
          options: options_quoteType,
          value: classProd.quoteType ? { value: classProd.quoteType, label: classProd.quoteType } : null,
          onChange: (option) => {
            const value = option?.value || '';
            classProd.quoteType = value;
          },
        },
      };

      return <InputSel_prod_memo_select selectProps={selectProps} disabled={disabled} />;
    },
  },

  doorModelName: {
    label: '門型',
    style: { width: 300 },
    createNode() {
      return null;
    },
  },

  fullWidth: {
    label: 'L', // 全寬
    style: {
      width: 60,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.fullWidth,
          onChange: (e) => {
            classProd.fullWidth = e.target.value as `${number}` | '';
          },
          onBlur() {
            classProd.onFullWidthChange?.();
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  W: {
    label: 'W',
    style: {
      width: 60,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.W,
          onChange: (e) => {
            classProd.W = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  // WG: {
  //   label: 'WG',
  //   style: {
  //     width: 60,
  //   },
  //   createNode({ disabled, classProd }) {
  //     const inputProps: TinputSelProps['inputProps'] = {
  //       props: {
  //         type: 'number',
  //         value: classProd.WG,
  //         onChange: (e) => {
  //           classProd.WG = e.target.value as `${number}` | '';
  //         },
  //       },
  //     };

  //     return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
  //   },
  // },

  height: {
    label: 'h',
    style: {
      width: 60,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.height,
          onChange: (e) => {
            classProd.height = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  boxB: {
    label: 'B',
    style: {
      width: 80,
    },
    createNode({ disabled, classProd }) {
      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          options: undefined,
          value: classProd.boxB ? { value: classProd.boxB, label: classProd.boxB } : null,
          onChange: (option) => {
            const value = (option?.value || '') as `${number}` | '';
            classProd.boxB = value;
          },
        },
      };

      return <InputSel_prod_memo_select disabled={disabled} selectProps={selectProps} />;
    },
  },

  boxD: {
    label: 'D',
    style: {
      width: 80,
    },
    createNode({ disabled, classProd }) {
      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          options: undefined,
          value: classProd.boxD ? { value: classProd.boxD, label: classProd.boxD } : null,
          onChange: (option) => {
            const value = (option?.value || '') as `${number}` | '';
            classProd.boxD = value;
          },
        },
      };

      return <InputSel_prod_memo_select disabled={disabled} selectProps={selectProps} />;
    },
  },

  area: {
    label: '面積',
    style: {
      width: 60,
    },
    createNode({ classProd }) {
      // return <InputSel_prod node={classProd.area} showBaseline="invisible" />;
      return classProd.area;
    },
  },

  volume: {
    label: '才數',
    style: {
      width: 60,
    },
    createNode({ classProd }) {
      // return <InputSel_prod node={classProd.volume} showBaseline="invisible" />;
      return classProd.volume;
    },
  },

  horsepower: {
    label: '馬力',
    style: {
      width: 90,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.horsepower;
      const value = v ? { value: v, label: v } : null;

      const inputSeleProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.horsepower = value;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSeleProps} disabled={disabled} />;
    },
  },

  guideRail: {
    label: '門軌',
    style: {
      width: 100,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.guideRail;
      const value = v ? { value: v, label: v } : null;

      // createAssetUrl
      // SJ302_30.svg

      const options = [
        {
          value: 'SJ302_30.svg',
          label: 'SJ302_30.svg',
          icon: createAssetUrl('SJ302_30.svg'),
        },
        {
          value: 'SJ302_30.svg',
          label: 'SJ302_30.svg',
          icon: createAssetUrl('SJ302_30.svg'),
        },
      ];

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          withIcon: true,
          creOptionWithIconProps: {
            showLabel: false,
            imgProps: {
              style: { height: '40px' },
            },
          },
          creSingleValueWithIconProps: {
            showLabel: false,
            imgProps: {
              style: { height: '40px' },
            },
          },
          props: {
            options: options,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.guideRail = value;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} disabled={disabled} />;
    },
  },

  isAntiTyphoon: {
    label: '防颱',
    style: {
      width: 60,
      textAlign: 'center',
    },
    createNode({ disabled, classProd }) {
      return (
        <Checkbox
          checked={!!classProd.isAntiTyphoon}
          onChange={(e) => {
            classProd.isAntiTyphoon = e.target.checked;
          }}
          disabled={disabled}
        />
      );
    },
  },

  hasSilencingStrip: {
    label: '門軌消音條',
    style: {
      width: 100,
      textAlign: 'center',
    },
    createNode({ disabled, classProd }) {
      return (
        <Checkbox
          checked={!!classProd.hasSilencingStrip}
          onChange={(e) => {
            classProd.hasSilencingStrip = e.target.checked;
          }}
          disabled={disabled}
        />
      );
    },
  },

  thickness: {
    label: '門片厚度',
    style: {
      width: 100,
    },
    createNode({ disabled, classProd }) {
      return classProd.thickness + ' t';
    },
  },

  materialName: {
    label: '材料',
    style: {
      width: 190,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.materialName;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.materialName = value;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} />;
    },
  },

  materialSurface: {
    label: '表面',
    style: {
      width: 80,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.materialSurface;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.materialSurface = value;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} />;
    },
  },

  bounceDoorWidth: {
    label: '彈射門寬度(m)',
    style: {
      width: 128,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.bounceDoorWidth,
          onChange: (e) => {
            classProd.bounceDoorWidth = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  guideRailThickness: {
    label: '門軌厚度',
    style: {
      width: 90,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.guideRailThickness;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            // options的label要加上單位't';
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.guideRailThickness = value as `${number}`;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} />;
    },
  },

  headBoxThickness: {
    label: '捲箱厚度',
    style: {
      width: 90,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.headBoxThickness;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            // options的label要加上單位't';
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.headBoxThickness = value as `${number}`;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} />;
    },
  },

  closingType: {
    label: '開閉方式',
    style: {
      width: 90,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.closingType;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.closingType = value;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} />;
    },
  },

  isIntegratedHeadBox: {
    label: '一體式捲箱',
    style: {
      width: 100,
      textAlign: 'center',
    },
    createNode({ disabled, classProd }) {
      return (
        <Checkbox
          checked={!!classProd.isIntegratedHeadBox}
          onChange={(e) => {
            classProd.isIntegratedHeadBox = e.target.checked;
          }}
          disabled={disabled}
        />
      );
    },
  },

  isULGuideRail: {
    label: 'UL',
    style: {
      width: 50,
      textAlign: 'center',
    },
    createNode({ disabled, classProd }) {
      return (
        <Checkbox
          checked={!!classProd.isULGuideRail}
          onChange={(e) => {
            classProd.isULGuideRail = e.target.checked;
          }}
          disabled={disabled}
        />
      );
    },
  },

  notes: {
    label: '備註',
    style: {
      width: 150,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classProd.notes,
          onChange: (e) => {
            classProd.notes = e.target.value;
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  quantity: {
    label: '數量',
    style: {
      width: 55,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.quantity,
          onChange: (e) => {
            classProd.quantity = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  price: {
    label: '牌價',
    style: {
      width: 120,
      textAlign: 'right',
    },
    createNode({ disabled, classProd }) {
      const { value, type } = inputLocaleStringSwitcher(classProd.price, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          type: type,
          value: value,
          onChange: (e) => {
            classProd.price = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  dualPrice: {
    label: '牌價複價',
    style: {
      width: 140,
      textAlign: 'right',
    },
    createNode({ disabled, classProd }) {
      const { value, type } = inputLocaleStringSwitcher(classProd.dualPrice, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          type: type,
          value: value,
          onChange: (e) => {
            classProd.dualPrice = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  unitPrice: {
    label: '單價',
    style: {
      width: 120,
      textAlign: 'right',
    },
    createNode({ disabled, classProd }) {
      const { value, type } = inputLocaleStringSwitcher(classProd.unitPrice, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          type: type,
          value: value,
          onChange: (e) => {
            classProd.unitPrice = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  totalPrice: {
    label: '複價',
    style: {
      width: 140,
      textAlign: 'right',
    },
    createNode({ disabled, classProd }) {
      const { value, type } = inputLocaleStringSwitcher(classProd.totalPrice, disabled);

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          className: 'text-right',
          type: type,
          value: value,
          onChange: (e) => {
            classProd.totalPrice = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  bottomBarAngleIron: {
    label: '底座角鐵',
    style: {
      width: 210,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.bottomBarAngleIron;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.bottomBarAngleIron = value;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} />;
    },
  },

  bottomBarPlate: {
    label: '底座板',
    style: {
      width: 210,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.bottomBarPlate;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: [],
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.bottomBarPlate = value;
            },
          },
        },
      };

      return <InputSel_prod_memo_select {...inputSelProps} />;
    },
  },

  //
}; // nodeConfig_origin

// MARK: createNodeConfig_prime
const createNodeConfig_prime = ({
  //
  doorModelDict,
}: {
  doorModelDict: Record<string, TdoorModelInfoDto> | undefined | null;
}) => {
  const nodeConfig_prime: TnodeConfig = _.cloneDeep(nodeConfig_origin);

  nodeConfig_prime.doorModelName.createNode = ({ classProd, disabled }) => {
    const options_doorModel = doorModelDict
      ? Object.values(doorModelDict).map((doorModel) => {
          return {
            label: doorModel.name,
            value: doorModel.name,
          };
        })
      : undefined;

    const selectProps: TinputSelProps['selectProps'] = {
      props: {
        isSearchable: true,
        options: options_doorModel,
        value: classProd.doorModelName ? { value: classProd.doorModelName, label: classProd.doorModelName } : null,
        onChange: (option) => {
          const doorModelName = option?.value || '';
          classProd.doorModelName = doorModelName;
          classProd.changeDoorModel(doorModelDict?.[doorModelName] || null);
        },
      },
    };

    return <InputSel_prod_memo_select selectProps={selectProps} disabled={disabled} />;
  };

  return nodeConfig_prime;
};

// ===============================================================================

// ===============================================================================
export type {
  //
  TconfigItem_prod as TconfigItem,
  TcellKey,
  TnodeConfig,
};
export {
  //
  defaultKeyArr,
  createNodeConfig_prime,
  nodeConfig_origin,
};

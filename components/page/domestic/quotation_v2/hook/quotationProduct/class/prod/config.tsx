import _ from 'lodash';

// antd
import { Checkbox } from 'antd';

// gear
import { TinputSelProps, inputLocaleStringSwitcher } from 'components/global/gear/inputAndSel_v2/inputSel';
import {
  InputSel_prod,
  // InputSel_prod_memo_select,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';

import { ClassProd } from './classProd_remake';

import {
  // optionsCreator_doorModel,
  optionsCreator_quoteType,
  // optionsCreator_bottomBar,
  // optionsCreator_motorLockBox,
  // optionsCreator_rollerSpec,
  optionsCreator_closingType,
  // optionsCreator_bottomBarAngleIron,
  // optionsCreator_bottomBarPlate,
  optionsCreator_boxB_SJ302,
  optionsCreator_boxB_SJ303A,
  optionsCreator_boxB_SJ312,
  optionsCreator_boxB_SJ305D,
  // optionsCreator_horsePower,
  // lookup_options_bottomBarAngleIronAndPlate,
  // optionsCreator_doorModelName,
  lookup_quoteType_doorModelName,
} from 'js/utils/options/productOptions';

import { TdoorModelInfoDto } from 'js/api/api_product';
import { createAssetUrl } from 'js/api/api_product';
import type {
  Toption,
  //  ToptionPlus
} from 'js/utils/options/options';

import { TdoorModel } from 'js/api/dtoTypes';

import scss from './config.module.scss';

// =======================================================================
const options_quoteType = optionsCreator_quoteType();

const InputSel_prod_select = (props: TinputSelProps) => {
  const { selectProps } = props;

  // selectProps?.props && (selectProps.props.menuPortalTarget ??= document.getElementById('quotationProdTableWrapper'));
  selectProps?.props && (selectProps.props.menuPortalTarget = undefined);

  return <InputSel_prod {...props} />;
};

// =======================================================================

interface TconfigItem_prod {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  className_thead?: string;
  createNode: (params: {
    //
    classProd: ClassProd;
    disabled: boolean;
  }) => React.ReactNode;
}

type TcellKey = keyof Pick<
  ClassProd,
  | 'rootProductName'
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
  'horsepower',
  'guideRail',
  'isAntiTyphoon',
  'hasSilencingStrip',

  'area',
  'volume',
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

// const lookup_options_boxB: {
//   [doorType: string]: Toption[] | undefined;
// } = {
//   'SJ-302': optionsCreator_boxB_SJ302(),
//   'SJ-303A': optionsCreator_boxB_SJ303A(),
//   'SJ-303AS': optionsCreator_boxB_SJ303A(),
//   'SJ-305D': optionsCreator_boxB_SJ305D(),
//   'SJ-312': optionsCreator_boxB_SJ312(),
// };

type Tlookup_options_boxB = {
  [key in TdoorModel]: Toption[] | undefined;
};

const lookup_options_boxB: Tlookup_options_boxB = {
  'SJ-302': optionsCreator_boxB_SJ302(),
  'SJ-312': optionsCreator_boxB_SJ312(),
  'SJ-305D': optionsCreator_boxB_SJ305D(),
  'SJ-303A': optionsCreator_boxB_SJ303A(),
  'SJ-303AS': optionsCreator_boxB_SJ303A(),
  // 'SJ-120A': undefined,
  // 'SJ-303S': undefined,
  W2: undefined,
};

// =======================================================================

// MARK:nodeConfig_origin

const nodeConfig_origin: TnodeConfig = {
  rootProductName: {
    label: '源主產品',
    style: { width: 100 },
    className_thead: 'text-lg text-main',
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps = {
        disabled,
        showBaseline: 'invisible',
        node: classProd.rootProductName,
      };

      return <InputSel_prod {...inputProps} />;
    },
  },

  itemName: {
    label: '項目',
    style: { width: 100 },
    className_thead: 'text-lg text-main',
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
            classProd.discount = e.target.value as `${number}` | '';
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
          // menuPortalTarget: undefined,
          // menuPortalTarget: document.getElementById('quotationProdTableWrapper'),
          // menuPortalTarget: document.getElementById('zxc'),
          // menuIsOpen: true,
          isSearchable: true,
          options: options_quoteType,
          value: classProd.quoteType ? { value: classProd.quoteType, label: classProd.quoteType } : null,
          onChange: (option) => {
            const value = option?.value || '';
            classProd.quoteType = value;
          },
        },
      };

      return <InputSel_prod_select selectProps={selectProps} disabled={disabled} />;
    },
  },

  // lookup_quoteType_doorModelName
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
          step: 0.001,
          min: 0,
          value: classProd.fullWidth,
          onChange: (e) => {
            if (e.target.validity.valid) {
              classProd.fullWidth = e.target.value as `${number}` | '';
            }
          },
          onBlur() {
            classProd.runAfterChange?.();
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
          step: 0.001,
          min: 0,
          value: classProd.W,
          onChange: (e) => {
            if (e.target.validity.valid) {
              classProd.W = e.target.value as `${number}` | '';
            }
          },
          onBlur() {
            classProd.runAfterChange();
          },
        },
      };

      return (
        <InputSel_prod
          inputProps={inputProps}
          disabled={disabled}
          // suffix={'fooo'}
        />
      );
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
          step: 0.001,
          min: 0,
          value: classProd.height,
          onChange: (e) => {
            if (e.target.validity.valid) {
              classProd.height = e.target.value as `${number}` | '';
            }
          },
          onBlur() {
            classProd.runAfterChange?.();
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
      const options = lookup_options_boxB[classProd.doorModelName as TdoorModel] || [];

      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          options,
          value: classProd.boxB ? { value: classProd.boxB, label: classProd.boxB } : null,
          onChange: (option) => {
            const value = (option?.value || '') as `${number}` | '';
            classProd.boxB = value;
          },
        },
      };

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.boxB ?? '',
          onChange: (e) => {
            classProd.boxB = e.target.value as `${number}` | '';
          },
        },
      };

      const inputSelProps = classProd.isSpecial ? { inputProps } : { selectProps };

      return <InputSel_prod_select disabled={disabled} {...inputSelProps} />;
    },
  },

  boxD: {
    label: 'D',
    style: {
      width: 50,
    },
    createNode({ disabled, classProd }) {
      disabled = classProd.isSpecial ? disabled : true;

      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.boxD ?? '',
          onChange: (e) => {
            classProd.boxD = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_prod disabled={disabled} inputProps={inputProps} />;
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
            isSearchable: classProd.isSpecial,
            options: classProd.options_horsepower,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.horsepower = value;
            },
          },
        },
      };

      return <InputSel_prod_select {...inputSeleProps} disabled={disabled} />;
    },
  },

  guideRail: {
    label: '門軌',
    style: {
      width: 100,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.guideRail;

      if (classProd.isSpecial) {
        const inpuSelProps: TinputSelProps = {
          inputProps: {
            props: {
              value: v ?? '',
              onChange: (e) => {
                classProd.guideRail = e.target.value;
              },
            },
          },
        };

        return <InputSel_prod disabled={disabled} {...inpuSelProps} />;
      }

      const value = v
        ? {
            value: v,
            label: v,
            icon: createAssetUrl('door-track', v),
          }
        : null;

      // let { guideRails = [] } = classProd.state.doorModel ?? {};
      // guideRails = _.sortBy(guideRails, 'imgSrc');

      // const options = guideRails.map(({ imgSrc }) => {
      //   return {
      //     value: imgSrc,
      //     label: imgSrc,
      //     icon: createAssetUrl(imgSrc),
      //   };
      // });

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
            options: classProd.options_guideRail,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.guideRail = value;
              // classProd.runAfterChange();
            },
          },
        },
      };

      const title = v?.replace(/\.svg$/, '');

      // 有icon的select，點擊開啟menu時click事件的傳遞不太正常
      // 造成的問題已經以別的方式解決，但還是要留意一下
      return (
        <span title={title}>
          <InputSel_prod_select {...inputSelProps} disabled={disabled} />
        </span>
      );
    },
  },

  isAntiTyphoon: {
    label: '防颱',
    style: {
      width: 60,
      textAlign: 'center',
    },
    createNode({ disabled, classProd }) {
      if (classProd.isSpecial) {
        return null;
      }

      return <Checkbox checked={!!classProd.isAntiTyphoon} disabled={true} />;
    },
  },

  hasSilencingStrip: {
    label: '門軌消音條',
    style: {
      width: 100,
      textAlign: 'center',
    },
    createNode({ disabled, classProd }) {
      if (classProd.isSpecial) {
        return null;
      }

      return <Checkbox checked={!!classProd.hasSilencingStrip} disabled={true} />;
    },
  },

  thickness: {
    label: '門片厚度',
    style: {
      width: 100,
    },
    createNode({ classProd }) {
      if (classProd.isSpecial) {
        return null;
      }

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
      const options_material = classProd.options_material;

      // const value = v ? { value: v, label: v } : null;
      const value = options_material?.find((option) => option.value === v) || null;

      const inputSelProps_input: TinputSelProps = {
        inputProps: {
          props: {
            value: v,
            onChange: (e) => {
              classProd.materialName = e.target.value;
            },
            readOnly: disabled,
          },
        },
      };

      const inputSelProps_select: TinputSelProps = {
        selectProps: {
          props: {
            value,
            options: classProd.options_material,
            onChange: (option) => {
              classProd.materialName = option?.value ?? '';
            },
          },
        },
      };

      const inputSelProps = classProd.isSpecial ? inputSelProps_input : inputSelProps_select;

      return <InputSel_prod disabled={disabled} {...inputSelProps} />;
    },
  },

  materialSurface: {
    label: '表面',
    style: {
      width: 110,
    },
    createNode({ disabled, classProd }) {
      const v = classProd.materialSurface;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps_input: TinputSelProps = {
        inputProps: {
          props: {
            value: v ?? '',
            onChange: (e) => {
              classProd.materialSurface = e.target.value;
            },
          },
        },
      };

      const inputSelProps_select: TinputSelProps = {
        selectProps: {
          props: {
            options: classProd.options_surface,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.materialSurface = value;
            },
          },
        },
      };

      const inpuSelProps = classProd.isSpecial ? inputSelProps_input : inputSelProps_select;

      return <InputSel_prod_select disabled={disabled} {...inpuSelProps} />;
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
          min: 0,
          step: 0.001,
          value: classProd.bounceDoorWidth,
          onChange: (e) => {
            if (e.target.validity.valid) {
              classProd.bounceDoorWidth = e.target.value as `${number}` | '';
            }
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
      if (classProd.isSpecial) {
        return null;
      }

      const v = classProd.guideRailThickness;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            isSearchable: classProd.isSpecial,
            options: classProd.options_guideRailThickness,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.guideRailThickness = value as `${number}`;
            },
          },
        },
      };

      return <InputSel_prod_select {...inputSelProps} />;
    },
  },

  headBoxThickness: {
    label: '捲箱厚度',
    style: {
      width: 90,
    },
    createNode({ disabled, classProd }) {
      if (classProd.isSpecial) {
        return null;
      }

      const v = classProd.headBoxThickness;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            isSearchable: classProd.isSpecial,
            options: classProd.options_headBoxThickness,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.headBoxThickness = value as `${number}`;
            },
          },
        },
      };

      return <InputSel_prod_select {...inputSelProps} />;
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
            options: optionsCreator_closingType(),
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.closingType = value;
            },
          },
        },
      };

      return <InputSel_prod_select {...inputSelProps} />;
    },
  },

  isIntegratedHeadBox: {
    label: '一體式捲箱',
    style: {
      width: 100,
      textAlign: 'center',
    },
    createNode({ disabled, classProd }) {
      if (classProd.isSpecial) {
        return null;
      }

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
      if (classProd.isSpecial) {
        return null;
      }

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
      const isAttached = classProd.isAttached;

      const inputSelProps_input: TinputSelProps = {
        disabled,
        inputProps: {
          props: {
            type: 'number',
            value: classProd.quantity,
            onChange: (e) => {
              classProd.quantity = e.target.value as `${number}` | '';
            },
          },
        },
      };

      const inputSelProps_attached: TinputSelProps = {
        disabled: true,
        showBaseline: 'invisible',
        node: classProd.quantity,
      };

      const inputSelProps = isAttached ? inputSelProps_attached : inputSelProps_input;

      return <InputSel_prod {...inputSelProps} />;
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
          min: 0,
          step: 0,
          onChange: (e) => {
            if (e.target.validity.valid) {
              classProd.price = e.target.value as `${number}` | '';
            }
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
      // const { value, type } = inputLocaleStringSwitcher(classProd.dualPrice, disabled);

      // const inputProps: TinputSelProps['inputProps'] = {
      //   props: {
      //     className: 'text-right',
      //     type: type,
      //     value: value,
      //     onChange: (e) => {
      //       classProd.dualPrice = e.target.value as `${number}` | '';
      //     },
      //   },
      // };

      // return <InputSel_prod inputProps={inputProps} disabled={disabled} />;

      return <InputSel_prod node={Number(classProd.dualPrice).toLocaleString()} disabled={true} />;
    },
  },

  unitPrice: {
    label: '單價',
    style: {
      width: 120,
      textAlign: 'right',
    },
    createNode({ disabled, classProd }) {
      // const { value, type } = inputLocaleStringSwitcher(classProd.unitPrice, disabled);

      // const inputProps: TinputSelProps['inputProps'] = {
      //   props: {
      //     className: 'text-right',
      //     type: type,
      //     value: value,
      //     onChange: (e) => {
      //       classProd.unitPrice = e.target.value as `${number}` | '';
      //     },
      //   },
      // };

      // return <InputSel_prod inputProps={inputProps} disabled={disabled} />;

      return <InputSel_prod node={Number(classProd.unitPrice).toLocaleString()} disabled={true} />;
    },
  },

  totalPrice: {
    label: '複價',
    style: {
      width: 140,
      textAlign: 'right',
    },
    createNode({ disabled, classProd }) {
      // const { value, type } = inputLocaleStringSwitcher(classProd.totalPrice, disabled);

      // const inputProps: TinputSelProps['inputProps'] = {
      //   props: {
      //     className: 'text-right',
      //     type: type,
      //     value: value,
      //     onChange: (e) => {
      //       classProd.totalPrice = e.target.value as `${number}` | '';
      //     },
      //   },
      // };

      // return <InputSel_prod inputProps={inputProps} disabled={disabled} />;

      return <InputSel_prod node={Number(classProd.totalPrice).toLocaleString()} disabled={true} />;
    },
  },

  bottomBarAngleIron: {
    label: '底座角鐵',
    style: {
      width: 210,
    },
    createNode({ disabled, classProd }) {
      if (classProd.isSpecial) {
        return null;
      }

      const v = classProd.bottomBarAngleIron;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: classProd.options_bottomBarAngleIron,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.bottomBarAngleIron = value;
            },
          },
        },
      };

      return <InputSel_prod_select {...inputSelProps} />;
    },
  },

  bottomBarPlate: {
    label: '底座板',
    style: {
      width: 210,
    },
    createNode({ disabled, classProd }) {
      if (classProd.isSpecial) {
        return null;
      }

      const v = classProd.bottomBarPlate;
      const value = v ? { value: v, label: v } : null;

      const inputSelProps: TinputSelProps = {
        disabled,
        selectProps: {
          props: {
            options: classProd.options_bottomBarPlate,
            value,
            onChange: (option) => {
              const value = option?.value || '';
              classProd.bottomBarPlate = value;
            },
          },
        },
      };

      return <InputSel_prod_select {...inputSelProps} />;
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
    const optionsDict = lookup_quoteType_doorModelName[classProd.quoteType || 'undefined'];
    const options = optionsDict ? Object.values(optionsDict) : undefined;
    options && options && options.filter((option) => !!option);

    let value: Toption | null = null;

    if (classProd.doorModelName) {
      value = (optionsDict && optionsDict[classProd.doorModelName]) || null;

      if (!value) {
        value = {
          value: classProd.doorModelName,
          label: classProd.doorModelName,
        };
      }
    }

    const selectProps: TinputSelProps['selectProps'] = {
      props: {
        isSearchable: true,
        options: options as Toption[],
        value: value,
        // menuPortalTarget: document.getElementById('fooo'),
        // menuIsOpen: true,
        onChange: (option) => {
          const doorModelName = option?.value || '';
          const doorModel = doorModelDict?.[doorModelName] || null;

          // classProd

          if ((!classProd.isSpecial && doorModel) || (classProd.isSpecial && doorModel)) {
            classProd.changeDoorModel({
              doorModel: doorModel,
            });
          } else if (!classProd.isSpecial && !doorModel) {
            classProd.changeDoorModel({
              doorModel: null,
            });
            classProd.doorModelName = doorModelName;
          } else {
            classProd.doorModelName = doorModelName;
          }
        },
        classNames: {
          menuPortal: () => scss.menuPortal,
        },
      },
    };

    return <InputSel_prod_select selectProps={selectProps} disabled={disabled} />;
  };

  return nodeConfig_prime;
};

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

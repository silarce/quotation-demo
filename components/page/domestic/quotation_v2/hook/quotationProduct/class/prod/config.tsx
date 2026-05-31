import _ from 'lodash';

import { TinputSelProps, inputLocaleStringSwitcher } from 'components/global/gear/inputAndSel_v2/inputSel';
import { InputSel_prod } from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';

import { ClassProd } from './classProd_remake';

import { optionsCreator_quoteType, lookup_quoteType_doorModelName } from 'js/utils/options/productOptions';

import type { Toption } from 'js/utils/options/options';

// =======================================================================
// 報價別與門型限縮：只剩「捲門」、SJ-302、SJ-312。
const ALLOWED_QUOTE_TYPES = ['捲門'];
const ALLOWED_DOOR_MODELS = ['A-001', 'SJ-312'];

const optionsCreator_quoteType_local = () =>
  optionsCreator_quoteType().filter((opt) => ALLOWED_QUOTE_TYPES.includes(opt.value));

const filterDoorModelOptionDict = (
  dict: { [k: string]: Toption | undefined } | undefined
): { [k: string]: Toption } | undefined => {
  if (!dict) {
    return dict;
  }

  const filtered: { [k: string]: Toption } = {};
  ALLOWED_DOOR_MODELS.forEach((name) => {
    const opt = dict[name];

    if (opt) {
      filtered[name] = opt;
    }
  });

  return filtered;
};

const options_quoteType = optionsCreator_quoteType_local();

const InputSel_prod_select = (props: TinputSelProps) => {
  const { selectProps } = props;
  selectProps?.props && (selectProps.props.menuPortalTarget = undefined);

  return <InputSel_prod {...props} />;
};

// =======================================================================

interface TconfigItem_prod {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  className_thead?: string;
  createNode: (params: { classProd: ClassProd; disabled: boolean }) => React.ReactNode;
}

type TcellKey = keyof Pick<
  ClassProd,
  | 'itemName'
  | 'quoteType'
  | 'doorModelName'
  | 'fullWidth'
  | 'height'
  | 'area'
  | 'materialName'
  // | 'materialSurface'
  | 'quantity'
  | 'price'
  | 'dualPrice'
  | 'unitPrice'
  | 'totalPrice'
  | 'discount'
>;

type TnodeConfig = {
  readonly [key in TcellKey]: TconfigItem_prod;
};

const defaultKeyArr: TcellKey[] = [
  'quoteType',
  'doorModelName',
  'fullWidth',
  'height',
  'area',
  'materialName',
  // 'materialSurface',
  'quantity',
  'price',
  'dualPrice',
  'unitPrice',
  'totalPrice',
  'discount',
];

// =======================================================================

const numberInputCell = (
  label: string,
  width: number,
  getter: (p: ClassProd) => string,
  setter: (p: ClassProd, v: `${number}` | '') => void
): TconfigItem_prod => ({
  label,
  style: { width, textAlign: 'right' },
  createNode({ disabled, classProd }) {
    const { value, type } = inputLocaleStringSwitcher(getter(classProd) as `${number}` | '', disabled);
    const inputSelProps: TinputSelProps = {
      disabled,
      inputProps: {
        props: {
          className: 'text-right',
          placeholder: '',
          value,
          type,
          min: 0,
          step: 0,
          onChange(e) {
            if (e.target.validity.valid) {
              setter(classProd, e.target.value as `${number}` | '');
            }
          },
        },
      },
    };

    return <InputSel_prod {...inputSelProps} />;
  },
});

const readOnlyNumberCell = (
  label: string,
  width: number,
  getter: (p: ClassProd) => string | number
): TconfigItem_prod => ({
  label,
  style: { width, textAlign: 'right' },
  createNode({ classProd }) {
    const v = getter(classProd);

    return Number(v || 0).toLocaleString();
  },
});

// =======================================================================

const nodeConfig_origin: TnodeConfig = {
  itemName: {
    label: '項目名',
    style: { width: 100 },
    className_thead: 'text-lg text-main',
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classProd.itemName ?? '',
          onChange: (e) => {
            classProd.itemName = e.target.value;
          },
        },
      };

      return <InputSel_prod inputProps={inputProps} disabled={disabled} />;
    },
  },

  quoteType: {
    label: '種類',
    style: { width: 100 },
    createNode({ disabled, classProd }) {
      const v = classProd.quoteType;
      const value = options_quoteType.find((opt) => opt.value === v) || null;
      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          options: options_quoteType,
          value,
          onChange: (opt) => {
            classProd.quoteType = opt?.value ?? '';
          },
        },
      };

      return <InputSel_prod_select selectProps={selectProps} disabled={disabled} />;
    },
  },

  doorModelName: {
    label: '型號',
    style: { width: 110 },
    createNode({ disabled, classProd }) {
      const optionsDict = filterDoorModelOptionDict(lookup_quoteType_doorModelName[classProd.quoteType || 'undefined']);
      const options = optionsDict ? Object.values(optionsDict) : [];

      let value: Toption | null = null;

      if (classProd.doorModelName) {
        value = (optionsDict && optionsDict[classProd.doorModelName]) || {
          value: classProd.doorModelName,
          label: classProd.doorModelName,
        };
      }

      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          isSearchable: true,
          options: options as Toption[],
          value,
          onChange: (opt) => {
            classProd.changeDoorModel({ doorModelName: opt?.value ?? '' });
          },
        },
      };

      return <InputSel_prod_select selectProps={selectProps} disabled={disabled} />;
    },
  },

  fullWidth: numberInputCell(
    '寬(W)',
    80,
    (p) => p.fullWidth ?? '',
    (p, v) => (p.fullWidth = v)
  ),
  height: numberInputCell(
    '高(h)',
    80,
    (p) => p.height ?? '',
    (p, v) => (p.height = v)
  ),

  area: {
    label: '面積',
    style: { width: 80, textAlign: 'right' },
    createNode({ classProd }) {
      const v = classProd.area;

      return Number(v || 0).toLocaleString();
    },
  },

  materialName: {
    label: '材料',
    style: { width: 110 },
    createNode({ disabled, classProd }) {
      const v = classProd.materialName;
      const options = classProd.options_material ?? [];
      const value = options.find((opt) => opt.value === v) || (v ? { value: v, label: v } : null);
      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          options,
          value,
          onChange: (opt) => {
            classProd.materialName = opt?.value ?? '';
          },
        },
      };

      return <InputSel_prod_select selectProps={selectProps} disabled={disabled} />;
    },
  },

  // materialSurface: {
  //   label: '表面',
  //   style: { width: 100 },
  //   createNode({ disabled, classProd }) {
  //     const v = classProd.materialSurface;
  //     const options = classProd.options_surface ?? [];
  //     const value = options.find((opt) => opt.value === v) || (v ? { value: v, label: v } : null);
  //     const selectProps: TinputSelProps['selectProps'] = {
  //       props: {
  //         options,
  //         value,
  //         onChange: (opt) => {
  //           classProd.materialSurface = opt?.value ?? null;
  //         },
  //       },
  //     };

  //     return <InputSel_prod_select selectProps={selectProps} disabled={disabled} />;
  //   },
  // },

  quantity: numberInputCell(
    '數量',
    60,
    (p) => p.quantity ?? '',
    (p, v) => (p.quantity = v)
  ),
  price: readOnlyNumberCell('牌價', 90, (p) => p.price ?? ''),

  dualPrice: readOnlyNumberCell('牌價複價', 100, (p) => p.dualPrice ?? ''),
  unitPrice: readOnlyNumberCell('單價', 90, (p) => p.unitPrice ?? ''),
  totalPrice: readOnlyNumberCell('複價', 100, (p) => p.totalPrice ?? ''),

  discount: numberInputCell(
    '折數',
    60,
    (p) => p.discount ?? '',
    (p, v) => (p.discount = v)
  ),
};

// MARK: createNodeConfig_prime
const createNodeConfig_prime = () => {
  return _.cloneDeep(nodeConfig_origin);
};

// ===============================================================================
export type { TconfigItem_prod as TconfigItem, TcellKey, TnodeConfig };
export {
  defaultKeyArr,
  createNodeConfig_prime,
  nodeConfig_origin,
  ALLOWED_QUOTE_TYPES,
  ALLOWED_DOOR_MODELS,
  filterDoorModelOptionDict,
  optionsCreator_quoteType_local,
};

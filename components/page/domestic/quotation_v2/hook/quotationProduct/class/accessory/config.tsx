import _ from 'lodash';

// gear
import InputSel, {
  TinputSelProps,
  InputSel_s1,
  InputSel_memo_select,
  inputLocaleStringSwitcher,
} from 'components/global/gear/inputAndSel_v2/inputSel';

import { Interface_ClassAccessory } from './classAccessory';

// ============================================================================

interface TconfigItem_accessory {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  createNode: (params: {
    //
    classAcce: Interface_ClassAccessory;
    disabled: boolean;
  }) => React.ReactNode;
}

type TcellKey_accessory = keyof Pick<
  Interface_ClassAccessory,
  'name' | 'unit' | 'quantity' | 'price' | 'dualPrice' | 'unitPrice' | 'totalPrice'
>;

type TnodeConfig_accessory = {
  readonly [key in TcellKey_accessory]: TconfigItem_accessory;
};

// ============================================================================

const defaultKeyArr_accessory: TcellKey_accessory[] = [
  //
  'unit',
  'quantity',
  'price',
  'dualPrice',
  'unitPrice',
  'totalPrice',
];

// ============================================================================

const createNodeConfig_accessory = (): TnodeConfig_accessory => {
  const nodeConfig: TnodeConfig_accessory = {
    name: {
      label: '名稱',
      style: { width: 200 },
      createNode({ disabled, classAcce }) {
        return classAcce.name;
      },
    },

    unit: {
      label: '單位',
      style: { width: 100 },
      createNode({ disabled, classAcce }) {
        return classAcce.unit;
      },
    },

    quantity: {
      label: '數量',
      style: { width: 100 },
      createNode({ disabled, classAcce }) {
        const inputSelProps: TinputSelProps = {
          inputProps: {
            props: {
              type: 'number',
              value: classAcce.quantity,
              onChange: (e) => {
                classAcce.quantity = e.target.value as `${number}` | '';
              },
            },
          },
        };

        return <InputSel_s1 {...inputSelProps} />;
      },
    },

    price: {
      label: '牌價',
      style: { width: 100 },
      createNode({ disabled, classAcce }) {
        const { value, type } = inputLocaleStringSwitcher(classAcce.price, disabled);

        const inputSelProps: TinputSelProps = {
          inputProps: {
            props: {
              value,
              type,
              onChange(e) {
                classAcce.price = e.target.value as `${number}` | '';
              },
            },
          },
        };

        return <InputSel_s1 {...inputSelProps} />;
      },
    },

    dualPrice: {
      label: '牌價複價',
      style: { width: 100 },
      createNode({ disabled, classAcce }) {
        const node = Number(classAcce.dualPrice).toLocaleString();

        return <InputSel node={node} showBaseline="invisible" />;
      },
    },

    unitPrice: {
      label: '單價',
      style: { width: 100 },
      createNode({ disabled, classAcce }) {
        const node = Number(classAcce.unitPrice).toLocaleString();

        return <InputSel node={node} showBaseline="invisible" />;
      },
    },

    totalPrice: {
      label: '複價',
      style: { width: 100 },
      createNode({ disabled, classAcce }) {
        const node = Number(classAcce.totalPrice).toLocaleString();

        return <InputSel node={node} showBaseline="invisible" />;
      },
    },
  };

  return nodeConfig;
};

// ============================================================================
export type { TconfigItem_accessory, TnodeConfig_accessory, TcellKey_accessory };
export { defaultKeyArr_accessory, createNodeConfig_accessory };

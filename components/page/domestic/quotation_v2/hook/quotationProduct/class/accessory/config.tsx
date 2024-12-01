import _ from 'lodash';

// gear
import InputSel, { TinputSelProps, inputLocaleStringSwitcher } from 'components/global/gear/inputAndSel_v2/inputSel';
import { InputSel_prod } from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';

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
      style: { width: 50 },
      createNode({ disabled, classAcce }) {
        return classAcce.unit;
      },
    },

    quantity: {
      label: '數量',
      style: { width: 50 },
      createNode({ disabled, classAcce }) {
        const inputSelProps: TinputSelProps = {
          disabled,
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

        return <InputSel_prod {...inputSelProps} />;
      },
    },

    price: {
      label: '牌價',
      style: { width: 100, textAlign: 'right' },
      createNode({ disabled, classAcce }) {
        const { value, type } = inputLocaleStringSwitcher(classAcce.price, disabled);

        const inputSelProps: TinputSelProps = {
          disabled,
          inputProps: {
            props: {
              className: 'text-right',
              value,
              type,
              onChange(e) {
                classAcce.price = e.target.value as `${number}` | '';
              },
            },
          },
        };

        return <InputSel_prod {...inputSelProps} />;
      },
    },

    dualPrice: {
      label: '牌價複價',
      style: { width: 100, textAlign: 'right' },
      createNode({ disabled, classAcce }) {
        return Number(classAcce.dualPrice).toLocaleString();
      },
    },

    unitPrice: {
      label: '單價',
      style: { width: 100, textAlign: 'right' },
      createNode({ disabled, classAcce }) {
        return Number(classAcce.unitPrice).toLocaleString();
      },
    },

    totalPrice: {
      label: '複價',
      style: { width: 100, textAlign: 'right' },
      createNode({ disabled, classAcce }) {
        return Number(classAcce.totalPrice).toLocaleString();
      },
    },
  };

  return nodeConfig;
};

// ============================================================================
export type { TconfigItem_accessory, TnodeConfig_accessory, TcellKey_accessory };
export { defaultKeyArr_accessory, createNodeConfig_accessory };

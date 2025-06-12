// gear
import InputSel, { TinputSelProps, inputLocaleStringSwitcher } from 'components/global/gear/inputAndSel_v2/inputSel';
import {
  InputSel_prod,
  InputSel_prod_memo_select,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/ui/InputSel_prod';

import { Interface_ClassComponent_base, Interface_ClassComponent_prime } from './classComponent_base';

import { TdoorModelInfoDto } from 'js/api/api_product';

import { Checkbox } from 'antd';

// ========================================================================

interface TconfigItem_component {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  createNode:
    | ((params: {
        //
        classComponent: Interface_ClassComponent_prime;
        disabled: boolean;
      }) => React.ReactNode)
    | null;
}

type TcellKey_component = keyof Pick<
  Interface_ClassComponent_prime,
  | 'name'
  //
  | 'number'
  | 'desc'
  | 'material'
  | 'materialSurface'
  | 'density'
  | 'isPainted'
  | 'quantity'
  | 'unit'
  | 'price'
  | 'dualPrice'
  | 'unitPrice'
  | 'totalPrice'
>;

type TnodeConfig_component = {
  readonly [key in TcellKey_component]: TconfigItem_component;
};

// ========================================================================

const defaultKeyArr_component: TcellKey_component[] = [
  // 'name',
  'number',
  'desc',
  'material',
  'materialSurface',
  'density',
  'isPainted',
  'unit',
  'quantity',
  'price',
  'dualPrice',
  'unitPrice',
  'totalPrice',
];

const createNodeConfig_component = (): TnodeConfig_component => {
  const nodeConfig_component: TnodeConfig_component = {
    name: {
      label: '名稱',
      style: { width: 140 },
      createNode({ disabled, classComponent }) {
        return classComponent.name;
      },
    },
    number: {
      label: '代號',
      style: { width: 110 },
      createNode({ disabled, classComponent }) {
        return classComponent.number;
      },
    },
    desc: {
      label: '說明',
      style: { width: 200 },
      createNode({ disabled, classComponent }) {
        if (!classComponent.isRawDataExist) {
          return <span className="text-danger">{classComponent.desc}</span>;
        }

        return classComponent.desc;
      },
    },

    material: {
      label: '材料',
      style: { width: 120 },
      createNode({ disabled, classComponent }) {
        const v = classComponent.material;
        const options_material = classComponent.options_material;

        // const value = v ? { value: v, label: v } : null;
        const value = options_material?.find((item) => item.value === v) || null;

        const inputSelProps: TinputSelProps = {
          disabled,
          selectProps: {
            props: {
              placeholder: '',
              options: classComponent.options_material,
              value,
              onChange(newValue) {
                classComponent.material = newValue?.value ?? '';
              },
            },
          },
        };

        return <InputSel_prod_memo_select {...inputSelProps} />;
      },
    },

    materialSurface: {
      label: '表面',
      style: { width: 110 },
      createNode({ disabled, classComponent }) {
        const v = classComponent.materialSurface;
        const value = v ? { value: v, label: v } : null;

        const inputSelProps: TinputSelProps = {
          disabled,
          selectProps: {
            props: {
              placeholder: '',
              options: classComponent.options_materialSurface,
              value,
              onChange(newValue) {
                classComponent.materialSurface = newValue?.value ?? '';
              },
            },
          },
        };

        return <InputSel_prod_memo_select {...inputSelProps} />;
      },
    },

    density: {
      label: '重量基重',
      style: { width: 80 },
      createNode() {
        return null;
      },
    },

    isPainted: {
      label: '烤漆',
      style: {
        width: 40,
        textAlign: 'center',
      },
      createNode({ disabled, classComponent }) {
        return (
          <Checkbox
            disabled={disabled}
            checked={classComponent.isPainted}
            onChange={(e) => {
              classComponent.isPainted = e.target.checked;
            }}
          />
        );
      },
    },

    unit: {
      label: '單位',
      style: { width: 40 },
      createNode({ disabled, classComponent }) {
        return classComponent.unit;
      },
    },

    quantity: {
      label: '數量',
      style: { width: 40 },
      createNode({ disabled, classComponent }) {
        const inputSelProps: TinputSelProps = {
          disabled,
          inputProps: {
            props: {
              placeholder: '',
              type: 'number',
              value: classComponent.quantity,
              onChange(e) {
                classComponent.quantity = e.target.value as `${number}` | '';
              },
            },
          },
        };

        return <InputSel_prod {...inputSelProps} />;
      },
    },

    price: {
      label: '牌價',
      style: { width: 80, textAlign: 'right' },
      createNode({ disabled, classComponent }) {
        const { value, type } = inputLocaleStringSwitcher(classComponent.price, disabled);

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
                  classComponent.price = e.target.value as `${number}` | '';
                }
              },
            },
          },
        };

        return <InputSel_prod {...inputSelProps} />;
      },
    },

    dualPrice: {
      label: '牌價複價',
      style: {
        width: 100,
        textAlign: 'right',
      },
      createNode({ disabled, classComponent }) {
        const dualPrice = classComponent.dualPrice.toLocaleString();

        return dualPrice;
      },
    },

    unitPrice: {
      label: '單價',
      style: { width: 80, textAlign: 'right' },
      createNode({ disabled, classComponent }) {
        const unitPrice = classComponent.unitPrice.toLocaleString();

        return unitPrice;
      },
    },

    totalPrice: {
      label: '複價',
      style: { width: 100, textAlign: 'right' },
      createNode({ disabled, classComponent }) {
        const totalPrice = classComponent.totalPrice.toLocaleString();

        return totalPrice;
      },
    },

    //
  };

  return nodeConfig_component;
};

// ========================================================================

export type {
  //
  TnodeConfig_component,
  TcellKey_component,
};
export {
  //
  // nodeConfig_component,
  // copyNodeConfig_component,
  defaultKeyArr_component,
  createNodeConfig_component,
  //
};

// ========================================================================
// ========================================================================
// ========================================================================
// ========================================================================

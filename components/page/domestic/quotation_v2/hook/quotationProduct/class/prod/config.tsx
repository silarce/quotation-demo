import { memo } from 'react';

import _ from 'lodash';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import {
  lookup_classProd,
  Interface_ClassProd_base,
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
// =======================================================================
const options_quoteType = optionsCreator_quoteType();
// =======================================================================

interface TcoTconfigItem_base {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
}
// ------------------------------------------------------------------------
interface TconfigItem_prod extends TcoTconfigItem_base {
  createNode: (params: {
    //
    classProd: Interface_ClassProd_base;
    disabled: boolean;
  }) => React.ReactNode;
}

type TcellKey = keyof Pick<
  Interface_ClassProd_base,
  | 'itemName'
  | 'discount'
  | 'quoteType'
  | 'doorModelName'
  | 'fullWidth'
  | 'WG'
  | 'height'
  | 'boxB'
  | 'boxD'
  | 'area'
  | 'volume'
>;

type TnodeConfig = {
  readonly [key in TcellKey]: TconfigItem_prod;
};

// ----------------------------------------------------------------------------

interface TconfigItem_component extends TcoTconfigItem_base {
  createNode: (params: {
    //
    classComponent: Interface_ClassComponent_prime;
    disabled: boolean;
  }) => React.ReactNode;
}

type TcellKey_component = keyof Pick<Interface_ClassComponent_prime, 'name' | 'number' | 'desc'>;

type TnodeConfig_component = {
  readonly [key in TcellKey_component]: TconfigItem_component;
};

// =======================================================================

const InputSel_cooked = (props: Parameters<typeof InputSel>[0]) => {
  return <InputSel showBaseline="auto" {...props} />;
};

const InputSel_meme_forSelect = memo(InputSel_cooked, (prev, next) => {
  const { value: _oldValue, options: oldOptions } = prev?.selectProps?.props ?? {};
  const { value: _newValue, options: newOptions } = next?.selectProps?.props ?? {};

  const oldValue = (_oldValue as { value: string }).value;
  const newValue = (_newValue as { value: string }).value;

  return oldValue === newValue && _.isEqual(oldOptions, newOptions) && prev.disabled === next.disabled;
});

// =======================================================================

const defaultKeyArr: TcellKey[] = [
  // 'itemName',
  'discount',
  'quoteType',
  'doorModelName',
  'fullWidth',
  'WG',
  'height',
  'boxB',
  'boxD',
  'area',
  'volume',
];

// =======================================================================

// MARK:nodeConfig_origin

const nodeConfig_origin: TnodeConfig = {
  itemName: {
    label: '項目',
    style: { width: 150 },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classProd.itemName,
          onChange: (e) => {
            classProd.itemName = e.target.value;
          },
        },
      };

      return <InputSel_cooked inputProps={inputProps} disabled={disabled} />;
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

      return <InputSel_cooked inputProps={inputProps} disabled={disabled} />;
    },
  },

  quoteType: {
    label: '報價別',
    style: { width: 200 },
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

      return <InputSel_meme_forSelect selectProps={selectProps} disabled={disabled} />;
    },
  },

  doorModelName: {
    label: '門型',
    style: { width: 200 },
    createNode() {
      return null;
    },
  },

  fullWidth: {
    label: 'L', // 全寬
    style: {
      width: 100,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.fullWidth,
          onChange: (e) => {
            classProd.fullWidth = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_cooked inputProps={inputProps} disabled={disabled} />;
    },
  },

  WG: {
    label: 'WG',
    style: {
      width: 100,
    },
    createNode({ disabled, classProd }) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.WG,
          onChange: (e) => {
            classProd.WG = e.target.value as `${number}` | '';
          },
        },
      };

      return <InputSel_cooked inputProps={inputProps} disabled={disabled} />;
    },
  },

  height: {
    label: 'h',
    style: {
      width: 100,
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

      return <InputSel_cooked inputProps={inputProps} disabled={disabled} />;
    },
  },

  boxB: {
    label: 'B',
    style: {
      width: 100,
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

      return <InputSel_meme_forSelect disabled={disabled} selectProps={selectProps} />;
    },
  },

  boxD: {
    label: 'D',
    style: {
      width: 100,
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

      return <InputSel_meme_forSelect disabled={disabled} selectProps={selectProps} />;
    },
  },

  area: {
    label: '面積',
    style: {
      width: 100,
    },
    createNode({ classProd }) {
      // return <InputSel_cooked node={classProd.area} showBaseline="invisible" />;
      return classProd.area;
    },
  },

  volume: {
    label: '才數',
    style: {
      width: 100,
    },
    createNode({ classProd }) {
      // return <InputSel_cooked node={classProd.volume} showBaseline="invisible" />;
      return classProd.volume;
    },
  },
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

    return <InputSel_meme_forSelect selectProps={selectProps} disabled={disabled} />;
  };

  return nodeConfig_prime;
};

// ===============================================================================

const defaultKeyArr_component: TcellKey_component[] = ['name', 'number', 'desc'];

const createNodeConfig_component = (): TnodeConfig_component => {
  const nodeConfig_component: TnodeConfig_component = {
    name: {
      label: '名稱',
      style: { width: 100 },
      createNode({ disabled, classComponent }) {
        return classComponent.name;
      },
    },
    number: {
      label: '代號',
      style: { width: 100 },
      createNode({ disabled, classComponent }) {
        return classComponent.number;
      },
    },
    desc: {
      label: '說明',
      style: { width: 100 },
      createNode({ disabled, classComponent }) {
        return classComponent.desc;
      },
    },
  };

  return nodeConfig_component;
};

// ===============================================================================
export type {
  //
  TconfigItem_prod as TconfigItem,
  TcellKey,
  TnodeConfig,
  //
  TnodeConfig_component,
};
export {
  //
  defaultKeyArr,
  createNodeConfig_prime,
  nodeConfig_origin,
  //
  // nodeConfig_component,
  // copyNodeConfig_component,
  defaultKeyArr_component,
  createNodeConfig_component,
};

import { memo } from 'react';

import _ from 'lodash';

import Select from 'react-select';
import { Select as Select_antd } from 'antd';
import Select_mui from '@mui/material/Select';

// gear
import InputSel, { TinputSelProps } from 'components/global/gear/inputAndSel_v2/inputSel';

import {
  lookup_classProd,
  Interface_ClassProd_base,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/lookup_classProd';

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

const InputSel_meme_forSelect = memo(InputSel, (prev, next) => {
  const { value: _oldValue, options: oldOptions } = prev?.selectProps?.props ?? {};
  const { value: _newValue, options: newOptions } = next?.selectProps?.props ?? {};

  const oldValue = (_oldValue as { value: string }).value;
  const newValue = (_newValue as { value: string }).value;

  return oldValue === newValue && _.isEqual(oldOptions, newOptions);
});

// =======================================================================

interface TconfigItem {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
  // createInputSelProps: (classProd: Interface_ClassProd_base) => TinputSelProps | null;
  createNode: (classProd: Interface_ClassProd_base) => React.ReactNode;
}

type TcellKey = keyof Pick<
  Interface_ClassProd_base,
  'itemName' | 'discount' | 'quoteType' | 'doorModelName'
  // | 'fullWidth'
  // | 'WG'
  // | 'height'
  // | 'boxB'
  // | 'boxD'
  // | 'area'
  // | 'volume'
>;

// type Tconfig = {
//   [key in TcellKey]: TconfigItem;
// };

type TnodeConfig = {
  readonly [key in TcellKey]: TconfigItem;
};

// =======================================================================

const options_quoteType = optionsCreator_quoteType();

// =======================================================================

const defaultKeyArr: TcellKey[] = [
  'itemName',
  'discount',
  'quoteType',
  'doorModelName',
  // 'fullWidth',
  // 'WG',
  // 'height',
  // 'boxB',
  // 'boxD',
  // 'area',
  // 'volume',
];

// const createDefaultCellKeyArr = () => {
//   const keyArr: TcellKey[] = [
//     'itemName',
//     'discount',
//     'quoteType',
//     // 'fullWidth',
//     // 'WG',
//     // 'height',
//     // 'boxB',
//     // 'boxD',
//     // 'area',
//     // 'volume',
//   ];

//   return keyArr;
// };

// =======================================================================

const nodeConfig_origin: TnodeConfig = {
  itemName: {
    label: '項目',
    style: { width: 350 },
    createNode(classProd) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          value: classProd.itemName,
          onChange: (e) => {
            classProd.itemName = e.target.value;
          },
        },
      };

      return <InputSel inputProps={inputProps} />;
    },
  },
  discount: {
    label: '折扣',
    style: { width: 60 },
    createNode(classProd) {
      const inputProps: TinputSelProps['inputProps'] = {
        props: {
          type: 'number',
          value: classProd.discount,
          onChange: (e) => {
            classProd.discount = e.target.value;
          },
        },
      };

      return <InputSel inputProps={inputProps} />;
    },
  },
  quoteType: {
    label: '報價別',
    style: { width: 200 },
    createNode(classProd) {
      const selectProps: TinputSelProps['selectProps'] = {
        props: {
          isSearchable: true,
          options: options_quoteType,
          value: classProd.quoteType ? { value: classProd.quoteType, label: classProd.quoteType } : null,
          onChange: (option) => {
            const value = option?.value || '';
            classProd.quoteType = value;
          },
        },
      };

      return <InputSel_meme_forSelect selectProps={selectProps} />;
    },
  },
  doorModelName: {
    label: '門型',
    style: { width: 200 },
    createNode() {
      return null;
    },
  },
};

const createNodeConfig_prime = ({
  //
  doorModelDict,
}: {
  doorModelDict: Record<string, TdoorModelInfoDto> | undefined | null;
}) => {
  const nodeConfig_prime: TnodeConfig = _.cloneDeep(nodeConfig_origin);

  nodeConfig_prime.doorModelName.createNode = (classProd) => {
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

    return <InputSel_meme_forSelect selectProps={selectProps} />;
  };

  return nodeConfig_prime;
};

export type { TconfigItem, TcellKey, TnodeConfig };
export { defaultKeyArr, createNodeConfig_prime, nodeConfig_origin };

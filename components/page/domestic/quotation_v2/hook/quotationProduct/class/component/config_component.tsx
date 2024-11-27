import { memo } from 'react';

import _ from 'lodash';

// gear
import InputSel, {
  TinputSelProps,
  InputSel_s1,
  InputSel_memo_select,
} from 'components/global/gear/inputAndSel_v2/inputSel';

import {
  lookup_classProd,
  Interface_ClassProd_base,
} from 'components/page/domestic/quotation_v2/hook/quotationProduct/class/prod/lookup_classProd';
import { Interface_ClassComponent_base, Interface_ClassComponent_prime } from '../component/classComponent_base';

import { TdoorModelInfoDto } from 'js/api/api_product';

// ========================================================================

interface TconfigItem_component {
  readonly label: React.ReactNode;
  style?: React.CSSProperties;
  className?: string;
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

// ========================================================================

const defaultKeyArr_component: TcellKey_component[] = [
  // 'name',
  'number',
  'desc',
];

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
      style: { width: 200 },
      createNode({ disabled, classComponent }) {
        return classComponent.desc;
      },
    },
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

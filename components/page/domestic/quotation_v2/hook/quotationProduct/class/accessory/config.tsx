import _ from 'lodash';

// gear
import InputSel, {
  TinputSelProps,
  InputSel_s1,
  InputSel_memo_select,
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

type TcellKey_accessory = keyof Pick<Interface_ClassAccessory, 'name' | 'unit'>;

type TnodeConfig_accessory = {
  readonly [key in TcellKey_accessory]: TconfigItem_accessory;
};

// ============================================================================

const defaultKeyArr_accessory: TcellKey_accessory[] = ['name', 'unit'];

// ============================================================================

const createNodeConfig_accessory = (): TnodeConfig_accessory => {
  const nodeConfig: TnodeConfig_accessory = {
    name: {
      label: '名稱',
      style: { width: 100 },
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
  };

  return nodeConfig;
};

// ============================================================================
export type { TconfigItem_accessory, TnodeConfig_accessory };
export { defaultKeyArr_accessory, createNodeConfig_accessory };

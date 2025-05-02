import classNames from 'classnames';

import Row_, { Cell as Cell_, Tprops_cell, Tprops_row } from 'components/global/gear/table/row';
import DataEntry, { Input, Checkbox } from 'components/global/gear/dataEntry';

import type { Tinstance_useDemandForm, TstateKit } from '../useDemandForm';

import scss from './index.module.scss';

// =========================================================================

type Tkeys =
  | 'itemName'
  | 'doorModel'
  | 'fullWidth'
  | 'WG'
  | 'height'
  | 'volume'
  | 'motor'
  | 'horsepower'
  | 'voltage'
  | 'antiTyphoonBaseLock'
  | 'obstacleSensor'
  | 'infrared'
  | 'remoteControl'
  | 'smartSwitch'
  | 'antiTyphoonColumn'
  | 'ul'
  | 'wheel'
  | 'floor'
  | 'locationArea';

type Tconfig = {
  [key in Tkeys]: {
    label: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    render: (props: { disabled: boolean; stateKit: TstateKit }) => React.ReactNode;
  };
};

// =========================================================================

const Cell = ({ className, ...props }: Tprops_cell) => {
  return <Cell_ className={classNames(scss.cell, className)} {...props} />;
};

const Row = ({ className, ...props }: Tprops_row) => {
  return <Row_ className={classNames(scss.row, className)} {...props} />;
};

// =========================================================================
export default function Table_main({
  disabled,
  instance_useDemandForm,
}: {
  disabled: boolean;
  instance_useDemandForm: Tinstance_useDemandForm;
}) {
  const { stateArr, createStateKit } = instance_useDemandForm;

  return (
    <div className={scss.table}>
      <Row thead={true}>
        {keyArr.map((key) => {
          const { label, style, className } = config[key];

          return (
            <Cell key={key} style={style} className={className}>
              {label}
            </Cell>
          );
        })}
      </Row>

      {stateArr.map((state, index) => {
        const stateKit = createStateKit(index);

        return (
          <Row key={index} thead={false}>
            {keyArr.map((key) => {
              const { render, style, className } = config[key];

              return (
                <Cell key={key} style={style} className={className}>
                  {render({ disabled, stateKit })}
                </Cell>
              );
            })}
          </Row>
        );
      })}
    </div>
  );
}
// =========================================================================

const config: Tconfig = {
  itemName: {
    label: '項目名稱',
    style: { width: 200 },
    render({ stateKit: { state, setChecked } }) {
      return (
        <div className="flex gap-1">
          <Checkbox
            checked={state.checked}
            onChange={(e) => {
              setChecked(e.target.checked);
            }}
          />
          {state.itemName}
        </div>
      );
    },
  },
  doorModel: {
    label: '門型',
    style: { width: 100 },
    render({ stateKit: { state } }) {
      return state.doorModel;
    },
  },
  fullWidth: {
    label: 'L',
    style: { width: 60 },
    render({ stateKit: { state } }) {
      return state.fullWidth;
    },
  },
  WG: {
    label: 'WG',
    style: { width: 60 },
    render({ stateKit: { state } }) {
      return state.WG;
    },
  },
  height: {
    label: 'h',
    style: { width: 60 },
    render({ stateKit: { state } }) {
      return state.height;
    },
  },
  volume: {
    label: '才數',
    style: { width: 60 },
    render({ stateKit: { state } }) {
      return state.volume;
    },
  },
  motor: {
    label: '馬達',
    style: { width: 50 },
    render({ stateKit: { state } }) {
      return state.motor;
    },
  },
  horsepower: {
    label: '馬力數',
    style: { width: 50 },
    render({ stateKit: { state } }) {
      return state.horsepower;
    },
  },
  voltage: {
    label: '電壓',
    style: { width: 100 },
    render({ stateKit: { state } }) {
      return state.voltage;
    },
  },
  antiTyphoonBaseLock: {
    label: '防颱鎖固',
    style: { width: 70 },
    render({ stateKit: { state } }) {
      return state.antiTyphoonBaseLock;
    },
  },
  obstacleSensor: {
    label: '障感器',
    style: { width: 70, justifyContent: 'center' },
    render({ stateKit: { state } }) {
      return <Checkbox checked={state.obstacleSensor} disabled={true} />;
    },
  },
  infrared: {
    label: '紅外線',
    style: { width: 70, justifyContent: 'center' },
    render({ stateKit: { state } }) {
      return <Checkbox checked={state.infrared} disabled={true} />;
    },
  },
  remoteControl: {
    label: '遙控器',
    style: { width: 70, justifyContent: 'center' },
    render({ stateKit: { state } }) {
      return <Checkbox checked={state.remoteControl} disabled={true} />;
    },
  },
  smartSwitch: {
    label: '智慧開關',
    style: { width: 70, justifyContent: 'center' },
    render({ stateKit: { state } }) {
      return <Checkbox checked={state.smartSwitch} disabled={true} />;
    },
  },
  antiTyphoonColumn: {
    label: '防颱中柱',
    style: { width: 70, justifyContent: 'center' },
    render({ stateKit: { state } }) {
      return <Checkbox checked={state.antiTyphoonColumn} disabled={true} />;
    },
  },
  ul: {
    label: 'UL熔金體',
    style: { width: 70, justifyContent: 'center' },
    render({ stateKit: { state } }) {
      return <Checkbox checked={state.ul} disabled={true} />;
    },
  },
  wheel: {
    label: '檔輪',
    style: { width: 70, justifyContent: 'center' },
    render({ stateKit: { state } }) {
      return <Checkbox checked={state.wheel} disabled={true} />;
    },
  },
  //
  floor: {
    label: '樓層',
    style: { width: 100 },
    render({ disabled, stateKit: { state, setFloor } }) {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            disabled={disabled}
            value={state.floor}
            onChange={(e) => {
              setFloor(e.target.value);
            }}
          />
        </DataEntry>
      );
    },
  },
  locationArea: {
    label: '區域',
    style: { width: 100 },
    render({ disabled, stateKit: { state, setLocationArea } }) {
      return (
        <DataEntry showBorder={!disabled}>
          <Input
            disabled={disabled}
            value={state.locationArea}
            onChange={(e) => {
              setLocationArea(e.target.value);
            }}
          />
        </DataEntry>
      );
    },
  },
};

const keyArr: Tkeys[] = [
  'itemName',
  'doorModel',
  'fullWidth',
  'WG',
  'height',
  'volume',
  'motor',
  'horsepower',
  'voltage',
  'antiTyphoonBaseLock',
  'obstacleSensor',
  'infrared',
  'remoteControl',
  'smartSwitch',
  'antiTyphoonColumn',
  'ul',
  'wheel',
  'floor',
  'locationArea',
];

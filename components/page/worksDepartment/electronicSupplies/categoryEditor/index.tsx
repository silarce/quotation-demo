import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import classNames from 'classnames';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './index.module.scss';

import DataEntry, { TdataEntrycontainerProps, TselectProps } from 'components/global/gear/dataEntry';

import {
  optionsCreator_horsePower,
  optionsCreator_voltage,
  optionsCreator_motorVender,
} from 'js/utils/options/productOptions';

// ==================================================================

const options_horsePower = optionsCreator_horsePower();
const options_voltage = optionsCreator_voltage({ withUnit: true });
const options_motorVender = optionsCreator_motorVender();

// ==================================================================

interface TpanelProps<A extends string> {
  action: '新增' | A;
  onConfirm: (v: string) => void;
}

type Tpanel<A extends string> = React.FC<TpanelProps<A>>;

interface ThookInstance {
  render?: React.ReactNode;
  result: string;
  clear: () => void;
}

type Tdict = {
  [key: string]: ThookInstance | undefined;
};

// ==================================================================
const props: TdataEntrycontainerProps = {
  captionClassName: 'text-lg',
  captionStyle: { width: 50 },
  captionMr: 2,
};

// ==================================================================

const Title = ({ children }: { children: React.ReactNode }) => <h1 className="text-main text-2xl">{children}</h1>;
const Caption = ({ children }: { children: React.ReactNode }) => <p className="text-main text-xl">{children}</p>;

const Container = ({
  children,
  title,
  action,
  result,

  value,
  options,
  onChange,

  onConfirm,
}: {
  children: React.ReactNode;
  title: string;
  action: string | '新增';
  result: React.ReactNode;

  value: string;
  options?: TselectProps['options'];
  onChange: (v: string) => void;

  onConfirm: () => void;
}) => {
  return (
    <div className={scss.container}>
      <Title>{title}</Title>
      {action !== '新增' && <Caption>{action}</Caption>}
      {action === '新增' && (
        <DataEntry>
          <DataEntry.Select
            className={scss.select}
            placeholder="種類"
            options={options}
            value={value || null}
            onChange={(v) => onChange(v)}
          />
        </DataEntry>
      )}
      <br />
      <div className="min-h-[250px]">{children}</div>
      <br />
      <p className="text-xl">種類:{result}</p>
      <br />
      <MyButton_v2 className={classNames(!value && 'invisible')} onClick={onConfirm}>
        確定
      </MyButton_v2>
    </div>
  );
};

// ==================================================================

const ControlBox: Tpanel<'台電控制箱' | '馬達控制箱' | 'UPS不斷電系統' | '彈射門控制箱'> = ({ action, onConfirm }) => {
  const title = action === '新增' ? '新增' : '編輯';
  const [state, setState] = useState(action === '新增' ? '' : action);

  const instance_powerControlBox = usePowerControlBox();
  const instance_motorControlBox = useMotorControlBox();
  const instance_ups = useUps();
  const instance_catapultDoorControlBox = useCatapultDoorControlBox();

  const dict: Tdict = {
    台電控制箱: instance_powerControlBox,
    馬達控制箱: instance_motorControlBox,
    UPS不斷電系統: instance_ups,
    彈射門控制箱: instance_catapultDoorControlBox,
  };

  const options = Object.keys(dict).map((key) => ({ value: key, label: key }));

  const { result, clear, render } = dict[state] ?? {};

  useEffect(() => {
    return () => {
      clear?.();
    };
  }, [state]);

  return (
    <Container
      title={title}
      action={action}
      result={result}
      value={state}
      options={options}
      onChange={(v) => setState(v)}
      onConfirm={() => onConfirm(result ?? '')}
    >
      {render}
    </Container>
  );
};

const LuckKey: Tpanel<'鎖號'> = ({ action, onConfirm }) => {
  const title = action === '新增' ? '新增' : '編輯';
  const [state, setState] = useState('');

  const instance_luckNumber = useLuckNumber();
  const instance_specialLuckNumber = useSpecialLuckNumber();

  const dict: Tdict = {
    鎖號: instance_luckNumber,
    特殊鎖號: instance_specialLuckNumber,
  };

  const options = Object.keys(dict).map((key) => ({ value: key, label: key }));

  const { result, clear, render } = dict[state] ?? {};

  useEffect(() => {
    return () => {
      clear?.();
    };
  }, [state]);

  return (
    <Container
      title={title}
      action={action}
      result={result}
      value={state}
      options={options}
      onChange={(v) => setState(v)}
      onConfirm={() => onConfirm(result ?? '')}
    >
      {render}
    </Container>
  );
};

// ==================================================================
// MARK:usePowerControlBox
const usePowerControlBox = (): ThookInstance => {
  const [state_horsepower, setState_horsepower] = useState('');
  const [state_brand, setState_brand] = useState('');
  const [state_voltage, setState_voltage] = useState('');

  let result = '台電控制箱 ';
  state_horsepower && (result += ` ${state_horsepower}`);
  state_brand && (result += ` ${state_brand}`);
  state_voltage && (result += ` ${state_voltage}`);

  const clear = () => {
    setState_horsepower('');
    setState_brand('');
    setState_voltage('');
  };

  const render = (
    <div key="powerControlBox">
      <Horsepower onChange={setState_horsepower} />
      <br />
      <Brand onChange={setState_brand} />
      <br />
      <Voltage onChange={setState_voltage} />
    </div>
  );

  return {
    render,
    result,
    clear,
  };
};

// MARK:useMotorControlBox
const useMotorControlBox = (): ThookInstance => {
  const [state_horsepower, setState_horsepower] = useState('');
  const [state_voltage, setState_voltage] = useState('');

  let result = '馬達控制箱';
  state_horsepower && (result = `${state_horsepower}${result}`);
  state_voltage && (result = `${result}(${state_voltage})`);

  const clear = () => {
    setState_horsepower('');
    setState_voltage('');
  };

  const render = (
    <div key="motorControlBox">
      <Horsepower onChange={setState_horsepower} />
      <br />
      <Voltage onChange={setState_voltage} />
    </div>
  );

  return {
    render,
    result,
    clear,
  };
};

// MARK:useUps
const useUps = (): ThookInstance => {
  const [state_horsepower, setState_horsepower] = useState('');

  let result = 'UPS不斷電系統 ';
  state_horsepower && (result += ` ${state_horsepower}`);

  const clear = () => {
    setState_horsepower('');
  };

  const render = (
    <div key="ups">
      <Horsepower onChange={setState_horsepower} />
    </div>
  );

  return {
    render,
    result,
    clear,
  };
};

// MARK:useUps
const useCatapultDoorControlBox = (): ThookInstance => {
  const [state_horsepower, setState_horsepower] = useState('');
  const [state_voltage, setState_voltage] = useState('');
  const [state_brand, setState_brand] = useState('');

  let result = '彈射門控制箱';
  state_horsepower && (result = `${result}${state_horsepower}`);
  state_voltage && (result = `${result} ${state_voltage}`);
  state_brand && (result = `${result}(${state_brand})`);

  const clear = () => {
    setState_horsepower('');
    setState_voltage('');
    setState_brand('');
  };

  const render = (
    <div key="catapultDoorControlBox">
      <Horsepower onChange={setState_horsepower} />
      <br />
      <Brand onChange={setState_brand} />
      <br />
      <Voltage onChange={setState_voltage} />
    </div>
  );

  return {
    result,
    clear,
    render,
  };
};

// ==============================================================================

const useLuckNumber = (): ThookInstance => {
  const [state_luckNumber, setState_state_luckNumber] = useState('');

  let result = '鎖號';
  state_luckNumber && (result = `${result} : ${state_luckNumber}`);

  const clear = () => {
    setState_state_luckNumber('');
  };

  const render = (
    <div key="catapultDoorControlBox">
      <DataEntry caption="號碼" {...props}>
        <DataEntry.Input onChange={(e) => setState_state_luckNumber(e.target.value)} />
      </DataEntry>
    </div>
  );

  return {
    result,
    clear,
    render,
  };
};

const useSpecialLuckNumber = (): ThookInstance => {
  const [state_luckNumber, setState_state_luckNumber] = useState('');

  let result = '特殊鎖號';
  state_luckNumber && (result = `${result} : ${state_luckNumber}`);

  const clear = () => {
    setState_state_luckNumber('');
  };

  const render = (
    <div key="catapultDoorControlBox">
      <DataEntry caption="號碼" {...props}>
        <DataEntry.Input onChange={(e) => setState_state_luckNumber(e.target.value)} />
      </DataEntry>
    </div>
  );

  return {
    result,
    clear,
    render,
  };
};

// ==============================================================================

const Horsepower = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  return (
    <DataEntry caption="馬力" {...props}>
      <DataEntry.Select value={value} onChange={onChange} options={options_horsePower} />
    </DataEntry>
  );
};

const Brand = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  return (
    <DataEntry caption="廠牌" {...props}>
      <DataEntry.Select value={value} onChange={onChange} options={options_motorVender} />
    </DataEntry>
  );
};

const Voltage = ({ value, onChange }: { value?: string; onChange: (v: string) => void }) => {
  return (
    <DataEntry caption="電壓" {...props}>
      <DataEntry.Select value={value} onChange={onChange} options={options_voltage} />
    </DataEntry>
  );
};

// ==============================================================================
// ==============================================================================
export { ControlBox, LuckKey };
export type { TpanelProps, Tpanel };

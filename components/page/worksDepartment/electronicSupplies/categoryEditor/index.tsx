import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import myAlert from 'components/global/gear/modal/simpleModal/alertModals';

import classNames from 'classnames';

import MyButton_v2 from 'components/global/gear/button/myButton_v2';

import scss from './index.module.scss';

import DataEntry, { TdataEntrycontainerProps, TselectProps } from 'components/global/gear/dataEntry';

// ==================================================================

interface TpanelProps<A extends string> {
  action: '新增' | A;
  onConfirm: (v: string) => void;
}

type Tpanel<A extends string> = React.FC<TpanelProps<A>>;

interface ThookInstance {
  Render: React.FC;
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

const ControlBox: Tpanel<'台電控制箱'> = ({ action, onConfirm }) => {
  const title = action === '新增' ? '新增' : '編輯';
  const [state, setState] = useState('');

  const instance_powerControlBox = usePowerControlBox();

  const dict: Tdict = {
    台電控制箱: instance_powerControlBox,
  };

  const { Render, result, clear } = dict[state] ?? {};

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
      options={[{ value: '台電控制箱', label: '台電控制箱' }]}
      onChange={(v) => setState(v)}
      onConfirm={() => onConfirm(result ?? '')}
    >
      {Render && <Render />}
    </Container>
  );
};

// ==================================================================
// MARK:usePowerControlBox
const usePowerControlBox = (): ThookInstance => {
  const [state_horsepower, setState_horsepower] = useState('');
  const [state_brand, setState_brand] = useState('');
  const [state_voltage, setState_voltage] = useState('');

  let result = '台電控制箱:';
  state_horsepower && (result += ` ${state_horsepower}`);
  state_brand && (result += ` ${state_brand}`);
  state_voltage && (result += ` ${state_voltage}`);

  const clear = () => {
    setState_horsepower('');
    setState_brand('');
    setState_voltage('');
  };

  const Render = useCallback(() => {
    return (
      <div>
        <DataEntry caption="馬力" {...props}>
          <DataEntry.Select
            value={state_horsepower}
            onChange={(v) => setState_horsepower(v)}
            options={[
              {
                label: '1HP',
                value: '1HP',
              },
              {
                label: '2HP',
                value: '2HP',
              },
            ]}
          />
        </DataEntry>
        <br />
        <DataEntry caption="廠牌" {...props}>
          <DataEntry.Select
            value={state_brand}
            onChange={(v) => setState_brand(v)}
            options={[
              {
                label: '東元',
                value: '東元',
              },
              {
                label: '大同',
                value: '大同',
              },
            ]}
          />
        </DataEntry>
        <br />
        <DataEntry caption="電壓" {...props}>
          <DataEntry.Select
            value={state_voltage}
            onChange={(v) => setState_voltage(v)}
            options={[
              {
                label: '220V',
                value: '220V',
              },
              {
                label: '380V',
                value: '380V',
              },
            ]}
          />
        </DataEntry>
      </div>
    );
  }, [state_horsepower, state_brand, state_voltage]);

  return {
    Render,
    result,
    clear,
  };
};

// ==============================================================================
// ==============================================================================
// ==============================================================================
export { ControlBox };

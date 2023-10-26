import { useState } from 'react';

// global gear
import InputSel from 'components/global/gear/inputAndSel/inputSel';

// gear
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';

// css
import style from './signature.module.scss';

// type
import { TemployeeDto } from 'js/api/dtoTypes';

type Tcontroll = {
  accounting: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
  };
  warehouseEmployee: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
  };
  factoryEmployee: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
  };
  supervisor: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
  };
  formCompleter: {
    employee: TemployeeDto | undefined;
    onChange: (v: TemployeeDto) => void;
  };
};

export type { Tcontroll, TemployeeDto };

// ===================================================================

export default function Signature({ controll, disabled }: { controll: Tcontroll; disabled?: boolean }) {
  const [targetControllKey, setTargetControllKey] = useState<keyof Tcontroll | undefined>(undefined);
  const targetControll = targetControllKey ? controll[targetControllKey] : undefined;

  return (
    <div className={style.signature}>
      {indexKeys.map((key, index) => {
        const { label, placeholder } = config[key];
        const value = (controll[key].employee?.chName || controll[key].employee?.enName) ?? '';

        const onClick = () => {
          setTargetControllKey(key);
        };

        return (
          <div className={style.cell} key={index} onClick={onClick}>
            <span>{label}</span>
            <InputSel
              className={style.input02}
              inputProps={{
                value,
              }}
              placeholder={placeholder}
              disabled={disabled}
              showBaseline="auto"
            />
          </div>
        );
      })}
      <EmployeeSelector
        showModal={!!targetControll}
        onConfirm={(arr) => {
          targetControll?.onChange(arr[0]);
        }}
        onCancel={() => setTargetControllKey(undefined)}
        defaultEmpArr={targetControll?.employee ? [targetControll.employee] : undefined}
        selLimit={1}
      />
    </div>
  );
}

// ========================================================

type TindexKeys = keyof Tcontroll;
const indexKeys: TindexKeys[] = ['accounting', 'warehouseEmployee', 'factoryEmployee', 'supervisor', 'formCompleter'];

const config: {
  [key in TindexKeys]: {
    label: string;
    placeholder: string;
  };
} = {
  accounting: {
    label: '會計',
    placeholder: '請選擇會計',
  },
  warehouseEmployee: {
    label: '倉庫人員',
    placeholder: '請選擇倉庫人員',
  },
  factoryEmployee: {
    label: '廠務人員',
    placeholder: '請選擇廠務人員',
  },
  supervisor: {
    label: '單位主管',
    placeholder: '請選擇單位主管',
  },
  formCompleter: {
    label: '填表人員',
    placeholder: '請選擇填表人員',
  },
};

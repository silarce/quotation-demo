import { useState } from 'react';
import classNames from 'classnames';

// global gear
// import InputSel from 'components/global/gear/inputAndSel/inputSel';
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';

// gear
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';

// css
import style from './quotationSinature.module.scss';

// type
import { TemployeeDto } from 'js/api/dtoTypes';

type Tcontroll = {
  manager?: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto | undefined) => void;
    forbidden?: boolean;
  };
  workDirector?: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto | undefined) => void;
    forbidden?: boolean;
  };
  supervisor?: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto | undefined) => void;
    forbidden?: boolean;
  };
  sales: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto | undefined) => void;
    forbidden?: boolean;
  };
  agent: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto | undefined) => void;
    forbidden?: boolean;
  };
};

export type { Tcontroll as Tcontroll_signature, TemployeeDto };

// ===================================================================

export default function Signature({ controll, disabled }: { controll: Tcontroll; disabled?: boolean }) {
  const [targetControllKey, setTargetControllKey] = useState<keyof Tcontroll | undefined>(undefined);
  const targetControll = targetControllKey ? controll[targetControllKey] : undefined;

  const keyArr = Object.keys(controll) as TindexKeys[];

  const toLeft = keyArr.length < 5;

  return (
    <div className={classNames(style.signature, toLeft && style.toLeft)}>
      {keyArr.map((key, index) => {
        if (!controll[key]) {
          return null;
        }

        const theControl = controll[key]!;

        const { label, placeholder } = config[key];
        const value = (theControl.employee?.chName || theControl.employee?.enName) ?? '';
        const forbidden = theControl.forbidden;

        const onClick = () => {
          if (disabled || forbidden) {
            return;
          }

          setTargetControllKey(key);
        };

        return (
          <div className={style.cell} key={index} onClick={onClick}>
            <span>{label}</span>
            <InputSel
              className={style.input02}
              inputProps={{
                props: {
                  value,
                  placeholder,
                },
              }}
              disabled={forbidden || disabled}
              showBaseline="always"
              showAddIcon={forbidden || disabled ? false : true}
            />
          </div>
        );
      })}
      <EmployeeSelector
        showModal={!!targetControll}
        onConfirm={(arr) => {
          targetControll?.onChange?.(arr[0]);
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
const indexKeys: TindexKeys[] = ['manager', 'workDirector', 'supervisor', 'sales', 'agent'];

const config: {
  [key in TindexKeys]: {
    label: string;
    placeholder: string;
  };
} = {
  manager: {
    label: '總經理',
    placeholder: '',
  },
  workDirector: {
    label: '應收帳款',
    placeholder: '',
  },
  supervisor: {
    label: '業務主管',
    placeholder: '',
  },
  sales: {
    label: '業務',
    placeholder: '',
  },
  agent: {
    label: '經辦',
    placeholder: '',
  },
};

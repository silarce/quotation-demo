import { useState } from 'react';

// global gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';
// type
import { TemployeeDto } from 'js/api/dtoTypes';
// css
import style from './quotationSinature.module.scss';
// ===================================================================

type Tcontrol = {
  manager: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto) => void;
  };
  director: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto) => void;
  };
  agent: {
    employee: TemployeeDto | undefined | null;
    onChange?: (v: TemployeeDto) => void;
  };
};

export type { Tcontrol as Tcontrol_sinature, TemployeeDto };

// ===================================================================

export default function QuotationSinature({
  // signatureArr,
  control,
  disabled = false,
}: {
  // signatureArr: TsignatureProps[];
  control: Tcontrol;
  disabled: boolean;
}) {
  const [showManagerHandler, setShowManagerHandler] = useState(false);
  const [showDirector, setShowDirector] = useState(false);
  const [showAgent, setShowAgent] = useState(false);

  const lookup = {
    manager: setShowManagerHandler,
    director: setShowDirector,
    agent: setShowAgent,
  } as const;

  return (
    <div className={style.container}>
      {/* {signatureArr.map((item, index) => {
        const { label, inputProps } = item;

        return (
          <div key={index}>
            <span>{label}</span>
            <InputSel inputProps={inputProps} disabled={disabled} showBaseline={'always'} />
          </div>
        );
      })} */}

      {indexKeys.map((key, index) => {
        const { label, placeholder } = config[key];
        const value = (control[key].employee?.chName || control[key].employee?.enName) ?? '';

        const onClick = () => {
          if (disabled) {
            return;
          }

          lookup[key](true);
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
                  onChange: () => {},
                },
              }}
              disabled={disabled}
              showBaseline="auto"
              showAddIcon={disabled ? false : true}
            />
          </div>
        );
      })}

      <EmployeeSelector
        showModal={showManagerHandler}
        onConfirm={(arr) => {
          control.manager.onChange?.(arr[0]);
        }}
        onCancel={() => setShowManagerHandler(false)}
        defaultEmpArr={control.manager.employee ? [control.manager.employee] : undefined}
        selLimit={1}
      />
      <EmployeeSelector
        showModal={showDirector}
        onConfirm={(arr) => {
          control.director.onChange?.(arr[0]);
        }}
        onCancel={() => setShowDirector(false)}
        defaultEmpArr={control.director.employee ? [control.director.employee] : undefined}
        selLimit={1}
      />
      <EmployeeSelector
        showModal={showAgent}
        onConfirm={(arr) => {
          control.agent.onChange?.(arr[0]);
        }}
        onCancel={() => setShowAgent(false)}
        defaultEmpArr={control.agent.employee ? [control.agent.employee] : undefined}
        selLimit={1}
      />
    </div>
  );
}

// ==================================================================

type TindexKeys = keyof Tcontrol;
const indexKeys: TindexKeys[] = ['manager', 'director', 'agent'];

const config: {
  [key in TindexKeys]: {
    label: string;
    placeholder: string;
  };
} = {
  manager: {
    label: '經理',
    placeholder: '請選擇經理',
  },
  director: {
    label: '主管',
    placeholder: '請選擇主管',
  },
  agent: {
    label: '經辦',
    placeholder: '經辦',
  },
};

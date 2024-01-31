import { useState } from 'react';
import classNames from 'classnames';

// gear
import InputSel from 'components/global/gear/inputAndSel_v2/inputSel';
import EmployeeSelector from 'components/global/gear/modal/employeeSelector';

// type
import { TemployeeDto } from 'js/api/dtoTypes';

// css
import scss from './signatureBar.module.scss';

// =======================================================================

type Tsignature = {
  label: string;
  employee: TemployeeDto | undefined;
  onChange: (v: TemployeeDto) => void;
  placeholder?: string;
  disabled?: boolean;
};

type Tcontrol = {
  signatureArr: Tsignature[];
};

export type { Tcontrol as Tcontrol_signatureBar };

// =======================================================================

export default function SignatureBar({
  //
  className,
  disabled,
  control,
}: {
  className?: string;
  disabled?: boolean;
  control: Tcontrol;
}) {
  const [targetIndex, setTargetIndex] = useState<number>(-1);
  const targetControll: Tsignature | undefined = control.signatureArr[targetIndex];

  const signatureArr = control.signatureArr;

  return (
    <div className={classNames(scss.signatureBar, 'gap-[35px]', className)}>
      {signatureArr.map((item, index) => {
        const { label, placeholder } = item;
        const value = (item.employee?.chName || item.employee?.enName) ?? '';

        const onClick = () => {
          !(item.disabled || disabled) && setTargetIndex(index);
        };

        return (
          <div key={index} className={scss.cell} onClick={onClick}>
            <span>{label}</span>
            <InputSel
              className={scss.input02}
              inputProps={{
                props: {
                  value,
                  placeholder,
                },
              }}
              disabled={item.disabled || disabled}
              showBaseline="auto"
            />
          </div>
        );
      })}

      <EmployeeSelector
        showModal={!!targetControll}
        onConfirm={(arr) => {
          targetControll?.onChange?.(arr[0]);
        }}
        onCancel={() => setTargetIndex(-1)}
        defaultEmpArr={targetControll?.employee ? [targetControll.employee] : undefined}
        selLimit={1}
      />
    </div>
  );
}

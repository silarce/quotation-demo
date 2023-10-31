// antd
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

import scss from './workSheetOptional.module.scss';

type Tcontrol = {
  value: string[];
  onChange: (arr: string[]) => void;
};

type Toption = {
  value: string;
  label: string;
};

export type { Tcontrol as Tcontrol_optional, Toption as Toption_optional };

// =============================================================
export default function WorkSheetOptional({
  // value,
  // onChange,
  control,
  optionArr,
  disabled,
}: {
  // value: string[];
  // onChange: (arr: string[]) => void;
  control: Tcontrol;
  optionArr: { value: string; label: string }[];
  disabled: boolean;
}) {
  return (
    <div className={scss.container}>
      <p className={scss.title}>選配 : </p>
      <div>
        <Checkbox.Group
          className={scss.checkGroup}
          disabled={disabled}
          options={optionArr}
          value={control.value}
          onChange={(arr) => {
            control.onChange(arr as string[]);
          }}
        />
      </div>
    </div>
  );
}

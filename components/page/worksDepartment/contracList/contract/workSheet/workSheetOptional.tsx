// antd
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';

import scss from './workSheetOptional.module.scss';

export default function WorkSheetOptional({
  value,
  onChange,
  optionArr,
  disabled,
}: {
  value: string[];
  onChange: (arr: string[]) => void;
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
          value={value}
          onChange={(arr) => {
            onChange(arr as string[]);
          }}
        />
      </div>
    </div>
  );
}

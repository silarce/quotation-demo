

// antd
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';


import scss from './optional.module.scss'


export default function WorkSheetOptional(
  {
    optionArr,
    onChange,
    disabled
  }:
    {
      optionArr: { value: string, label: string }[],
      onChange: (arr: string[]) => void
      disabled: boolean
    }
) {


  return (
    <div className={scss.container}>
      <p className={scss.title}>選配 : </p>
      <div>
        <Checkbox.Group
          className={scss.checkGroup}
          disabled={disabled}
          options={optionArr}
          //  (arr: CheckboxValueType[]) => void
          onChange={(arr) => { onChange(arr as string[]) }} />
      </div>
    </div>
  )
}



















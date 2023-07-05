

// antd
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/es/checkbox/Group';


import scss from './optional.module.scss'


export default function WorkSheetOptional(
  {
    optionArr,
    onChange }:
    {
      optionArr: { value: string, label: string }[],
      onChange: (arr: string[]) => void
    }
) {


  return (
    <div className={scss.container}>
      <p className={scss.title}>選配 : </p>
      <div>
        <Checkbox.Group
          className={scss.checkGroup}
          options={optionArr}
          //  (arr: CheckboxValueType[]) => void
          onChange={(arr) => { onChange(arr as string[]) }} />
      </div>
    </div>
  )
}



















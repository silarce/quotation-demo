import { useState } from 'react';
import moment from 'moment';
// 產生隨機字串(作為id)
import { nanoid } from 'nanoid'

// antd
import { DatePicker } from 'antd';
import 'moment/locale/zh-tw';
import locale from 'antd/lib/date-picker/locale/zh_TW';

// css
import style from "./timePicker01.module.scss"

export default function TimePicker01({
  label, stateValue, placeholder, onChange, onChange02,
  id, className, width, labelWidth, gap,
  disabled
}:
  {
    label: string,
    stateValue: string | number | undefined | null,
    onChange?: (dateString: string) => void,
    onChange02?: (
      moment: moment.Moment | null,
      dateString: string
    ) => void,
    placeholder?: string | false,
    id?: string | number
    className?: string
    width?: string
    labelWidth?: string
    gap?: string
    disabled?: boolean | undefined
  }) {
  // ========================================================
  const [isFocus, setIsFocus] = useState(false)

  // ========================================================
  // 將stateValue轉為moment物件
  const value = (() => {
    const themoment = moment(stateValue, "y-MM-DD")
    let value
    if (themoment.format("y-MM-DD") === "Invalid date")
      value = undefined
    else value = themoment
    return value
  })()
  // ========================================================

  const theOnChange = onChange02 ? onChange02
    : onChange ? (
      moment: moment.Moment | null,
      dateString: string) => {
      onChange(dateString)
    }
      : undefined

  // ========================================================

  if (id === undefined) id = nanoid()
  id = `${id}`
  // ========================================================

  const lableStyle = {
    width: width ? width : "",
    gridTemplateColumns: labelWidth ? `${labelWidth} auto` : "",
    gap: gap ? gap : "",

  }
  className = className ? className : ""

  const styleDisabled = disabled ? style.disabled : ""
  const styleFocus = isFocus ? style.focus : ""

  className = `${style.label} ${className}
  ${styleDisabled} ${styleFocus}`
  // ========================================================

  return (
    <label
      className={className}
      htmlFor={id}
      style={lableStyle}
    >
      <span>{label}</span>
      <DatePicker className={style.timePicker}
        locale={locale}
        id={id}
        value={value}
        placeholder="例 : 100-01-01"
        defaultPickerValue={moment().year(moment().year() - 1911)}
        format={"y-MM-DD"}
        disabled={disabled}
        bordered={false}
        showToday={false}
        autoComplete="off"
        onChange={theOnChange}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
      />
      <hr />
    </label>
  )
}






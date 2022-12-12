
import {
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,
  Dispatch, SetStateAction,
} from "react"

import moment from 'moment';
// antd
import { DatePicker } from 'antd';
import 'moment/locale/zh-tw';
import locale from 'antd/lib/date-picker/locale/zh_TW';

// css
import scss from "../inputSel.module.scss"




export type TdatePickerProps = {
  value: string
  boxClassName?: string
  datePickerClassName?: string

  onChange?: (dateString: string) => void,
  onChange02?: (
    moment: moment.Moment | null,
    dateString: string
  ) => void,

  onFocus?: () => void
  onBlur?: () => void

}


export default function MyDatePicker(
  {
    datePickerProps,
    setIsFocus,
    placeholder,
    disabled,
  }:
    {
      datePickerProps: TdatePickerProps
      setIsFocus: Dispatch<SetStateAction<boolean>>
      placeholder?: string
      disabled?: boolean | undefined
    }
) {


  const {
    value,
    boxClassName,
    datePickerClassName,
    onChange,
    onChange02,
    onFocus,
    onBlur,
  } = datePickerProps

  const theOnFocus = () => {
    setIsFocus(true)
    onFocus?.()
  }
  const theOnBlur = () => {
    setIsFocus(false)
    onBlur?.()
  }

  // ---------------------------------------------------------------------------
  // 將stateValue轉為moment物件
  const theValue = (() => {
    const themoment = moment(value, "y-MM-DD")
    let theValue
    if (themoment.format("y-MM-DD") === "Invalid date")
      theValue = undefined
    else theValue = themoment
    return theValue
  })()


  // ---------------------------------------------------------------------------
  const theOnChange = onChange02 ? onChange02
    : onChange ? (
      moment: moment.Moment | null,
      dateString: string) => {
      onChange(dateString)
    }
      : undefined



  const datePickerBoxClassName = (() => {
    return `${scss.datePickerBox} ${boxClassName ?? ""}`
  })();

  const theDatePickerClassName = (() => {
    return `${scss.timePicker} ${datePickerClassName ?? ""}`
  })()

  // -----------------------------------------------------------------
  return (
    <div className={datePickerBoxClassName}>
      <DatePicker className={theDatePickerClassName}
        locale={locale}
        value={theValue}
        placeholder={placeholder ?? "例 : 100-01-01"}
        defaultPickerValue={moment().year(moment().year() - 1911)}
        format={"y-MM-DD"}
        disabled={disabled}
        bordered={false}
        showToday={false}
        autoComplete="off"
        onChange={theOnChange}
        onFocus={theOnFocus}
        onBlur={theOnBlur}
      />
    </div>
  )
}
























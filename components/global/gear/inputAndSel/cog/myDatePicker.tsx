
import {
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,
  Dispatch, SetStateAction,
} from "react"

import moment from 'moment';
// antd
import { DatePicker, DatePickerProps } from 'antd';
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
  antdDatePickerProps?: DatePickerProps
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
    antdDatePickerProps,
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
    const theMoment = moment(value)
    return theMoment.isValid() ? theMoment : undefined
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
        // showToday={false}
        autoComplete="off"
        onChange={theOnChange}
        onFocus={theOnFocus}
        onBlur={theOnBlur}
        {
        ...{
          // 上面的showToday有型別錯誤，不知道為什麼
          showToday: false,
          ...antdDatePickerProps
        }
        }
      />
    </div>
  )
}
























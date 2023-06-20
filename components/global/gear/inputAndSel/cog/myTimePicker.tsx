
import {
  useRef, useEffect,
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,
  Dispatch, SetStateAction,
} from "react"
import classNames from "classnames";


import moment from 'moment';
// antd
import { TimePicker } from 'antd';
import 'moment/locale/zh-tw';
import locale from 'antd/lib/date-picker/locale/zh_TW';

// css
import scss from "../inputSel.module.scss"


export type TtimePickerProps = {
  value: string
  boxClassName?: string
  timePickerClassName?: string
  onChange?: (timeString: string) => void,
  onChange02?: (
    moment: moment.Moment | null,
    timeString: string
  ) => void,
  onFocus?: () => void
  onBlur?: () => void
  focusTrigger?: boolean
}



export default function MyTimePicker(
  {
    timePickerProps,
    setIsFocus,
    placeholder,
    disabled,
  }:
    {
      timePickerProps: TtimePickerProps
      setIsFocus: Dispatch<SetStateAction<boolean>>
      placeholder?: string
      disabled?: boolean | undefined
    }
) {

  const ref = useRef<HTMLInputElement>(null!)



  const {
    value,
    boxClassName,
    timePickerClassName,
    onChange,
    onChange02,
    onFocus,
    onBlur,
    focusTrigger,
  } = timePickerProps

  const theOnFocus = () => {
    setIsFocus(true)
    onFocus?.()
  }
  const theOnBlur = () => {
    setIsFocus(false)
    onBlur?.()
  }

  const theOnChange = (() => {
    if (onChange02) return onChange02
    if (onChange) return (moment: moment.Moment | null, dateString: string) => {
      onChange(dateString)
    }

    return undefined
  })()

  useEffect(() => {
    if (focusTrigger) ref.current.focus()
  }, [focusTrigger])


  // ---------------------------------------------------------------------------
  // ---------------------------------------------------------------------------
  // 將stateValue轉為moment物件
  const theValue = (() => {
    const themoment = moment(value)
    let theValue
    if (themoment.format("YYYY-MM-DD HH:mm:ss") === "Invalid date")
      theValue = undefined
    else theValue = themoment
    return theValue
  })()

  return (
    <div className={classNames(scss.timePickerBox, boxClassName)}>
      <TimePicker ref={ref}
        className={classNames(scss.timePicker, timePickerClassName)}
        popupClassName={classNames(scss.timePickerPopupt)}
        locale={locale}
        value={theValue}
        placeholder={placeholder ?? "HH:mm"}
        defaultValue={moment('00:00', "HH-mm")}
        format="HH-mm"
        disabled={disabled}
        bordered={false}
        showNow={false}
        autoComplete="off"
        onChange={theOnChange}
        onFocus={theOnFocus}
        onBlur={theOnBlur}
        suffixIcon={null}
        allowClear={false}
      />
    </div>
  )
}

















import {
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,

  useState
} from "react"

import classNames from "classnames";

import Image from "next/image";

// component
import Input, { TinputProps } from "./cog/input";
import MySelect, { TselectProps } from "./cog/mySelect";
import Textarea, { TtextareaProps } from "./cog/textarea";
import MyDatePicker, { TdatePickerProps } from "./cog/myDatePicker";
import MyTimePicker, { TtimePickerProps } from "./cog/myTimePicker";

// icon
import iconMust from "public/image/icon/asterisk.svg"

// css
import scss from "./inputSel.module.scss"

export type { TselectProps }


// =============================================================================

export default function InputSel(
  {
    label,
    placeholder,

    captionWidth,
    captionColor,
    width,
    gap,
    padding,
    margin,
    hrColor,

    showBaseline = "always",
    disabled,
    presetStyle,

    isMust,

    className,
    captionClassName,
    hrClassName,
    mustTipClassName,

    inputProps,
    selectProps,
    textareaProps,
    datePickerProps,
    timePickerProps,

  }:
    {
      label?: string
      placeholder?: string

      width?: CSSProperties["width"]
      gap?: CSSProperties["gap"]
      captionWidth?: CSSProperties["width"]
      captionColor?: "main"
      padding?: CSSProperties["padding"]
      margin?: CSSProperties["margin"]
      hrColor?: CSSProperties["borderColor"]


      /*invisible總是不可見(不渲染) always總是可見 auto disable時不可見*/
      showBaseline?: "invisible" | "always" | "auto"
      disabled?: boolean
      presetStyle?: "s01"

      isMust?: boolean

      className?: string
      captionClassName?: string
      hrClassName?: string
      mustTipClassName?: string

      inputProps?: TinputProps
      selectProps?: TselectProps
      textareaProps?: TtextareaProps
      datePickerProps?: TdatePickerProps
      timePickerProps?: TtimePickerProps


    }

) {

  const [isFocus, setIsFocus] = useState(false)



  // -----------------------------------------------------------------------

  if (presetStyle) {
    switch (presetStyle) {
      case "s01":
        padding = "17px 4px 14px 4px"
        gap = "40px"
        break;
      default:
        break;
    }
  }

  // -----------------------------------------------------------------------
  // 由外部控制的css，會寫在inline

  const lableStyle: CSSProperties = {
    width: width,
    gap: gap,
    gridTemplateColumns: !label ? "auto" : undefined,
    padding: padding,
    margin: margin
  }
  const captionStyle: CSSProperties = {
    width: captionWidth,
  }
  const hrStyle: CSSProperties = {
    borderColor: hrColor
  }
  // -----------------------------------------------------------------------
  // 根據不同的狀況設定className

  const labelClasses = (() => {
    return `${scss.label} ${className ?? ""}`
  })()
  const captionClasses = (() => {
    return classNames(
      scss.caption, captionClassName,
      { [scss.colorMain]: captionColor === "main" }
    )
  })()
  const hrClasses = (() => {
    const classIsFocus = (isFocus || "") && "isFocus"
    const classInvisible = (() => {
      if (showBaseline === "always") return ""
      if (disabled) return "invisible"
    })()
    return `${scss.hr} ${classIsFocus} ${classInvisible} ${hrClassName ?? ""}`
  })()



  // ------------------------------------------------------------------------


  return (
    <label className={labelClasses} style={lableStyle}    >

      {label &&
        <div className={captionClasses} style={captionStyle}>
          <span>{label}</span>
        </div>
      }

      {inputProps &&
        <Input
          inputProps={inputProps}
          placeholder={placeholder ?? `請輸入${label ?? ""}`}
          setIsFocus={setIsFocus}
          disabled={disabled}
        />
      }

      {textareaProps &&
        <Textarea
          textareaProps={textareaProps}
          placeholder={placeholder ?? `請輸入${label ?? ""}`}
          setIsFocus={setIsFocus}
          disabled={disabled}
        />
      }

      {selectProps &&
        <MySelect
          selectProps={selectProps}
          placeholder={placeholder ?? `請選擇${label ?? ""}`}
          disabled={disabled}
        />
      }

      {datePickerProps &&
        <MyDatePicker
          datePickerProps={datePickerProps}
          setIsFocus={setIsFocus}
          placeholder={placeholder}
          disabled={disabled}
        />
      }
      {timePickerProps &&
        <MyTimePicker
          timePickerProps={timePickerProps}
          setIsFocus={setIsFocus}
          placeholder={placeholder}
          disabled={disabled}
        />
      }


      {showBaseline !== "invisible" &&
        <hr className={classNames(hrClasses, { [scss.isMust]: isMust })}
          style={hrStyle}
        />
      }

      {isMust &&
        <div className={classNames(scss.mustTip, mustTipClassName)}>
          <Image src={iconMust} alt="必填" />
        </div>
      }

    </label>
  )
}


// =============================================================================


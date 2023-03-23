
import {
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,

  useState
} from "react"

// component
import Input, { TinputProps } from "./cog/input";
import MySelect, { TselectProps } from "./cog/mySelect";
import Textarea, { TtextareaProps } from "./cog/textarea";
import MyDatePicker, { TdatePickerProps } from "./cog/myDatePicker";

// css
import scss from "./inputSel.module.scss"



// =============================================================================

export default function InputSel(
  {
    label,
    placeholder,

    captionWidth,
    width,
    gap,
    padding,
    margin,
    hrColor,

    showBaseline = "always",
    disabled,
    presetStyle,

    className,
    captionClassName,
    hrClassName,

    inputProps,
    selectProps,
    textareaProps,
    datePickerProps,
  }:
    {
      label?: string
      placeholder?: string

      width?: CSSProperties["width"]
      gap?: CSSProperties["gap"]
      captionWidth?: CSSProperties["width"]
      padding?: CSSProperties["padding"]
      margin?: CSSProperties["margin"]
      hrColor?: CSSProperties["borderColor"]


      /*invisible總是不可見(不渲染) always總是可見 auto disable時不可見*/
      showBaseline?: "invisible" | "always" | "auto"
      disabled?: boolean
      presetStyle?: "s01"

      className?: string
      captionClassName?: string
      hrClassName?: string

      inputProps?: TinputProps
      selectProps?: TselectProps
      textareaProps?: TtextareaProps
      datePickerProps?: TdatePickerProps
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
    return `${scss.caption} ${captionClassName ?? ""}`
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
          placeholder={placeholder ?? `請輸入${label??""}`}
          setIsFocus={setIsFocus}
          disabled={disabled}
        />
      }

      {textareaProps &&
        <Textarea
          textareaProps={textareaProps}
          placeholder={placeholder ?? `請輸入${label??""}`}
          setIsFocus={setIsFocus}
          disabled={disabled}
        />
      }

      {selectProps &&
        <MySelect
          selectProps={selectProps}
          placeholder={placeholder ?? `請選擇${label??""}`}
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


      {showBaseline !== "invisible" &&
        <hr className={hrClasses}
          style={hrStyle}
        />
      }

    </label>
  )
}


// =============================================================================



import {
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,

  useState
} from "react"

// component
import Input, { TinputProps } from "./cog/input";
import MySelect, { TselectProps } from "./cog/mySelect";



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

    showBaseline = true,
    disabled,

    labelClassName,
    captionClassName,
    hrClassName,

    inputProps,
    selectProps
  }:
    {
      label?: string
      placeholder?: string

      width?: CSSProperties["width"]
      gap?: CSSProperties["gap"]
      captionWidth?: CSSProperties["width"]

      showBaseline?: boolean
      disabled?: boolean

      labelClassName?: string
      captionClassName?: string
      hrClassName?: string

      inputProps?: TinputProps
      selectProps?: TselectProps
    }

) {

  const [isFocus, setIsFocus] = useState(false)



  const lableStyle: CSSProperties = {
    width: width,
    gap: gap,
    gridTemplateColumns: !label ? "auto" : undefined
  }
  const captionStyle: CSSProperties = {
    width: captionWidth,
  }


  const labelClasses = (() => {
    return `${scss.label} ${labelClassName ?? ""}`
  })()
  const captionClasses = (() => {
    return `${scss.caption} ${captionClassName ?? ""}`
  })()

  const hrClasses = (() => {
    const classIsFocus = (isFocus || "") && "isFocus"
    const classInvisible = (disabled || "") && "invisible"
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
          placeholder={placeholder}
          setIsFocus={setIsFocus}
          disabled={disabled}
        />
      }

      {selectProps &&
        <MySelect
          selectProps={selectProps}
          placeholder={placeholder}
          disabled={disabled}
        />
      }

      {showBaseline &&
        <hr className={hrClasses} />
      }

    </label>
  )
}


// =============================================================================


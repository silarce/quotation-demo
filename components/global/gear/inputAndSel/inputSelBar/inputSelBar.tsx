import {
  ChangeEvent, CSSProperties,
  useState
} from "react"

// gear
import InputSel from "../inputSel"


// css
import scss from "./inputSelBar.module.scss"

// type
import type { Toption } from "fakeDatabase/options/options"
// component
import Input, { TinputProps } from "../cog/input";
import MySelect, { TselectProps } from "../cog/mySelect";
import Textarea, { TtextareaProps } from "../cog/textarea";




type TinputPropsWrapper = {
  type: "input",
  props: TinputProps
  placeholder?: string
  style?: CSSProperties
}
type TselectPropsWrapper = {
  type: "select",
  props: TselectProps
  placeholder?: string
  style?: CSSProperties
}
type TtextareaPropsWrapper = {
  type: "textarea",
  props: TtextareaProps
  placeholder?: string
  style?: CSSProperties
}

export type TselInputPropsArr
  = (TinputPropsWrapper | TselectPropsWrapper | TtextareaPropsWrapper)[]

// =========================================================================
export default function InputSelBar(
  {
    label, propsArr,
    captionWidth, width, gap, padding, hrColor,
    showBaseline = "always",
    disabled,
    className, captionClassName, hrClassName,
    valueContanierClassName,
  }:
    {
      label?: string
      propsArr:
      (TinputPropsWrapper | TselectPropsWrapper | TtextareaPropsWrapper)[]

      width?: CSSProperties["width"]
      gap?: CSSProperties["gap"]
      captionWidth?: CSSProperties["width"]
      padding?: CSSProperties["padding"]
      hrColor?: CSSProperties["borderColor"]

      /*invisible總是不可見(不渲染) always總是可見 auto disable時不可見*/
      showBaseline?: "invisible" | "always" | "auto"
      disabled?: boolean

      className?: string
      valueContanierClassName?: string
      captionClassName?: string
      hrClassName?: string
    }
) {

  const [isFocus, setIsFocus] = useState(false)

  // -----------------------------------------------------------------------
  // 由外部控制的css，會寫在inline

  const lableStyle: CSSProperties = {
    width: width,
    gap: gap,
    gridTemplateColumns: !label ? "auto" : undefined,
    padding: padding
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
  const valueContainerClasses = (() => {
    return `${scss.valueContanier} ${valueContanierClassName ?? ""}`
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
    // 包裝的元素不可以是label，否則select會壞掉
    <div className={labelClasses} style={lableStyle}>

      {label &&
        <div className={captionClasses} style={captionStyle}>
          <span>{label}</span>
        </div>
      }

      <div className={valueContainerClasses}>
        {propsArr.map((item, index) => {
          const { type, placeholder, props, style } = item
          if (type === "input")
            return (
              <Input key={index}
                inputProps={props}
                placeholder={placeholder}
                setIsFocus={setIsFocus}
                disabled={disabled}
              />
            )
          if (type === "textarea")
            return (
              <Textarea key={index}
                textareaProps={props}
                placeholder={placeholder}
                setIsFocus={setIsFocus}
                disabled={disabled}
              />
            )
          if (type === "select") {
            if (!props.arrowType) props.arrowType = "black"


            const oldOnFocus = props.onFocus
            props.onFocus = () => {
              setIsFocus(true)
              oldOnFocus?.()
            }
            const oldOnBlur = props.onBlur
            props.onBlur = () => {
              setIsFocus(false)
              oldOnBlur?.()
            }

            return (
              <MySelect key={index}
                selectProps={props}
                placeholder={placeholder}
                disabled={disabled}
                style={style}
              />
            )
          }
          return null
        })}
      </div>



      {showBaseline !== "invisible" &&
        <hr className={hrClasses}
          style={hrStyle}
        />
      }

    </div>
  )

}












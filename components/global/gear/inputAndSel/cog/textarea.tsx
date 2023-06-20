import {
  ChangeEvent, TextareaHTMLAttributes, CSSProperties, FocusEvent,
  Dispatch, SetStateAction,
} from "react"

import TextareaAutosize, { TextareaAutosizeProps } from 'react-textarea-autosize';

// css
import scss from "../inputSel.module.scss"


/*
TextareaAutosizeProps這個型別長這樣
interface TextareaAutosizeProps extends Omit<TextareaProps, 'style'> {
    maxRows?: number;
    minRows?: number;
    onHeightChange?: (height: number, meta: TextareaHeightChangeMeta) => void;
    cacheMeasurements?: boolean;
    style?: Style;
}
*/

export type TtextareaProps = {
  value: string
  onChange?: (value: string) => void
  className?: string
  allowNewLineByUser?: boolean
  props?: TextareaAutosizeProps
}

// =====================================================================
export default function Textarea(
  {
    textareaProps,
    placeholder,
    setIsFocus,
    disabled
  }:
    {
      textareaProps: TtextareaProps
      placeholder?: string | undefined
      setIsFocus: Dispatch<SetStateAction<boolean>>
      disabled: boolean | undefined
    }
) {


  const {
    value,
    onChange,
    className,
    allowNewLineByUser,
    props,
  } = textareaProps

  const textareaClasses = (() => {
    return `${scss.textareaBox} ${className ?? ""}`
  })()

  return (
    <div className={textareaClasses}>
      <TextareaAutosize
        placeholder={placeholder}
        value={value}
        autoComplete="off"
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        // onChange={(e) => onChange(e.target.value)}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        onKeyDown={(e) => {
          if (!allowNewLineByUser) {
            if (e.code === "Enter") e.preventDefault()
            if (e.code === "NumpadEnter") e.preventDefault()
          }
        }}
        /*如果props裡存在對應prop的話
        props裡的prop會把上面對應的prop蓋過去*/
        {...props}

      />
    </div>
  )

}












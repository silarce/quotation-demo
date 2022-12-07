import {
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,
  Dispatch, SetStateAction,
  useState
} from "react"









// css
import scss from "../inputSel.module.scss"





export type TinputProps = {
  value: string
  onChange: (value: string) => void
  className?: string
  attributes?: InputHTMLAttributes<HTMLInputElement>
}



// ==============================================================================
export default function Input(
  { placeholder,
    inputProps,
    setIsFocus,
    disabled
  }:
    {
      placeholder?: string | undefined
      inputProps: TinputProps
      setIsFocus: Dispatch<SetStateAction<boolean>>
      disabled: boolean | undefined
    }
) {

  const inputClasses = (() => {
    return `${scss.inputBox} ${inputProps?.className ?? ""}`
  })()



  return (
    <div className={inputClasses}>
      <input
        type="text"
        placeholder={placeholder}
        autoComplete="off"
        value={inputProps.value}
        onFocus={() => setIsFocus(true)}
        onBlur={() => setIsFocus(false)}
        onChange={(e) => inputProps.onChange(e.target.value)}
        disabled={disabled}
        /*如果inputProps.attributes裡存在對應prop的話
        inputProps.attributes裡的prop會把上面對應的props蓋過去
        計畫只會把type或autoComplete蓋過去*/
        {...inputProps.attributes}
      />
    </div>
  )
}










// UI套件
import Select from 'react-select';

// icon
import iconArrow from "public/image/icon/arrow_down.svg"

// css
import style from "./select03.module.scss"


type Toption = {
  value: string
  label: string
}


const Select03 = ({
  stateValue, options, onChange, placeholder,
  className, width, labelWidth }:
  {
    stateValue: Toption | string | null
    options: Toption[]
    onChange: (option: Toption | null) => void
    placeholder?: string
    className?: string
    width?: string
    labelWidth?: string
  }) => {

  let option = typeof stateValue === "string"
    ? {
      value: stateValue,
      label: stateValue
    }
    : stateValue;
  if (option?.value === "") option = null


  // ========================================================
  className = className ? className : ""

  if (!placeholder) placeholder = ""
  // if (!placeholder) placeholder = `請選擇`
  // ========================================================
  const lableStyle = {
    width: width ? width : "",
    gridTemplateColumns: labelWidth ? `${labelWidth} auto` : ""
  }
  // ========================================================

  // eslint-disable-next-line @next/next/no-img-element
  const DropdownIndicator = () => (<img src={iconArrow.src} alt="下拉箭頭" />)
  return (
    <div className={`${style.label} ${className} selec03`}
      style={lableStyle}
    >
      <Select className={style.select}
        placeholder={placeholder}
        value={option}
        options={options}
        onChange={onChange}
        components={{ DropdownIndicator }}
        isSearchable={false}
      />
      <hr />
    </div>
  )
}


export type { Toption }
export default Select03









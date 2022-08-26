// 目錄
// Select01
// Select02

// UI套件
import Select from 'react-select';
import type { StylesConfig, GroupBase } from 'react-select';

// icon
import iconArrow from "public/image/icon/arrow_down_red.svg"

// css
import style from "./select.module.scss"



const myStyle: StylesConfig<Toption, false, GroupBase<Toption>> = {
  valueContainer: (provided) => {
    const padding = 0;
    return { ...provided, padding }
  }
}


type Toption = {
  value: string
  label: string
}

const Select01 = ({
  label, stateValue, placeholder, options, onChange,
  className, width, labelWidth }:
  {
    label: string
    stateValue: Toption | null
    placeholder?: string
    options: Toption[]
    onChange: (option: Toption | null) => void
    className?: string
    width?: string
    labelWidth?: string
  }) => {


  // ========================================================
  className = className ? className : ""
  // ========================================================
  const lableStyle = {
    width: width ? width : "",
    gridTemplateColumns: labelWidth ? `${labelWidth} auto` : ""
  }
  // ========================================================
  stateValue = stateValue?.value === "" ? null : stateValue
  // ========================================================

  // eslint-disable-next-line @next/next/no-img-element
  const DropdownIndicator = () => (<img src={iconArrow.src} alt="下拉箭頭" />)
  return (
    <div className={`${style.label} ${className}`}
      style={lableStyle}
    >
      <span>{label}</span>
      <Select className={style.select}
        placeholder={placeholder}
        defaultValue={stateValue}
        value={stateValue}
        options={options}
        onChange={onChange}
        components={{ DropdownIndicator }}
        isSearchable={false}
        styles={myStyle}
      />
      <hr />
    </div>
  )
}



const Select02 = ({
  label, stateValue, placeholder, options, onChange,
  className, width, labelWidth }:
  {
    label: string
    // stateValue: string
    stateValue: Toption | string | null
    placeholder?: string
    options: Toption[]
    onChange: (option: Toption | null) => void
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
  if (!placeholder) placeholder = `請選擇${label}`
  // ========================================================
  const lableStyle = {
    width: width ? width : "",
    gridTemplateColumns: labelWidth ? `${labelWidth} auto` : ""
  }
  // ========================================================

  // eslint-disable-next-line @next/next/no-img-element
  const DropdownIndicator = () => (<img src={iconArrow.src} alt="下拉箭頭" />)
  return (
    <div className={`${style.label} ${className}`}
      style={lableStyle}
    >
      <span>{label}</span>
      <Select className={style.select}
        placeholder={placeholder}
        value={option}
        options={options}
        onChange={onChange}
        components={{ DropdownIndicator }}
        isSearchable={false}
        styles={myStyle}
      />
      <hr />
    </div>
  )
}


export type { Toption }
export { Select01, Select02 }











// UI套件
import Select from 'react-select';

// icon
import iconArrow from "public/image/icon/arrow_down_red.svg"

// css
import style from "./select.module.scss"



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
  console.log(stateValue)

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
      />
      <hr />
    </div>
  )
}



export { Select01 }









import { useState, useEffect } from "react"


// UI套件
import Select, { SingleValue } from 'react-select';
import type { StylesConfig, GroupBase } from 'react-select';

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
  className, width, labelWidth, disabled }:
  {
    stateValue: Toption | string | null
    options: Toption[]
    onChange: (option: Toption | null) => void
    placeholder?: string
    className?: string
    width?: string
    labelWidth?: string
    disabled?: boolean
  }) => {

  // ====================================================
  // 避免發生window is undefined
  const [windowReady, setWindowReady] = useState(false)
  useEffect(() => {
    setWindowReady(true)
  }, [])
  if (!windowReady) return null
  // ====================================================


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
  const DropdownIndicator = () => {
    if (disabled) return <></>
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={iconArrow.src} alt="下拉箭頭" />
  }


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
        styles={myStyle}
        menuPortalTarget={document.body}
        isDisabled={disabled}
      />
      {!disabled && <hr />}
    </div>
  )
}


export type { Toption }
export default Select03

const myStyle: StylesConfig<Toption, false, GroupBase<Toption>> = {
  valueContainer: (provided) => {
    const padding = 0;
    return { ...provided, padding }
  },
  menuList: (provided) => {
    const padding = `0 12px`;
    const width = `calc(100% + 18px)`;
    const backgroundColor = "#fff";
    return {
      ...provided, padding, width, backgroundColor,
    }
  },
  menu: (provided) => {
    const boxShadow = "none";
    const filter = "drop-shadow(0px 3px 15px rgba(0, 0, 0, 0.15))"
    return {
      ...provided,
      boxShadow, filter
    }
  },
  option: (provided) => {
    const optionStyle = {
      display: "block",
      paddingLeft: "0",
      paddingRight: "0",
      fontWeight: "400",
      fontSize: "16px",
      lineHeight: "22px",
      color: "$colorText",
      cursor: "pointer",
      backgroundColor: "transparent",
      borderBottom: `solid 1px ${style.colorBorder01}`,
      "&:hover": {
        color: "red"
      },
      ":nth-last-of-type(1)": {
        borderColor: "transparent"
      },
    }
    return {
      ...provided, ...optionStyle
    }
  },
  //   (provided,state) => {
  //   return {
  //     ...provided
  //   }
  // },
}


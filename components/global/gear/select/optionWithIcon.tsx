

import { components } from "react-select";
const { Option } = components

import style from "./optionWithIcon.module.scss"




export function OptionWithIcon01(props: any) {

  const { data } = props
  const { label, icon } = data

  return (
    <Option {...props}>
      <div className={style.option}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {icon && <img src={icon} alt="iconImg" />}
        <span>{label}</span>
      </div>
    </Option>
  )
}
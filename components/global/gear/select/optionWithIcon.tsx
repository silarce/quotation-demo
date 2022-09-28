

import { components } from "react-select";
const { Option } = components

import style from "./optionWithIcon.module.scss"




export function OptionWithIcon01(props: any) {

  const { data } = props
  const { label, icon } = data

  return (
    <Option {...props} className={style.option}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={icon} alt="" />
      <span>{label}</span>
    </Option>
  )
}
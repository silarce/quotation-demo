

import { components } from "react-select";
const { SingleValue } = components

import style from "./optionWithIcon.module.scss"

export function SingleValueWithIcon01(props: any) {

  const { data } = props
  const { label, icon } = data

  return (
    <SingleValue {...props} className={style.option}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {icon && <img src={icon} alt="iconImg" />}
      <span>{label}</span>
    </SingleValue>
  )
}
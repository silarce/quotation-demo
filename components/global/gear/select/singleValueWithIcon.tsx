

import { components, SingleValueProps } from "react-select";
import classNames from "classnames";

import { GroupBase } from 'react-select/dist/declarations/src/types.d';
const { SingleValue } = components

import type { Toption } from "js/utils/options/options"


import style from "./optionWithIcon.module.scss"

export function SingleValueWithIcon01(
  props: SingleValueProps<Toption, false, GroupBase<Toption>>,
  props2?: {
    className?: string
    showLabel?: boolean
  }
) {

  const { className, showLabel = true, } = props2 || {}

  const { data } = props
  const { label, icon } = data

  return (
    <SingleValue {...props} className={classNames(style.option, className)}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {icon && <img src={icon} alt="iconImg" />}
      {showLabel && <span>{label}</span>}
    </SingleValue>
  )
}
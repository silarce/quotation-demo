

import { components } from "react-select";

import { OptionProps, }
  from 'react-select';
import { GroupBase } from 'react-select/dist/declarations/src/types.d';

import type { Toption } from "fakeDatabase/options/options"

const { Option } = components

import style from "./optionWithIcon.module.scss"


export function OptionWithIcon01(props: OptionProps<Toption, false, GroupBase<Toption>>) {

  const { data } = props
  const { label, icon } = data

  return (
    <Option {...props} className={style.option}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {icon && <img src={icon} alt="iconImg" />}
      <span>{label}</span>
    </Option>
  )
}
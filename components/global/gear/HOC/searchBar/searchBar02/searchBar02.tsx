import {
  ChangeEvent, CSSProperties, InputHTMLAttributes,
  Fragment, useState
} from "react"

import MySelect, { TselectProps } from "./mySelect"

const _ = require("lodash")

// icon
import { IconSearch } from "public/image/icon/svgComponent/svgIcons"

// css
import scss from "./searchBar02.module.scss"

// type
import { Toption } from "components/global/gear/select/select03"






export type TinputProps = {
  // value: string | number
  placeholder?: string
  onChange?: (value: string) => void
  className?: string
  attributes?: InputHTMLAttributes<HTMLInputElement>
}

export type { TselectProps }

type TinputConfig = {
  props: TinputProps
  boxStyle?: CSSProperties,
}
type TselectConfig = {
  props: TselectProps
  boxStyle?: CSSProperties,
}



// ============================================================================
export default function SearchBar02(
  {
    inputConfigArr,
    selectConfigArr,
    doSearch,
    disabled,
    containerStyle,
  }:
    {


      inputConfigArr?: TinputConfig[]
      selectConfigArr?: TselectConfig[]

      doSearch: (valueArr: (string | number | null | undefined)[]) => void
      disabled?: boolean
      containerStyle?: CSSProperties
    }
) {





  const [inpValueArr, setInpValueArr]
    = useState<(string | number | null | undefined)[]>(inputConfigArr?.map(() => undefined) ?? [])
  const [selValueArr, setSelValueArr]
    = useState<(string | number | null | undefined)[]>(selectConfigArr?.map(() => undefined) ?? [])


  const valueArr = selValueArr.concat(inpValueArr)


  return (
    <div className={scss.searchBar} style={containerStyle}>

      {selectConfigArr?.map((config, index) => {

        const { props, boxStyle } = config
        const { onChange } = props

        const theOnChange = (option: Toption | null) => {
          const value = option?.value || null

          onChange?.(option) // 基本上不會用到

          selValueArr[index] = value
          setSelValueArr(state => [...state]) // 基本上會用到
        }

        const propsCopy = _.cloneDeep(props) as typeof props
        propsCopy.onChange = theOnChange

        propsCopy.options.unshift({ label: "無", value: "" })

        return (
          <div key={index} className={scss.selectWrapper} style={boxStyle}>
            <MySelect
              value={selValueArr[index]}
              selectProps={propsCopy}
              disabled={disabled}
            />
          </div>
        )
      })}
      {/*  */}

      <div className={scss.divLine} />


      {/*  */}
      {inputConfigArr?.map((config, index) => {

        const { props, boxStyle } = config

        const { placeholder, onChange, className, attributes, } = props

        const theOnChange = (e: ChangeEvent<HTMLInputElement>) => {
          const value = e.target.value
          onChange?.(value) // 基本上不會用到

          const attOnChange = attributes?.onChange
          attOnChange?.(e) // 基本上不會用到
          delete attributes?.onChange // 避免在元素內展開後蓋過theOnChange

          inpValueArr[index] = value
          setInpValueArr(state => [...state]) // 基本上會用到
        }

        return (
          <div key={index} className={scss.inputWrapper} style={boxStyle}>
            <input className={`${scss.input} ${className ?? ""}`}
              type="text"
              value={inpValueArr[index] ?? ""}
              placeholder={placeholder}
              onChange={theOnChange}
              disabled={disabled}
              {...{ ...attributes }}
            />
          </div>
        )
      })}

      <IconSearch className={scss.iconSearch}
        onClick={() => { doSearch(valueArr) }}
      />
    </div>
  )




}






















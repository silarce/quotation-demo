import {
  ChangeEvent, CSSProperties, InputHTMLAttributes,
  Fragment, useState
} from "react"

import MySelect, { TselectProps } from "./mySelect"

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




// ============================================================================
export default function SearchBar02(
  {
    inputPropsArr,
    selectPropsArr,
    doSearch,
    disabled,
    containerStyle,
  }:
    {


      inputPropsArr?: TinputProps[]
      selectPropsArr?: TselectProps[]

      doSearch: (valueArr: (string | number | null | undefined)[]) => void
      disabled?: boolean
      containerStyle?: CSSProperties
    }
) {

  const [inpValueArr, setInpValueArr] = useState<(string | number | null | undefined)[]>([])
  const [selValueArr, setSelValueArr] = useState<(string | number | null | undefined)[]>([])

  const valueArr = inpValueArr.concat(selValueArr)

  return (
    <div className={scss.searchBar} style={containerStyle}>

      {selectPropsArr?.map((props, index) => {

        const theOnChange = (option: Toption | null) => {
          const value = option?.value || null

          const { onChange } = props
          onChange?.(option) // 基本上不會用到

          selValueArr[index] = value
          setSelValueArr(state => [...state]) // 基本上會用到
        }

        props.onChange = theOnChange


        return (
          <div key={index} className={scss.selectWrapper}>
            <MySelect
              value={selValueArr[index]}
              selectProps={props}
              disabled={disabled}
            />
          </div>
        )
      })}
      {/*  */}

      <div className={scss.divLine} />


      {/*  */}
      {inputPropsArr?.map((props, index) => {

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
          <div key={index} className={scss.inputWrapper}>
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






















import {
  CSSProperties, FocusEvent,
} from "react"

import classNames from "classnames";

// import Select, { Options, SingleValue, ActionMeta } from 'react-select';
import Select, { Options, SingleValue, ActionMeta } from 'react-select';
import InputSel, { TselectProps } from "../../inputAndSel/inputSel";


// icon
import iconArrowBlack from "public/image/icon/arrow_down.svg"

// css
import scss from "./selectBar.module.scss"

// type
import type { Toption } from "fakeDatabase/options/options"


export type { TselectProps }

// export type TselectProps = {
//   value: Toption | string | number | null | undefined
//   options: Toption[]
//   placeholder?: string
//   className?: string
//   // onChange: (option: Toption | null, meta?: ActionMeta<Toption>) => void
//   onChange: (option: SingleValue<Toption>, meta?: ActionMeta<Toption>) => void
//   onFocus?: (e?: FocusEvent<HTMLInputElement>) => void
//   onBlur?: (e?: FocusEvent<HTMLInputElement>) => void
//   /*不是className*/
//   classNames?: TselClassesObj
//   selectRef?: React.LegacyRef<HTMLDivElement>
//   openMenuOnFocus?: boolean
//   customComponents?: TselCustomComponents
//   boxStyle?: CSSProperties
// }

export default function SelectBar(
  {
    selectPropsArr,
    disabled,
    style
  }:
    {
      // selectPropsArr: TselectProps[]
      selectPropsArr: {
        placeholder?: string
        boxStyle?: CSSProperties
        selectProps: TselectProps
      }[]
      disabled?: boolean | undefined
      style?: CSSProperties
    }
) {


  // 客製化元件
  // 箭頭
  const DropdownIndicator = () => {
    if (disabled) return null
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={iconArrowBlack.src} alt="下拉箭頭" />
  }


  // ------------------------------------------------------------------------
  return (
    <div className={scss.selectBar}>

      {selectPropsArr.map((props, index) => {
        const { boxStyle, selectProps, placeholder } = props
        const { selClassNames } = selectProps

        // __________________________________________________
        // 如果selectProps.value == false就轉為null
        // 如果是字串，就轉為Toption的型態
        let selValue = selectProps.value
        if (/string|number/.test(typeof selValue)) {
          selValue = selectProps.options.find((item) => item.value === selValue)
            ?? { label: selValue as string, value: selValue as string }
        }
        else selValue = null
        // __________________________________________________

        return (
          <div className={scss.selBox} style={boxStyle} key={index}>
            <InputSel
              placeholder={placeholder}
              showBaseline="invisible"
              selectProps={{
                ...selectProps,
                arrowType: "black",
                selClassNames: {
                  // container: (state) => `${scss.selContainer} ${classNames?.container ?? ""}`,
                  // control: (state) => {
                  //   const menuIsOpen = state["menuIsOpen"] ? scss.menuIsOpen : ""
                  //   return `${scss.selControl} ${classNames?.control ?? ""} ${menuIsOpen}`
                  // },
                  // singleValue: (state) => `${scss.selSingleValue} ${classNames?.singleValue ?? ""}`,
                  // placeholder: (state) => `${scss.selPlaceholder} ${classNames?.placeholder ?? ""}`,
                  // menu: (state) => `${scss.selMenu} ${classNames?.menu ?? ""}`,
                  // menuList: (state) => `${scss.selMenuList} ${classNames?.menuList ?? ""}`,
                  // option: (state) => {
                  //   const isSelected = state["isSelected"] ? scss.isSelected : ""
                  //   return `${scss.selOption} ${classNames?.option ?? ""} ${isSelected}`
                  // },
                  // input: (state) => `${scss.selInput ?? ""} ${classNames?.input ?? ""}`,
                  container: (state) => classNames(scss.selContainer, selClassNames?.container?.(state)),

                  control: (state) => {
                    const menuIsOpen = state["menuIsOpen"] ? scss.menuIsOpen : ""
                    return classNames(scss.selControl, selClassNames?.control?.(state), menuIsOpen)
                  },

                  singleValue: (state) => classNames(scss.selSingleValue, selClassNames?.singleValue?.(state)),
                  placeholder: (state) => classNames(scss.selPlaceholder, selClassNames?.placeholder?.(state)),
                  menu: (state) => classNames(scss.selMenu, selClassNames?.menu?.(state)),
                  menuList: (state) => classNames(scss.selMenuList, selClassNames?.menuList?.(state)),

                  option: (state) => {
                    const isSelected = state["isSelected"] ? scss.isSelected : ""
                    return classNames(scss.selOption, selClassNames?.option?.(state), isSelected)
                  },

                  input: (state) => classNames(scss.selInput, selClassNames?.input?.(state)),
                }
              }} />
          </div>
        )
      })}
    </div>
  )
}

// =============================================================================

// // Select 裡的子元件列表，這個列表用於classNames(不是className)
// type TselClassesObj = {
//   clearIndicator?: string
//   container?: string
//   control?: string
//   dropdownIndicator?: string
//   group?: string
//   groupHeading?: string
//   indicatorsContainer?: string
//   indicatorSeparator?: string
//   input?: string
//   loadingIndicator?: string
//   loadingMessage?: string
//   menu?: string
//   menuList?: string
//   menuPortal?: string
//   multiValue?: string
//   multiValueLabel?: string
//   multiValueRemove?: string
//   noOptionsMessage?: string
//   option?: string
//   placeholder?: string
//   singleValue?: string
//   valueContainer?: string
// }


// // Select裡 可客制元件列表
// type Tcomponent
//   = (props?: { [key: string]: any }) => JSX.Element

// type TselCustomComponents = {
//   ClearIndicator?: Tcomponent
//   Control?: Tcomponent
//   DropdownIndicator?: Tcomponent
//   DownChevron?: Tcomponent
//   CrossIcon?: Tcomponent
//   Group?: Tcomponent
//   GroupHeading?: Tcomponent
//   IndicatorsContainer?: Tcomponent
//   IndicatorSeparator?: Tcomponent
//   Input?: Tcomponent
//   LoadingIndicator?: Tcomponent
//   Menu?: Tcomponent
//   MenuList?: Tcomponent
//   MenuPortal?: Tcomponent
//   LoadingMessage?: Tcomponent
//   NoOptionsMessage?: Tcomponent
//   MultiValue?: Tcomponent
//   MultiValueContainer?: Tcomponent
//   MultiValueLabel?: Tcomponent
//   MultiValueRemove?: Tcomponent
//   Option?: Tcomponent
//   Placeholder?: Tcomponent
//   SelectContainer?: Tcomponent
//   SingleValue?: Tcomponent
//   ValueContainer?: Tcomponent
// }













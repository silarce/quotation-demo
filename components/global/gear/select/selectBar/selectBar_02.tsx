
import { useState, useEffect, CSSProperties, } from "react"
import classNames from "classnames";

import InputSel, { TselectProps } from "../../inputAndSel/inputSel";

// css
import scss from "./selectBar_02.module.scss"

// type
import { Toption } from "js/utils/options/options"


export type { TselectProps, Toption }




interface TsearchTargetSel {
  options: Toption[]
  placeholder?: string
  wrapperClassName?: string
  className?: string
  defaultValue?: string | Toption
  value?: string | Toption
  onChange?: (v: string) => void
  selClassNames?: TselectProps["selClassNames"]
  gap?: 10 | 20 | 30
}

export type { TsearchTargetSel }


export default function SelectBar_02(
  {
    controlled,
    selPropsArr,
    disabled,
    style,
    className,
    onChange,
  }:
    {
      selPropsArr: TsearchTargetSel[]
      disabled?: boolean | undefined
      style?: CSSProperties
      className?: string
      controlled?: boolean
      onChange?: (arr: (Toption | null)[]) => void
    }
) {

  const [valueArr, setValueArr]
    = useState<(Toption | null)[]>(
      selPropsArr.map((item) => {
        const { defaultValue, options } = item
        if (defaultValue) {
          if (typeof defaultValue === "string")
            return { value: defaultValue, label: defaultValue }
          return defaultValue
        }
        if (options) return options[0]
        return null
      })
    )

  useEffect(() => {
    selPropsArr.forEach((props, index) => {
      const { options } = props
      if (valueArr[index] === undefined && !controlled) {
        setValueArr(arr => {
          arr[index] = options?.[0] ?? null
          return [...arr]
        })
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (onChange) onChange(valueArr)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [valueArr])


  // ------------------------------------------------------------------------
  return (
    <div className={classNames(scss.selectBar, className)}>

      {selPropsArr.map((props, index) => {
        const {
          options, placeholder, defaultValue,
          value, onChange, wrapperClassName,
          className, selClassNames, gap
        } = props
        // __________________________________________________

        return (
          <div className={classNames(scss.selBox, wrapperClassName)} key={index}>
            <InputSel
              className={classNames(className)}
              placeholder={placeholder}
              showBaseline="invisible"
              disabled={disabled}
              selectProps={{
                value: controlled ? value : valueArr[index] ?? options[0],
                options,
                onChange: (option: Toption | null) => {
                  if (!option) return
                  if (controlled) {
                    onChange?.(option.value)
                    return
                  }
                  setValueArr(arr => {
                    arr[index] = option
                    return [...arr]
                  })
                },
                arrowType: "black",

                selClassNames: {
                  container: (state) => classNames(scss.selContainer, selClassNames?.container?.(state)),
                  control: (state) => {
                    const menuIsOpen = state["menuIsOpen"] ? scss.menuIsOpen : ""
                    return classNames(scss.selControl, selClassNames?.control?.(state), menuIsOpen)
                  },
                  singleValue: (state) => classNames(scss.selSingleValue, { [scss[`mr${gap}`]]: gap }, selClassNames?.singleValue?.(state)),
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

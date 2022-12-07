
import {
  ChangeEvent, InputHTMLAttributes, CSSProperties, FocusEvent,

  useState
} from "react"





import Select, { Options, SingleValue, ActionMeta } from 'react-select';

// icon
import iconArrow from "public/image/icon/arrow_down_red.svg"

// css
import scss from "../inputSel.module.scss"

// type
import type { Toption } from "fakeDatabase/options/options"




export type TselectProps = {
  value: Toption | string | number | null | undefined
  options: Toption[]
  // onChange: (option: Toption | null, meta?: ActionMeta<Toption>) => void
  onChange: (option: SingleValue<Toption>, meta?: ActionMeta<Toption>) => void
  onFocus?: (e?: FocusEvent<HTMLInputElement>) => void
  onBlur?: (e?: FocusEvent<HTMLInputElement>) => void
  /*不是className*/
  classNames?: TselClassesObj


  selectRef?: React.LegacyRef<HTMLDivElement>
  openMenuOnFocus?: boolean
  customComponents?: TselCustomComponents
}



// ==============================================================================
export default function MySelect(
  {
    selectProps,
    placeholder,
    disabled,
  }:
    {
      selectProps: TselectProps
      placeholder?: string | undefined
      disabled: boolean | undefined
    }


) {

  // 如果selectProps.value == false就轉為null
  // 如果是字串，就轉為Toption的型態
  if (selectProps) {
    const selValue = selectProps.value
    if (!selValue) selectProps.value = null
    else if (/string|number/.test(typeof selValue)) {
      selectProps.value = selectProps.options.find((item) => item.value === selValue)
        ?? { label: selValue as string, value: selValue as string }
    }
  }

  // 客製化元件
  // eslint-disable-next-line @next/next/no-img-element
  const DropdownIndicator = () => (<img src={iconArrow.src} alt="下拉箭頭" />)


  return (
    <div className={scss.selectBox}>
      <Select
        className={scss.select}
        isDisabled={disabled}
        value={selectProps.value as Toption}
        placeholder={placeholder}
        options={selectProps.options}
        onChange={selectProps.onChange}
        components={{ DropdownIndicator, ...selectProps.customComponents }}
        unstyled={true}
        menuPortalTarget={document.getElementById("__next")}
        // menuPosition={"fixed"}
        // menuIsOpen={true}
        classNames={{
          menu: (state) => `${scss.selMenu} ${selectProps.classNames?.menu ?? ""}`,
          placeholder: (state) => `${scss.selPlaceholder} ${selectProps.classNames?.placeholder ?? ""}`,
          singleValue: (state) => `${scss.selSingleValue} ${selectProps.classNames?.singleValue ?? ""}`,
          option: (state) => `${scss.selOption} ${selectProps.classNames?.option ?? ""}`,
          control: (state) => `${scss.selControl} ${selectProps.classNames?.control ?? ""}`,
          menuList: (state) => `${scss.selMenuList} ${selectProps.classNames?.menuList ?? ""}`,
        }}
      />
    </div>
  )

}



// =============================================================================

// Select 裡的子元件列表，這個列表用於classNames(不是className)
type TselClassesObj = {
  clearIndicator?: string
  container?: string
  control?: string
  dropdownIndicator?: string
  group?: string
  groupHeading?: string
  indicatorsContainer?: string
  indicatorSeparator?: string
  input?: string
  loadingIndicator?: string
  loadingMessage?: string
  menu?: string
  menuList?: string
  menuPortal?: string
  multiValue?: string
  multiValueLabel?: string
  multiValueRemove?: string
  noOptionsMessage?: string
  option?: string
  placeholder?: string
  singleValue?: string
  valueContainer?: string
}


// Select裡 可客制元件列表
type Tcomponent
  = (props?: { [key: string]: any }) => JSX.Element

type TselCustomComponents = {
  ClearIndicator?: Tcomponent
  Control?: Tcomponent
  DropdownIndicator?: Tcomponent
  DownChevron?: Tcomponent
  CrossIcon?: Tcomponent
  Group?: Tcomponent
  GroupHeading?: Tcomponent
  IndicatorsContainer?: Tcomponent
  IndicatorSeparator?: Tcomponent
  Input?: Tcomponent
  LoadingIndicator?: Tcomponent
  Menu?: Tcomponent
  MenuList?: Tcomponent
  MenuPortal?: Tcomponent
  LoadingMessage?: Tcomponent
  NoOptionsMessage?: Tcomponent
  MultiValue?: Tcomponent
  MultiValueContainer?: Tcomponent
  MultiValueLabel?: Tcomponent
  MultiValueRemove?: Tcomponent
  Option?: Tcomponent
  Placeholder?: Tcomponent
  SelectContainer?: Tcomponent
  SingleValue?: Tcomponent
  ValueContainer?: Tcomponent
}















import {
  useMemo,
  ChangeEvent,
  CSSProperties,
} from "react"

// global gear
import InputSelBar, { TselInputPropsArr } from "../inputSelBar/inputSelBar"

// css
import scss from "./inputSelBar_address.module.scss"

// fakeData type
import {
  Toption,
  optionsCreator_county, districtOptionsSelector
} from 'js/utils/options/countryAndDistrict'

export type TaddressProps = {
  county: string | null | undefined
  onChangeCounty: (option: Toption | null) => void
  district: string | null | undefined
  onChangeDistrict: (option: Toption | null) => void
  address: string | null | undefined
  onChangeAddress: (e: string) => void

  showDistrict?: boolean
}

export default function InputSelBar_address(
  {
    label,
    addressProps,
    captionWidth,
    gap,
    padding,
    className,
    captionClassName,
    valueContanierClassName,
    disabled,
    hrColor,
    presetStyle,
    showBaseline,
    customContyOption,
    customDistrictOption,
  }:
    {
      label?: string
      addressProps: TaddressProps

      captionWidth?: CSSProperties["width"]
      gap?: CSSProperties["gap"]
      padding?: CSSProperties["padding"]
      hrColor?: CSSProperties["borderColor"]

      disabled?: boolean
      showBaseline?: "invisible" | "always" | "auto"

      className?: string
      valueContanierClassName?: string
      captionClassName?: string

      presetStyle?: "s01"

      customContyOption?: {
        optionArr: Toption[]
        unshift?: boolean
      }
      customDistrictOption?: {
        optionArr: Toption[]
        unshift?: boolean
      }
    }) {

  const {
    county,
    onChangeCounty,
    district,
    onChangeDistrict,
    address,
    onChangeAddress,
  } = addressProps

  let { showDistrict } = addressProps
  if (showDistrict === undefined) showDistrict = true



  if (presetStyle) {
    switch (presetStyle) {
      case "s01":
        padding = "17px 4px 14px 4px"
        gap = "40px"
        break;
      default:
        break;
    }
  }



  // 地址
  // 城市
  let countryOptions = optionsCreator_county()
  if (customContyOption) {
    if (customContyOption.unshift) {
      countryOptions = [...customContyOption.optionArr, ...countryOptions]
    }
    else
      countryOptions = [...countryOptions, ...customContyOption.optionArr]
  }
  // 地區
  let districtOptions = useMemo(() => {
    let contyOptions = districtOptionsSelector(county || "")
    if (customDistrictOption) {
      if (customDistrictOption.unshift) {
        contyOptions = [...customDistrictOption.optionArr, ...contyOptions]
      }
      else
        contyOptions = [...contyOptions, ...customDistrictOption.optionArr]
    }
    return contyOptions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [county])



  const selectInputList: TselInputPropsArr = [
    {
      type: "select",
      placeholder: "選擇縣市",
      style: { width: "90px" },
      props: {
        value: county ?? null,
        options: countryOptions,
        onChange: onChangeCounty,
      }
    },
    {
      type: "select",
      placeholder: "選擇地區",
      style: { width: "90px" },
      props: {
        value: district ?? null,
        options: districtOptions,
        onChange: onChangeDistrict,
      }
    },
    {
      type: "textarea",
      placeholder: "請輸入剩餘地址",
      props: {
        value: address || "",
        onChange: onChangeAddress,
        className: `${scss.address} ${scss.addressPlus}`
      }
    },
  ]

  if (showDistrict === false) {
    selectInputList.splice(1, 1)
  }


  // ------------------------------------------------------------------
  valueContanierClassName = `${valueContanierClassName ?? ""}`

  // ------------------------------------------------------------------
  return (
    <InputSelBar
      label={label}
      propsArr={selectInputList}
      className={className}
      captionClassName={captionClassName}
      valueContanierClassName={valueContanierClassName}
      captionWidth={captionWidth}
      gap={gap}
      padding={padding}
      disabled={disabled}
      hrColor={hrColor}
      showBaseline={showBaseline}
    />
  )
}


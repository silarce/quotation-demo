
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
} from 'fakeDatabase/options/countryAndDistrict'

export type TaddressProps = {
  county: string | null | undefined
  onChangeCounty: (option: Toption | null) => void
  district: string | null | undefined
  onChangeDistrict: (option: Toption | null) => void
  address: string | null | undefined
  onChangeAddress: (e: string) => void
}

export default function InputSelBar_address(
  {
    label,
    addressProps,
    captionWidth,
    gap,
    padding,
    className,
    valueContanierClassName,
    disabled,
    hrColor,
    presetStyle,
  }:
    {
      label?: string
      addressProps: TaddressProps
      captionWidth?: CSSProperties["width"]
      gap?: CSSProperties["gap"]
      padding?: CSSProperties["padding"]
      className?: string
      valueContanierClassName?: string
      disabled?: boolean
      hrColor?: CSSProperties["borderColor"]
      presetStyle?: "s01"
    }) {

  const {
    county,
    onChangeCounty,
    district,
    onChangeDistrict,
    address,
    onChangeAddress,
  } = addressProps


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
  const countryOptions = optionsCreator_county()
  // 地區
  const districtOptions = useMemo(() => {
    return districtOptionsSelector(county || "")
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

  // ------------------------------------------------------------------
  valueContanierClassName = `${valueContanierClassName ?? ""}`

  // ------------------------------------------------------------------
  return (
    <InputSelBar
      label={label}
      propsArr={selectInputList}
      className={className}
      valueContanierClassName={valueContanierClassName}
      captionWidth={captionWidth}
      gap={gap}
      padding={padding}
      disabled={disabled}
      hrColor={hrColor}
    />
  )
}


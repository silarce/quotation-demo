
import {
  useMemo,
  ChangeEvent,
  CSSProperties,
} from "react"

// global gear
import SelInputBar, { TselInputPropsArr } from "./selInpuBar"

// css
import scss from "./selInputBar_address.module.scss"

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

export default function SelInputBar_address(
  {
    label,
    addressProps,
    captionWidth,
    gap,
    padding,
    className,
    valueContanierClassName,
    disabled,
    hrColor
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
    }) {

  const {
    county,
    onChangeCounty,
    district,
    onChangeDistrict,
    address,
    onChangeAddress,
  } = addressProps



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
    <SelInputBar
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



import {
  useMemo,
  ChangeEvent,
  CSSProperties,
} from "react"

// global gear
import SelectInput from "components/global/gear/HOC/selectInput.tsx/selectInput"

// fakeData type
import { Toption, optionsCreator_county, districtOptionsSelector } from 'fakeDatabase/options/countryAndDistrict'

export type TselectInputProps = {
  county: string | null | undefined
  onChangeCountry: (option: Toption | null) => void
  district: string | null | undefined
  onChangeDistrict: (option: Toption | null) => void
  address: string | null | undefined
  onChangeAddress: (e: ChangeEvent<HTMLTextAreaElement>) => void
}

export default function SelectInput_address(
  {
    selectInputProps,
    label,
    labelWidth,
    className,
    disabled
  }:
    {
      selectInputProps: TselectInputProps
      label?: string
      labelWidth?: CSSProperties["width"]
      className?: string
      disabled?: boolean
    }) {

  const {
    county,
    onChangeCountry,
    district,
    onChangeDistrict,
    address,
    onChangeAddress,
  } = selectInputProps



  // 地址
  // 城市
  const countryOptions = optionsCreator_county()
  // 地區
  const districtOptions = useMemo(() => {
    return districtOptionsSelector(county || "")
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [county])

  const selectInputList = [
    {
      stateValue: county ?? null,
      options: countryOptions,
      placeholder: "選擇縣市",
      width: "90px",
      onChange: onChangeCountry
    },
    {
      stateValue: district ?? null,
      options: districtOptions,
      placeholder: "選擇地區",
      width: "90px",
      onChange: onChangeDistrict
    },
    {
      stateValue: address || "",
      placeholder: "請輸入剩餘地址",
      onChange: onChangeAddress
    },
  ]

  return (
    <SelectInput className={className}
      label={label || "地址"} selectInputPropsList={selectInputList}
      // labelWidth="120px"
      // labelMarginRight="400px"
      disabled={disabled} />
  )
}


// ========================================================

// 參考範例，或見theCompanyInfo.tsx

// const clearDistrict = () => {
//   companyInfo.district = null
//   setCompanyInfo({ ...companyInfo })
// }
// const selectInputProps = {
//   county,
//   onChangeCountry: (option: Toption | null) => {
//     if (!option) return
//     if (companyInfo.county === option.value) return
//     companyInfo.county = option.value
//     clearDistrict()
//     setCompanyInfo({ ...companyInfo })
//   },
//   district,
//   onChangeDistrict: (option: Toption | null) => {
//     if (!option) return
//     if (companyInfo.district === option.value) return
//     companyInfo.district = option.value
//     setCompanyInfo({ ...companyInfo })
//   },
//   address,
//   onChangeAddress: (e: ChangeEvent<HTMLTextAreaElement>) => {
//     const value = e.target.value
//     companyInfo.address = value
//     setCompanyInfo({ ...companyInfo })
//   },
// }

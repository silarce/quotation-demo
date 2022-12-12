
import {  Dispatch, SetStateAction } from "react";

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel";
import SelInputBar_address from "components/global/gear/HOC/selectInput.tsx/selInputBar_address";

// option
import {
  Toption,
  optionsCreator_gender, optionsCreator_marital
} from "fakeDatabase/options/options";
const [optionsGender, optionMarital]
  = [optionsCreator_gender(), optionsCreator_marital()]

// type
import { TpostEmployee } from "js/api/api_employee";
import type { TprePostEmployee } from "../editEmployee";
// css
import style from "../editEmployee.module.scss"

export default function EditEmployeeItem01({ data, setData }: {
  data: TprePostEmployee
  setData:
  Dispatch<SetStateAction<TprePostEmployee>>
}) {
  const {
    residenceCounty, residenceDistrict, residenceAddress,
    mailingCounty, mailingDistrict, mailingAddress
  } = data



  const selectInputPropsResidence = {
    county: residenceCounty,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.residenceCounty = value
        data.residenceDistrict = ""
        return { ...data }
      })
    },
    district: residenceDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.residenceDistrict = value
        return { ...data }
      })
    },
    address: residenceAddress,
    onChangeAddress: (value: string) => {
      setData(data => {
        data.residenceAddress = value
        return { ...data }
      })
    },
  }
  const selectInputPropsMailing = {
    county: mailingCounty,
    onChangeCounty: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.mailingCounty = value
        data.mailingDistrict = ""
        return { ...data }
      })
    },
    district: mailingDistrict,
    onChangeDistrict: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.mailingDistrict = value
        return { ...data }
      })
    },
    address: mailingAddress,
    onChangeAddress: (value: string) => {
      setData(data => {
        data.mailingAddress = value
        return { ...data }
      })
    },
  }



  // ======================================================
  return (
    <div className={style.editEmployeeItem01}>
      <p className={style.subTitle}>員工個人資料</p>
      <div className={style.form01}>
        {/* 左邊 */}
        <div>
          {keyIndex01.map((key, index) => {
            const { label } = config01[key]
            const stateValue = data[key]
            const onChange = (value: string) => {
              setData(data => {
                data[key] = value
                return { ...data }
              })
            }
            return (
              <InputSel key={index}
                className={style.input02}
                label={label}
                captionWidth="100px"
                presetStyle="s01"
                inputProps={{
                  value: stateValue,
                  onChange: onChange
                }}
              />
            )
          })}
        </div>
        {/* 垂直分隔線 */}
        <div className={style.vr} />
        {/* 右邊 */}
        <div>
          {/*  */}

          <InputSel
            className={style.input02}
            label={"生日"}
            width={"240px"}
            presetStyle="s01"
            captionWidth={"40px"}
            datePickerProps={{
              value: data.birthday,
              onChange: (dateString: string) => {
                setData(data => {
                  data.birthday = dateString
                  return { ...data }
                })
              },
            }}
          />

          {/*  */}
          {keyIndex02.map((key, index) => {
            const { label, options, width, labelWidth } = config02[key]
            const stateValue = data[key]
            if (options) {
              const onChange = (option: Toption | null) => {
                if (!option) return
                const { value } = option
                setData(data => {
                  data[key] = value
                  return ({ ...data })
                })
              }
              return (
                <InputSel key={index}
                  className={style.select02}
                  label={label}
                  presetStyle="s01"
                  width={width}
                  captionWidth={labelWidth}
                  selectProps={{
                    value: stateValue,
                    options: options,
                    onChange: onChange,
                  }}
                />
              )
            }
            const onChange = (value: string) => {
              setData(data => {
                data[key] = value
                return { ...data }
              })
            }
            return (
              <InputSel key={index}
                className={style.input02}
                label={label}
                captionWidth={labelWidth}
                presetStyle="s01"
                inputProps={{
                  value: stateValue,
                  onChange: onChange
                }}
              />
            )
          })}
        </div>
        {/* 下面 */}
        <div >

          <SelInputBar_address
            className={style.selectInput}
            label="戶籍地址"
            captionWidth="100px"
            padding="17px 4px 14px 4px"
            gap="40px"
            addressProps={selectInputPropsResidence} />
          <SelInputBar_address
            className={style.selectInput}
            label="通訊地址"
            captionWidth="100px"
            padding="17px 4px 14px 4px"
            gap="40px"
            addressProps={selectInputPropsMailing} />
        </div>
      </div>
    </div>
  )
}


// ============================================================
type TkeyIndex01Key = (keyof Pick<TpostEmployee,
  "chName" | "enName" | "identity" | "phone1" | "phone2">)

const keyIndex01: TkeyIndex01Key[]
  = ["chName", "enName", "identity", "phone1", "phone2"]

const config01: {
  [key in TkeyIndex01Key]: {
    label: string
  }
} = {
  chName: {
    label: "中文姓名"
  },
  enName: {
    label: "英文姓名"
  },
  identity: {
    label: "身分證字號"
  },
  phone1: {
    label: "聯絡電話1"
  },
  phone2: {
    label: "聯絡電話2"
  },
}
// -------------------------
type TkeyIndex02Key = (keyof Pick<TpostEmployee,
  "gender" | "marital" | "education" | "expertise">)

const keyIndex02: TkeyIndex02Key[]
  = ["gender", "marital", "education", "expertise"]

const config02: {
  [key in TkeyIndex02Key]: {
    label: string
    width?: string
    labelWidth?: string
    options?: Toption[]
  }
} = {
  gender: {
    label: "性別",
    width: "240px",
    options: optionsGender,
    labelWidth: "40px"
  },
  marital: {
    label: "婚姻",
    width: "240px",
    labelWidth: "40px",
    options: optionMarital
  },
  education: {
    label: "學歷",
    labelWidth: "40px"
  },
  expertise: {
    label: "專長",
    labelWidth: "40px"
  },
}









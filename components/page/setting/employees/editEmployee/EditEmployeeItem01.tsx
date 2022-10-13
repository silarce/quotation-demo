
import { ChangeEvent, Dispatch, SetStateAction } from "react";


// global gear
import Input02 from "components/global/gear/input/input02"
import { Select02 } from "components/global/gear/select/select"
import SelectInput_address from "components/global/gear/HOC/selectInput.tsx/selectInput_address";

// option
import {
  Toption,
  optionsCreator_gender, optionsCreator_marital
} from "fakeDatabase/options/options";
const [optionsGender, optionMarital]
  = [optionsCreator_gender(), optionsCreator_marital()]

// type
import { TpostEmployee, Temployee } from "js/api/api_employee";

// css
import style from "../editEmployee.module.scss"

export default function EditEmployeeItem01({ data, setData }: {
  // data: TpostEmployee | Partial<Temployee>
  data:  Partial<Temployee>
  // setData: Dispatch<SetStateAction<TpostEmployee | Partial<Temployee>>>
  setData:
  // Dispatch<SetStateAction<TpostEmployee>>
  //  |
  Dispatch<SetStateAction<Partial<Temployee>>>
}) {
  const {
    residenceCounty, residenceDistrict, residenceAddress,
    mailingCounty, mailingDistrict, mailingAddress
  } = data



  const searchInputPropsResidence = {
    county: residenceCounty,
    onChangeCountry: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.residenceCounty = value
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
    onChangeAddress: (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setData(data => {
        data.residenceAddress = value
        return { ...data }
      })
    },
  }
  const searchInputPropsMailing = {
    county: mailingCounty,
    onChangeCountry: (option: Toption | null) => {
      if (!option) return
      const value = option.value
      setData(data => {
        data.mailingCounty = value
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
    onChangeAddress: (e: ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      setData(data => {
        data.mailingAddress = value
        return { ...data }
      })
    },
  }


  return (
    <div className={style.editEmployeeItem01}>
      <p className={style.subTitle}>員工個人資料</p>
      <div className={style.form01}>
        {/* 左邊 */}
        <div>
          {keyIndex01.map((key, index) => {
            const { label } = config01[key]
            const stateValue = data[key]
            const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value
              setData(data => {
                data[key] = value
                return { ...data }
              })
            }
            return (
              <Input02 key={index}
                className={style.input02}
                stateValue={stateValue}
                label={label}
                onChange={onChange}
              />
            )
          })}
        </div>
        {/* 垂直分隔線 */}
        <div className={style.vr} />
        {/* 右邊 */}
        <div>
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
                <Select02 key={index}
                  className={style.select02}
                  stateValue={stateValue}
                  label={label}
                  options={options}
                  onChange={onChange}
                  width={width}
                  labelWidth={labelWidth}
                />
              )
            }
            const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
              const value = e.target.value
              setData(data => {
                data[key] = value
                return { ...data }
              })
            }
            return (
              <Input02 key={index}
                className={style.input02}
                stateValue={stateValue}
                label={label}
                onChange={onChange}
                width={width}
                labelWidth={labelWidth}
              />
            )
          })}
        </div>
        {/* 下面 */}
        <div >
          <SelectInput_address
            className={style.selectInput}
            label="戶籍地址"
            searchInputProps={searchInputPropsResidence} />
          <SelectInput_address
            className={style.selectInput}
            label="通訊地址"
            searchInputProps={searchInputPropsMailing} />
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
  "birthday" | "gender" | "marital" | "education" | "expertise">)

const keyIndex02: TkeyIndex02Key[]
  = ["birthday", "gender", "marital", "education", "expertise"]

const config02: {
  [key in TkeyIndex02Key]: {
    label: string
    width?: string
    labelWidth?: string
    options?: Toption[]
  }
} = {
  birthday: {
    label: "生日",
    width: "240px",
    labelWidth: "40px"
  },
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









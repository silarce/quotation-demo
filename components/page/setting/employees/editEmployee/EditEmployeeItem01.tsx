
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
import { TpostEmployee } from "js/api/api_employee";

// css
import style from "../editEmployee.module.scss"

export default function EditEmployeeItem01({ data, setData }: {
  data: TpostEmployee
  setData: Dispatch<SetStateAction<TpostEmployee>>
}) {





  const searchInputPropsResidence = {
    county: "",
    onChangeCountry: "",
    district: "",
    onChangeDistrict: "",
    address: "",
    onChangeAddress: "",
  }



  return (
    <div className={style.editEmployeeItem01}>
      <p>員工個人資料</p>
      <div className={style.main}>
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
            {/* <SelectInput_address searchInputProps={searchInputPropsResidence} /> */}
            test
            {/* <SelectInput className={style.selectInput}
              label="戶籍地址" searchInputPropsList={selectInputList}
              labelWidth="110px" />
            <SelectInput className={style.selectInput}
              label="聯絡地址" searchInputPropsList={contactSelectInputList}
              labelWidth="110px" /> */}
          </div>
        </div>


      </div>
    </div>
  )
}


// ============================================================
type TkeyIndex01Key = (keyof Pick<TpostEmployee,
  "ch_name" | "en_name" | "identity" | "phone1" | "phone2">)

const keyIndex01: TkeyIndex01Key[]
  = ["ch_name", "en_name", "identity", "phone1", "phone2"]

const config01: {
  [key in TkeyIndex01Key]: {
    label: string
  }
} = {
  ch_name: {
    label: "中文姓名"
  },
  en_name: {
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









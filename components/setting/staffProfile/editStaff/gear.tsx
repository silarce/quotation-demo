import { Dispatch, SetStateAction } from 'react';

// UI套件
import reactSel, { SingleValue } from 'react-select';

// icon
import iconArrow from "public/image/icon/arrow_down_red.svg"

// css
import style from "./_localLayout.module.scss"

// type
import { TstaffInfo } from "components/setting/staffProfile/fakeData";
type TsetSelStaffInfo = Dispatch<SetStateAction<TstaffInfo>>


// ========================================================
interface Tdata {
  key: keyof TstaffInfo
  label: string
  placeholder: string
  options?: { value: string, label: string }[]
}
interface TdepartmentData {
  key: keyof TstaffInfo["department01"]
  label: string
  placeholder: string
  options?: { value: string, label: string }[]
}


// ========================================================

const Input = ({ data, stateData, setSelStaffInfo }:
  {
    data: Tdata,
    stateData: string | number,
    setSelStaffInfo: TsetSelStaffInfo
  }) => {
  const { key, label, placeholder } = data

  const onChange = (value: string) => {
    if (key === "department01" || key === "department02") return;
    setSelStaffInfo(state => {
      state[key] = value
      return { ...state }
    })
  }

  return (
    <label className={style.label} htmlFor={key}>
      <span>{label}</span>
      <input id={key} type="text" placeholder={placeholder}
        value={stateData}
        onChange={(e) => onChange(e.target.value)}
      />
      <hr />
    </label>
  )
}
// ========================================================

const Select = ({ data, stateData, setSelStaffInfo, parentKey }:
  {
    data: Tdata | TdepartmentData,
    stateData: string,
    setSelStaffInfo: TsetSelStaffInfo
    parentKey?: "department01" | "department02"
  }) => {
  const Select = reactSel //  只是為了讓字少一點

  const { label, options, placeholder } = data
  let { key } = data
  if (parentKey) key = key as TdepartmentData["key"]
  else key = key as Tdata["key"]

  const selValue = stateData
    ? {
      value: stateData,
      label: stateData
    }
    : null

  const handleChange = (option: SingleValue<{
    value: string;
    label: string;
  }>) => {
    if (!option) return null
    const { value } = option
    setSelStaffInfo(state => {
      if (parentKey) {
        state[parentKey][key as TdepartmentData["key"]] = value
        return { ...state }
      }
      if (
        key === "department01"
        || key === "department02"
        || key === "departmentId"
        || key === "department"
        || key === "jobTitle"
        || key === "level"
      ) return state
      state[key] = value
      return { ...state }
    })
  }; //handleChange

  // eslint-disable-next-line @next/next/no-img-element
  const DropdownIndicator = () => (<img src={iconArrow.src} alt="下拉箭頭" />)
  return (
    <div className={style.label} >
      <span>{label}</span>
      <Select className={style.select}
        placeholder={placeholder}
        defaultValue={selValue}
        value={selValue}
        options={options}
        onChange={handleChange}
        components={{ DropdownIndicator }}
        isSearchable={false}
      />
      <hr />
    </div>
  )
}



export type {
  Tdata, TdepartmentData
}
export {
  Input, Select

}
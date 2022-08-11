import { Dispatch, SetStateAction, ChangeEvent } from 'react';

// UI套件
import { SingleValue } from 'react-select';

// global gear
import { Input01 } from "components/global/gear/input/input";
import { Select01 } from 'components/global/gear/select/select';

// type
import { TstaffInfo } from "meta/fakeData/fakeStaffList";
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


const Input = ({ data, stateData, setSelStaffInfo,
  width, labelWidth }:
  {
    data: Tdata,
    stateData: string | number,
    setSelStaffInfo: TsetSelStaffInfo,
    width?: string,
    labelWidth?: string,
  }) => {
  const { key, label, placeholder } = data

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (key === "department01" || key === "department02") return;
    setSelStaffInfo(state => {
      state[key] = value
      return { ...state }
    })
  }

  const stateValue = stateData
  const id = key

  return (
    <Input01
      {...{
        label, stateValue,
        placeholder, onChange, id,
        width, labelWidth
      }} />
  )
}
// ========================================================

const Select = ({ data, stateData, setSelStaffInfo, parentKey,
  width, labelWidth }:
  {
    data: Tdata | TdepartmentData,
    stateData: string,
    setSelStaffInfo: TsetSelStaffInfo
    parentKey?: "department01" | "department02"
    width?: string
    labelWidth?: string
  }) => {

  const { label, options, placeholder } = data
  let { key } = data
  if (parentKey) key = key as TdepartmentData["key"]
  else key = key as Tdata["key"]

  
  const selValue = {
    value: stateData,
    label: stateData
  }


  const onChange = (option: SingleValue<{
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
  if (!options) return null
  return (
    <Select01
      {...{
        label, stateValue: selValue, placeholder,
        options, onChange, width, labelWidth
      }}
    />
  )
}



export type {
  Tdata, TdepartmentData
}
export {
  Input, Select
}
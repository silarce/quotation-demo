import { Dispatch, SetStateAction } from 'react';

// antd
import { Dropdown, Menu } from 'antd';
import { Select as antdSelect } from 'antd';

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
  options?: { label: string }[]
}
interface TdepartmentData {
  key: keyof TstaffInfo["department01"]
  label: string
  placeholder: string
  options?: { label: string }[]
}

interface Toptions {
  label: string
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
// 建立antd下拉式選單要用的menu元件
const menuCreator = (
  options: { label: string }[],
  key: keyof TstaffInfo,
  setSelStaffInfo: TsetSelStaffInfo
) => {
  const items = options.map((item, index) => {
    if (key === "department01" || key === "department02") return null
    const { label } = item
    const onClick = () => {
      setSelStaffInfo(state => {
        state[key] = label
        return { ...state }
      })
    }
    return {
      key: index,
      label: (
        <>
          <span onClick={onClick}>{label}</span>
        </>
      )
    }
  })
  return (
    <Menu items={items} />
  )
}

const menuGroupCreator = (
  options: { label: string }[],
  departmentKey: string,
  // departmentKey: "department01" | "department02",
  key: keyof TstaffInfo["department01"],
  setSelStaffInfo: TsetSelStaffInfo
) => {
  if (!(departmentKey === "department01"
    || departmentKey === "department02")) return (<></>)

  const items = options.map((item, index) => {
    const { label } = item
    const onClick = () => {
      setSelStaffInfo(state => {
        state[departmentKey][key] = label
        return { ...state }
      })
    }
    return {
      key: index,
      label: (
        <>
          <span onClick={onClick}>{label}</span>
        </>
      )
    }
  })
  return (
    <Menu items={items} />
  )
}


const WrongSelect = ({ data, stateData, setSelStaffInfo }:
  {
    data: Tdata,
    stateData: string | number,
    setSelStaffInfo: TsetSelStaffInfo
  }) => {


  const { key, label, placeholder, options } = data
  if (options === undefined) return null

  const menu = menuCreator(options, key, setSelStaffInfo)

  return (
    <div className={style.label}>
      <span>{label}</span>
      <Dropdown overlay={menu}
        overlayClassName={style.selList}
        trigger={["click"]}
      >
        <div className={style.select}>
          <span className={stateData ? style.hasValue : ""}>{stateData || placeholder}</span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={iconArrow.src} alt="下拉箭頭" />
        </div>
      </Dropdown>
      <hr />
    </div>
  )
}




const WrongSelectGroup = ({ data, stateData, setSelStaffInfo }:
  {
    data: { key: string, list: TdepartmentData[] },
    stateData: TstaffInfo["department01"],
    setSelStaffInfo: TsetSelStaffInfo
  }) => {

  const { key: departmentKey, list } = data

  return (
    <>
      {list.map((item, index) => {
        const { key, label, placeholder, options } = item
        if (options === undefined) return null

        const menu = menuGroupCreator(
          options,
          departmentKey,
          key,
          setSelStaffInfo
        )

        const dataLabel = stateData[key]

        return (
          <div key={index} className={style.label} >
            <span>{label}</span>
            <Dropdown overlay={menu}
              overlayClassName={style.selList}
              trigger={["click"]}
            >
              <div className={style.select}>
                <span className={dataLabel ? style.hasValue : ""}>{dataLabel || placeholder}</span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={iconArrow.src} alt="下拉箭頭" />
              </div>
            </Dropdown>
            <hr />
          </div>
        )
      })}
    </>
  )
}



const Select = ({ data, stateData, setSelStaffInfo }:
  {
    data: Tdata,
    stateData: string,
    setSelStaffInfo: TsetSelStaffInfo
  }) => {
  const Select = antdSelect //  只是為了讓字少一點
  const { Option } = Select;

  const { key, label, options, placeholder } = data

  const handleChange = (value: string) => {

    // setSelStaffInfo(state => {
    //   if (key === "department01" || key === "department02") return state
    //   state[key] = value
    //   return { ...state }
    // })
  };


  console.log(data)
  if (!options) return null
  return (
    <>
      {/* <Select defaultValue={stateData || placeholder} onChange={handleChange}>
        {options.map((item, index) => {
          const { label } = item
          return (
            <Option key={index} value={label}>{label}</Option>
          )
        })}

      </Select> */}
<select>
  <option value="1">1</option>
  <option value="2">2</option>
  <option value="3">3</option>
  <option value="4">4</option>
</select>

    </>
  )

}















































export type {
  Tdata, TdepartmentData, Toptions
}
export {
  Input,
  menuCreator, WrongSelect, WrongSelectGroup,
  Select

}
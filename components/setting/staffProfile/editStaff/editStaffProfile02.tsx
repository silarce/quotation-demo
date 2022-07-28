import { useState, Dispatch, SetStateAction } from "react"


// gear
import {
  Tdata, TdepartmentData,
  Input, Select
} from "./gear"


// css
import style from "./editStaffProfile02.module.scss"

// icon
import iconAdd from "public/image/icon/addCircle.svg"
import iconRemove from "public/image/icon/removeCircle.svg"

// type
import { TstaffInfo } from "components/setting/staffProfile/fakeData";
type TsetSelStaffInfo = Dispatch<SetStateAction<TstaffInfo>>


export default function EditStaffProfile02(
  { selStaffInfo, setSelStaffInfo }:
    {
      selStaffInfo: TstaffInfo,
      setSelStaffInfo: TsetSelStaffInfo
    }
) {


  const [isDepart02, setIsDepart02] = useState(false)


  const switchNewDepart = () => {
    setIsDepart02(state => !state)
  }

  return (
    <div className={style.container}>
      <p>公司資訊</p>
      <div className={style.main}>
        {/* select */}
        <div>
          <div className={style.selBox}>
            {departmentGroup.map((item, index) => {
              const { key } = item
              return (
                <Select key={index} data={item}
                  {...{
                    stateData: selStaffInfo["department01"][key],
                    setSelStaffInfo, parentKey: "department01"
                  }} />
              )
            })}
            {/*  eslint-disable-next-line @next/next/no-img-element */}
            <img src={isDepart02 ? iconRemove.src : iconAdd.src} alt="增加/移除部門"
              onClick={switchNewDepart}
            />
          </div>
          {isDepart02 &&
            <div className={style.selBox}>
              {departmentGroup.map((item, index) => {
                const { key } = item
                return (
                  <Select key={index} data={item}
                    {...{
                      stateData: selStaffInfo["department02"][key],
                      setSelStaffInfo, parentKey: "department02"
                    }} />
                )
              })}
            </div>
          }
        </div>
        {/* input */}
        <div className={style.inputContainer}>
          <div>
            <Input data={input01.seniority}
              {...{ stateData: selStaffInfo.seniority, setSelStaffInfo }} />
          </div>
          <div>
            {input02.map((item, index) => {
              const stateData = selStaffInfo[item.key]
              if (typeof stateData === "object" || stateData === undefined) return null
              return (
                <Input key={index} data={item}
                  {...{ stateData, setSelStaffInfo }}
                />
              )
            })}
          </div>

        </div>
        {/*  */}
      </div>
    </div>
  )
}





// ===========================================================


// 部門
const selOptionsDepartment = [
  { value: "管理部", label: "管理部" },
  { value: "營業部", label: "營業部" },
  { value: "研發部", label: "研發部" },
  { value: "工程部", label: "工程部" },
  { value: "廠務部", label: "廠務部" },
  { value: "會計部", label: "會計部" },
]
// 職稱
const selOptionsJobTitle = [
  { value: "總經", label: "總經理" },
  { value: "副總經理", label: "副總經理" },
  { value: "協理", label: "協理" },
  { value: "資深經理", label: "資深經理" },
  { value: "經理", label: "經理" },
  { value: "副理", label: "副理" },
  { value: "課長", label: "課長" },
  { value: "副課長", label: "副課長" },
  { value: "專員", label: "專員" },
  { value: "助理", label: "助理" },
]
// 職等
const selOptionsLevel = [
  { value: "Level 10", label: "Level 10" },
  { value: "Level 9", label: "Level 9" },
  { value: "Level 8", label: "Level 8" },
  { value: "Level 7", label: "Level 7" },
  { value: "Level 6", label: "Level 6" },
  { value: "Level 5", label: "Level 5" },
  { value: "Level 4", label: "Level 4" },
  { value: "Level 3", label: "Level 3" },
  { value: "Level 2", label: "Level 2" },
  { value: "Level 1", label: "Level 1" },
]


const departmentGroup: TdepartmentData[] = [
  {
    key: "department", label: "部門", placeholder: "請選擇部門",
    options: selOptionsDepartment
  },
  {
    key: "jobTitle", label: "職稱", placeholder: "請選擇職稱",
    options: selOptionsJobTitle
  },
  {
    key: "level", label: "職等", placeholder: "請選擇職等",
    options: selOptionsLevel
  },
]

const department01: { key: string, list: TdepartmentData[] } = {
  key: "department01",
  list: [
    {
      key: "department", label: "部門", placeholder: "請選擇部門",
      options: selOptionsDepartment
    },
    {
      key: "jobTitle", label: "職稱", placeholder: "請選擇職稱",
      options: selOptionsJobTitle
    },
    {
      key: "level", label: "職等", placeholder: "請選擇職等",
      options: selOptionsLevel
    },
  ]
}
const department02: { key: string, list: TdepartmentData[] } = {
  key: "department01",
  list: [
    {
      key: "department", label: "部門", placeholder: "請選擇部門",
      options: selOptionsDepartment
    },
    {
      key: "jobTitle", label: "職稱", placeholder: "請選擇職稱",
      options: selOptionsJobTitle
    },
    {
      key: "level", label: "職等", placeholder: "請選擇職等",
      options: selOptionsLevel
    },
  ]
}

// const input01: Tdata = {
const input01: { [key: string]: Tdata } = {
  seniority: { key: "seniority", label: "年資", placeholder: "請輸入年資" },
}

const input02: Tdata[] = [
  {
    key: "arrivalDate", label: "到職日", placeholder: "例 : 1990-01-01",
  },
  {
    key: "resignationDate", label: "離職日", placeholder: "例 : 1990-01-01",
  },
  {
    key: "retirementDate", label: "退休日", placeholder: "例 : 1990-01-01",
  },
  {
    key: "layoffDate", label: "資遣日", placeholder: "例 : 1990-01-01",
  },
]
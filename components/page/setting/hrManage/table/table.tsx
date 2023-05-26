import { MouseEvent, } from "react"
import Image from "next/image";

// icon
import { IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';
import iconPassword from 'public/image/icon/password.svg';
// css
import scss from "./table.module.scss"
// type
import { TemployeeDto } from "js/api/api_employee"


export default function Table(
  {
    employeeList,
    onDelete,
    onResetPw,
    userCount
  }:
    {
      employeeList: TemployeeDto[]
      onDelete: (e: MouseEvent, index: number) => void
      onResetPw: (employee: TemployeeDto) => void
      userCount: string | number
    }) {


  // ---------------------------------------------------------------------------
  return (
    <div className={scss.employeeList}>
      <div className={scss.thead}>

        {/* 密碼icon的位置 */}
        <div className={scss.column}
          style={{ width: "25px" }}>
          <span>{ }</span>
        </div>
        {/*  */}

        {tableKeyIndex.map((key, index) => {
          const { label, width, flex } = tableConfig[key]
          const theStyle = { width, flex }
          return (
            <div className={scss.column} key={index}
              style={theStyle}>
              <span>{label}</span>
            </div>
          )
        })}

        {/*  */}
        <div className={scss.countBox}>
          <span>已加入人數 / 操作人數上限 :</span>
          <span className={scss.numerator}>{userCount}</span>
          <span> / 30</span>
        </div>
      </div>

      {/*  */}
      <div className={scss.tbody}>

        {employeeList.map((employee, index) => {
          const { idNumber, user } = employee
          const id = user!.id
          return (
            <div className={scss.row} key={index}>

              {/*  */}
              <div className={scss.column}
                style={{ width: "25px" }}>
                <Image className="cursor-pointer" src={iconPassword} alt=""
                  onClick={() => onResetPw(employee)} />
              </div>
              {/*  */}

              {tableKeyIndex.map((key, index) => {
                const data = employee[key]
                const { width, flex } = tableConfig[key]
                const theStyle = { width, flex }

                if (key === "jobs" && Array.isArray(data)) {
                  return (
                    <div className={`${scss.column} ${scss.departmentInfo}`} key={index}
                      style={theStyle}
                    >
                      {data.map((item, index) => {
                        const { grade, name } = item
                        const { name: departmentName, code }
                          = item.department ?? {}
                        return (
                          <div key={index}>
                            {`${code} / ${departmentName} / ${name} / Level${grade}`}
                          </div>
                        )
                      })}
                    </div>
                  )
                }

                if (typeof data === "string")
                  return (
                    <div className={scss.column} key={index}
                      style={theStyle}
                    >
                      <span>{data ?? "無資料"}</span>
                    </div>
                  )
              })}

              <div className={`${scss.column}`}>
                <IconRemoveCircle className={scss.btnRemove}
                  onClick={(e) => { onDelete(e, index) }} />
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

// ============================================================

type TtableKeysIndex = keyof Pick<TemployeeDto,
  "idNumber" | "chName" | "phone1" | "jobs">

const tableKeyIndex: TtableKeysIndex[] = [
  "idNumber", "chName", "phone1", "jobs"
]

const tableConfig
  : {
    [key in TtableKeysIndex]: {
      label: string
      width: string
      flex?: string
    }
  }
  = {
  "idNumber": {
    label: "員工編號",
    width: "120px"
  },
  "chName": {
    label: "姓名",
    width: "100px"
  },
  "phone1": {
    label: "電話",
    width: "160px"
  },
  "jobs": {
    label: "部門編號/部門名稱/職稱/職等",
    width: "auto",
    flex: "auto"
  },
}




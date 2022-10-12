
import Link from "next/link";

// global
import CellWithBar from "components/global/gear/cell/cellWithBar"





// icon
import { Icondelete01 } from 'public/image/icon/svgComponent/svgIcons';
// css
import style from "./employeeList.module.scss"
// type
import { Temployee } from "js/api/api_employee"


export default function EmployeeList({ employeeList }: {
  employeeList: Temployee[]
}) {

  return (
    <div className={style.employeeList}>
      <div className={style.thead}>
        {tableIndex.map((key, index) => {
          const { label, width, flex } = tableConfig[key]
          const theStyle = { width, flex }
          return (
            <div className={style.column} key={index}
              style={theStyle}>
              <span>{label}</span>
            </div>
          )
        })}
      </div>

      <div className={style.tbody}>
        {employeeList.map((row, index) => {
          const id = row.id
          return (
            <CellWithBar key={index}>
              <Link href={`/setting/employees/edit/${id}`}>
                <div className={style.row} >
                  {tableIndex.map((key, index) => {
                    const data = row[key]
                    const { width, flex } = tableConfig[key]
                    const theStyle = { width, flex }

                    if (typeof data === "string")
                      return (
                        <div className={style.column} key={index}
                          style={theStyle}
                        >
                          <span>{data}</span>
                        </div>
                      )
                    if (Array.isArray(data))
                      return (
                        <div className={style.column} key={index}
                          style={theStyle}
                        >
                          <span>{"人員的部門資料後端還沒做好"}</span>
                        </div>
                      )
                    if (!data)
                      return (
                        <div className={style.column} key={index}
                          style={theStyle}
                        >
                          <span>{"無資料"}</span>
                        </div>
                      )
                  })}

                  <div className={`${style.column} ${style.btnCell}`}>
                    <Icondelete01 />
                  </div>
                </div>
              </Link>
            </CellWithBar>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================

type TtableIndexKeys = keyof Pick<Temployee,
  "idNumber" | "chName" | "phone1" | "jobs">

const tableIndex: TtableIndexKeys[] = [
  "idNumber", "chName", "phone1", "jobs"
]

const tableConfig
  : {
    [key in TtableIndexKeys]: {
      label: string
      width: string
      flex?: string
    }
  }
  = {
  "idNumber": {
    label: "使用者代號",
    width: "150px"
  },
  "chName": {
    label: "姓名",
    width: "150px"
  },
  "phone1": {
    label: "電話",
    width: "170px"
  },
  "jobs": {
    label: "部門編號/部門名稱/職稱/職等",
    width: "auto",
    flex: "auto"
  },
}




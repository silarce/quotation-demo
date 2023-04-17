import {
  MouseEvent,
  useState, useContext
} from "react"
import Link from "next/link";


// global gear
import CellWithBar from "components/global/gear/cell/cellWithBar"
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"
import { ModalSuccess, ModalErr } from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";
// api
import { apiDeleteEmployee } from "js/api/api_employee";

// icon
import { IconDelete01 } from 'public/image/icon/svgComponent/svgIcons';
// css
import scss from "./employeeList.module.scss"
// type
import { TemployeeDto } from "js/api/api_employee"



export default function EmployeeList({ employeeList, toUpdate, isLoading }: {
  employeeList: TemployeeDto[]
  toUpdate: () => void
  isLoading: boolean
}) {


  const [selInfo, setSelInfo] = useState({
    id: "",
    idNumber: "",
    chName: ""
  })
  const closeDelPanel = () => {
    setSelInfo({
      id: "",
      idNumber: "",
      chName: ""
    })
  }

  const openDelPanel = (e: MouseEvent, data: TemployeeDto) => {
    e.stopPropagation()
    if (isLoading) return;
    const { id, idNumber, chName } = data
    setSelInfo({ id, idNumber, chName })
  }

  const deleteEmployee = async () => {
    if (!selInfo.id) return
    try {
      setRootLoading(true)
      await apiDeleteEmployee(selInfo.id)
      await toUpdate()
      ModalSuccess({ title: "刪除完成" })
    }
    catch {
      await toUpdate()
      ModalErr({ title: "刪除失敗" })
    }
    finally {
      setRootLoading(false)
      closeDelPanel()
    }
  }



  return (
    <div className={scss.employeeList}>
      <div className={scss.thead}>
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
      </div>

      <div className={scss.tbody}>
        {employeeList.map((row, index) => {
          const id = row.id
          const href = {
            pathname: "/setting/employees/edit",
            query: { employeeId: id }
          }
          return (
            <CellWithBar key={index}>
              {/* <Link href={`/setting/employees/edit/${id}`}> */}
              <Link href={href}>
                <div className={scss.row} >
                  {tableKeyIndex.map((key, index) => {
                    const data = row[key]
                    const { width, flex } = tableConfig[key]
                    const theStyle = { width, flex }

                    if (key === "jobs" && Array.isArray(data)) {
                      return (
                        <div className={`${scss.column} ${scss.departmentInfo}`} key={index}
                          style={theStyle}
                        >
                          {data.map((item, index) => {
                            const { grade, name } = item
                            const department = item.department

                            const { name: departmentName, code } = department ?? {}
                            return (
                              <span key={index}>
                                {`${code} / ${departmentName} / ${name} / Level${grade}`}
                              </span>
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

                  <div className={`${scss.column} ${scss.btnCell}`}>
                    <IconDelete01 onClick={(e) => {
                      e.preventDefault()
                      openDelPanel(e, row)
                    }} />
                  </div>
                </div>
              </Link>
            </CellWithBar>
          )
        })}
      </div>
      <TwoButtonModal
        {...{
          visible: !!selInfo.id,
          text: `請確定要刪除「${selInfo.idNumber}」「${selInfo.chName}」?`,
          onConfirm: deleteEmployee,
          onCancel: closeDelPanel,
        }} />
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
    width: "110px"
  },
  "jobs": {
    label: "部門編號/部門名稱/職稱/職等",
    width: "auto",
    flex: "auto"
  },
}




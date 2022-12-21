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
import InputSel from "components/global/gear/inputAndSel/inputSel";
import SearchBar02 from "components/global/gear/HOC/searchBar/searchBar02/searchBar02";
import AddButton from "components/global/gear/button/addButton";

// icon
import { IconRemoveCircle } from 'public/image/icon/svgComponent/svgIcons';
// css
import scss from "./table.module.scss"
// type
import { Temployee } from "js/api/api_employee"
import { Toption } from "fakeDatabase/options/options";


export default function Table(
  {
    employeeList,
    toUpdate,
    searchOption,
    openAddPanel,
    onSearch,
  }:
    {
      employeeList: Temployee[]
      toUpdate: () => void
      searchOption: Toption[]
      openAddPanel: () => void
      onSearch: (valueArr: (string | number | null | undefined)[]) => void
    }) {



  // ---------------------------------------------------------------------------

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

  const openDelPanel = (e: MouseEvent, data: Temployee) => {
    e.stopPropagation()
    const { id, idNumber, chName } = data
    setSelInfo({ id, idNumber, chName })
  }

  const deleteEmployee = async () => {
    // 將員工的ERP權限移除的api還沒做好
    // 下面的註解僅供參考

    // if (!selInfo.id) return
    // try {
    //   setRootLoading(true)
    //   await apiDeleteEmployee(selInfo.id)
    //   await toUpdate()
    //   ModalSuccess({ title: "刪除完成" })
    // }
    // catch {
    //   await toUpdate()
    //   ModalErr({ title: "刪除失敗" })
    // }
    // finally {
    //   setRootLoading(false)
    //   closeDelPanel()
    // }
  }

  // ---------------------------------------------------------------------------

  const selectPropsArr = [
    {
      boxStyle: { width: "180px" },
      props: {
        placeholder: "請選擇部門",
        options: searchOption,
      }
    },
  ]
  const inputPropsArr = [
    {
      props: {
        placeholder: "請輸入搜尋內容",
      }
    },
  ]
  // ---------------------------------------------------------------------------
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

        {/*  */}
        <div className={scss.ctrlBar}>
          <div className={scss.searchlBar}>
            <SearchBar02
              doSearch={onSearch}
              inputConfigArr={inputPropsArr}
              selectConfigArr={selectPropsArr}
            />
          </div>
          {/*  */}
          <div className={scss.addBtnBox}>
            <AddButton className={scss.addBtn}
              label="新增操作人員"
              onClick={openAddPanel}
            />
          </div>
        </div>
      </div>

      {/*  */}
      <div className={scss.tbody}>
        {employeeList.map((row, index) => {
          return (
            <div className={scss.row} key={index}>
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
                        const { name: departmentName } = department
                        return (
                          <div key={index}>
                            {`字母 / ${departmentName} / ${name} / Level${grade}`}
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
                  onClick={(e) => { openDelPanel(e, row) }} />
              </div>
            </div>

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

type TtableKeysIndex = keyof Pick<Temployee,
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




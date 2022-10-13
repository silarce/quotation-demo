// 人員資料
// 人員資料

import {
  useState, useMemo, useEffect,
  createContext,
  Dispatch,
  SetStateAction
} from "react"



import { useRouter } from "next/router";


// components
import EmployeeList from "components/page/setting/employees/employeeList";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import LoadingCover from "components/global/gear/loadingCover";

// api
import { useEmployee, TapiGetEmployeeParams } from "js/api/api_employee";

// css
import style from "./employees.module.scss"

// ==================================================

export const employeeContext = createContext<{
  setIsLoading: Dispatch<SetStateAction<boolean>>
}>(null!)


export default function Employees() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  // ====================================================
  let { data, setData, update } = useEmployee()
  const employeeList = data?.data || []
  const meta = data?.meta


  console.log(data)




  const [params, setParams] = useState<TapiGetEmployeeParams>({
    order: "ASC",
    page: 1,
    pageSize: 10,
  })
  const setPage = (page: number) => {
    setParams(params => {
      params.page = page
      return { ...params }
    })
  }
  const toUpdate = async () => {
    setIsLoading(true)
    await update(params)
    setIsLoading(false)
  }

  useEffect(() => {
    toUpdate()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  // ====================================================
  // 用於搜尋功能
  // const [filteredList, setFilteredList] = useState<typeof fakeStaffList>([])

  const searchStaff = (searchValue: string) => {
    alert("重作中")
  }


  // ====================================================
  const panelList: TpanelList = [
    {
      type: "inputSearch",
      placeholder: "編號/模糊姓名",
      onClick: searchStaff
    },
    {
      type: "myButton",
      label: "新增員工資料",
      onClick: () => {
        if (!meta) return
        const lastId =
          "A" + (`${meta.itemCount + 1}`.padStart(5, "0"))
        router.push(`/setting/employees/add/${lastId}`)
      }
    }
  ]
  // ====================================================


  return (
    <div className={style.scrollContainer}>
      <PageHeader02 tag="人員資料"
        panelList={panelList}
      />
      <employeeContext.Provider value={{ setIsLoading }}>
        <div className={style.mainContainer}>
          <EmployeeList
            employeeList={employeeList} toUpdate={toUpdate} />

        </div>
      </employeeContext.Provider>
      <LoadingCover open={isLoading} />
    </div>
  )
}




// ============================================================
// ============================================================
// ============================================================
/*
計畫事項
地址輸入欄有BUG，改變城市後區域不會歸null，要修
生日欄位的格式要修正
輸入日期的欄位要改成日期選擇器
要製作上傳成功失敗的提示(Modal系列要改風格)
讀取中要改善
*/



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
    return await update(params)
  }

  useEffect(() => {

    (async () => {
      setIsLoading(true)
      await toUpdate()
      setIsLoading(false)
    })()

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
要製作上傳成功失敗的提示(Modal系列要改風格)
讀取中要改善
到職日 離職日 退休日 資遣日也要用日期選擇器
*/

/*
討論事項
使用者代號的問題
使用者代號目前是依據總使用者的數量產生流水號
如果有使用者被刪除，這個流水號就會發生重複
如果要改成客戶端自己輸入使用者代號，
但後端並沒有避免使用者代號重複的檢查機制，所以還是可能會重複

新增使用者時，所有的資料(除了使用者代號idNumber)都是空字串也能新增
是否要在前端這邊設置簡單的檢查機制?
例如檢查有沒有輸入中文姓名

目前還無法取得人員的部門資料，所以先以"無法取得資料代替"
新增或修改時也不會送出jobId這個參數

後端的filter參數似乎還無法使用，因此無法過濾資料(搜尋功能)

後端有提供page參數，但設計圖沒有設計分頁器(包括其他所有的列表都沒有)
*/


// 人員資料
// 人員資料

import {
  useState, useEffect, useMemo
} from "react"
import { useRouter } from "next/router";

// components
import EmployeeList from "components/page/setting/employees/employeeList";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";
// api
import { useEmployee, TapiGetEmployeeParams } from "js/api/api_employee";

// css
import style from "./employees.module.scss"

// ==================================================

export default function Employees() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  // ====================================================
  const [params, setParams] = useState<TapiGetEmployeeParams>({
    order: "DESC",
    page: 1,
    pageSize: 9999,
    filter: {
      $or: {
        idNumber: {
          $contains: router.query.searchValue,
        },
        chName: {
          $contains: router.query.searchValue,
        },
        // enName: {
        //   $contains: searchValue,
        // }
      }
    },
    populate: ["jobs"]
  })

  let { data, update } = useEmployee(params)
  const employeeList = data?.data || []
  const meta = data?.meta

  const setPage = (page: number) => {
    setParams(params => {
      params.page = page
      return { ...params }
    })
  }

  // 搜尋功能
  const searchStaff = (searchValue: string) => {
    router.push(
      {
        pathname: "/setting/employees",
        query: {
          searchValue
        }
      }
    )
    setParams(params => ({
      ...params,
      filter: {
        $or: {
          idNumber: {
            $contains: searchValue,
          },
          chName: {
            $contains: searchValue,
          },
          // enName: {
          //   $contains: searchValue,
          // }
        }
      }
    }))
  }

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await update()
      setIsReady(true)
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  // ====================================================
  const panelList: TpanelList = [
    {
      type: "inputSearch",
      placeholder: "編號/模糊姓名",
      onClick: searchStaff,
      defaultValue: router.query.searchValue as string
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
  const MemoPageHeader = useMemo(() => {
    return (
      <PageHeader02 tag="人員資料"
        panelList={panelList}
      />
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!meta, router.query.searchValue])
  // ====================================================
  return (
    <div className={style.scrollContainer}>
      {MemoPageHeader}
      <div className={style.mainContainer}>
        {isReady &&
          <EmployeeList
            employeeList={employeeList} toUpdate={update} />
        }
        <LoadingCover01 isLoading={isLoading} />
      </div>
    </div>
  )
}


// ============================================================
// ============================================================
// ============================================================
/*
計畫事項



*/

/*
討論事項
關於公司設定-人員資料

10/14
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

10/17
get /employees 的order參數沒有作用，ASC或DESC取得的資料排序一樣

後端的filter參數今天更新了，今天應該就能把搜尋功能補上

後端新增查詢jobId功能，似乎有點問題，我再跟後端討論
根據與jobs相關的api，似乎不能直接編輯人員的部門、職稱、職等這三個參數
只能送jobId到後端去，設定對應的、固定的的部門、職稱、職等

*/


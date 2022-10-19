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
        router.push(`/setting/employees/add/addEmployee`)
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

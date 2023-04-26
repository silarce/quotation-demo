
import {
  useState, useEffect
} from "react"
import { useRouter } from "next/router";

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer";

// components
import EmployeeList from "components/page/setting/employees/employeeList";

// antd
import { Pagination } from 'antd';

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
    order: "ASC",
    page: 1,
    pageSize: 12,
    sort: "idNumber",
    filter: {
      $or: {
        idNumber: {
          $contains: router.query.searchValue,
        },
        chName: {
          $contains: router.query.searchValue,
        },
      }
    },
    populate: ["jobs.department"]
  })

  let { data, update } = useEmployee(params)
  const employeeList = data?.data || []
  const meta = data?.meta

  // 搜尋功能
  const searchStaff = (searchValue: string) => {
    if (isLoading) return
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
      page: 1,
      filter: {
        $or: {
          idNumber: {
            $contains: searchValue,
          },
          chName: {
            $contains: searchValue,
          },
        }
      }
    }))
  }
  // ====================================================
  const setPage = (page: number) => {
    setParams(params => {
      params.page = page
      return { ...params }
    })
  }

  // =========================================================
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
        if (isLoading) return
        router.push(`/setting/employees/add/addEmployee`)
      }
    }
  ]
  // ====================================================
  return (
    <SubLayer>
      <PageHeader02 tag="人員資料" panelList={panelList} />
      <div className={style.body}>
        <EmployeeList
          employeeList={employeeList} toUpdate={update} isLoading={isLoading} />
        <div className={style.paginationBox}>
          <Pagination
            current={meta?.page ?? 1} total={meta?.itemCount ?? 0}
            pageSize={meta?.pageSize ?? 0}
            onChange={setPage}
            showSizeChanger={false}
          />
        </div>
      </div>
    </SubLayer>
  )
}
// ERP操作權限
// ERP操作權限
// ERP操作權限

import {
  useState, useEffect, useMemo
} from "react"
import { useRouter } from "next/router";

// component
import Table from "components/page/setting/hrManage/table/table";

// gear
import Header from "components/page/setting/hrManage/header/header"
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";

// api
import { useEmployee, TapiGetEmployeeParams } from "js/api/api_employee";
import { useDepartments } from "js/api/api_department";

import scss from "./erpCtrlPermissions.module.scss"





// ==========================================================================
export default function ErpCtrlPermissions() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  // ------------------------------------------------------------------------

  const [params, setParams] = useState<TapiGetEmployeeParams>({
    order: "ASC",
    page: 1,
    pageSize: 12,
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

  const { data: departmentsData, update: updateDepartments } = useDepartments()
  const departmentList = departmentsData?.data || []

  const options_departments = useMemo(() => {
    if (!departmentsData.data) return []
    
    return departmentsData.data.map((item) => {
      const { id, name } = item
      return {
        value: id,
        label: name
      }
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentsData])


  // ------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await Promise.all([update(), updateDepartments()])
        .then((valueArr) => valueArr)
        .catch(err => Promise.reject(err))
      setIsReady(true)
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])


  // ------------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={scss.header}>
        <Header />
        <div className={scss.countBox}>
          <span>已加入人數 / 操作人數上限 :</span>
          <span className={scss.numerator}>9</span>
          <span> / 30</span>
        </div>
      </div>

      <div className={scss.mainContainer} >
        <div className={scss.main}>
          <Table
            employeeList={employeeList} toUpdate={update}
            searchOption={options_departments}
          />

        </div>
      </div>


    </div>
  )
}

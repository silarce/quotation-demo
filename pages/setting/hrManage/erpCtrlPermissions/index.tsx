// ERP操作權限
// ERP操作權限
// ERP操作權限

import {
  useState, useEffect, useMemo
} from "react"
import { useRouter } from "next/router";

// component
import Table from "components/page/setting/hrManage/table/table";
import SelectEmployeePanel from "components/page/setting/hrManage/modal/selectEmployeePanel"

// gear
import Header from "components/page/setting/hrManage/header/header"
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal"
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";

// api
import {
  TapiGetEmployeeParams,
  useEmployee, apiPostEmployeeErpUser,
} from "js/api/api_employee";
import { useDepartments } from "js/api/api_department";

import scss from "./erpCtrlPermissions.module.scss"
import myAlert from "components/global/gear/modal/simpleModal/alertModals";


// ==========================================================================
export default function ErpCtrlPermissions() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  // ------------------------------------------------------------------------

  // 列表-送進table裡面
  const [params, setParams] = useState<TapiGetEmployeeParams>({
    order: "ASC",
    page: 1,
    pageSize: 99999999999,
    filter: {
      user: {
        $notNull: true
      },
      // 問後端這部分要怎麼設
      // jobs: {
      //   $contains: {
      //     department: {
      //       id: { $eq: "ce0ad704-148b-4c48-bdb2-5f1458c6a998" }
      //     }
      //   }
      // },
      $or: {
        idNumber: {
          $contains: router.query.searchValue,
        },
        chName: {
          $contains: router.query.searchValue,
        },
      },
    },
    populate: ["jobs.department", "user"]
  })

  let { data: employeeData01, update: updateEmployeeData01 } = useEmployee(params)
  const employeeList = employeeData01?.data || []
  // const meta = data?.meta

  const updateList = async () => {
    setIsLoading(true)
    await updateEmployeeData01()
    setIsLoading(false)
  }


  // ____________________________________________

  // 新增操作人員用的
  const { data: employeeData02, update: updateEmployeeData02 } = useEmployee({
    pageSize: 999999999,
    populate: ["jobs"],
  })
  const employeeList_all = employeeData02?.data || []

  // ____________________________________________

  // 部門列表
  const { data: departmentsData, update: updateDepartments } = useDepartments()
  // 用在搜尋bar的option
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
      if (isReady) {
        await updateEmployeeData01()
      }
      else {
        await Promise.all([updateEmployeeData01(), updateEmployeeData02(), updateDepartments()])
          .then((valueArr) => valueArr)
          .catch(err => Promise.reject(err))
      }
      setIsReady(true)
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])


  // ------------------------------------------------------------------------
  // 搜尋功能 searchBar

  const onSearch = (valueArr: (string | number | null | undefined)[]) => {

    const department = valueArr[0]
    const other = valueArr[1]

    router.push(
      {
        pathname: "/setting/hrManage/erpCtrlPermissions",
        query: {
          department,
          other
        }
      }
    )
    // 只是為了rerender，params只會被pathname控制，應該是不用做成狀態
    setParams(state => ({ ...state }))
  }

  // ------------------------------------------------------------------------
  // 新增操作人員

  const [showAddPanel, setShowAddPanel] = useState(false)

  const openAddPanel = () => {
    setShowAddPanel(true)
  }

  const onConfirm = async (indexArr: number[]) => {
    const id = employeeList_all[indexArr[0]].id
    showRootLoading(true)
    try {
      await apiPostEmployeeErpUser(id)
      setShowAddPanel(false)
    }
    catch (err) {
      myAlert.err({
        title: "新增操作人員失敗",
      })
    }

    showRootLoading(false)
    await updateList()
  }

  const onCancel = () => {
    setShowAddPanel(false)
  }

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
          {isReady &&
            <Table
              employeeList={employeeList} toUpdate={updateEmployeeData01}
              searchOption={options_departments}
              openAddPanel={openAddPanel}
              onSearch={onSearch}
            />
          }
        </div>
        <LoadingCover01 isLoading={isLoading} />
      </div>
      
      <SelectEmployeePanel
        visible={showAddPanel}
        label="請選擇操作人員"
        tip="僅單選(後端還未提供複選api)"
        employeeList={employeeList_all}
        onConfirm={onConfirm}
        onCancel={onCancel}
        selectLimit={1}
      />
    </div>
  )
}





/*
把搜尋功能做出
把新增操作人員做出來

*/
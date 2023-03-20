// ERP操作權限
// ERP操作權限
// ERP操作權限

import {
  MouseEvent,
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
import { setRootLoading, showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";

// api
import {
  TapiGetEmployeeParams,
  useEmployee, apiPostEmployeeErpUser, apiDeleteEmployeeErpUser,
} from "js/api/api_employee";
import { useDepartments } from "js/api/api_department";

import scss from "./erpCtrlPermissions.module.scss"
import myAlert from "components/global/gear/modal/simpleModal/alertModals";


// ==========================================================================
export default function ErpCtrlPermissions() {

  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isReady, setIsReady] = useState(false)
  // 只是用來rerender
  const [rerender, setRerender] = useState(false)
  // ------------------------------------------------------------------------

  const params: TapiGetEmployeeParams = {
    order: "ASC",
    page: 1,
    pageSize: 99999999999,
    filter: {
      user: {
        $notNull: true
      },
      // 收到空字串會壞掉
      "jobs.department.id": router.query.department || undefined,
      $or: {
        chName: {
          $contains: router.query.content,
        },
        idNumber: {
          $contains: router.query.content,
        },

      }
    },
    populate: ["jobs.department", "user"]
  }


  // 列表-送進table裡面

  let { data: employeeData01, update: updateEmployeeData01 } = useEmployee(params)
  const employeeList = employeeData01?.data || []
  const employeeData01Meta = employeeData01?.meta

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
    if (!departmentsData?.data) return []

    return departmentsData?.data.map((item) => {
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

      await Promise.all([updateEmployeeData01(), updateEmployeeData02(), updateDepartments()])
        .then((valueArr) => valueArr)
        .catch(err => Promise.reject(err))

      setIsReady(true)
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  useEffect(() => {
    if (!isReady) return
    updateList()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query])



  // ------------------------------------------------------------------------
  // 搜尋功能 searchBar

  const onSearch = async (valueArr: (string | number | null | undefined)[]) => {
    if (isLoading) return
    const department = valueArr[0]
    const content = valueArr[1]

    router.push({
      pathname: "/setting/hrManage/erpCtrlPermissions",
      query: { department, content }
    })
  }

  // ------------------------------------------------------------------------
  // 新增操作人員

  const [showAddPanel, setShowAddPanel] = useState(false)

  const openAddPanel = () => {
    if (isLoading) return
    setShowAddPanel(true)
  }

  const onConfirm = async (indexArr: number[]) => {
    if (isLoading) return
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
  // 刪除功能

  const [selIndex, setSelIndex] = useState<number>(-1)


  const selId = employeeList[selIndex]?.id
  const selIdNumber = employeeList[selIndex]?.idNumber
  const selChName = employeeList[selIndex]?.chName

  const openDelete = (e: MouseEvent, index: number) => {
    e.stopPropagation()
    if (isLoading) return
    setSelIndex(index)
  }

  const removeEmployee = async (employeeId: string) => {
    if (isLoading) return
    setRootLoading(true)
    try {
      await apiDeleteEmployeeErpUser(employeeId)
      setRootLoading(false)
    }
    catch {
      myAlert.err({ title: "移除失敗" })
    }
    setRootLoading(false)
    cancelDelete()
    await updateList()
  }

  const cancelDelete = () => {
    setSelIndex(-1)
  }

  // ------------------------------------------------------------------------
  return (
    <div className={scss.container}>
      <div className={scss.header}>
        <Header />
        <div className={scss.countBox}>
          <span>已加入人數 / 操作人數上限 :</span>
          <span className={scss.numerator}>{employeeData01Meta?.itemCount}</span>
          <span> / 30</span>
        </div>
      </div>

      <div className={scss.mainContainer} >
        <div className={scss.main}>
          {isReady &&
            <Table
              employeeList={employeeList}
              searchOption={options_departments}
              openAddPanel={openAddPanel}
              onSearch={onSearch}
              onDelete={openDelete}
            />
          }
        </div>
        {/* <LoadingCover01 isLoading={isLoading} /> */}
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

      <TwoButtonModal
        visible={!!selId}
        text={`請確定要刪除「${selIdNumber}」「${selChName}」?`}
        onConfirm={() => removeEmployee(selId)}
        onCancel={cancelDelete}
      />

    </div>
  )
}

// 人事權限管理
// 人事權限管理

import {
  useState, useEffect
} from "react"

// components
import Header from "components/page/setting/hrManage/header/header";
import SelectEmployeePanel from "components/page/setting/hrManage/modal/selectEmployeePanel"
import Card from "components/page/setting/hrManage/card/card";

// gear
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import TwoButtonModal from "components/global/gear/modal/simpleModal/twoButtonModal";

// css
import scss from "./hrManage.module.scss"

// api
import {
  TdepartmentDto,
  useDepartments_managers,
  apiPostDepartments_id_managers, apiDeleteDepartments_id_managers,
} from "js/api/api_department";
import { useEmployee, TemployeeDto } from "js/api/api_employee";


// ==========================================================================
export default function HrManage() {
  const [isLoading, setIsLoading] = useState(false)
  // --------------------------------------------------------------------------
  const { data, update } = useDepartments_managers()
  const dataArr = data ?? []

  const { data: employeeData, update: updateEmployeeData } = useEmployee({
    pageSize: 999999999,
    populate: ["jobs"],
    filter: {
      user: {
        $notNull: true
      },
    }
  })
  const employeeList = employeeData?.data || []

  const doUpdate = async () => {
    setIsLoading(true)
    try { await update() }
    catch { myAlert.err({ title: "取得資料失敗" }) }
    setIsLoading(false)

  }

  // --------------------------------------------------------------------------
  useEffect(() => {
    (async () => {
      setIsLoading(true)
      await Promise.all([updateEmployeeData(), update()])
        .catch(err => myAlert.err({ title: err }))
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // --------------------------------------------------------------------------

  // 被選中部門的id
  const [selDepartmentId, setDelDepartmentId] = useState<string>()
  // 打開新增管理人員面板
  const showAdd = (departmentId: string) => setDelDepartmentId(departmentId)

  // 確定新增
  const onConfirm = async (indexArr: number[]) => {
    if (!selDepartmentId) return;

    const selEmployeeIdArr: string[] = []
    employeeList.forEach((item, index) => {
      if (indexArr?.includes(index)) selEmployeeIdArr.push(item.id)
    })

    const body = { employeeIds: selEmployeeIdArr }

    showRootLoading(true)
    try {
      await apiPostDepartments_id_managers(selDepartmentId, body)
      setDelDepartmentId(undefined)
    }
    catch (err) {
      myAlert.err({ title: "新增管理人員失敗", content: err as string })
    }
    showRootLoading(false)

    await doUpdate()
  }
  // 關閉新增管理人員面板
  const onCancel = () => setDelDepartmentId(undefined)

  // --------------------------------------------------------------------------
  // 刪除功能

  type TdelTarget = {
    department: TdepartmentDto
    employee: TemployeeDto
  }

  // 設定刪除目標的同時會叫出確定面板
  const [delTarget, setDelTarget] = useState<TdelTarget>()

  // 確定刪除
  const delConfirm = async () => {
    if (!delTarget) return
    const departmentId = delTarget.department.id
    const employeeId = delTarget.employee.id
    const body = { employeeIds: [employeeId] }
    showRootLoading(true)
    try {
      await apiDeleteDepartments_id_managers(departmentId, body)
      setDelTarget(undefined)
    }
    catch (err) {
      myAlert.err({ title: "刪除管理人員失敗", content: err as string })
    }
    showRootLoading(false)
    await doUpdate()
  }
  // 取消刪除
  const delCancel = () => {
    setDelTarget(undefined)
  }

  // --------------------------------------------------------------------------
  return (
    <div className={scss.scrollContainer}>

      <Header />

      <div className={scss.mainContainer}>
        <div className={scss.main} style={{ width: "100%" }}>
          {dataArr.map((item, index) => {
            const { id, name, employees } = item

            const removeData = async (itemIndex: number) => {
              // 設定刪除目標
              setDelTarget({
                department: item,
                employee: employees![itemIndex]
              })
            }

            return (
              <Card<TemployeeDto> key={index}
                label={name}
                addLabel={"新增管理人員"}
                noDataTip={"目前尚未沒有管理人員"}
                dataArr={employees ?? []}
                showAdd={() => showAdd(id)}
                removeData={removeData}
                CustomItem={customCard}
              />
            )
          })}
        </div>
        <LoadingCover01 isLoading={isLoading} />
      </div>

      <SelectEmployeePanel
        visible={!!selDepartmentId}
        label="請選擇管理人員"
        tip="可複選"
        employeeList={employeeList}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />

      <TwoButtonModal
        visible={!!delTarget}
        text={`請確定要從「${delTarget?.department.name}」移除「${delTarget?.employee.chName}」?`}
        onConfirm={delConfirm}
        onCancel={delCancel}
      />

    </div>
  )
}
// ====================================================================

const customCard = (
  { data }:
    { data: TemployeeDto }
) => {

  const { idNumber, chName, phone1, jobs } = data
  const { name } = jobs?.[0] ?? {}

  return (
    <div className={scss.customCard}>
      <div>
        <span>{idNumber}</span>
        {" / "}
        <span>{chName}</span>
      </div>
      <span>{name || "無職稱"}</span>
      <span>{phone1 || "無連絡電話"}</span>
    </div>
  )
}

// ====================================================================


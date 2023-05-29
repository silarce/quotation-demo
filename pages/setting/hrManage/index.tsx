import {
  useState, useEffect
} from "react"
import _ from "lodash"

// layer
import SubLayer from "components/Layer/SubLayer/SubLayer";

// components
import PageHeader02 from "components/PageHeader/PageHeader02/PageHeader02";
import CellWithBar from "components/global/gear/cell/cellWithBar";

// gear
import { showRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";
import LoadingCover01 from "components/global/gear/loadingCover/loadingCover01";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import MyButton from "components/global/gear/button/myButton";
import EmployeeSelector from "components/global/gear/modal/employeeSelector";

// icon
import iconAdd from "public/image/icon/add.svg"
import { IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons"

// css
import scss from "./hrManage.module.scss"

// api
import {
  useDepartments_managers,
  apiPostDepartments_id_managers, apiDeleteDepartments_id_managers,
} from "js/api/api_department";
import { TemployeeDto } from "js/api/api_employee";

// config
import { hrManageLinkArr } from "components/page/setting/hrManage/hrManageLinkArr";


// ==========================================================================
export default function HrManage() {
  const [isLoading, setIsLoading] = useState(false)
  // --------------------------------------------------------------------------
  const { data, update } = useDepartments_managers()
  const dataArr = data ?? []


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
      try {
        await update()
      } catch (error) {
        myAlert.err({ title: "取得資料失敗" })
      }
      setIsLoading(false)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // --------------------------------------------------------------------------

  // 被選中部門的id
  const [selDepartmentId, setDelDepartmentId] = useState<string>()

  // 打開新增管理人員面板
  const showAdd = (departmentId: string) => {
    if (isLoading) return;
    setDelDepartmentId(departmentId)
  }

  // 確定新增
  const addManager = async (empArr: TemployeeDto[]) => {
    if (!selDepartmentId) return;
    if (empArr.length === 0) return;
    const employeeIds = empArr.map((emp) => emp.id)
    const body = { employeeIds }
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
  // 確定刪除
  const delMenager = async (
    { departmentId, employeeId }:
      {
        departmentId: string
        employeeId: string
      }
  ) => {

    const body = { employeeIds: [employeeId] }

    showRootLoading(true)
    try {
      await apiDeleteDepartments_id_managers(departmentId, body)
    }
    catch (err) {
      myAlert.err({ title: "刪除管理人員失敗", content: err as string })
    }
    showRootLoading(false)
    await doUpdate()
  }

  // --------------------------------------------------------------------------
  return (
    <SubLayer >

      <PageHeader02 linkList={hrManageLinkArr} />

      <div className={scss.body}>

        {dataArr.map((item, index) => {
          const { id: departmentId, name, employees: employeesArr } = item
          return (
            <div key={departmentId} className={scss.card}>
              <div className={scss.left}><span>{name}</span></div>
              <div className={scss.right}>
                {employeesArr?.map((emp) => {
                  const { id: employeeId, idNumber, chName, phone1, jobs } = emp

                  const jobsStrArr = jobs?.map((job) => {
                    const { department, name: jobName, grade } = job ?? {}
                    const { name: departmentName, code } = department ?? {}
                    let str = ""
                    if (code) str =
                      `${code} / ${departmentName} / ${jobName} / Level ${grade}`
                    return str
                  }) || []

                  const onDelete = () => {
                    myAlert.confirm({
                      title: "確定要移除?",
                      content: (
                        <>
                          <span>id number:{idNumber}</span>
                          <br />
                          <span>姓名:{chName}</span>
                        </>
                      ),
                      props: {
                        onOk: () => delMenager({ departmentId, employeeId })
                      }
                    })
                  }
                  return (
                    <CellWithBar key={employeeId} className={scss.row}>
                      <div><span>{idNumber}</span></div>
                      <div><span>{chName}</span></div>
                      <div><span>{phone1}</span></div>
                      <div>
                        <span>{jobsStrArr[0]}</span>
                        {jobsStrArr[1] && <>
                          <br />
                          <span>{jobsStrArr[1]}</span>
                        </>}
                      </div>
                      <div >
                        <IconRemoveCircle className={scss.removeBtn} onClick={onDelete} />
                      </div>
                    </CellWithBar>
                  )
                })}
                <MyButton label="新增管理人員" img={iconAdd.src}
                  onClick={() => showAdd(departmentId)}
                  className={scss.addBtn}
                />
              </div>
            </div>
          )
        })}
        {/* <LoadingCover01 isLoading={isLoading} /> */}
      </div>
      <EmployeeSelector
        showModal={!!selDepartmentId}
        label="請選擇管理人員"
        tip="可複選"
        onConfirm={addManager}
        onCancel={onCancel}
      />
    </SubLayer>
  )
}
// ====================================================================


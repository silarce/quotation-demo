import { useEffect, useMemo } from "react";
import { useRouter } from "next/router";


import _ from "lodash"

// component
import EditEmployee from "components/page/setting/employees/editEmployee";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";

// css
import style from "../employees.module.scss"

// api
import { TemployeeDto, apiPostEmployee, } from "js/api/api_employee";
import {
  Tparams_jobs,
  useDepartments_jobs
} from "js/api/api_department";
// import { useCheckEmployee } from "js/api/api_employee";

// hook
import { useClassEmployee } from "hooks/department-job-Employee/useEmployee";

// tool
import { jobsOptionsCreator } from "js/tools/selectOption/jobsOptionsCreator";

// =====================================================
const departmentParams: Tparams_jobs = {
  order: "ASC",
  page: 1,
  pageSize: 999,
  populate: ["jobs"],
}

// 防抖
let timeoutId: NodeJS.Timeout;
// =====================================================
export default function AddEmployee() {
  const router = useRouter()

  // ------------------------------------------------------
  const { data: departmentsDataWithMeta, update: updateDepartmentsData }
    = useDepartments_jobs(departmentParams)
  const departmentsData = departmentsDataWithMeta?.data

  useEffect(() => {
    (async () => { await updateDepartmentsData() })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // ------------------------------------------------------
  const classEmpolyee = useClassEmployee()

  const departmentJobOptionGroup = useMemo(() => {
    if (!departmentsData) return undefined
    return jobsOptionsCreator(departmentsData)
  }, [departmentsData])

  // =======================================================
  // 檢查idNumber是否不重複
  // const {
  //   check,
  //   setCheck,
  //   reCheck
  // } = useCheckEmployee(classEmpolyee?.idNumber ?? "")

  // useEffect(() => {
  //   setCheck("loading")
  //   clearTimeout(timeoutId)
  //   timeoutId = setTimeout(() => {
  //     if (!classEmpolyee?.idNumber) return setCheck("notOk")
  //     reCheck()
  //   }, 500);
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [classEmpolyee?.idNumber])
  // =======================================================
  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {
        if (!classEmpolyee) return
        try {
          // if (check === "notOk") throw new Error("使用者代號錯誤")
          // if (check === "loading") throw new Error("正在檢查使用者代號")
          setRootLoading(true)
          const res = await apiPostEmployee(classEmpolyee.postBody) as TemployeeDto
          router.push({
            pathname: `/setting/employees`,
            // query: {
            //   isNew: true
            // }
          })
          myAlert.success({ title: "新增人員完成" })
        }
        catch (error) {
          const err = error as Error
          const title = "新增使用者失敗"
          myAlert.err({ title, content: err.message })
        }
        finally {
          setRootLoading(false)
        }
      }
    },
    {
      type: "myButton",
      label: "取消",
      onClick: () => { router.back() }
    }
  ]

  // =====================================================
  return (
    <div className={style.container}>

      <PageHeader02 tag="人員資料"
        panelList={panelList}
      />
      <div className={style.mainContainer}>
        {classEmpolyee && departmentJobOptionGroup &&
          <EditEmployee
            classEmployee={classEmpolyee}
            departmentJobOptionGroup={departmentJobOptionGroup}
          // check={check}
          />
        }
      </div>
    </div>
  )
} // AddEmployee


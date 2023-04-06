import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
const _ = require("lodash")

// component
import EditEmployee from "components/page/setting/employees/editEmployee";

// global gear
import PageHeader02, { TpanelList } from "components/PageHeader/pageHeader02";
import myAlert from "components/global/gear/modal/simpleModal/alertModals";
import { setRootLoading } from "components/global/gear/loadingCover/rootLoadingCover";
import InvalidIdTip from "components/global/InvalidIdTip";
// css
import style from "../employees.module.scss"

// api
import {
  TemployeeDto, TapiGetEmployee_idParams,
  useEmployeeById, apiPatchEmployee
} from "js/api/api_employee";
import { Tparams_jobs, useDepartments_jobs, } from "js/api/api_department";

// hook
import { useClassEmployee } from "hooks/department-job-Employee/useEmployee";
// tool
import { jobsOptionsCreator } from "js/tools/selectOption/jobsOptionsCreator";

type TemployeeDto_jobs = TemployeeDto & (Pick<Required<TemployeeDto>, "jobs">)

const theUseEmployeeByIdParams: TapiGetEmployee_idParams = {
  populate: ["jobs"]
}

const departmentParams: Tparams_jobs = {
  order: "ASC",
  page: 1,
  pageSize: 999,
  populate: ["jobs"]
}

export default function AddEmployee() {
  const router = useRouter()
  const [isReady, setIsReady] = useState(false)
  // ================================================

  let { data: employeeData_basic, setData: setEmployeeData, update: updateEmployee } =
    useEmployeeById(router.query.employeeId as string || "", theUseEmployeeByIdParams)
  const employeeData = employeeData_basic as TemployeeDto_jobs | undefined

  const { data: departmentsDataWithMeta, update: updateDepartmentsData }
    = useDepartments_jobs(departmentParams)
  const departmentsData = departmentsDataWithMeta?.data

  useEffect(() => {
    (async () => {
      await Promise.all([updateEmployee(), updateDepartmentsData()])
      setIsReady(true)
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const classEmployee = useClassEmployee(employeeData)

  const departmentJobOptionGroup = useMemo(() => {
    if (!departmentsData) return undefined
    return jobsOptionsCreator(departmentsData)
  }, [departmentsData])


  const panelList: TpanelList = [
    {
      type: "redButton",
      label: "上傳",
      onClick: async () => {
        if (!classEmployee) return
        try {
          setRootLoading(true)

          const { postBody, } = classEmployee
          const id = postBody.id

          await apiPatchEmployee(postBody, id)
          router.push({
            pathname: `/setting/employees`,
          })
          myAlert.success({ title: "變更人員資料完成" })
        }
        catch (error) {
          const err = error as Error
          const title = "變更人員資料失敗、未知原因"
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
      onClick: () => {
        if (router.query.isNew) {
          window.history.go(-2)
          return
        }
        router.back()
      }
    }
  ]

  if (isReady && !employeeData) {
    return <InvalidIdTip />
  }

  if (isReady && classEmployee && departmentJobOptionGroup) {
    return (
      <div className={style.container}>
        <PageHeader02 tag="人員資料"
          panelList={panelList}
        />
        <div className={style.mainContainer}>
          <EditEmployee
            classEmployee={classEmployee}
            departmentJobOptionGroup={departmentJobOptionGroup}
          />
        </div>
      </div>
    )
  }
  
  return null
}

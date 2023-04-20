
import { useRouter } from "next/router";

// component
import EditEmployeeItem01 from "./editEmployee/EditEmployeeItem01";
import EditEmployeeItem02 from "./editEmployee/EditEmployeeItem02";

import InputSel from "components/global/gear/inputAndSel/inputSel";

// type
import { Class_employee } from "hooks/department-job-Employee/useEmployee";
import { jobsOptionsCreator } from "js/tools/selectOption/jobsOptionsCreator";

// css
import scss from "./editEmployee.module.scss"

// =====================================================
export default function EditEmployee({ classEmployee, departmentJobOptionGroup, check }: {
  classEmployee: Class_employee
  departmentJobOptionGroup: ReturnType<typeof jobsOptionsCreator>
  check?: "ok" | "notOk" | "loading"
}) {
  const router = useRouter()

  // ==================================================
  if (!router.isReady) return null
  // ==================================================
  return (
    <div className={scss.editEmployee}>

      <div className={scss.employeeId}>
        <InputSel
          label="員工編號"
          placeholder="新員工"
          className={scss.input02}
          disabled={true}
          showBaseline="auto"
          inputProps={{
            value: classEmployee.idNumber ?? "新員工",
            onChange: (v: string) => {
            },
          }}
        />
      </div>

      <EditEmployeeItem01 classEmployee={classEmployee} />
      <EditEmployeeItem02 classEmployee={classEmployee} departmentJobOptionGroup={departmentJobOptionGroup} />
    </div>
  )
}


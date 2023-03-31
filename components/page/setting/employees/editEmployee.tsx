
import { useRouter } from "next/router";

// component
import EditEmployeeItem01 from "./editEmployee/EditEmployeeItem01";
import EditEmployeeItem02 from "./editEmployee/EditEmployeeItem02";

import InputSel from "components/global/gear/inputAndSel/inputSel";

// icon
import { IconCheck01, IconCross01 } from "public/image/icon/svgComponent/svgIcons";
import CircularProgress from '@mui/material/CircularProgress';
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
  const idNumberIsDisabled
    = router.pathname === "/setting/employees/edit/[id]"
  // ==================================================
  if (!router.isReady) return null
  // ==================================================
  return (
    <div className={scss.editEmployee}>

      <div className={scss.employeeId}>
        <InputSel
          label="員工編號"
          placeholder="請輸入員工編號"
          className={scss.input02}
          disabled={idNumberIsDisabled}
          showBaseline="auto"
          inputProps={{
            value: classEmployee.idNumber,
            onChange: (v: string) => {
              classEmployee.idNumber = v
            },
          }}
        />
        {check &&
          <span className={scss.checkTip}>
            {check === "ok" ? <IconCheck01 className={scss.check} cursor="auto" />
              : check === "notOk" ? <IconCross01 className={scss.cross} cursor="auto" />
                : <CircularProgress size={30} />
            }
            {check === "notOk" &&
              <span className={scss.alertTip}>
                {classEmployee.idNumber ? "此員工編號已有人使用" : "請輸入員工編號"}
              </span>
            }
          </span>
        }
      </div>

      <EditEmployeeItem01 classEmployee={classEmployee} />
      <EditEmployeeItem02 classEmployee={classEmployee} departmentJobOptionGroup={departmentJobOptionGroup} />
    </div>
  )
}


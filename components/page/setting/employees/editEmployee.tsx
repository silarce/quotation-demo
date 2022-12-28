import {
  Dispatch, SetStateAction,
  useEffect
} from "react";
import { useRouter } from "next/router";

// component
import EditEmployeeItem01 from "./editEmployee/EditEmployeeItem01";
import EditEmployeeItem02 from "./editEmployee/EditEmployeeItem02";

import InputSel from "components/global/gear/inputAndSel/inputSel";

// icon
import { IconCheck01, IconCross01 } from "public/image/icon/svgComponent/svgIcons";
import CircularProgress from '@mui/material/CircularProgress';
// type
import { TpostEmployee, } from "js/api/api_employee";
import type { TjobDto } from "js/api/api_department";

// css
import scss from "./editEmployee.module.scss"


// =====================================================
export default function EditEmployee({ data, setData, check }: {
  data: TprePostEmployee
  setData: Dispatch<SetStateAction<TprePostEmployee>>
  check?: "ok" | "notOk" | "loading"
}) {
  const router = useRouter()
  // ===================================================
  if (!data) data = emptyDataOri()
  // ==================================================

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
          label="使用者代號"
          placeholder="請輸入使用者代號"
          className={scss.input02}
          disabled={idNumberIsDisabled}
          showBaseline="auto"
          inputProps={{
            value: data.idNumber,
            onChange: (value: string) => {
              setData(data => ({ ...data, idNumber: value }))
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
                {data.idNumber ? "此代號已有人使用" : "請輸入使用者代號"}
              </span>
            }

          </span>
        }
      </div>

      <EditEmployeeItem01
        data={data}
        setData={setData}
      />
      <EditEmployeeItem02
        data={data}
        setData={setData}
      />
    </div>
  )
}
// ===========================================================


export type TprePostEmployee
  = Omit<TpostEmployee, "jobId"> & { jobs: TjobDto[] }

const emptyDataOri = (): TprePostEmployee => ({
  "idNumber": "",
  "chName": "",
  "enName": "",
  "identity": "",
  "birthday": "",
  "gender": "",
  "marital": "",
  "education": "",
  "expertise": "",
  "phone1": "",
  "phone2": "",
  "email": "",
  "residenceCounty": "",
  "residenceDistrict": "",
  "residenceAddress": "",
  "mailingCounty": "",
  "mailingDistrict": "",
  "mailingAddress": "",
  "processPermission": true,
  "seniority": "",
  "startDate": "",
  "leaveDate": "",
  "retireDate": "",
  "severanceDate": "",
  "jobs": [],
})









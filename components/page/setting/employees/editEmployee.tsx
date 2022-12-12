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
import type { TjobsData } from "js/api/api_department";

// css
import style from "./editEmployee.module.scss"
// =====================================================


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
    <div className={style.editEmployee}>

      <div className={style.employeeId}>
        <InputSel
          label="使用者代號"
          placeholder="請輸入使用者代號"
          className={style.input02}
          disabled={idNumberIsDisabled}
          inputProps={{
            value: data.idNumber,
            onChange: (value: string) => {
              setData(data => ({ ...data, idNumber: value }))
            },
          }}
        />
        {check &&
          <span className={style.checkTip}>
            {check === "ok" ? <IconCheck01 className={style.check} cursor="auto" />
              : check === "notOk" ? <IconCross01 className={style.cross} cursor="auto" />
                : <CircularProgress size={30} />
            }
            {check === "notOk" &&
              <span className={style.alertTip}>
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
  = Omit<TpostEmployee, "jobId"> & { jobs: TjobsData[] }

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









import { Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";

// component
import EditEmployeeItem01 from "./editEmployee/EditEmployeeItem01";
import EditEmployeeItem02 from "./editEmployee/EditEmployeeItem02";


// type
import { TpostEmployee, Temployee } from "js/api/api_employee";

// css
import style from "./editEmployee.module.scss"


export default function EditEmployee({ data, setData }: {
  data: Partial<Temployee>
  setData:
  Dispatch<SetStateAction<Partial<Temployee>>>
}) {
  const router = useRouter()

  if (!router.isReady) return null

  if (!data) data = emptyDataOri()
  if (!data.idNumber) data.idNumber =
    router.query.employeeId as string

  return (
    <div className={style.editEmployee}>

      <div className={style.employeeId}>
        <span>使用者代號</span>
        <span>{data.idNumber}</span>
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


const emptyDataOri = (): TpostEmployee => ({
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
  // "jobId": [""]
})
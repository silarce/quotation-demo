import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { useRouter } from "next/router";

// component
import EditEmployeeItem01 from "./editEmployee/EditEmployeeItem01";
import EditEmployeeItem02 from "./editEmployee/EditEmployeeItem02";

// global gear
import Input02 from "components/global/gear/input/input02"
import { Select02 } from "components/global/gear/select/select"

// type
import { TpostEmployee } from "js/api/api_employee";

// css
import style from "./editEmployee.module.scss"




export default function EditEmployee({ data, setData }: {
  data: TpostEmployee
  setData: Dispatch<SetStateAction<TpostEmployee>>
}) {
  const router = useRouter()

  // const { idNumber } = data

  console.log(data)

  if (!router.isReady) return null

  return (
    <div className={style.editEmployee}>

      <div className={style.employeeId}>
        <span>使用者代號</span>
        <span>{router.query.employeeId}</span>
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

import { ChangeEvent, Dispatch, SetStateAction } from "react";

// component
import EditEmployeeItem01 from "./editEmployee/EditEmployeeItem01";

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

  const { id_number } = data



  console.log(data)

  return (
    <div className={style.editEmployee}>

      <div className={style.employeeId}>
        <span>使用者代號</span>
        <span>{id_number}</span>
      </div>

      <EditEmployeeItem01
        data={data}
        setData={setData}
      />
    </div>
  )
}

// ============================================================
type TkeyIndex01Key = (keyof Pick<TpostEmployee,
  "ch_name" | "en_name" | "identity" | "phone1" | "phone2">)

const keyIndex01: TkeyIndex01Key[]
  = ["ch_name", "en_name", "identity", "phone1", "phone2"]

const config01: {
  [key in TkeyIndex01Key]: {
    label: string
  }
} = {
  ch_name: {
    label: "中文姓名"
  },
  en_name: {
    label: "英文姓名"
  },
  identity: {
    label: "身分證字號"
  },
  phone1: {
    label: "聯絡電話1"
  },
  phone2: {
    label: "聯絡電話2"
  },
}
// -------------------------
type TkeyIndex02Key = (keyof Pick<TpostEmployee,
  "birthday" | "gender" | "marital" | "education" | "expertise">)

const keyIndex02: TkeyIndex02Key[]
  = ["birthday", "gender", "marital", "education", "expertise"]

const config02: {
  [key in TkeyIndex02Key]: {
    label: string
    type?: string
    width?: string
  }
} = {
  birthday: {
    label: "生日",
    width: "240px",
  },
  gender: {
    label: "性別",
    width: "240px",
    type: "select"
  },
  marital: {
    label: "婚姻",
    width: "240px",
    type: "select"
  },
  education: {
    label: "學歷"
  },
  expertise: {
    label: "專長"
  },
}

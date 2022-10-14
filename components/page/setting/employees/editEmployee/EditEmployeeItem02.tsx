
import { useState } from "react";

import { ChangeEvent, Dispatch, SetStateAction } from "react";


// global gear
import Input02 from "components/global/gear/input/input02"
import { Select02 } from "components/global/gear/select/select"
import TimePicker01 from "components/global/gear/input/timePicker01";
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons";


// option
import {
  Toption,
  optionsCreator_department, optionsCreator_jobTitle,
  optionsCreator_level,
} from "fakeDatabase/options/options";

const optionsDepartment = optionsCreator_department();
const optionsJobTitle = optionsCreator_jobTitle();
const optionsLevel = optionsCreator_level();

// type
import { TpostEmployee, Temployee } from "js/api/api_employee";

// css
import style from "../editEmployee.module.scss"

export default function EditEmployeeItem02({ data, setData }: {
  data: TpostEmployee | Partial<Temployee>
  setData: Dispatch<SetStateAction<TpostEmployee | Partial<Temployee>>>
}) {


  const [isDepart02, setIsDepart02] = useState(false)

  const switchNewDepart = () => {
    setIsDepart02(state => !state)
  }


  return (
    <div className={style.editEmployeeItem02}>
      <p className={style.subTitle}>公司資訊</p>
      <div className={style.form02}>

        <>
          <div className={style.selBox}>
            {keyindex01.map((key, index) => {
              const { label, options } = config01[key]
              const onChange = () => { }
              return (
                <Select02 key={index}
                  stateValue={null}
                  label={label}
                  options={options}
                  onChange={onChange}
                />
              )
            })}
            {isDepart02
              ? <IconRemoveCircle onClick={switchNewDepart} />
              : <IconAddCircle onClick={switchNewDepart} />
            }
          </div>
          {isDepart02 &&
            <div className={style.selBox}>
              {keyindex01.map((key, index) => {
                const { label, options } = config01[key]
                const onChange = () => { }
                return (
                  <Select02 key={index}
                    stateValue={null}
                    label={label}
                    options={options}
                    onChange={onChange}
                  />
                )
              })}
              {isDepart02
                ? <IconRemoveCircle onClick={switchNewDepart} />
                : <IconAddCircle onClick={switchNewDepart} />
              }
            </div>}
        </>

        <div className={style.bottomContainer}>
          <div>
            <Input02
              stateValue={data.seniority}
              label="年資"
              labelWidth="60px"
              onChange={(e) => {
                const value = e.target.value
                setData(data => {
                  data.seniority = value
                  return { ...data }
                })
              }}
            />
          </div>
          <div>
            {keyIndex02.map((key, index) => {
              const stateValue = data[key]
              const { label } = config02[key]

              const onChange = (dateString: string) => {
                const value = dateString
                setData(data => {
                  data[key] = value
                  return { ...data }
                })
              }
              return (
                <TimePicker01
                  key={index}
                  stateValue={stateValue}
                  label={label}
                  labelWidth="60px"
                  onChange={onChange}
                />
              )
            })}
          </div>

        </div>
      </div>
    </div>
  )
}


// ============================================================
type TkeyIndex01Keys = "department" | "jobTitle" | "level"

const keyindex01: TkeyIndex01Keys[] = [
  "department", "jobTitle", "level",
]

const config01: {
  [key in TkeyIndex01Keys]: {
    label: string
    options: Toption[]
  }
} = {
  "department": {
    label: "部門",
    options: optionsDepartment
  },
  "jobTitle": {
    label: "職稱",
    options: optionsJobTitle
  },
  "level": {
    label: "職等",
    options: optionsLevel
  },
}

// ---------------
type TkeyIndexKeys =
  "startDate" | "leaveDate" | "retireDate" | "severanceDate"

const keyIndex02: TkeyIndexKeys[] = [
  "startDate", "leaveDate", "retireDate", "severanceDate"
]

const config02: {
  [key in TkeyIndexKeys]: {
    label: string
  }
} = {
  "startDate": {
    label: "到職日"
  },
  "leaveDate": {
    label: "離職日"
  },
  "retireDate": {
    label: "退休日"
  },
  "severanceDate": {
    label: "資遣日"
  },
}




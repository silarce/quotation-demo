
import { useState, useEffect } from "react";

import { Dispatch, SetStateAction } from "react";


// global gear
import Input02 from "components/global/gear/input/input02"
import { Select02 } from "components/global/gear/select/select"
import TimePicker01 from "components/global/gear/input/timePicker01";
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons";


import {
  useJobsOptions
} from "js/api/api_department";


// type
import { TpostEmployee, Temployee } from "js/api/api_employee";
import { Toption } from "fakeDatabase/options/options";
// css
import style from "../editEmployee.module.scss"


// ============================================================
export default function EditEmployeeItem02({ data, setData }: {
  data: TpostEmployee | Partial<Temployee>
  setData: Dispatch<SetStateAction<TpostEmployee | Partial<Temployee>>>
}) {

  // ======================================================
  // 部門選擇所需的狀態與options
  const {
    department, jobName, jobId,
    optionsDepartments, onChangeDepartments,
    optionsJobs, onChangeJobs,
    updateDepartmentsData,
  } = useJobsOptions()

  useEffect(() => {
    updateDepartmentsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setData(data => ({
      ...data,
      jobId: [jobId]
    }))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId])

  const [config01, keyindex01] = jobConfig()

  // ======================================================


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
              const { stateValue, label, options, onChange }
                = config01[key]
              return (
                <Select02 key={index}
                  stateValue={stateValue}
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
          {/* {isDepart02 &&
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
            </div>} */}
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
  // --------------------------------------------------------

  function jobConfig() {

    type TkeyIndex01Keys = "department" | "jobName" | "grade";

    const keyindex01: TkeyIndex01Keys[] = [
      "department",
      "jobName",
      "grade",
    ];

    const config01: {
      [key in TkeyIndex01Keys]: {
        stateValue: Toption | null | string
        label: string;
        options: Toption[];
        onChange: (option: Toption | null) => void
      };
    } = {
      "department": {
        stateValue: department,
        label: "部門",
        options: optionsDepartments,
        onChange: onChangeDepartments
      },
      "jobName": {
        stateValue: jobName,
        label: "職稱",
        options: optionsJobs,
        onChange: onChangeJobs
      },
      "grade": {
        stateValue: jobName?.grade ?? null,
        label: "職等",
        options: [{ value: "", label: "職等不能選擇" }],
        onChange: () => { }
      },
    };
    return [config01, keyindex01] as const
  }
} // EditEmployeeItem02


// ============================================================

type TkeyIndex02Keys =
  "startDate" | "leaveDate" | "retireDate" | "severanceDate"

const keyIndex02: TkeyIndex02Keys[] = [
  "startDate", "leaveDate", "retireDate", "severanceDate"
]

const config02: {
  [key in TkeyIndex02Keys]: {
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




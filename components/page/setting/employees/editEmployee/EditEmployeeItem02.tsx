
import { useState, useEffect } from "react";

import { Dispatch, SetStateAction } from "react";


// global gear
import Input02,{TeTextarea} from "components/global/gear/input/input02"
import { Select02 } from "components/global/gear/select/select"
import TimePicker01 from "components/global/gear/input/timePicker01";
// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons";

// api
import {
  Tparams, TuseJobsOptions, TjobsData,
  useDepartments, useJobsOptions
} from "js/api/api_department";


// type
import { TpostEmployee, Temployee } from "js/api/api_employee";
import { Toption } from "fakeDatabase/options/options";
import type { TprePostEmployee } from "../editEmployee";
// css
import style from "../editEmployee.module.scss"


// ============================================================
const defaultParams = (): Tparams => ({
  order: "ASC",
  page: 1,
  pageSize: 999,
  populate: ["jobs"]
})
// ============================================================
export default function EditEmployeeItem02({ data, setData }: {
  data: TprePostEmployee
  setData:
  Dispatch<SetStateAction<TprePostEmployee>>
}) {

  // ======================================================
  // 部門資料
  const { data: departmentsData, update: updateDepartmentsData }
    = useDepartments(defaultParams())
  // ======================================================
  // 部門選擇所需的狀態與options
  const jobsOptions01
    = useJobsOptions(departmentsData, data?.jobs?.[0])
  const jobsOptions02
    = useJobsOptions(departmentsData, data?.jobs?.[1])

  useEffect(() => {
    updateDepartmentsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const jobs: TjobsData[] = []
    jobsOptions01.jobs && jobs.push(jobsOptions01.jobs)
    jobsOptions02.jobs && jobs.push(jobsOptions02.jobs)
    setData(data => ({
      ...data,
      jobs
    }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsOptions01.jobs, jobsOptions02.jobs])


  const [jobsConfig01, jobsKeyindex01] = jobConfig(jobsOptions01)
  const [jobsConfig02] = jobConfig(jobsOptions02)

  // ======================================================

  const [isDepart02, setIsDepart02] = useState(!!data?.jobs?.[1])

  const switchNewDepart = () => {
    setIsDepart02(state => !state)
    jobsOptions02.clear()
  }

  return (
    <div className={style.editEmployeeItem02}>
      <p className={style.subTitle}>公司資訊</p>
      <div className={style.form02}>
        <>
          <div className={style.selBox}>
            {jobsKeyindex01.map((key, index) => {
              const { stateValue, label, options, onChange }
                = jobsConfig01[key]
              return (
                <Select02 key={index}
                  stateValue={stateValue}
                  label={label}
                  options={options}
                  onChange={onChange}
                />
              )
            })}

            <Input02
              className={style.input02}
              stateValue={data.jobs[0]?.grade ?? ""}
              label="職等"
              labelWidth="100px"
              disabled={true}
            />
            {isDepart02
              ? <IconRemoveCircle onClick={switchNewDepart} />
              : <IconAddCircle onClick={switchNewDepart} />
            }
          </div>
          {isDepart02 &&
            <div className={style.selBox}>
              {jobsKeyindex01.map((key, index) => {
                const { stateValue, label, options, onChange }
                  = jobsConfig02[key]

                return (
                  <Select02 key={index}
                    stateValue={stateValue}
                    label={label}
                    options={options}
                    onChange={onChange}
                  />
                )
              })}
              <Input02
                className={style.input02}
                stateValue={data.jobs[1]?.grade ?? ""}
                label="職等"
                labelWidth="100px"
                disabled={true}
              />
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
              onChange={(e:TeTextarea) => {
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
} // EditEmployeeItem02


// ============================================================
function jobConfig(jobsOptions: TuseJobsOptions) {
  const {
    department, jobName, jobs,
    optionsDepartments, onChangeDepartments,
    optionsJobs, onChangeJobs,
  } = jobsOptions

  type TkeyIndex01Keys = "department" | "jobName";
  //  | "grade";

  const keyindex01: TkeyIndex01Keys[] = [
    "department",
    "jobName",
    // "grade",
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
    // "grade": {
    //   stateValue: jobName?.grade ?? null,
    //   label: "職等",
    //   options: [{ value: "", label: "職等不能選擇" }],
    //   onChange: () => { }
    // },
  };
  return [config01, keyindex01] as const
}
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

// ===============================================================


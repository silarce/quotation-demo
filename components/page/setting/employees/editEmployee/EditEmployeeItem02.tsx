
import { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";

// global gear
import InputSel from "components/global/gear/inputAndSel/inputSel";

// icon
import { IconAddCircle, IconRemoveCircle } from "public/image/icon/svgComponent/svgIcons";

// api
import {
  Tparams, TuseJobsOptions, TjobDto,
  useDepartments, useJobsOptions
} from "js/api/api_department";


// type
import { Toption } from "fakeDatabase/options/options";
import type { TprePostEmployee } from "../editEmployee";
// css
import scss from "../editEmployee.module.scss"


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
    = useJobsOptions(departmentsData ?? {}, data?.jobs?.[0])
  const jobsOptions02
    = useJobsOptions(departmentsData ?? {}, data?.jobs?.[1])

  useEffect(() => {
    updateDepartmentsData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const jobs: (TjobDto | undefined)[] = []
    jobsOptions01.jobs ? jobs.push(jobsOptions01.jobs) : jobs.push(undefined)
    jobsOptions02.jobs && jobs.push(jobsOptions02.jobs)

    setData(data => ({ ...data, jobs }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobsOptions01.jobs, jobsOptions02.jobs])

  const [jobsConfig01, jobsKeyindex01] = jobConfig(jobsOptions01)
  const [jobsConfig02, jobsKeyindex02] = jobConfig(jobsOptions02)

  // ======================================================

  const [isDepart02, setIsDepart02] = useState(!!data?.jobs?.[1])

  const switchNewDepart = () => {
    setIsDepart02(state => !state)
    jobsOptions02.clear()
  }

  return (
    <div className={scss.editEmployeeItem02}>
      <p className={scss.subTitle}>公司資訊</p>
      <div className={scss.form02}>
        <>

          <div className={scss.selBox}>
            {jobsKeyindex01.map((key, index) => {
              const { stateValue, label, options, onChange }
                = jobsConfig01[key]
              return (
                <InputSel className={scss.inputSel} key={index}
                  label={label}
                  presetStyle="s01"
                  selectProps={{
                    value: stateValue,
                    options: options,
                    onChange: onChange,
                  }}
                />
              )
            })}
            <InputSel
              className={scss.input02}
              label="職等"
              presetStyle="s01"
              disabled={true}
              inputProps={{
                value: data.jobs[0]?.grade ?? "",
                onChange: () => { },
              }}
            />

            {isDepart02
              ? <IconRemoveCircle onClick={switchNewDepart} />
              : <IconAddCircle onClick={switchNewDepart} />
            }
          </div>


          {isDepart02 &&
            <div className={scss.selBox}>
              {jobsKeyindex02.map((key, index) => {
                const { stateValue, label, options, onChange }
                  = jobsConfig02[key]

                return (
                  <InputSel className={scss.inputSel} key={index}
                    label={label}
                    presetStyle="s01"
                    selectProps={{
                      value: stateValue,
                      options: options,
                      onChange: onChange,
                    }}
                  />
                )
              })}
              <InputSel
                className={scss.inputSel}
                label="職等"
                presetStyle="s01"
                disabled={true}
                inputProps={{
                  value: data.jobs[1]?.grade ?? "",
                  onChange: () => { },
                }}
              />
              {isDepart02
                ? <IconRemoveCircle onClick={switchNewDepart} />
                : <IconAddCircle onClick={switchNewDepart} />
              }
            </div>}
        </>









        <div className={scss.bottomContainer}>
          <div>
            <InputSel className={scss.inputSel}
              label="年資"
              captionWidth="60px"
              presetStyle="s01"
              inputProps={{
                value: data.seniority,
                onChange: (value: string) => {
                  setData(data => {
                    data.seniority = value
                    return { ...data }
                  })
                },
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
                <InputSel className={scss.inputSel}
                  key={index}
                  label={label}
                  captionWidth="60px"
                  presetStyle="s01"
                  datePickerProps={{
                    value: stateValue,
                    onChange: onChange,
                  }}
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


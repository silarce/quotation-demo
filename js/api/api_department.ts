import { useState, useEffect, useMemo } from "react";

import { axi } from "./_axiosCreator";


// type
import { Toption } from "fakeDatabase/options/options";

export type Tparams = {
  order: "ASC" | "DESC",
  page: number,
  pageSize: number,
  filter?: {
    [key: string]: any
  }
  populate?: string[]
}

export type Tmeta = {
  "page": number,
  "pageSize": number,
  "itemCount": number,
  "pageCount": number,
  "hasPreviousPage": boolean,
  "hasNextPage": boolean
}


// ==========================================================
// ==========================================================
// departments type
export type TdepartmentData = {
  "id": string,
  "createdAt": string, //"2022-10-17T13:53:13.657Z"
  "updatedAt": string, //"2022-10-17T13:53:13.657Z"
  "name": string,
  "jobs": TjobsData[]
}

type TgetDepartments = {
  data: TdepartmentData[]
  meta: Tmeta
}


// ----------------------------------------------------
// departments

const apiGetDepartments = (params: Tparams) => {
  const api = "/departments"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

export const useDepartments = (params: Tparams) => {
  let [data, setData] = useState<Partial<TgetDepartments>>({})
  const update = async () => {
    const data = await apiGetDepartments(params)
    if (data) setData(data)
    return data
  }
  return { data, setData, update }
}



// ==========================================================
// ==========================================================
// ==========================================================
// jobs type


type TjobsData =
  {
    "id": string,
    "createdAt": string, // "2022-10-17T13:39:50.061Z"
    "updatedAt": string, // "2022-10-17T13:39:50.061Z"
    "name": string,
    "grade": 0,
    "department": {
      "id": string,
      "createdAt": string, // "2022-10-17T13:39:50.061Z"
      "updatedAt": string, // "2022-10-17T13:39:50.061Z"
      "name": string,
      "jobs": string[]
    },
  }

type TgetJobs = {
  data: TjobsData[]
  meta: Tmeta
}


// ----------------------------------------------------
// jobs

const apiGetJobs = (params: Tparams) => {
  const api = "/jobs"

  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

export const useJobs = (params: Tparams) => {
  let [data, setData] = useState<Partial<TgetJobs>>({})
  const update = async () => {
    const data = await apiGetJobs(params)
    if (data) setData(data)
    return data
  }
  return { data, setData, update }
}



// =====================================================
// =====================================================
// =====================================================
// =====================================================
// =====================================================
// hook

export const useJobsOptions = () => {

  const defaultParams = (): Tparams => ({
    order: "ASC",
    page: 1,
    pageSize: 999,
    populate: ["jobs"]
  })

  // !!!!!!!!!!!! 搞這麼多東西就是為了這個
  const [jobId, setJobId] = useState("")
  // !!!!!!!!!!!!

  // 取得部門資料，然後再取得裡面的職稱資料
  const { data: departmentsData, update: updateDepartmentsData }
    = useDepartments(defaultParams())

  const [department, setDepartment] =
    useState<Toption | null>(null) //部門
  const [jobName, setJobName] =
    useState<Toption | null>(null) //職稱 


  // =============================================================
  // 部門options
  const {
    optionsDepartmentsObj,
    optionsDepartments
  } = useMemo(() => {
    return optionsDepartmentsOri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [departmentsData?.data])

  const onChangeDepartments = (option: Toption | null) => {
    if (!option) return null
    setDepartment(option)
  }

  // =============================================================
  // 職稱options

  const {
    // optionsJobsObj,
    optionsJobs
  } = useMemo(() => {
    return optionsJobsOri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department])

  const onChangeJobs = (option: Toption | null) => {
    if (!option) return null
    setJobName(option)
    setJobId(option.value as string)
  }

  return {
    department, jobName, jobId,
    optionsDepartments, onChangeDepartments,
    optionsJobs, onChangeJobs,
    updateDepartmentsData,
  }

  // --------------------------------
  function optionsDepartmentsOri() {
    const optionsDepartmentsObj
      = {} as { [key: string]: TdepartmentData }
    const optionsDepartments
      = [] as Toption[]

    departmentsData.data?.forEach((item) => {
      const { id, name } = item;
      optionsDepartmentsObj[id] = item
      optionsDepartments.push({
        value: id,
        label: name
      })
    })
    return {
      optionsDepartmentsObj,
      optionsDepartments
    }
  }

  function optionsJobsOri() {
    const optionsJobsObj =
      {} as { [key: string]: TjobsData }
    const optionsJobs =
      [] as Toption[]
    if (department) {
      optionsDepartmentsObj[department.value].jobs.forEach((item) => {
        const { id, name, grade } = item;
        optionsJobsObj[id] = item
        optionsJobs.push({
          value: id,
          label: name,
          grade: `${grade}`
        })
      })
    }
    return {
      optionsJobsObj,
      optionsJobs
    }
  }
}











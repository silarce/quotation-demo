import { useState, useEffect, useMemo } from "react";

import { axi } from "./_axiosCreator";


// type
import { TpageMetaDto, TdepartmentDto, TjobDto, TdepartmentManagerDto } from "./dtoTypes";
import { Toption } from "fakeDatabase/options/options";

export type { TdepartmentDto, TjobDto }


export type Tparams = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate?: string[]
}

// ==========================================================
// ==========================================================

export type TgetDepartments = {
  data: TdepartmentDto[]
  meta: TpageMetaDto
}


// ----------------------------------------------------
// departments

const apiGetDepartments = (params: Tparams) => {
  const api = "/departments"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

export const useDepartments = (params: Tparams = {}) => {
  let [data, setData] = useState<TgetDepartments>()
  const update = async () => {
    const data = await apiGetDepartments(params)
    if (data) setData(data)
    return data
  }
  return { data, setData, update }
}

// 新增部門
export const apiPostDepartments = (body: { name: string }) => {
  const api = "/departments"
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}


// 更新部門，目前只能變更name
export const apiPatchDepartments = (id: string, body: { name: string }) => {
  const api = `/departments/${id}`
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}
// 刪除部門
export const apiDeleteDepartments = (id: string) => {
  const api = `/departments/${id}`
  return axi.delete(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}


// ==========================================================
// ==========================================================
// ==========================================================
// jobs type


type TgetJobs = {
  data: TjobDto[]
  meta: TpageMetaDto
}


// ----------------------------------------------------
// jobs

// 取得所有職等
const apiGetJobs = (params: Tparams) => {
  const api = "/jobs"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

export const useJobs = (params: Tparams) => {
  let [data, setData] = useState<TgetJobs>()
  const update = async () => {
    const data = await apiGetJobs(params)
    if (data) setData(data)
    return data
  }
  return { data, setData, update }
}

// 新增職等
export const apiPostJobs = (body: {
  "name": string
  "grade": number
  "departmentId": string
}) => {
  const api = "/jobs"
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}


// 更新職等
export const apiPatchJobs = (id: string, body: {
  "name"?: string
  "grade"?: number
  "departmentId"?: string
}) => {
  const api = `/jobs/${id}`
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}
// 刪除職等
export const apiDeleteJobs = (id: string) => {
  const api = `/jobs/${id}`
  return axi.delete(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}


// =====================================================
// =====================================================
// =====================================================

// departments/managers

const apiGetDepartments_managers = () => {
  const api = "/departments/managers"
  return axi.get(api)
    .then(({ data }) => data as TdepartmentManagerDto[])
    .catch(err => Promise.reject(err))
}

export const useDepartments_managers = () => {
  let [data, setData] = useState<TdepartmentManagerDto[]>()
  const update = async () => {
    const data = await apiGetDepartments_managers()
    if (data) setData(data)
    return data
  }
  return { data, setData, update }
}


type TpostDepartments_id_managersBody = {
  employeeIds: string[]
}

export const apiPostDepartments_id_managers
  = (departmentId: string, body: TpostDepartments_id_managersBody) => {
    const api = `/departments/${departmentId}/managers`
    return axi.post(api, body)
      .then(({ data }) => data as TdepartmentManagerDto[])
      .catch(err => Promise.reject(err))
  }

export const apiDeleteDepartments_id_managers
  = (departmentId: string, body: TpostDepartments_id_managersBody) => {
    const api = `/departments/${departmentId}/managers`
    return axi.delete(api, { data: { ...body } })
      .then(({ data }) => data as TdepartmentManagerDto[])
      .catch(err => Promise.reject(err))
  }

// =====================================================
// =====================================================
// =====================================================
// =====================================================
// =====================================================
// hook

// 人員資料中設定部門/職稱/職等用的
// 會輸出一系列的資料，options與onChange
// 部門與職稱的options會連動，選擇部門後會使職稱的options改變
// 最後要取得的資料是jobs
// 目前使用在/setting/employees/edit/[id]
//        與/setting/employees/add/addEmployee
export const useJobsOptions = (
  departmentsData: Partial<TgetDepartments>,
  defaultJobs?: TjobDto
) => {

  // 這裡先設定jobsData，要post前再把jobId取出然後post
  const [jobs, setJobs]
    = useState<TjobDto | undefined>(defaultJobs)

  const [department, setDepartment] =
    useState<Toption | null>(null) //部門
  const [jobName, setJobName] =
    useState<Toption | null>(null) //職稱 


  // --------------------------------------------------------------
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
    setJobName(null)
    setJobs(undefined)
  }

  // --------------------------------------------------------------
  // 職稱options

  const {
    optionsJobsObj,
    optionsJobs
  } = useMemo(() => {
    return optionsJobsOri()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [department])

  const onChangeJobs = (option: Toption | null) => {
    if (!option) return null
    setJobName(option)
    setJobs(optionsJobsObj[option.value])
  }
  // --------------------------------------------------------------
  const clear = () => {
    setDepartment(null)
    setJobName(null)
    setJobs(undefined)
  }

  useEffect(() => {

    if (!jobs) return
    setDepartment({
      value: jobs.department!.id,
      label: jobs.department!.name
    })
    setJobName({
      value: jobs.id,
      label: jobs.name,
      // grade: `${jobs.grade}`
    })
  }, [])
  // ==============================================
  // ==============================================
  return {
    department, jobName, jobs,
    optionsDepartments, onChangeDepartments,
    optionsJobs, onChangeJobs,
    clear
  }
  // ==============================================
  // ==============================================

  // --------------------------------
  function optionsDepartmentsOri() {
    const optionsDepartmentsObj
      = {} as { [key: string]: TdepartmentDto }
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
      {} as { [key: string]: TjobDto }
    const optionsJobs =
      [] as Toption[]
    if (department) {
      optionsDepartmentsObj[department.value]?.jobs?.forEach((item) => {
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


export type TuseJobsOptions = ReturnType<typeof useJobsOptions>










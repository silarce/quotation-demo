import { useState } from "react";

import { axi } from "./_axiosCreator";


// type
import {
  TpageMetaDto, TdepartmentDto, TdepartmentDto_jobs, TjobDto,
  TdepartmentManagerDto, TupdateDepartmentJobDto
} from "./dtoTypes";

export type { TdepartmentDto, TdepartmentDto_jobs, TjobDto, TupdateDepartmentJobDto }


export type Tparams = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate?: "jobs"[]
}
export type Tparams_jobs = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate: "jobs"[]
}

// ==========================================================
// ==========================================================

export type TgetDepartments = {
  data: TdepartmentDto[]
  meta: TpageMetaDto
}
export type TgetDepartments_jobs = {
  data: TdepartmentDto_jobs[]
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

/**
 * data.data型別為TdepartmentDto_jobs[]
 */
export const useDepartments_jobs = (params: Tparams_jobs) => {
  let [data, setData] = useState<TgetDepartments_jobs>()
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
    .then(({ data }) => data as { id: string })
    .catch(err => Promise.reject(err))
}


// 更新部門，目前只能變更name
export const apiPatchDepartments_id = (id: string, body: { name: string }) => {
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

// 批次更新部門資料(包括name與底下的jobs)
export const apiPatchDepartments = (body: TupdateDepartmentJobDto[]) => {
  const api = "/departments"
  return axi.patch(api, body)
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
const apiGetJobs = (params: Tparams_jobs) => {
  const api = "/jobs"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

export const useJobs = (params: Tparams_jobs) => {
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

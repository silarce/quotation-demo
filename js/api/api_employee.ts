
import {
  useState, useEffect
} from "react";

import { axi } from "./_axiosCreator";

// type
import { TemployeeDto, TpageMetaDto } from "./dtoTypes";

export type { TemployeeDto }

// =============================================
// 員工資料


// 員工資料列表
export type TgetEmployee = {
  "data": TemployeeDto[],
  "meta": TpageMetaDto
}

// 新增、更新員工資料的body
export type TpostEmployee = {
  "idNumber": undefined
  "chName": string
  "enName": string
  "identity": string
  "birthday": Date | undefined | string
  "gender": string
  "marital": string
  "education": string
  "expertise": string
  "phone1": string
  "phone2": string
  "email": string
  "residenceCounty": string
  "residenceDistrict": string
  "residenceAddress": string
  "mailingCounty": string
  "mailingDistrict": string
  "mailingAddress": string
  "seniority": string
  "startDate": Date | undefined
  "leaveDate": Date | undefined
  "retireDate": Date | undefined
  "severanceDate": Date | undefined
  "processPermission": true
  militaryServiceType: string
  "qualifications": { "name": string, "years": number }[]
  "jobId": string[]
}

type Tpopulate = ("jobs" | "jobs.department")[]



// =======================================================
// 取得員工資料列表
export type TapiGetEmployeeParams = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate?: string[]
  sort?: keyof TemployeeDto
}
const apiGetEmployee = (params?: TapiGetEmployeeParams) => {
  // const api = "/employees?filter[user][$notNull]"
  const api = "/employees"
  return axi.get(api, { params })
    // return axi.get(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err.message))
}

export const useEmployee = (params?: TapiGetEmployeeParams) => {
  let [data, setData] = useState<TgetEmployee>()
  const update = async () => {
    const data = await apiGetEmployee(params)
    if (data) setData(data)
    return data
  }

  return { data, setData, update }
}

export const useCheckEmployee = (
  idNumber: string,
) => {
  type Tcheck = "ok" | "notOk" | "loading"

  const params: TapiGetEmployeeParams = {
    order: "ASC",
    page: 1,
    pageSize: 999,
    filter: {
      idNumber: {
        $eq: idNumber
      }
    }
  }
  const [check, setCheck] = useState<Tcheck>("loading")

  const update = async () => {
    try {
      setCheck("loading")
      const res = await apiGetEmployee(params)
      if (res.data.length === 0) setCheck("ok")
      else setCheck("notOk")
    }
    catch {
      setCheck("notOk")
    }
  }

  return {
    check,
    setCheck,
    reCheck: update
  }
}


// =======================================================
// 取得個別員工資料
export type TapiGetEmployee_idParams = {
  populate: Tpopulate
}

const apiGetEmployee_id = (id: string, params?: TapiGetEmployee_idParams) => {
  const api = `/employees/${id}`

  return axi.get(api, { params })
    .then(({ data }) => {
      return data
    })
    .catch((err) => false)
}

export const useEmployeeById = (id: string, params?: TapiGetEmployee_idParams) => {
  const [data, setData] = useState<TemployeeDto>()

  const update = async () => {
    const res = await apiGetEmployee_id(id, params)
    if (res) setData(res)
    return res
  }
  return { data, setData, update }
}

// =======================================================
// 新增員工資料

export const apiPostEmployee = (body: TpostEmployee) => {
  const api = "/employees"
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}
// =======================================================
// 修改員工資料
export const apiPatchEmployee = (body: TpostEmployee, id: string) => {
  const api = `/employees/${id}`
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

// =======================================================
// 刪除員工資料

export const apiDeleteEmployee = (id: string) => {
  const api = `/employees/${id}`
  return axi.delete(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

// =======================================================
// 新增ERP使用者

export const apiPostEmployeeErpUser = (id: string) => {
  const api = `/employees/${id}/erp-user`
  return axi.post(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}
// 刪除ERP使用者
export const apiDeleteEmployeeErpUser = (id: string) => {
  const api = `/employees/${id}/erp-user`
  return axi.delete(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}


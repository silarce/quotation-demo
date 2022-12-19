
import {
  useState, useEffect
} from "react";

import { axi } from "./_axiosCreator";

// type
import { TjobsData } from "./api_department"


// =============================================
// 員工資料
export type Temployee = {
  "id": string,
  "createdAt": string, // 2022-10-12T08:47:24.753Z"
  "updatedAt": string, // 2022-10-12T08:47:24.753Z"
  "idNumber": string,
  "chName": string,
  "enName": string,
  "identity": string,
  "birthday": string,
  "gender": string,
  "marital": string,
  "education": string,
  "expertise": string,
  "phone1": string,
  "phone2": string,
  "email": string,
  "residenceCounty": string,
  "residenceDistrict": string,
  "residenceAddress": string,
  "mailingCounty": string,
  "mailingDistrict": string,
  "mailingAddress": string,
  "seniority": string,
  "startDate": string,
  "leaveDate": string,
  "retireDate": string,
  "severanceDate": string,
  "processPermission": true,
  "jobs"?: TjobsData[]
}

// 員工資料列表
export type TgetEmployee = {
  "data": Temployee[],
  "meta": {
    "page": number,
    "pageSize": number,
    "itemCount": number,
    "pageCount": number,
    "hasPreviousPage": boolean,
    "hasNextPage": boolean
  }
}

// 新增、更新員工資料的body
export type TpostEmployee = {
  "idNumber": string,
  "chName": string,
  "enName": string,
  "identity": string,
  "birthday": string,
  "gender": string,
  "marital": string,
  "education": string,
  "expertise": string,
  "phone1": string,
  "phone2": string,
  "email": string,
  "residenceCounty": string,
  "residenceDistrict": string,
  "residenceAddress": string,
  "mailingCounty": string,
  "mailingDistrict": string,
  "mailingAddress": string,
  "seniority": string,
  "startDate": string,
  "leaveDate": string,
  "retireDate": string,
  "severanceDate": string,
  "processPermission": true,
  "jobId": string[]
}

type Tpopulate =
  "jobs.department"[]



// =======================================================
// 取得員工資料列表
export type TapiGetEmployeeParams = {
  order: "ASC" | "DESC",
  page: number,
  pageSize: number,
  filter?: {
    [key: string]: any
  }
  populate?: Tpopulate
}
const apiGetEmployee = (params?: TapiGetEmployeeParams) => {
  const api = "/employees"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err.message))
}

export const useEmployee = (params?: TapiGetEmployeeParams) => {
  let [data, setData] = useState<Partial<TgetEmployee>>({})
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
  const [data, setData] = useState<Partial<Temployee>>({})

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




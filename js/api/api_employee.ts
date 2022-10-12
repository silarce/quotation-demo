
import { useState, useEffect } from "react";

import { axi } from "./_axiosCreator";

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
  "jobs": string[]
}

// 員工資料列表
export type TgetEmployee = {
  "data"?: Temployee[],
  "meta"?: {
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
  "jobId"?: string[]
}



export type TapiGetEmployee = {
  order: "ASC" | "DESC",
  page: number,
  pageSize: number,
}

const apiGetEmployee = (params: TapiGetEmployee) => {
  const api = "/employees"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => err)
}

export const useEmployee = () => {
  const [data, setData] = useState<TgetEmployee>({})
  const update = async (params: TapiGetEmployee) => {
    const data = await apiGetEmployee(params)
    if (data) setData(data)
    return data
  }
  return { data, setData, update } as const
}

// =======================================================
// 新增員工資料

export const apiPostEmployee = (body: TpostEmployee) => {
  const api = "/employees"
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch(err => err)
}










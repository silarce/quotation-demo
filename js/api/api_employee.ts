
import { useState, useEffect } from "react";

import { axi } from "./_axiosCreator";

// =============================================
// 員工資料
type Temployee = {
  "id": string,
  "createdAt": string,//"2022-10-11T07:16:58.689Z"
  "updatedAt": string,//"2022-10-11T07:16:58.689Z"
  "id_number": string,
  "ch_name": string,
  "en_name": string,
  "identity": string,
  "birthday": string,
  "gender": string,
  "marital": string,
  "education": string,
  "expertise": string,
  "phone1": string,
  "phone2": string,
  "email": string,
  "residence_address": string,
  "mailing_address": string,
  "process_permission": boolean,
  "seniority": string,
  "start_date": string,
  "leave_date": string,
  "retire_date": string,
  "severance_date": string,
  "departments": string[]
}

// 員工資料列表
type TgetEmployee = {
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
  "id_number": string,
  "ch_name": string,
  "en_name": string,
  "identity": string,
  "birthday": string,
  "gender": string,
  "marital": string,
  "education": string,
  "expertise": string,
  "phone1": string,
  "phone2": string,
  "email": string,
  "residence_address": string,
  "mailing_address": string,
  "process_permission": boolean,
  "seniority": string,
  "start_date": string,
  "leave_date": string,
  "retire_date": string,
  "severance_date": string,
  "departmentId"?: string[]
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
  const [data, setData] = useState<TgetEmployee>({} as TgetEmployee)
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










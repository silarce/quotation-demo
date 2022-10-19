
import { useState } from "react";

import { axi } from "./_axiosCreator";

// ===============================================================


type Tmeta = {
  "page": number,
  "pageSize": number,
  "itemCount": number,
  "pageCount": number,
  "hasPreviousPage": boolean,
  "hasNextPage": boolean
}

export type TapiGetCustomersParams = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate?: "contacts"[]
  sort?: string[]
}


export type TcontactData = {
  "id": string,
  "createdAt": string //"2022-10-17T05:35:08.115Z",
  "updatedAt": string //"2022-10-17T05:35:08.115Z",
  "createdBy": string
  "updatedBy": string
  "deletedBy": string | null
  "name": string
  "phone": string
}


export type TcustomersData = {
  "id": string,
  "createdAt": string // "2022-10-19T05:36:03.899Z",
  "updatedAt": string // "2022-10-19T05:36:03.899Z",
  "customerNumber": string, //客戶編號
  "name": string, //客戶全稱
  "nickname": string, //客戶簡稱
  "category": string, //客戶類型
  "principal": string, //客戶負責人
  "taxDeductionCategory": string, //扣稅類別
  "taxId": string, //統一編號
  "phone": string, 
  "fax": string, 
  "county": string, 
  "district": string, 
  "address": string, 
  "invoiceCounty": string, //發票地址縣市
  "invoiceDistrict": string, //發票地址區域
  "invoiceAddress": string, //發票地址剩餘地址
  "contacts"?: TcontactData[] //聯絡人
}


export type TgetCustomers = {
  data: TcustomersData[]
  meta: Tmeta
}

const apiGetCustomers = (params?: TapiGetCustomersParams) => {
  const api = "/customers"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err.message))
}

export const useCustomers = (params?: TapiGetCustomersParams) => {
  let [data, setData] = useState<Partial<TgetCustomers>>({})
  const update = async () => {
    const data = await apiGetCustomers(params)
    if (data) setData(data)
    return data
  }
  return { data, setData, update }
}





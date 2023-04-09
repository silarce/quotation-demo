
import { useState } from "react";

import { axi } from "./_axiosCreator";

// type
import type { TcustomerDto, TcustomerDto_Populate, TpageMetaDto, Tcontact } from "./dtoTypes";

/**
 * "types"、"contacts"為必須
 */
type TcustomerDto_TC = TcustomerDto_Populate<["types", "contacts"]>


export type { TcustomerDto, TcustomerDto_Populate, TcustomerDto_TC, Tcontact as Tcontacts }
// ===============================================================

export const customerTypesLookup = Object.freeze({
  construction: "營造",
  firm: "事務所",
  propertyOwner: "業主",
  contractor: "協力廠商",
});

type TcustomerTypesLookupKeys = (keyof typeof customerTypesLookup)
export const customerTypesArr
  = (Object.keys(customerTypesLookup) as TcustomerTypesLookupKeys[])
    .map((key) => ({ value: key, label: customerTypesLookup[key] }))

// export const customerTypesArr = [
//   { value: "construction", label: "營造" },
//   { value: "firm", label: "事務所" },
//   { value: "propertyOwner", label: "業主" },
//   { value: "contractor", label: "協力廠商" },
// ]


// ===============================================================

export type TapiGetCustomersParams = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate?: ("contacts" | "types")[]
  sort?: string[]
}

export type TgetCustomers = {
  data: TcustomerDto[]
  meta: TpageMetaDto
}


export type TpostCustomer = {
  "id"?: string,
  "createdAt"?: string // "2022-10-19T05:36:03.899Z",
  "updatedAt"?: string // "2022-10-19T05:36:03.899Z",
  "customerNumber"?: undefined, // 客戶編號 後端不收
  "name": string, //客戶全稱
  "nickname": string, //客戶簡稱
  types: ("construction" | "firm" | "propertyOwner" | "contractor")[]
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
  "contacts": {
    "id"?: string,
    "createdAt"?: string //"2022-10-17T05:35:08.115Z",
    "updatedAt"?: string //"2022-10-17T05:35:08.115Z",
    "createdBy"?: string
    "updatedBy"?: string
    "deletedBy"?: string | null
    "name": string
    "phone": string
  }[] //聯絡人
}

// ============================================================
// 取得客戶列表

const apiGetCustomers = (params?: TapiGetCustomersParams) => {
  const api = "/customers"
  return axi.get(api, { params })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err.message))
}

export const useCustomers = (params?: TapiGetCustomersParams) => {
  let [data, setData] = useState<TgetCustomers>()
  const update = async () => {
    const data = await apiGetCustomers(params)
    if (data) setData(data)
    return data
  }
  return { data: data?.data, meta: data?.meta, setData, update }
}

// ============================================================
const apiCustomersNameExist = (name: string) => {
  const api = `/customers/name-exist/${name}`
  return axi.get(api)
    .then(({ data }) => data as { isExist: boolean })
    .catch(err => Promise.reject(err.message))
}

export const useApiCustomersNameExist = (name: string) => {
  type Tcheck = "ok" | "notOk" | "loading"
  const [check, setCheck] = useState<Tcheck>("loading")

  const reCheck = async () => {
    try {
      setCheck("loading")
      const res = await apiCustomersNameExist(name)
      if (!res.isExist) setCheck("ok")
      else setCheck("notOk")
    }
    catch {
      setCheck("notOk")
    }
  }
  return {
    check,
    setCheck,
    reCheck
  }
}

// ============================================================
// 取得個別客戶資料

const apiGetCustomers_id
  = (id: string, params?: TapiGetCustomersParams) => {
    const api = `/customers/${id}`
    return axi.get(api, { params })
      .then(({ data }) => data)
      .catch(err => Promise.reject(err.message))
  }

export const useCustomersById
  = (id: string, params?: TapiGetCustomersParams) => {
    let [data, setData] = useState<TcustomerDto_TC>()
    const update = async () => {
      const data = await apiGetCustomers_id(id, params)
      if (data) setData(data)
      return data
    }
    return { data, setData, update }
  }

// ==============================================================
// 新增客戶資料
export const apiPostCustomers = (body: TpostCustomer) => {
  const api = `/customers`
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err.message))
}

// ==============================================================
// 編輯客戶資料
export const apiPatchCustomers_id
  = (id: string, body: TpostCustomer) => {
    body.id && delete body.id
    const api = `/customers/${id}`
    return axi.patch(api, body)
      .then(({ data }) => data)
      .catch(err => Promise.reject(err.message))
  }

// ==============================================================
// 刪除客戶資料
export const apiDeleteCustomers_id
  = (id: string,) => {
    const api = `/customers/${id}`
    return axi.delete(api)
      .then(({ data }) => data)
      .catch(err => Promise.reject(err.message))
  }






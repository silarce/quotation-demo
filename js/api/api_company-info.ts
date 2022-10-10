
import { useState, useEffect } from "react";

import { axi } from "./_axiosCreator";

// =============================================
// 取得公司資訊
type TapiCompanyInfoKeys =
  "id" | "createdAt" | "updatedAt" | "name" |
  "phone" | "email" | "logoLink" | "fax" |
  "taxId" | "county" | "district" | "address"
export type TapiCompanyInfo = {
  [key in TapiCompanyInfoKeys]: string | null
} |
  {
    [key in TapiCompanyInfoKeys]?: undefined
  }

const apiCompanyInfo = () => {
  const api = "/company-info"
  return axi.get(api)
    .then(({ data }) => data)
    .catch(err => err)
}

export const useCompanyInfo = () => {
  const [data, setData] = useState<TapiCompanyInfo>({})
  const update = async () => {
    const res = await apiCompanyInfo()
    if (res) {
      setData(res)
      return res
    }
  }
  return [data, setData, update] as const
}

// =============================================
// 更新公司資訊

export type TpatchCompanyInfo = {
  "name": string,
  "phone": string,
  "email": string,
  "county": string,
  "district": string,
  "address": string,
  "fax": string,
  "taxId": string,
}

export const apiPatchCompanyInfo = (body: TpatchCompanyInfo) => {
  const api = "/company-info"
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => err)
}


// =============================================
// 上傳 LOGO
export const apiUploadCompanyLogo = (formData: FormData) => {
  const api = "/company-info/logo"
  const body = formData
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => err)
}















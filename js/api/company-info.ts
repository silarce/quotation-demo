
import { useState, useEffect } from "react";

import { axi } from "./_axiosCreator";


// =============================================
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
    if (res) setData(res)
  }
  useEffect(() => {
    update()
  }, [])

  return [data, setData, update] as const
}

// =============================================
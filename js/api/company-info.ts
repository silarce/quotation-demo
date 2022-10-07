
import { useState, useEffect } from "react";

import { axi } from "./_axiosCreator";


type TapiCompanyInfo = {
  "id": string,
  "createdAt": string,
  "updatedAt": string,
  "name": string,
  "phone": string,
  "email": string,
  "address": string,
  "logoLink": string
}

const apiCompanyInfo = () => {
  const api = "/company-info"
  return axi.get(api)
    .then(({ data }) => data)
    .catch(err => err)
}

export const useCompanyInfo = () => {

  const [data, setData] = useState<TapiCompanyInfo>()
  const update = async () => {
    const res = await apiCompanyInfo()
    if (res) setData(res)
  }
  useEffect(() => {
    update()
    console.log(document.cookie)
  }, [])

  return [data, update]
}

import { useState } from "react";
import { axi } from "./_axiosCreator";

// type
import { TpageMetaDto, TerpFeatureDto } from "./dtoTypes";



const apiGetErpFeatures = () => {
  const api = "/erp-features"
  return axi.get(api)
    .then(({ data }) => data as TpageMetaDto[])
    .catch(err => Promise.reject(err))
}

// 得到空陣列，怎麼新增資料?
const useErpFeatures = () => {
  const [data, setData] = useState<TpageMetaDto[]>()
  const update = async () => {
    const res = await apiGetErpFeatures()
    if (res) setData(res)
    return res
  }
  return { data, setData, update }
}

type TpostErpFeaturesBody = {
  departmentIds: string[]
}

////////////////////////////////////////// 這個id是什麼的id
export const apiPostErpFeatures_id_departments = (id: string, body: TpostErpFeaturesBody) => {
  const api = `/erp-features/${id}/departments`
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

export const apiDeleteErpFeatures_id_departments = (id: string, body: TpostErpFeaturesBody) => {
  const api = `/erp-features/${id}/departments`
  return axi.delete(api, { data: { ...body } })
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

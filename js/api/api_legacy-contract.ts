import { useState } from "react";

import { axi } from "./_axiosCreator";

import _ from "lodash"




import {
  TpaymentMethodDto,
  TlegacyContractProductDto,
  TlegacyContractAdditionDto,
  TlegacyContractDto,
  TcreateLegacyContractProductDto,
  TcreateLegacyContractAdditionDto,
  TcreateLegacyContractDto,
  TupdateLegacyContractDto,
  TpageMetaDto,
} from "./dtoTypes"



type Tparams = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate?: "jobs"[]
}



type TgetLegacyContracts = {
  data: TlegacyContractDto[]
  meta: TpageMetaDto
}


// =================================================================

const apiGetLegacyContracts = (params?: Tparams) => {
  const api = "/legacy-contracts"
  return axi.get(api, { params })
    .then(({ data }) => data as TgetLegacyContracts)
    .catch(err => Promise.reject(err))
}

export const useLegacyContracts = (params?: Tparams) => {
  let [res, setRes] = useState<TgetLegacyContracts>()
  const update = async () => {
    const res = await apiGetLegacyContracts(params)
    if (res) setRes(res)
    return res
  }
  return {
    legacyContractsArr: res?.data,
    legacyContractsMeta: res?.meta,
    setLegacyContracts: setRes,
    updateLegacyContracts: update
  }
}


const apiGetLegacyContracts_id = (id: string, params: Tparams = {}) => {
  const api = `/legacy-contracts/${id}`
  return axi.get(api, { params })
    .then(({ data }) => data as TgetLegacyContracts)
    .catch(err => Promise.reject(err))
}


export const apiPostLegacyContracts = (body: TcreateLegacyContractDto) => {
  const api = `/legacy-contracts`
  return axi.post(api)
    .then(({ data }) => data as TgetLegacyContracts)
    .catch(err => Promise.reject(err))
}


export const apiPatchLegacyContracts_id = (id: string, body: TupdateLegacyContractDto) => {
  const api = `/legacy-contracts/${id}`
  return axi.patch(api, body)
    .then(({ data }) => data as TgetLegacyContracts)
    .catch(err => Promise.reject(err))
}

export const apiDeleteLegacyContracts_id = (id: string) => {
  const api = `/legacy-contracts/${id}`
  return axi.delete(api)
    .then(({ data }) => data as TgetLegacyContracts)
    .catch(err => Promise.reject(err))
}















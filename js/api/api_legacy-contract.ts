import { useState } from "react";

import { axi, domain } from "./_axiosCreator";

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
  TfileDto
} from "./dtoTypes"

export { domain }

export type Tparams = {
  order?: "ASC" | "DESC",
  page?: number,
  pageSize?: number,
  filter?: {
    [key: string]: any
  }
  populate?: string[]
  sort?: string
}



type TgetLegacyContracts = {
  data: TlegacyContractDto[]
  meta: TpageMetaDto
}


export type {
  TpaymentMethodDto,
  TlegacyContractProductDto,
  TlegacyContractAdditionDto,
  TlegacyContractDto,
  TcreateLegacyContractProductDto,
  TcreateLegacyContractAdditionDto,
  TcreateLegacyContractDto,
  TupdateLegacyContractDto,
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

  const update_infinite = async () => {
    if (!res) return
    const apiRes = await apiGetLegacyContracts(params)
    const newData = apiRes.data
    const oldData = res.data
    res.data = [...oldData, ...newData]
    setRes({ ...res })
    return apiRes
  }

  return {
    legacyContractsArr: res?.data,
    legacyContractsMeta: res?.meta,
    setLegacyContracts: setRes,
    updateLegacyContracts: update,
    updateLegacyContracts_infinite: update_infinite
  }
}


export const apiGetLegacyContracts_id = (id: string, params: Tparams = {}) => {

  const api = `/legacy-contracts/${id}`
  return axi.get(api, { params })
    .then(({ data }) => data as TlegacyContractDto)
    .catch(err => Promise.reject(err))
}

export const useLegacyContract_id = (id: string | undefined, params?: Tparams) => {
  let [res, setRes] = useState<TlegacyContractDto>()
  const update = async () => {
    if (!id) return undefined
    const res = await apiGetLegacyContracts_id(id, params)
    if (res) setRes(res)
    return res
  }
  return {
    legacyContract: res,
    updateLegacyContract: update
  }
}


export const apiPostLegacyContracts = (body: TcreateLegacyContractDto) => {
  const api = `/legacy-contracts`
  return axi.post(api, body)
    .then(({ data }) => data as TlegacyContractDto)
    .catch(err => Promise.reject(err))
}


export const apiPatchLegacyContracts_id = (id: string, body: TupdateLegacyContractDto) => {
  const api = `/legacy-contracts/${id}`
  return axi.patch(api, body)
    .then(({ data }) => data as TlegacyContractDto)
    .catch(err => Promise.reject(err))
}

export const apiDeleteLegacyContracts_id = (id: string) => {
  const api = `/legacy-contracts/${id}`
  return axi.delete(api)
    .then(({ data }) => data as TlegacyContractDto)
    .catch(err => Promise.reject(err))
}


/**取得舊合約附件 */
export const apiGetLegacyContracts_id_attachments = (id: string) => {
  const api = `/legacy-contracts/${id}/attachments`
  return axi.get(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

export const useLegacyContracts_id_attachments = (id: string | undefined) => {
  let [res, setRes] = useState<TfileDto[]>()
  const update = async () => {
    if (!id) return undefined
    const res = await apiGetLegacyContracts_id_attachments(id) as TfileDto[]
    if (res) setRes(res)
    return res
  }
  return {
    attachments: res,
    updateAttachments: update,
    domain
  }
}


/**上傳舊合約附件 */
export const apiPostLegacyContracts_id_attachments = (contractId: string, body: FormData) => {
  const api = `/legacy-contracts/${contractId}/attachments`
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

/**移除舊合約附件 */
export const apiDelLegacyContracts_id_attachments = (contractId: string, fileId: string) => {
  const api = `/legacy-contracts/${contractId}/attachments/${fileId}`
  return axi.delete(api)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}











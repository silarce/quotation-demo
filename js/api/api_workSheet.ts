
import {
  useState, useEffect
} from "react";

import { axi } from "./_axiosCreator";

// type
import {
  Tparams,
  TpageMetaDto,
  TannotationDto,
  TcreateAnnotationDto,
} from "./dtoTypes";


type TgetAnnotation = {
  data: TannotationDto[]
  meta: TpageMetaDto
}


const apiGetAnnotation = (params?: Tparams) => {
  const api = "/work-sheet/presets/annotations"
  return axi.get(api, { params })
    .then(({ data }) => data as TgetAnnotation)
    .catch(err => Promise.reject(err))
}

export const useGetAnnotation = (otherParams?: Tparams) => {

  const [page, setPage] = useState(1)
  const params = {
    page,
    pageSize: 9999,
    ...otherParams
  }

  const [res, setRes] = useState<TgetAnnotation>()
  const update = async () => {
    const res = await apiGetAnnotation(params)
    if (res) setRes(res)
    return res
  }

  // const update_infinite = async () => {
  //   if (!res) return
  //   const apiRes = await apiGetAnnotation(params)
  //   const newData = apiRes.data
  //   const oldData = res.data
  //   const mergedData = [...oldData, ...newData]
  //   apiRes.data = [...oldData, ...newData]
  //   setRes({ data: mergedData, meta: apiRes.meta })
  //   setPage(page => ++page)
  // }
  return {
    annotationArr: res?.data,
    annotationMeta: res?.meta,
    update_anno: update,
    // update_infinite_anno: update_infinite,
  }
}

export const apiPostAnnotation = ({ body }: { body: TcreateAnnotationDto }) => {
  const api = "/work-sheet/presets/annotations"
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err))
}

export const apiPatchAnnotation = ({ body, id }: { body: TcreateAnnotationDto, id: string }) => {
  const api = `/work-sheet/presets/annotations/${id}`
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err))
}

export const apiDeleteAnnotation = ({ id }: { id: string }) => {
  const api = `/work-sheet/presets/annotations/${id}`
  return axi.patch(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err))
}






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
    .catch(err => Promise.reject(err.message))
}

export const useGetAnnotation = (otherParams?: Tparams) => {

  const [page, setPage] = useState(1)
  const params = {
    page,
    pageSize: 10,
    ...otherParams
  }

  const [res, setRes] = useState<TgetAnnotation>()
  const update = async () => {
    const res = await apiGetAnnotation(params)
    if (res) setRes(res)
    return res
  }

  const update_infinite = async () => {
    if (!res) return
    const apiRes = await apiGetAnnotation(params)
    const newData = apiRes.data
    const oldData = res.data
    const mergedData = [...oldData, ...newData]
    apiRes.data = [...oldData, ...newData]
    setRes({ data: mergedData, meta: apiRes.meta })
    setPage(page => ++page)
  }
  return {
    annotationArr: res?.data,
    annotationMeta: res?.meta,
    update: update,
    update_infinite: update,
  }

}





import { useState, useEffect } from "react";
import { useInView } from 'react-intersection-observer';

import { axi } from "./_axiosCreator";

// type
import {
  Tparams,
  TpageMetaDto,
  TannotationDto, TcreateAnnotationDto,
  TcreateQuotationRangeDto, TquotationRangeDto
} from "./dtoTypes";


type TgetAnnotation = {
  data: TannotationDto[]
  meta: TpageMetaDto
}

type TgetQuotataionRanges = {
  data: TquotationRangeDto[]
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
    sort: "category",
    ...otherParams
  }

  const [res, setRes] = useState<TgetAnnotation>()
  const update = async () => {
    const res = await apiGetAnnotation(params)
    if (res) setRes(res)
    return res
  }

  return {
    annotationArr: res?.data,
    annotationMeta: res?.meta,
    update_anno: update,
    // update_infinite_anno: update_infinite,
  }
}

export const useGetAnnotation_v2 = (customParams?: Tparams) => {
  /**就只是為了render */
  const [render, setRender] = useState(0)
  const [isLoading, setIsloading] = useState(false)
  /**viewRef 不可以放在一開始就會出現在畫面上的item上，
   * 不然無法觸發nextPage */
  const [viewRef, inView] = useInView();
  const [page, setPage] = useState(1)

  const params = {
    page,
    // pageSize必須大於畫面一次可顯示的item數量才不會壞掉    
    // 不過應該只有在嚴格模式會壞掉
    pageSize: 20,
    sort: "category",
    order: "DESC",
    ...customParams
  } as const

  const [dataArrQueue, setDataArrQueue] = useState<TgetAnnotation["data"][]>([])
  const [data, setData] = useState<TgetAnnotation["data"]>()
  const [meta, setMeta] = useState<TgetAnnotation["meta"]>()


  const update_infinite = async () => {
    if (meta && !meta.hasNextPage) return
    const res = await apiGetAnnotation(params)
    setIsloading(false)
    const dataArrQueueCopy = [...dataArrQueue]
    dataArrQueueCopy[page - 1] = res.data
    setDataArrQueue(dataArrQueueCopy)
    setData(dataArrQueueCopy.flat())
    setMeta(res.meta)
    return res
  }

  const nextPage = async () => {
    if (meta && !meta.hasNextPage) return
    setPage(page + 1)
  }

  const reset = () => {
    setIsloading(true)
    setDataArrQueue([])
    setData(undefined)
    setMeta(undefined)
    setPage(1)
    setRender(state => ++state)
  }

  useEffect(() => {
    update_infinite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, render])

  useEffect(() => {
    if (inView) nextPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // useEffect(() => {
  //   reset()
  // }, [])

  return {
    data, meta, setData,
    nextPage, reset,
    viewRef, isLoading
  }
} // useGetAnnotation_v2

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
  return axi.delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err))
}



// =====================================================================


const apiGetQuotationRanges = (params?: Tparams) => {
  const api = "/work-sheet/presets/quotation-ranges"
  return axi.get(api, { params })
    .then(({ data }) => data as TgetQuotataionRanges)
    .catch(err => Promise.reject(err))
}

export const useGetQuotationRanges_v2 = (customParams?: Tparams) => {
  /**就只是為了render */
  const [render, setRender] = useState(0)
  const [isLoading, setIsloading] = useState(false)
  /**viewRef 不可以放在一開始就會出現在畫面上的item上，
   * 不然無法觸發nextPage */
  const [viewRef, inView] = useInView();
  const [page, setPage] = useState(1)

  const params = {
    page,
    // pageSize必須大於畫面一次可顯示的item數量才不會壞掉    
    // 不過應該只有在嚴格模式會壞掉
    pageSize: 20,
    sort: "category",
    order: "DESC",
    ...customParams
  } as const

  const [dataArrQueue, setDataArrQueue] = useState<TgetAnnotation["data"][]>([])
  const [data, setData] = useState<TgetAnnotation["data"]>()
  const [meta, setMeta] = useState<TgetAnnotation["meta"]>()


  const update_infinite = async () => {
    if (meta && !meta.hasNextPage) return
    const res = await apiGetQuotationRanges(params)
    setIsloading(false)
    const dataArrQueueCopy = [...dataArrQueue]
    dataArrQueueCopy[page - 1] = res.data
    setDataArrQueue(dataArrQueueCopy)
    setData(dataArrQueueCopy.flat())
    setMeta(res.meta)
    return res
  }

  const nextPage = async () => {
    if (meta && !meta.hasNextPage) return
    setPage(page + 1)
  }

  const reset = () => {
    setIsloading(true)
    setDataArrQueue([])
    setData(undefined)
    setMeta(undefined)
    setPage(1)
    setRender(state => ++state)
  }

  useEffect(() => {
    update_infinite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, render])

  useEffect(() => {
    if (inView) nextPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  // useEffect(() => {
  //   reset()
  // }, [])

  return {
    data, meta, setData,
    nextPage, reset,
    viewRef, isLoading
  }
} // useGetQuotationRanges_v2

export const apiPostQuotationRanges = ({ body }: { body: TcreateAnnotationDto }) => {
  const api = "/work-sheet/presets/quotation-ranges"
  return axi.post(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err))
}

export const apiPatchQuotationRanges = ({ body, id }: { body: TcreateAnnotationDto, id: string }) => {
  const api = `/work-sheet/presets/quotation-ranges/${id}`
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err))
}

export const apiDeleteQuotationRanges = ({ id }: { id: string }) => {
  const api = `/work-sheet/presets/quotation-ranges/${id}`
  return axi.delete(api)
    .then(({ data }) => data)
    .catch((err) => Promise.reject(err))
}










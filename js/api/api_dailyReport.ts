import { useState, useEffect } from "react";
import { useInView } from 'react-intersection-observer';
import _ from "lodash"

import { axi } from "./_axiosCreator";





import {
  TdailyReportItemDto, TdailyReportDto, TsetReportersDto,
  TcreateDailyReportItemDto, TupdateDailyReportDto,
  TemployeeDto,
  TpageMetaDto,
  TdailyReportWorkerJobsDto,
  TdailyReportWokerDto,
  Tparams,
} from "./dtoTypes"


export type {
  TcreateDailyReportItemDto,
  TdailyReportDto,
  TdailyReportWokerDto,
  Tparams,
  TemployeeDto
}
// =================================================================



type TgetDailyReports = {
  data: TdailyReportDto[]
  meta: TpageMetaDto
}

// 取得指定月份所有日報表
/**month格式為yyyy-MM 例:2022-02 */
const apiDailyReports = (
  filter?: { [key: string]: any },
  controller?: AbortController
) => {
  const api = `/daily-reports`
  const params = {
    populate: [
      "employee", "reviewStatus.reviewerEmployee.jobs", "isReviewCompleted",],
    filter,
    pageSize: 200,
    sort: "date",
    order: "DESC"
  }

  return axi.get(api, { params, signal: controller?.signal })
    .then(({ data }) => data as TgetDailyReports)
    .catch(err => Promise.reject(err))
}

// export const useApiDailyReports = (params?: { filter?: { [key: string]: any } }) => {
export const useApiDailyReports = (params?: Tparams) => {
  const controller = new AbortController();

  const [res, setRes] = useState<TgetDailyReports>()
  const update = async () => {
    const data = await apiDailyReports(params?.filter, controller)
    if (data) setRes(data)
    return data
  }
  return {
    dailyReport: res?.data,
    setDailyReports: setRes,
    updateDailyReports: update,
    controller: controller
  }
}

// ----
export const useApiDailyReports_v2 = (
  { customeParams }:
    { customeParams: Tparams }
) => {

  const [viewRef, inView] = useInView();
  const [page, setPage] = useState(1)

  const params: Tparams = {
    page,
    pageSize: 20,
    sort: "date",
    order: "DESC",
    populate: [
      "employee", "reviewStatus.reviewerEmployee.jobs", "isReviewCompleted"
    ],
    ...customeParams
  }

  const [dataArrQueue, setDataArrQueue] = useState<TgetDailyReports["data"][]>([])
  const [data, setData] = useState<TgetDailyReports["data"]>()
  const [meta, setMeta] = useState<TgetDailyReports["meta"]>()

  const update_infinite = async () => {
    if (meta && !meta.hasNextPage) return
    const res = await apiDailyReports(params)
    const dataArrQueueCopy = [...dataArrQueue]
    dataArrQueueCopy[page - 1] = res.data
    setDataArrQueue(dataArrQueueCopy)
    setData(dataArrQueueCopy.flat())
    return res
  }

  const nextPage = async () => {
    if (meta && !meta.hasNextPage) return
    setPage(page + 1)
  }

  const reset = () => {
    setDataArrQueue([])
    setData(undefined)
    setMeta(undefined)
    setPage(1)
  }

  useEffect(() => {
    update_infinite()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  useEffect(() => {
    if (inView) nextPage()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  useEffect(() => {
    reset()
  }, [customeParams])

  return {
    data, meta,
    setData, nextPage, reset,
    viewRef
  }
}







// 取得自己指定日期的日報表
/**date格式為yyyy-MM-DD 例:2022-02-02 */
export const apiDailyReports_my = (date: string) => {
  const api = `/daily-reports/my?date=${date}`
  return axi.get(api)
    .then(({ data }) => data as TdailyReportDto)
    .catch(err => Promise.reject(err))
}
/**date格式為yyyy-MM-DD 例:2022-02-02 */
export const useApiDailyReports_my = (date: string) => {
  let [data, setData] = useState<TdailyReportDto>()
  const update = async () => {
    const data = await apiDailyReports_my(date)
    if (data) setData(data)
    return data
  }
  return {
    dailyReport_my: data,
    setDailyReports_my: setData,
    updateDailyReports_my: update
  }
}

// 更新自己的指定日期的日報表
export const apiPatchDailyReports_my = (
  { date, body }:
    {
      /**YYYY-MM-DD */
      date: string
      body: TupdateDailyReportDto
    }
) => {
  const api = `/daily-reports/my?date=${date}`
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

// 取得指定日報表
export const apiDailyReports_id = (id: string) => {
  const api = `/daily-reports/${id}`
  const params = { populate: ["items.workers", "employee", "reviewStatus.reviewerEmployee"] }
  return axi.get(api, { params })
    .then(({ data }) => data as TdailyReportDto)
    .catch(err => Promise.reject(err))
}

export const useApiDailyReports_id = (id: string) => {
  let [data, setData] = useState<TdailyReportDto>()
  const update = async () => {
    const data = await apiDailyReports_id(id)
    if (data) setData(data)
    return data
  }
  return {
    dailyReport_id: data,
    setDailyReports_id: setData,
    updateDailyReports_id: update
  }
}


// 審閱日報表
export const apiDailyReports_review = (id: string) => {
  const api = `/daily-reports/${id}/review`
  return axi.post(api)
    .then(({ data }) => data as TdailyReportDto)
    .catch(err => Promise.reject(err))
}

// 取得所有審核人員
const apiDailyReports_reviewers = () => {
  const api = "/daily-reports/reviewers"
  return axi.get(api)
    .then(({ data }) => data as TemployeeDto[])
    .catch(err => Promise.reject(err))
}

export const useApiDailyReports_reviewers = () => {
  let [data, setData] = useState<TemployeeDto[]>([])
  const update = async () => {
    const data = await apiDailyReports_reviewers()
    if (data) setData(data)
    return data
  }
  return {
    /** 所有需回報的人員 */
    reviewersArr: data,
    setReviewersArr: setData,
    /**更新所有需回報的人員 */
    updateReviewersArr: update
  }
}

/**設定審核人員 */
export const apiPatchDailyReports_reviewers = (body: { employeeIds: string[] }) => {
  const api = "/daily-reports/reviewers"
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}


/**確認使用者是否為審核人員 */
export const apiIsReviewer = () => {
  const api = "/daily-reports/is-reviewer/me"
  return axi.get(api)
    .then(({ data }) => data as { isReviewer: boolean })
    .catch(err => Promise.reject(err))
}


type TgetDailyReportsWorkers = {
  data: TdailyReportWokerDto[]
  meta: TpageMetaDto
}

export const apiGetDailyReportsWorkers = (params?: Tparams) => {
  const api = "/daily-reports/workers"
  return axi.get(api, { params })
    .then(({ data }) => data as TgetDailyReportsWorkers)
    .catch(err => Promise.reject(err))
}

export const useApiGetDailyReportsWorkers = (params?: Tparams) => {
  const [res, setRes] = useState<TgetDailyReportsWorkers>()
  const update = async () => {
    const res = await apiGetDailyReportsWorkers(params)
    if (res) setRes(res)
    return res
  }

  const update_infinite = async () => {
    if (!res) return
    const apiRes = await apiGetDailyReportsWorkers(params)
    const newData = apiRes.data
    const oldData = res.data
    apiRes.data = [...oldData, ...newData]
    setRes({ ...apiRes })
    return apiRes
  }


  return {
    workers: res?.data, meta: res?.meta,
    updateWorkers: update,
    updateWorkers_infinite: update_infinite,
    setRes,
  }
}
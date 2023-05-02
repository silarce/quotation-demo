import { useState } from "react";

import { axi } from "./_axiosCreator";

import _ from "lodash"


import {
  TdailyReportItemDto, TdailyReportDto, TsetReportersDto,
  TcreateDailyReportItemDto, TupdateDailyReportDto,
  TemployeeDto,
  TpageMetaDto
} from "./dtoTypes"


export type { TcreateDailyReportItemDto, TdailyReportDto }
// =================================================================


// 取得所有回報人員
const apiDailyReports_Reporters = () => {
  const api = "/daily-reports/reporters"
  return axi.get(api)
    .then(({ data }) => data as TemployeeDto[])
    .catch(err => Promise.reject(err))
}

export const useApiDailyReports_Reporters = () => {
  let [data, setData] = useState<TemployeeDto[]>([])
  const update = async () => {
    const data = await apiDailyReports_Reporters()
    if (data) setData(data)
    return data
  }
  return {
    dailyReports_ReportersArr: data,
    setDailyReports_ReportersArr: setData,
    updateDailyReports_ReportersArr: update
  }
}

// 設定回報人員
export const apiPatchDailyReports_Reporters = (body: { employeeIds: string[] }) => {
  const api = "/daily-reports/reporters"
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

// 檢查自己是不是回報人員
const apiDailyReports_isReporters_me = () => {
  const api = "/daily-reports/is-reporter/me"
  return axi.get(api)
    .then(({ data }) => data as boolean)
    .catch(err => Promise.reject(err))
}

export const useApiDailyReports_isReporters_me = () => {
  let [data, setData] = useState<boolean>()
  const update = async () => {
    const data = await apiDailyReports_isReporters_me()
    if (data) setData(data)
    return data
  }
  return {
    dailyReports_isReporters_me: data,
    setDailyReports_isReporters_me: setData,
    updateDailyReports_isReporters_me: update
  }
}


// 取得指定月份所有日報表
/**month格式為yyyy-MM 例:2022-02 */
const apiDailyReports = (month: string) => {
  const api = `/daily-reports?month=${month}`
  return axi.get(api)
    .then(({ data }) => data as TdailyReportDto[])
    .catch(err => Promise.reject(err))
}
/**month格式為yyyy-MM 例:2022-02 */
export const useApiDailyReports = (month: string) => {
  let [data, setData] = useState<TdailyReportDto[]>()
  const update = async () => {
    const data = await apiDailyReports(month)
    if (data) setData(data)
    return data
  }
  return {
    dailyReport: data,
    setDailyReports: setData,
    updateDailyReports: update
  }
}

// 取得自己指定日期的日報表
/**date格式為yyyy-MM-DD 例:2022-02-02 */
const apiDailyReports_my = (date: string) => {
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
  body: {
    date: Date
    items: TcreateDailyReportItemDto[]
  }
) => {
  const api = "/daily-reports/my"
  return axi.patch(api, body)
    .then(({ data }) => data)
    .catch(err => Promise.reject(err))
}

// 取得指定日報表
const apiDailyReports_id = (id: string) => {
  const api = `/daily-reports/${id}`
  return axi.get(api)
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





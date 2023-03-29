// type
import {
  TdepartmentDto, TdepartmentDto_jobs, TjobDto,
  TupdateDepartmentJobDto
} from "js/api/dtoTypes";



import { Toption } from "fakeDatabase/options/options";

export type { TdepartmentDto, TdepartmentDto_jobs, TjobDto, TupdateDepartmentJobDto }


export const jobsOptionsCreator = (departmentArr: TdepartmentDto_jobs[]) => {

  type TjobOptiion = Toption & { grade: string }

  const departmentOptionArr: Toption[] = []
  /** key為department的id */
  const jobOptionArrList: { [key: string]: TjobOptiion[] } = {}
  departmentArr.forEach((de) => {
    const { id, jobs } = de
    departmentOptionArr.push({ value: de.id, label: de.name })
    jobOptionArrList[id] = jobs.map((job) => {
      return {
        value: job.id,
        label: job.name,
        grade: `${job.grade}`,
      }
    })
  })
  return {
    departmentOptionArr,
    jobOptionArrList
  }
} // jobsOptionsCreator



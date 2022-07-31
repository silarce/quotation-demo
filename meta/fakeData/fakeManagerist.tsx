import type { TstaffInfo, TstaffProfile } from "./fakeStaffList"
import { fakeStaffList } from "./fakeStaffList"





interface TdepartmentManageList {
  departmentId: string
  label: string
  list: TstaffInfo[]
}

type TfakeManagerList = TdepartmentManageList[]
// interface TfakeManagerList {
//   departmentB: TdepartmentManageList
//   departmentC: TdepartmentManageList
//   departmentD: TdepartmentManageList
//   departmentE: TdepartmentManageList
//   departmentF: TdepartmentManageList
// }


const departmentB = {
  departmentId: "B",
  label: "營業部",
  list: [
    fakeStaffList[0],
  ]
}
const departmentC = {
  departmentId: "C",
  label: "研發部",
  list: [
    fakeStaffList[3],
    fakeStaffList[4],
    fakeStaffList[5],
  ]
}
const departmentD = {
  departmentId: "D",
  label: "工務部",
  list: [
    fakeStaffList[6],
    fakeStaffList[7],
    fakeStaffList[8],
  ]
}
const departmentE = {
  departmentId: "E",
  label: "廠務部",
  list: [
    fakeStaffList[9],
    fakeStaffList[10],
    fakeStaffList[11],
  ]
}
const departmentF = {
  departmentId: "F",
  label: "會計部",
  list: []
}

const fakeManagerList: TfakeManagerList = [
  departmentB,
  departmentC,
  departmentD,
  departmentE,
  departmentF
]
// const fakeManagerList: TfakeManagerList = {
//   departmentB,
//   departmentC,
//   departmentD,
//   departmentE,
//   departmentF
// }

export type {
  TstaffInfo,
  TdepartmentManageList,
  TfakeManagerList
}
export { fakeManagerList }






































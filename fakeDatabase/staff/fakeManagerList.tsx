// fakeData
import { TstaffInfo, fakeStaffObjList } from "fakeDatabase/staff/fakeStaffList";


interface TdepartmentManage {
  departmentId: string
  label: string
  list: TstaffInfo[]
}

interface TdepartmentManageObjList {
  [key: string]: TdepartmentManage
}

type TdepartmentManageList = TdepartmentManage[]

const fakeManagerObjList: TdepartmentManageObjList = {
  "departmentB": {
    departmentId: "B",
    label: "營業部",
    list: [
      fakeStaffObjList["A001"],
    ]
  },
  "departmentC": {
    departmentId: "C",
    label: "研發部",
    list: [
      fakeStaffObjList["A003"],
      fakeStaffObjList["A008"],
      fakeStaffObjList["A006"],
    ]
  },
  "departmentD": {
    departmentId: "D",
    label: "工務部",
    list: [
      fakeStaffObjList["A005"],
      fakeStaffObjList["A010"],
      fakeStaffObjList["A013"],
    ]
  },
  "departmentE": {
    departmentId: "E",
    label: "廠務部",
    list: [
      fakeStaffObjList["A012"],
      fakeStaffObjList["A016"],
      fakeStaffObjList["A020"],
    ]
  },
  "departmentF": {
    departmentId: "F",
    label: "會計部",
    list: []
  },
}

const fakeManagerList: TdepartmentManageList = Object.values(fakeManagerObjList)


export type {
  TdepartmentManage,
  TdepartmentManageObjList,
  TdepartmentManageList,
  TstaffInfo
}
export {
  fakeManagerObjList,
  fakeManagerList,
}






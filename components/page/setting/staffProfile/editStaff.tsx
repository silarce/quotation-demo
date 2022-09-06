import { Dispatch, SetStateAction } from "react"

import style from "./editStaff.module.scss"

import EditStaffProfile01 from "./editStaff/editStaffProfile01"
import EditStaffProfile02 from "./editStaff/editStaffProfile02"

// type
import { TstaffInfo } from "fakeDatabase/staff/fakeStaffList";
type TsetSelStaffInfo = Dispatch<SetStateAction<TstaffInfo>>




export default function EditStaff({ selStaffInfo, setSelStaffInfo }:
  {
    selStaffInfo: TstaffInfo,
    setSelStaffInfo: TsetSelStaffInfo
  }) {
  const { staffId } = selStaffInfo

  return (
    <div className={style.container}>

      <div className={style.staffId}>
        <span>使用者代號</span>
        <span>{staffId}</span>
      </div>

      {/* 這兩個元件裡面很亂，等要接api時再一併整理 */}
      <EditStaffProfile01 selStaffInfo={selStaffInfo} setSelStaffInfo={setSelStaffInfo} />
      <EditStaffProfile02 selStaffInfo={selStaffInfo} setSelStaffInfo={setSelStaffInfo} />

    </div>
  )
}
// ==========================================================




















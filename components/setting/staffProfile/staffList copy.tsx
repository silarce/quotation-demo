import {
  useMemo, useRef,
  Dispatch, SetStateAction
} from 'react';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// icon
import iconDelete from "public/image/icon/delete01.svg"

// css
import style from "./staffList.module.scss"

// fakeData
import { TstaffInfo } from "../../../meta/fakeData/fakeStaffList"



type TsetSelStaffInfo = Dispatch<SetStateAction<TstaffInfo>>
type TsetDelVisible = Dispatch<SetStateAction<boolean>>
type TsetIsEditStaff = Dispatch<SetStateAction<boolean>>

export default function StaffList({ setSelStaffInfo, setDelVisible,
  data, setIsEditStaff }:
  {
    setSelStaffInfo: TsetSelStaffInfo,
    setDelVisible: TsetDelVisible
    data: TstaffInfo[]
    setIsEditStaff: TsetIsEditStaff
  }) {


  const columns = useMemo(() =>
    columnsCreator(
      setSelStaffInfo,
      setDelVisible,
      setIsEditStaff
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
    , [])


  return (
    <Table className={style.antdTable}
      columns={columns} dataSource={data}
      pagination={false}
    />
  )
}


// ================================================


const columnsCreator = (
  setSelStaffInfo: TsetSelStaffInfo,
  setDelVisible: TsetDelVisible,
  setIsEditStaff: TsetIsEditStaff
) => {

  return (
    [
      {
        title: '使用者代號',
        dataIndex: 'staffId',
        width: 150,
      },
      {
        title: '姓名',
        dataIndex: 'chName',
        width: 150,
      },
      {
        title: '電話',
        dataIndex: 'phone01',
        width: 170,
      },
      {
        title: '部門編號/部門名稱/職稱/職等',
        dataIndex: 'info01',
        width: 300,
        render: (_, staffProfile) => {
          const { department01 } = staffProfile
          const { departmentId, department,
            jobTitle, level, } = department01

          const showEditPanel = () => {
            setSelStaffInfo(staffProfile)
            setIsEditStaff(true)
          }

          return (
            <div className={style.departmentInfo}
              onClick={showEditPanel}>
              <span>{departmentId}</span>
              <span>{department}</span>
              <span>{jobTitle}</span>
              <span>{level}</span>
            </div>
          )
        }
      },
      {
        title: '',
        dataIndex: 'info02',
        render: (_, staffProfile) => {
          const { department02 } = staffProfile
          if (!department02) return null
          const { departmentId, department,
            jobTitle, level } = department02
          if (!departmentId) return null
          const showEditPanel = () => {
            setSelStaffInfo(staffProfile)
            setIsEditStaff(true)
          }
          return (
            <div className={style.departmentInfo}
              onClick={showEditPanel}>
              <span>{departmentId}</span>
              <span>{department}</span>
              <span>{jobTitle}</span>
              <span>{level}</span>
            </div>
          )
        }
      },
      {
        title: '',
        key: 'action',
        width: 55,
        render: (_, info) => {
          const onClick = () => {
            setSelStaffInfo(info)
            setDelVisible(true)
          }

          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img className={style.iconDelete}
              src={iconDelete.src} alt=""
              onClick={onClick}
            />
          )
        },
      },
    ] as ColumnsType<TstaffInfo>
  )
}


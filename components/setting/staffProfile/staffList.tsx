import {
  useMemo,
  Dispatch, SetStateAction
} from 'react';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// icon
import iconDelete from "public/image/icon/delete01.svg"

// css
import style from "./staffList.module.scss"

// fakeData
import { TstaffInfo } from "./fakeData"



type TsetSelStaffInfo = Dispatch<SetStateAction<TstaffInfo>>
type TsetDelVisible = Dispatch<SetStateAction<boolean>>

export default function StaffList(
  { setSelStaffInfo, setDelVisible, data }:
    {
      setSelStaffInfo: TsetSelStaffInfo,
      setDelVisible: TsetDelVisible
      data: TstaffInfo[]
    }) {


  const columns = useMemo(() => columnsCreator(setSelStaffInfo, setDelVisible)
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
  setDelVisible: TsetDelVisible) => {

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
        render: (_, { department01 }) => {
          const { departmentId, department,
            jobTitle, level, } = department01
          return (
            <>
              <span className={style.infoSpan}>{departmentId}</span>
              <span className={style.infoSpan}>{department}</span>
              <span className={style.infoSpan}>{jobTitle}</span>
              <span className={style.infoSpan}>{level}</span>
            </>
          )
        }
      },
      {
        title: '',
        dataIndex: 'info02',
        render: (_, { department02 }) => {
          if (!department02) return null
          const { departmentId, department,
            jobTitle, level } = department02

          if (!departmentId) return null
          return (
            <>
              <span className={style.infoSpan}>{departmentId}</span>
              <span className={style.infoSpan}>{department}</span>
              <span className={style.infoSpan}>{jobTitle}</span>
              <span className={style.infoSpan}>{level}</span>
            </>
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


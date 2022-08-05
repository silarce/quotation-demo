import { useMemo, } from 'react';

import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

// icon
import { Icondelete01 } from 'public/image/icon/svgComponent/svgIcons';

// css
import style from "./staffList.module.scss"

// fakeData
import { TstaffInfo } from "../../../meta/fakeData/fakeStaffList"

export default function StaffList({
  data,
  editStaff, openDeletePanel }:
  {
    data: TstaffInfo[]
    editStaff: (staffProfile: TstaffInfo) => void
    openDeletePanel: (staffProfile: TstaffInfo) => void
  }) {

  // ========================================
  const columns = useMemo(() =>
    columnsCreator(
      editStaff,
      openDeletePanel
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

// 每一行cell的設定
const columnsCreator = (
  editStaff: (staffProfile: TstaffInfo) => void,
  openDeletePanel: (staffProfile: TstaffInfo) => void,
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

          return (
            <div className={style.departmentInfo}
              onClick={() => editStaff(staffProfile)}>
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
          return (
            <div className={style.departmentInfo}
              onClick={() => editStaff(staffProfile)}>
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
            openDeletePanel(info)
          }

          return (
            <Icondelete01 className={style.iconDelete} onClick={onClick} />
          )
        },
      },
    ] as ColumnsType<TstaffInfo>
  )
}


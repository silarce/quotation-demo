import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';

//modal
import { modal_empty, modal_leave, modal_delete } from 'components/global/gear/modal/fongModal';
import { Container_confirm } from 'components/global/container/modal';

//icon
import Circle from 'public/image/icon/fong/circle.svg';
import Wrong from 'public/image/icon/fong/x.svg';

//button
import Btn from 'components/global/gear/button/btn_fong';
import { DataEntry_fong, Input, Select } from 'components/global/gear/dataEntry';

interface LeaveSettingItem {
  key: string;
  leaveName: string;
  leaveDays: number;
  leaveLimit: number;
  isPaid: boolean;
  paidLeaveRatio: number;
  affectFullAttendance: boolean;
  notifyWhenPaid: boolean;
  note: string;
}

export default function LeaveSetting() {
  const columns: ColumnsType<LeaveSettingItem> = [
    { title: '假別名稱', dataIndex: 'leaveName', key: 'leaveName', width: '5%' },
    { title: '可休天數', dataIndex: 'leaveDays', key: 'leaveDays', width: '5%', align: 'center' },
    { title: '可休上限', dataIndex: 'leaveLimit', key: 'leaveLimit', width: '5%', align: 'center' },
    {
      title: '計薪',
      dataIndex: 'isPaid',
      key: 'isPaid',
      width: '5%',
      align: 'center',
      render: (val: boolean) =>
        val ? (
          <div className="flex justify-center">
            <Circle />
          </div>
        ) : (
          <div className="flex justify-center">
            <Wrong />
          </div>
        ),
    },
    {
      title: '帶薪比例',
      dataIndex: 'paidLeaveRatio',
      key: 'paidLeaveRatio',
      width: '5%',
      align: 'center',
    },
    {
      title: '全勤影響',
      dataIndex: 'affectFullAttendance',
      key: 'affectFullAttendance',
      width: '5%',
      align: 'center',
      render: (val: boolean) =>
        val ? (
          <div className="flex justify-center">
            <Circle />
          </div>
        ) : (
          <div className="flex justify-center">
            <Wrong />
          </div>
        ),
    },
    {
      title: '帶薪通知',
      dataIndex: 'notifyWhenPaid',
      key: 'notifyWhenPaid',
      width: '5%',
      align: 'center',
      render: (val: boolean) =>
        val ? (
          <div className="flex justify-center">
            <Circle />
          </div>
        ) : (
          <div className="flex justify-center">
            <Wrong />
          </div>
        ),
    },
    { title: '備註', dataIndex: 'note', key: 'note', width: '50%' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: '5%',
      render: (_: any, record: LeaveSettingItem) => (
        <div className="flex justify-center gap-4">
          <Image
            src={editIcon}
            alt="edit"
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
            onClick={() => {}}
          />
          <Image
            src={deleteIcon}
            alt="delete"
            width={16}
            height={16}
            style={{ cursor: 'pointer' }}
            onClick={() => {
              modal_delete({
                onConfirm: () => {
                  console.log('刪除該筆資料', record.key);
                },
              });
            }}
          />
        </div>
      ),
    },
  ];

  const data: LeaveSettingItem[] = [
    {
      key: '1',
      leaveName: '事假',
      leaveDays: 21,
      leaveLimit: 21,
      isPaid: false,
      paidLeaveRatio: 0,
      affectFullAttendance: true,
      notifyWhenPaid: false,
      note: '',
    },
  ];

  const handle_addHoliday = () => {
    const modalInstance = modal_empty({
      width: 500,
      content: (
        <div>
          <Container_confirm
            title="假別基本設定"
            footerRight={
              <>
                <Btn onClick={() => {}}>取消</Btn>
                <Btn theme="save">儲存</Btn>
              </>
            }
          >
            <div className="flex flex-col gap-4 mt-4">
              <DataEntry_fong caption={`假日名稱`} isMust={true}>
                <Input />
              </DataEntry_fong>
              <DataEntry_fong caption={`可休天數`} isMust={true}>
                <Input />
              </DataEntry_fong>
              <DataEntry_fong caption={`可休上限`} isMust={true}>
                <Input />
              </DataEntry_fong>
              <DataEntry_fong caption={`計薪`} isMust={true}>
                <Select />
              </DataEntry_fong>
              <DataEntry_fong caption={`帶薪比例`} isMust={true}>
                <Select />
              </DataEntry_fong>
              <DataEntry_fong caption={`全勤影響`} isMust={true}>
                <Select />
              </DataEntry_fong>
              <DataEntry_fong caption={`需開通`} isMust={true}>
                <Select />
              </DataEntry_fong>
              <DataEntry_fong caption={`備註`}>
                <Input />
              </DataEntry_fong>
            </div>
          </Container_confirm>
        </div>
      ),
    });
  };

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <p className="text-[16px] font-bold">假別清單</p>

          <Btn theme="add" onClick={() => handle_addHoliday()}>
            新增假別
          </Btn>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>
    </>
  );
}

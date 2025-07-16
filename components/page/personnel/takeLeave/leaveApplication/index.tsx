import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

import dayjs, { Dayjs } from 'dayjs';
import LeaveDateTimePicker from './LeaveDateTimePicker';
import { LogoUploader } from 'components/global/myCom/uploader/Uploader';

interface LeaveApplicationItem {
  key: string;
  applyDate: string;
  leaveType: string;
  start: string;
  end: string;
  hours: number;
  status: string;
}

export default function LeaveApplication() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const columns: ColumnsType<LeaveApplicationItem> = [
    { title: '申請日期', dataIndex: 'applyDate', key: 'applyDate', width: '10%' },
    { title: '假別', dataIndex: 'leaveType', key: 'leaveType', align: 'left', width: '10%' },
    { title: '起', dataIndex: 'start', key: 'start', width: '15%' },
    { title: '迄', dataIndex: 'end', key: 'end', width: '15%' },
    { title: '時數', dataIndex: 'hours', key: 'hours', align: 'center', width: '10%' },
    { title: '狀態', dataIndex: 'status', key: 'status', align: 'left', width: '30%' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: '10%',
      render: () => (
        <div className="flex justify-center gap-5">
          <Image
            src={editIcon}
            alt="edit"
            style={{ cursor: 'pointer', width: '20px', height: '20px' }}
            onClick={() => setIsEditModalOpen(true)}
          />
          <Image src={deleteIcon} alt="delete" style={{ cursor: 'pointer' }} width={16} height={16} />
        </div>
      ),
    },
  ];

  const data: LeaveApplicationItem[] = [
    {
      key: '1',
      applyDate: '2025/06/11',
      leaveType: '病假',
      start: '2025/06/10 08:00',
      end: '2025/06/10 17:00',
      hours: 8,
      status: '審核中',
    },
    {
      key: '2',
      applyDate: '2025/06/01',
      leaveType: '事假',
      start: '2025/06/08 08:00',
      end: '2025/06/08 12:00',
      hours: 4,
      status: '審核完成',
    },
  ];

  const [start, setStart] = useState<Dayjs | null>(null);
  const [end, setEnd] = useState<Dayjs | null>(null);

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <MyInput
              label="搜尋欄"
              onChange={setInput}
              labelWidth="whitespace-nowrap"
              placeholder="請輸入代碼/名稱/類型"
            />
            <SearchButton onClick={() => console.log('Search')} />
          </div>
          <AddButton label="新增假單" onClick={() => setIsEditModalOpen(true)} className="h-[40px]" />
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={scss.customTable} />
      </div>
      <Modal
        title=""
        width={455}
        closable={false}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        open={isEditModalOpen}
        footer={null}
        className={scss.customModal}
      >
        <div className="py-1">
          <span className="font-bold text-[16px]">請假單</span>
          <div>
            <MyInput
              label="部門："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="- -"
            />
            <MyInput
              label="員工姓名："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="- -"
            />
            <MySelect
              label="假別："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇"
              options={[
                { label: '病假', value: '病假' },
                { label: '事假', value: '事假' },
              ]}
            />
            <div className="flex items-center mt-3">
              <p className="whitespace-nowrap w-[36%]">請假起：</p>
              <LeaveDateTimePicker value={start} onChange={setStart} />
            </div>
            <div className="flex items-center mt-3">
              <p className="whitespace-nowrap w-[36%]">請假迄：</p>
              <LeaveDateTimePicker value={end} onChange={setEnd} />
            </div>
            <MyInput
              label="請假時數："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder=""
            />
            <MySelect
              label="選擇流程："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇"
              options={[
                { label: '病假', value: '病假' },
                { label: '事假', value: '事假' },
              ]}
            />
            <MyInput
              label="備註："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="- -"
            />
            <div className="gap-4 items-center mt-3">
              <LogoUploader
                defaultPreviewUrl={previewLogoUrl}
                onFileChange={(file) => setLogoFile(file)}
                label="附件："
                marginLeft="66px"
              />
            </div>
          </div>
          <div className="h-[40px] flex gap-4 mt-3 justify-end">
            <CancelButton label="取消" onClick={() => setIsEditModalOpen(false)} />
            <CancelButton label="儲存" onClick={() => setIsEditModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
}

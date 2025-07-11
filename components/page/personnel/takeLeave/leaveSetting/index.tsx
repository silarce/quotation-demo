import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import scss from 'components/global/myCom/myTable/table.module.scss';

import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg';
import deleteIcon from 'public/image/icon/trash.svg';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import AddButton from 'components/global/myCom/button/AddButton';
import SearchButton from 'components/global/myCom/button/searchButton';

interface StaffShiftItem {
  key: string;
  leaveCode: string;
  leaveName: string;
  leaveType: string;
  needDocument: string;
  note: string;
}

export default function LeaveSetting() {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [input, setInput] = useState('');

  const columns: ColumnsType<StaffShiftItem> = [
    { title: '假別代碼', dataIndex: 'leaveCode', key: 'leaveCode', width: '10%' },
    { title: '假別名稱', dataIndex: 'leaveName', key: 'leaveName', width: '10%' },
    { title: '類型', dataIndex: 'leaveType', key: 'leaveType', width: '10%', align: 'center' },
    { title: '需附證明', dataIndex: 'needDocument', key: 'needDocument', align: 'center', width: '10%' },
    { title: '備註', dataIndex: 'note', key: 'note', align: 'left', width: '50%' },
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

  const data: StaffShiftItem[] = [
    {
      key: '1',
      leaveCode: 'D001',
      leaveName: '特休',
      leaveType: '有薪',
      needDocument: '是',
      note: '依勞基法',
    },
    {
      key: '2',
      leaveCode: 'D002',
      leaveName: '病假',
      leaveType: '半薪',
      needDocument: '否',
      note: '需提供就醫證明/收據',
    },
  ];

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
          <AddButton label="新增假別" onClick={() => setIsEditModalOpen(true)} className="h-[40px]" />
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
          <span className="font-bold text-[16px]">新增班別</span>
          <div>
            <MyInput
              label="假別代碼："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入假別代碼"
            />
            <MyInput
              label="假別名稱："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入假別名稱"
            />
            <MySelect
              label="假別類型："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="支付薪資"
              options={[
                { label: '有薪', value: '有薪' },
                { label: '半薪', value: '半薪' },
                { label: '無薪', value: '無薪' },
              ]}
            />
            <MySelect
              label="需附證明："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇"
              options={[
                { label: '是', value: '是' },
                { label: '否', value: '否' },
              ]}
            />
            <MySelect
              label="角色選擇："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇班別"
              options={[
                { label: '一般員工', value: '一般員工' },
                { label: '主管', value: '主管' },
              ]}
            />
            <MyInput
              label="備註："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="請輸入備註"
            />
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

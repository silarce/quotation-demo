import { useState } from 'react';
import type { ColumnsType } from 'antd/es/table';
import { Modal, Table } from 'antd';
import tablescss from 'components/global/myCom/myTable/table.module.scss';
import { LogoUploader } from 'components/global/myCom/uploader/Uploader';
import Image from 'next/image';
import editIcon from 'public/image/icon/note.svg?url';
import deleteIcon from 'public/image/icon/trash.svg?url';
import MyInput from 'components/global/myCom/Input/Input';
import MySelect from 'components/global/myCom/select/mySelect';
import LeaveDateTimePicker from 'components/page/personnel/checkIn/cardApplication/LeaveDateTimePicker';
import { Dayjs } from 'dayjs';

//button
import CancelButton from 'components/global/myCom/button/cancelButton';
import SearchButton from 'components/global/myCom/button/searchButton';

interface AbnormalItem {
  key: string;
  empId: string;
  department: string;
  name: string;
  abnormalDate: string;
  clockIn: string;
  clockOut: string;
  abnormalType: string;
  status: string;
}

export default function AbnornalAttendance() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [input, setInput] = useState('');
  const [previewLogoUrl, setPreviewLogoUrl] = useState<string | undefined>(undefined);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [start, setStart] = useState<Dayjs | null>(null);

  const columns: ColumnsType<AbnormalItem> = [
    { title: '員工編號', dataIndex: 'empId', key: 'empId', align: 'left', width: '10%' },
    { title: '部門', dataIndex: 'department', key: 'department', align: 'left', width: '10%' },
    { title: '姓名', dataIndex: 'name', key: 'name', align: 'left', width: '10%' },
    { title: '異常日期', dataIndex: 'abnormalDate', key: 'abnormalDate', align: 'left', width: '15%' },
    { title: '上班打卡', dataIndex: 'clockIn', key: 'clockIn', align: 'center', width: '10%' },
    { title: '下班打卡', dataIndex: 'clockOut', key: 'clockOut', align: 'center', width: '10%' },
    { title: '異常類型', dataIndex: 'abnormalType', key: 'abnormalType', align: 'left', width: '10%' },
    { title: '目前狀態', dataIndex: 'status', key: 'status', align: 'center', width: '10%' },
    {
      title: '操作',
      key: 'actions',
      align: 'center',
      width: '10%',
      render: () => (
        <div className="flex justify-center gap-4">
          <Image src={editIcon} alt="edit" width={20} height={20} style={{ cursor: 'pointer' }} />
          <Image src={deleteIcon} alt="delete" width={16} height={16} style={{ cursor: 'pointer' }} />
        </div>
      ),
    },
  ];

  const data: AbnormalItem[] = [
    {
      key: '1',
      empId: 'A001',
      department: '資訊部',
      name: '丘子鈞',
      abnormalDate: '2025/06/17',
      clockIn: '09:15',
      clockOut: '18:00',
      abnormalType: '遲到',
      status: '待補卡',
    },
    {
      key: '2',
      empId: 'A002',
      department: '會計部',
      name: '呂元棠',
      abnormalDate: '2025/06/18',
      clockIn: '-',
      clockOut: '-',
      abnormalType: '缺勤',
      status: '補卡審核中',
    },
  ];

  return (
    <>
      <div className="border border-[#616161] rounded-md px-6 py-8 h-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-4 h-[40px]">
            <MyInput
              marginLeft="0px"
              onChange={setInput}
              labelWidth="whitespace-nowrap"
              placeholder="請輸入yyyy-mm-dd"
            />
            <SearchButton onClick={() => console.log('Search')} />
          </div>
        </div>
        <Table columns={columns} dataSource={data} pagination={false} className={tablescss.customTable} />
      </div>
      <Modal
        title=""
        width={455}
        closable={false}
        centered
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        open={isModalOpen}
        footer={null}
        className={tablescss.customModal}
      >
        <div className="py-1">
          <span className="font-bold text-[16px]">補卡申請單</span>
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
              label="補卡類型："
              labelWidth="w-[32%]"
              className="mt-3"
              placeholder="請選擇"
              options={[
                { label: '病假', value: '病假' },
                { label: '事假', value: '事假' },
              ]}
            />
            <div className="flex items-center mt-3">
              <p className="whitespace-nowrap w-[36%]">補卡時段：</p>
              <LeaveDateTimePicker value={start} onChange={setStart} />
            </div>
            <MyInput
              label="備註："
              onChange={setInput}
              labelWidth="w-[34%]"
              className="mt-3"
              marginLeft="8px"
              placeholder="填寫說明"
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
            <CancelButton label="取消" onClick={() => setIsModalOpen(false)} />
            <CancelButton label="儲存" onClick={() => setIsModalOpen(false)} />
          </div>
        </div>
      </Modal>
    </>
  );
}
